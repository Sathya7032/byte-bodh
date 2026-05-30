import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TemplateOne from "./TemplateOne";
import TemplateThree from "./TemplateThree";
import TemplateFour from "./TemplateFour";
import Portfolio from "../portfolio/Portfolio";
import { getPublicProfileByUsername } from "../api/profileService";

function getUsernameFromDomain() {
  const hostname = window.location.hostname;

  // For local development (e.g., username.localhost)
  if (hostname.endsWith(".localhost")) {
    const subdomain = hostname.replace(".localhost", "");
    return subdomain && subdomain !== "www" ? subdomain : null;
  }
  // For production (e.g., username.bytebodh.in)
  if (hostname.endsWith(".bytebodh.in")) {
    const subdomain = hostname.replace(".bytebodh.in", "");
    return subdomain && subdomain !== "www" ? subdomain : null;
  }

  return null;
}

function PublicPortfolioPage() {
  const { username: urlUsername } = useParams();
  const [profile, setProfile] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const username = urlUsername || getUsernameFromDomain();

    if (!username) {
      setError("Invalid domain format");
      setLoading(false);
      return;
    }

    getPublicProfileByUsername(username)
      .then((res) => {
        console.log("Fetched public profile data in PublicPortfolioPage:", res.data);
        
        const profileData = res.data?.data;
        if (!profileData) {
          throw new Error("Profile data not found");
        }

        // Find active template ID from userTemplates in the response
        const activeTemplate = profileData.user?.userTemplates?.find(ut => ut.active);
        const templateId = activeTemplate?.template?.id || 1; // Fallback to template 1

        setProfile(profileData);
        setTemplateId(templateId);
      })
      .catch((err) => {
        console.error("Error fetching public profile:", err);
        setError(err.message || "Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlUsername]);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        Loading portfolio...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        {error}
      </h2>
    );
  }

  if (!profile) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        Profile not found
      </h2>
    );
  }

  // 🔥 Template switch
  switch (templateId) {
    case 1:
      return <TemplateOne profile={profile} />;

    case 2:
      return <Portfolio profile={profile} />;

    case 3:
      return <TemplateThree profile={profile} />;

    case 4:
      return <TemplateFour profile={profile} />;

    default:
      return <TemplateOne profile={profile} />;
  }
}

export default PublicPortfolioPage;