import React from 'react';
import facebook_img from '../../../images/fb.svg'
import linkedin_img from '../../../images/linkedin.svg'
import twitter_img from '../../../images/twitter.svg'
import instagram_img from '../../../images/instagram.png'

const SocialMediaProviderBadge = ({provider}) => {
    const providers = {
        FACEBOOK: {imgSrc: facebook_img, text: 'Facebook'},
        INSTAGRAM: {imgSrc: instagram_img, text: 'Instagram'},
        LINKEDIN: {imgSrc: linkedin_img, text: 'LinkedIn'},
        TWITTER: {imgSrc: twitter_img, text: 'Twitter'},
    };

  //  <i class="fa-brands fa-facebook"></i>

    const providerInfo = providers[provider];

    if (!providerInfo) {
        return null;
    }

    return (
        <>
            <img src={providerInfo.imgSrc} height="20px" width="20px" alt={provider}/>
            <h3 className="cmn_headings">{providerInfo.text.toLowerCase()}</h3>
        </>
    );
}

export default SocialMediaProviderBadge;
