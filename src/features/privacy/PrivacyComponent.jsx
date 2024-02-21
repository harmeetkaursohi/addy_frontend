import SideBar from "../sidebar/views/Layout";
import React, { useEffect, useState } from "react";
import "./privacy.css";

const PrivacyComponent = () => {
  const [iframeContent, setIframeContent] = useState("");
  const url = import.meta.env.VITE_APP_CMS_API_BASE_URL+"privacy-policy";
  const divId = "privacy-policy-content";
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((html) => {
        const divContent = extractDivContent(
          html.privacy_policy_content,
          divId
        );
        setIframeContent(divContent);
      })
      .catch((error) => console.error("Error fetching content:", error));
  }, [url, divId]);
  const extractDivContent = (html, divId) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
   
    const specificDiv = doc.getElementById(divId);
    
    return specificDiv ? specificDiv.outerHTML : "";
  };
  return (
    <>
      <SideBar />
      <div className="cmn_container faq_section pt-5">
        <div className="cmn_wrapper_outer">
          <div className="dashboard_outer">
            <h2 className="cmn_title">Privacy Policy</h2>
            <div className="privacy_wrapper">
              <iframe
                title="Embedded Content"
                srcDoc={iframeContent}
                width="100%"
                height="500px"
              
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyComponent;
