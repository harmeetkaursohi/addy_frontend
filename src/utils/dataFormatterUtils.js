import {isNullOrEmpty} from "./commonUtils";
import {SocialAccountProvider} from "./contantData";

export const getInstagramBusinessAccounts = (accountsData) => {
    const businessAccounts = accountsData?.filter(data => {
        return data.hasOwnProperty("instagram_business_account")
    })
    if (isNullOrEmpty(businessAccounts)) {
        return [];
    }
    return businessAccounts?.map(data => {
        return data["instagram_business_account"]
    })
}

export const formatPageAccessTokenDTOToConnect = ({data, socialMediaAccountInfo}) => {
    let pageAccessTokenDTO = {
        pageId: data?.id,
        name: data?.name,
        socialMediaAccountId: socialMediaAccountInfo?.id
    }
    switch (socialMediaAccountInfo?.provider) {
        case SocialAccountProvider.FACEBOOK.toUpperCase(): {
            pageAccessTokenDTO = {
                ...pageAccessTokenDTO,
                imageUrl: data.picture?.data?.url,
                about: data?.about,
                access_token: data?.access_token,
            }
            break;
        }
        case SocialAccountProvider.INSTAGRAM.toUpperCase(): {
            pageAccessTokenDTO = {
                ...pageAccessTokenDTO,
                imageUrl: data?.profile_picture_url,
                about: data?.about,
                access_token: socialMediaAccountInfo.accessToken,
            }
            break;
        }
        case SocialAccountProvider.PINTEREST.toUpperCase(): {
            pageAccessTokenDTO = {
                ...pageAccessTokenDTO,
                imageUrl: data?.media?.image_cover_url,
                about: data?.description,
                access_token: socialMediaAccountInfo.accessToken,
            }
            break;
        }
        case SocialAccountProvider.LINKEDIN.toUpperCase(): {
            pageAccessTokenDTO = {
                ...pageAccessTokenDTO,
                imageUrl: data?.logo_url,
                about: data?.description,
                access_token: socialMediaAccountInfo.accessToken,
            }
            break;
        }
        default: {
        }
    }
    return pageAccessTokenDTO;
}

export const getConnectedSocialMediaAccount = (connectedSocialAccount) => {
    return {
        facebook: connectedSocialAccount?.filter(socialMediaAccount => socialMediaAccount.provider === "FACEBOOK")?.[0] || null,
        instagram: connectedSocialAccount?.filter(socialMediaAccount => socialMediaAccount.provider === "INSTAGRAM")?.[0] || null,
        linkedin: connectedSocialAccount?.filter(socialMediaAccount => socialMediaAccount.provider === "LINKEDIN")?.[0] || null,
        pinterest: connectedSocialAccount?.filter(socialMediaAccount => socialMediaAccount.provider === "PINTEREST")?.[0] || null
    }

}