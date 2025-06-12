import React, { useEffect } from "react";
import { testConnection, fetchPosts } from "./api/index"; // adjust path as needed

const DebugAPI = () => {
  useEffect(() => {
    const debugAPI = async () => {
      console.log("🔍 Starting API debug...");

      // Test 1: Direct fetch to your Vercel backend
      try {
        console.log("Test 1: Direct fetch to backend...");
        const directResponse = await fetch(
          "https://full-stack-mern-u5sq.vercel.app/posts"
        );
        const directData = await directResponse.json();
        console.log("✅ Direct fetch successful:", directData);
      } catch (error) {
        console.error("❌ Direct fetch failed:", error);
      }

      // Test 2: Using your API functions
      try {
        console.log("Test 2: Using API functions...");
        const apiResponse = await fetchPosts(1);
        console.log("✅ API function successful:", apiResponse.data);
      } catch (error) {
        console.error("❌ API function failed:", error);
      }

      // Test 3: Check localStorage
      console.log(
        "Test 3: LocalStorage profile:",
        localStorage.getItem("profile")
      );
    };

    debugAPI();
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f0f0f0", margin: "20px" }}>
      <h3>Debug Info (Check Console)</h3>
      <p>Open browser console (F12) to see debug information</p>
    </div>
  );
};

export default DebugAPI;
