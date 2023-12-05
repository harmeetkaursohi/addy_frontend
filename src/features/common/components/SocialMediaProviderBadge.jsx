import React from 'react';
import {getInitialLetterCap} from "../../../utils/commonUtils";

const SocialMediaProviderBadge = ({provider}) => {
    const providers = {
        FACEBOOK: {className: "fa-brands fa-facebook", text: 'Facebook'},
        INSTAGRAM: {className: "fa-brands fa-instagram insta-icon", text: 'Instagram'},
        LINKEDIN: {className: "fa-brands fa-linkedin", text: 'LinkedIn'},
        TWITTER: {className: "fa-brands fa-twitter", text: 'Twitter'},
    };

    const providerInfo = providers[provider];

    if (!providerInfo) {
        return null;
    }

    return (
        <div style={{display: "flex", alignItems: "center"}}>
            <i className={`${providerInfo.className}`} style={{color: "#0866ff", fontSize: "24px"}}/>
            <h3 className="cmn_headings ms-1">{getInitialLetterCap(providerInfo.text.toLowerCase())}</h3>
        </div>
    );
};

export default SocialMediaProviderBadge;
//
