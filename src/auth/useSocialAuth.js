import { useState } from "react";
import { toast } from "react-toastify";
import { loginWithGoogleApi } from "../services/auth";
import { triggerAppleSignIn, isApplePlatform } from "../utils/appleAuth";

/** Google / Apple sign-in handlers shared by the Login and Register pages. */
export default function useSocialAuth(onAuthenticated) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const onGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("Couldn't get your Google credentials. Please try again.");
      return;
    }
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogleApi(credentialResponse.credential);
      if (res.success) onAuthenticated(res.data?.user || res.data, res.data?.isNewUser);
      else toast.error(res.message || "Google sign-in was not authorized");
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const onGoogleError = () => toast.error("Google sign-in was closed or failed");

  const onApple = async () => {
    setAppleLoading(true);
    try {
      const res = await triggerAppleSignIn();
      if (res.success) onAuthenticated(res.data?.user || res.data, res.data?.isNewUser);
      else toast.info(res.message || "Apple sign-in isn't available right now");
    } catch {
      toast.error("Apple sign-in failed. Please try again.");
    } finally {
      setAppleLoading(false);
    }
  };

  return { onGoogleSuccess, onGoogleError, onApple, googleLoading, appleLoading, isApple: isApplePlatform() };
}
