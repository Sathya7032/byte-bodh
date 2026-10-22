// Apple Sign-In Client Utility for ByteBodh (Optimized for macOS / iOS / Web)
import { loginWithAppleApi } from "../services/auth";

let appleScriptPromise = null;

// Dynamically load Apple's official JavaScript SDK
export const loadAppleScript = () => {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.AppleID) return Promise.resolve(window.AppleID);
  if (appleScriptPromise) return appleScriptPromise;

  appleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById("apple-auth-sdk");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.AppleID));
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const script = document.createElement("script");
    script.id = "apple-auth-sdk";
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/auth/js";
    script.async = true;
    script.onload = () => {
      resolve(window.AppleID);
    };
    script.onerror = (err) => {
      console.warn("Could not load Apple Auth SDK:", err);
      reject(err);
    };
    document.head.appendChild(script);
  });

  return appleScriptPromise;
};

// Check if current user is on an Apple platform (macOS / iOS / iPadOS)
export const isApplePlatform = () => {
  if (typeof navigator === "undefined") return false;
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  return (
    /Mac|iPhone|iPod|iPad/.test(platform) ||
    (userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1) ||
    (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
  );
};

// Trigger Apple Sign-In flow
export const triggerAppleSignIn = async () => {
  try {
    const AppleID = await loadAppleScript();
    const clientId = process.env.REACT_APP_APPLE_CLIENT_ID || "com.bytebodh.efolio";
    const redirectURI = `${window.location.origin}/login`;

    AppleID.auth.init({
      clientId,
      scope: "name email",
      redirectURI,
      usePopup: true,
    });

    const data = await AppleID.auth.signIn();
    if (!data || !data.authorization || !data.authorization.id_token) {
      throw new Error("No identity token received from Apple");
    }

    const idToken = data.authorization.id_token;
    let fullName = "";
    if (data.user) {
      const nameParts = [data.user.name?.firstName, data.user.name?.lastName].filter(Boolean);
      fullName = nameParts.join(" ");
    }

    return await loginWithAppleApi(idToken, fullName);
  } catch (error) {
    console.error("Apple Sign-In error:", error);
    return {
      success: false,
      message: error.error || error.message || "Apple Sign-In was cancelled or failed",
    };
  }
};
