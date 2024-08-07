import React, {useEffect, useState} from "react";
import "./privacy.css";
import {useAppContext} from "../common/components/AppProvider";
import jsondata from "../../locales/data/initialdata.json"
const PrivacyComponent = () => {
    const [iframeContent, setIframeContent] = useState("");
    const {sidebar} = useAppContext()
    const url = import.meta.env.VITE_APP_CMS_API_BASE_URL + "privacy-policy";
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
        if (specificDiv) {

            specificDiv.style.fontFamily = 'Nunito sans-serif';
            specificDiv.style.color = "#2E3646";
            return specificDiv ? specificDiv.outerHTML : "";
        } else {
            return "";
        }


    };
    return (
        <>
            <div className={`cmn_container  ${sidebar ? " " : "cmn_Padding"}`}>
                <div className=" cmn_outer">
                    <div className="cmn_wrapper_outer privacy_policy_container ">
                        <h2 className="cmn_title">{jsondata.privacy_policy}</h2>
                        <h6 className="cmn_small_heading">{jsondata.privacy_policy_heading}</h6>
                        <div className="privacy_wrapper">
                            <iframe
                                title="Embedded Content"
                                srcDoc={iframeContent}
                                width="100%"
                                height="2115px"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyComponent;
