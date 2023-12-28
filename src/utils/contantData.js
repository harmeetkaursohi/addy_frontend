const enabledSocialMedia = {
    isFaceBookEnabled: `${import.meta.env.VITE_APP_ENABLE_FACEBOOK}` === "true",
    isInstagramEnabled: `${import.meta.env.VITE_APP_ENABLE_INSTAGRAM}` === "true",
    isLinkedinEnabled: `${import.meta.env.VITE_APP_ENABLE_LINKEDIN}` === "true",
    isPinterestEnabled: `${import.meta.env.VITE_APP_ENABLE_PINTEREST}` === "true",
}

export const SocialAccountProvider = Object.freeze({
    ...(enabledSocialMedia.isFaceBookEnabled && { FACEBOOK:"facebook" }),
    ...(enabledSocialMedia.isInstagramEnabled && { INSTAGRAM: "instagram" }),
    ...(enabledSocialMedia.isLinkedinEnabled && { LINKEDIN: "linkedin" }),
    ...(enabledSocialMedia.isPinterestEnabled && { PINTEREST:"pinterest" }),
});
export const Linkedin_URN_Id_Types = Object.freeze({
    ORGANIZATION:"organization",
    DIGITAL_MEDIA_ASSET: "digitalmediaAsset",
    PERSON: "person",
    SHARE: "share",
    UGC_POST: "ugcPost",
    IMAGE: "image",
    VIDEO: "video",
});
export const UpdateCommentFailedMsg="Update Fail: User can only edit comments made from Addy."
export const SomethingWentWrong="Something went wrong!"
export const NoInstagramBusinessAccountFound="No business account found for Instagram to connect!"
export const CouldNotPostComment="Could not post comment!"


