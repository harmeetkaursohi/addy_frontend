import * as yup from "yup";
import {
    ErrorFetchingPost,
    InvalidAspectRatio,
    InvalidImageDimension,
    IsRequired,
    IsRequiredFor,
    MultiMediaLimit,
    MultiMediaSizeLimit,
    NoBusinessAccountFound,
    OnlyImageOrVideoCanBePosted,
    PinterestImageLimitation,
    SelectAtleastOnePage,
    SocialAccountProvider,
    SomethingWentWrongTryLater,
    VideoFormatNotSupported
} from "./contantData.js";
import {exchangeForLongLivedToken, getAllFacebookConnectedSocialMediaAccounts} from "../services/facebookService.js";
import {decodeJwtToken} from "../app/auth/auth.js";
import {facebookPageConnect, getFacebookConnectedPages} from "../app/actions/facebookActions/facebookActions.js";
import fb from "../images/fb.svg";
import instagram_img from "../images/instagram.png";
import linkedin from "../images/linkedin.svg";
import Pinterest from "../images/pinterest_icon.svg";
import {getAllSocialMediaPostsByCriteria} from "../app/actions/postActions/postActions";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {Linkedin_URN_Id_Types} from "./contantData.js";
import default_user_icon from "../images/default_user_icon.svg"
import {showErrorToast} from "../features/common/components/Toast";

export const validationSchemas = {

    login: yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required')
    }),

    register: yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        username: yup.string().required('Username is required'),
        email: yup.string().required('Email is required').email('Invalid email format'),
    }),

    updatePassword: yup.object().shape({
        oldPassword: yup.string().required('Old password is required'),
        newPassword: yup.string()
            .required('Password is required')
            .matches(/^(?=.*[0-9])/, 'Password must contain at least one digit (0-9)')
            .matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter (a-z)')
            .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter (A-Z)')
            .matches(/^(?=.*[@#$%^&+=])/, 'Password must contain at least one special character (@#$%^&+=)')
            .matches(/^(?=\S+$)/, 'Password cannot contain whitespace')
            .matches(/.{8,}$/, 'Password must be at least 8 characters long'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required'),

    }),

    createPassword: yup.object().shape({
        password: yup.string()
            .required('Password is required')
            .matches(/^(?=.*[0-9])/, 'Password must contain at least one digit (0-9)')
            .matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter (a-z)')
            .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter (A-Z)')
            .matches(/^(?=.*[@#$%^&+=])/, 'Password must contain at least one special character (@#$%^&+=)')
            .matches(/^(?=\S+$)/, 'Password cannot contain whitespace')
            .matches(/.{8,}$/, 'Password must be at least 8 characters long'),
        confirmPassword: yup.string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),

    }),

    address: yup.object().shape({
        country: yup.string().required('Country is required'),
        addressLine1: yup.string().required('AddressLine is required'),
        county: yup.string().required('County is required'),
        state: yup.string().required('State is required'),
    }),

    forgotPassword: yup.object().shape({
        email: yup.string().required('Email is required').email('Invalid email format'),
    }),

    contactForm: yup.object().shape({
        first_name: yup.string().required('First Name is required'),
        last_name: yup.string().required('Last Name is required'),
        email_address: yup.string().required('Email address is required').email('Invalid email address format'),
        phone_number: yup.string().required('Phone Number is required'),
        message: yup.string().required('Message is required'),
        "g-recaptcha-response": yup.string().required("Please check on the reCAPTCHA box."),
    }),

    editProfileInfo: yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
    }),

    editProfileInfoWithAddressRequired: yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        username: yup.string().required('Username is required'),
        addressLine1: yup.string().required('Address is required'),
        country: yup.string().required('Country is required'),
        state: yup.string().required('State is  required'),
        county: yup.string().required('County is required'),
    }),

};


export const computeAndSocialAccountJSON = async (jsonObj, tokenProvider) => {
    const token = localStorage.getItem("token");
    const decodeJwt = decodeJwtToken(token);
    const response = {
        customerId: decodeJwt.customerId, token: token, socialAccountData: {
            pageAccessToken: []
        }
    }
    switch (tokenProvider) {
        case SocialAccountProvider.INSTAGRAM:
        case SocialAccountProvider.FACEBOOK: {
            const longLivedToken = await exchangeForLongLivedToken(jsonObj?.data?.accessToken, tokenProvider);
            if (tokenProvider === SocialAccountProvider.INSTAGRAM) {
                const facebookConnectedSocialMediaAccountsData = await getAllFacebookConnectedSocialMediaAccounts(longLivedToken);
                const instagramBusinessAccount = facebookConnectedSocialMediaAccountsData?.filter(accountData => {
                    return accountData.hasOwnProperty("instagram_business_account")
                })
                if (isNullOrEmpty(instagramBusinessAccount)) {
                    throw new Error(formatMessage(NoBusinessAccountFound, [getInitialLetterCap(tokenProvider)]));
                }
            }
            return {
                ...response, socialAccountData: {
                    ...response.socialAccountData,
                    name: jsonObj?.data?.name || null,
                    email: jsonObj?.data?.email || null,
                    imageUrl: jsonObj?.data?.picture?.data?.url || null,
                    provider: getKeyFromValueOfObject(SocialAccountProvider, tokenProvider) || null,
                    providerId: jsonObj?.data?.userID || null,
                    accessToken: longLivedToken || null,
                }
            }
            break;
        }
        case SocialAccountProvider.LINKEDIN : {
            if (jsonObj === null || jsonObj === undefined || Object?.keys(jsonObj?.data)?.includes("error")) {
                throw new Error(SomethingWentWrongTryLater);
            }
            const imageArray = jsonObj?.data?.profilePicture?.["displayImage~"]?.elements
            return {
                ...response, socialAccountData: {
                    ...response.socialAccountData,
                    name: (jsonObj?.data?.localizedFirstName + " " + jsonObj?.data?.localizedLastName) || null,
                    email: null,
                    imageUrl: (imageArray === undefined || imageArray === null || imageArray?.length === 0) ? null : imageArray[imageArray?.length - 1]?.identifiers[0]?.identifier,
                    provider: getKeyFromValueOfObject(SocialAccountProvider, tokenProvider) || null,
                    providerId: jsonObj?.data?.id || null,
                    accessToken: jsonObj?.data?.access_token || null,
                    refreshToken: jsonObj?.data?.refresh_token || null,
                }
            }
        }


        case SocialAccountProvider.PINTEREST : {
            if (jsonObj.data.account_type !== "BUSINESS") {
                throw new Error(formatMessage(NoBusinessAccountFound, [getInitialLetterCap(tokenProvider)]));
            }
            return {
                ...response, socialAccountData: {
                    ...response.socialAccountData,
                    name: jsonObj?.data?.business_name || null,
                    email: jsonObj?.data?.email || null,
                    imageUrl: jsonObj?.data?.profile_image || null,
                    provider: getKeyFromValueOfObject(SocialAccountProvider, tokenProvider) || null,
                    providerId: jsonObj?.data?.id || null,
                    accessToken: jsonObj?.data?.access_token || null,
                    refreshToken: jsonObj?.data?.refresh_token || null,
                }
            }
        }
    }
}


export const getKeyFromValueOfObject = (object, value) => {

    for (const key in object) {
        if (object.hasOwnProperty(key) && object[key] === value) {
            return key;
        }
    }

}

export const cleanAndValidateRequestURL = (baseUrl, path, fields, token) => {
    const url = new URL(`${baseUrl}${path}`);
    url.searchParams.set('fields', fields);
    url.searchParams.set('access_token', token);
    return url.toString();
}


export const pageConnectAction = (dispatch, token, data, socialMediaAccountInfo) => {
    const decodeJwt = decodeJwtToken(token);
    let requestBody = {
        customerId: decodeJwt?.customerId, pageAccessTokenDTO: {
            pageId: data?.id,
            name: data?.name,
            socialMediaAccountId: socialMediaAccountInfo?.id
        }, token: token
    }
    switch (socialMediaAccountInfo?.provider) {
        case SocialAccountProvider.FACEBOOK.toUpperCase(): {
            requestBody = {
                ...requestBody, pageAccessTokenDTO: {
                    ...requestBody.pageAccessTokenDTO,
                    imageUrl: data.picture?.data?.url,
                    about: data?.about,
                    access_token: data?.access_token,
                }
            }
            break;
        }
        case SocialAccountProvider.INSTAGRAM.toUpperCase(): {
            requestBody = {
                ...requestBody, pageAccessTokenDTO: {
                    ...requestBody.pageAccessTokenDTO,
                    imageUrl: data?.profile_picture_url,
                    about: data?.about,
                    access_token: socialMediaAccountInfo.accessToken,
                }
            }
            break;
        }
        case SocialAccountProvider.PINTEREST.toUpperCase(): {
            requestBody = {
                ...requestBody, pageAccessTokenDTO: {
                    ...requestBody.pageAccessTokenDTO,
                    imageUrl: data?.media?.image_cover_url,
                    about: data?.description,
                    access_token: socialMediaAccountInfo.accessToken,
                }
            }
            break;
        }
        case SocialAccountProvider.LINKEDIN.toUpperCase(): {
            requestBody = {
                ...requestBody, pageAccessTokenDTO: {
                    ...requestBody.pageAccessTokenDTO,
                    imageUrl: data?.logo_url,
                    about: data?.description,
                    access_token: socialMediaAccountInfo.accessToken,
                }
            }
            break;
        }
        default: {
        }
    }
    if (data) {
        dispatch(facebookPageConnect(requestBody)).then((response) => {
            dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            dispatch(getAllSocialMediaPostsByCriteria({
                token: token,
                query: {limit: 6, period: "MONTH", sort: "feedPostDate", sortOrder: "asc", postStatus: ["SCHEDULED"]}
            }));
        }).catch((error) => {
            console.log("--->error", error)
        })
    }
}

// Define a function to convert combined date and time string to Unix timestamp
export function convertToUnixTimestamp(scheduleDate, scheduleTime) {
    const combinedDateTimeString = `${scheduleDate}T${scheduleTime}:00`;
    const localDateTime = new Date(combinedDateTimeString);
    return localDateTime.getTime() / 1000;
}


// Function to validate schedule date and time
export const validateScheduleDateAndTime = (scheduleDate, scheduleTime) => {
    const inputDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const currentDate = new Date();
    const minAllowedDate = new Date(currentDate.getTime() + 10 * 60000);
    return inputDateTime >= minAllowedDate;
};

export const checkDimensions = (file) => {

    if (file.type.startsWith('image/')) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const imageUrl = URL.createObjectURL(file);
            img.src = imageUrl;
            img.onload = () => {
                resolve({file: file, url: imageUrl, fileName: file?.name, mediaType: "IMAGE"});
            };
            img.onerror = (error) => {
                reject(error);
            };
        });
    }

    if (file.type.startsWith('video/')) {
        return new Promise((resolve, reject) => {
            const mediaElement = document.createElement("video");
            const videoUrl = URL.createObjectURL(file);
            mediaElement.src = videoUrl;

            mediaElement.onloadedmetadata = () => {
                resolve({
                    file: file,
                    url: videoUrl,
                    mediaType: "VIDEO",
                    fileName: file?.name,
                    duration: mediaElement.duration
                });
            };
            mediaElement.onerror = (error) => {
                reject(error);
            };
        });
    }
};

export const handleSeparateCaptionHashtag = (inputText) => {
    if (inputText) {
        const hashtagIndex = inputText.indexOf('#');
        if (hashtagIndex !== -1) {
            const extractedCaption = inputText.substring(0, hashtagIndex).trim();
            const extractedHashtag = inputText.substring(hashtagIndex).trim();
            return {caption: extractedCaption, hashtag: extractedHashtag}

        } else {
            return {caption: inputText, hashtag: ''};
        }
    }
};

export function sortByKey(list, key) {
    function sortBy(a, b) {
        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();
        return dateA - dateB;
    }

    list.sort(sortBy);
    return list;
}

export const redirectToURL = (redirectedURL) => {
    window.open(redirectedURL, '_blank');
}

export const isPlannerPostEditable = (btnReference, data = null) => {
    if (data === null) {
        return false
    }
    if (btnReference === "DELETE") {
        return ((new Date(data?.feedPostDate).getTime() - 15 * 60 * 1000) - new Date().getTime() > 0) || (data?.postPages?.every(postPage => postPage?.errorInfo?.isDeletedFromSocialMedia));
    }
    return (new Date(data?.feedPostDate).getTime() - 15 * 60 * 1000) - new Date().getTime() > 0;
}


export const computeAndReturnPlannerEvent = (currentObject) => {
    let a = [];
    Object.keys(currentObject).map(c => {
        a.push({
            start: new Date(c),
            showMoreContent: Object.keys(currentObject[c]).length - 1,
            batchId: Object.keys(currentObject[c])[0],
            postDate: new Date(c),
            childCardContent: computeAndBuildChildCard(currentObject[c], Object.keys(currentObject[c])[0])
        });
    })

    return a;
}
export const isPostDatesOnSameDayOrInFuture = (postDate, currentDate) => {
    const d1 = new Date(postDate);
    const d2 = new Date(currentDate);
    return d1.getUTCDate() >= d2.getUTCDate() && d1.getUTCMonth() >= d2.getUTCMonth() && d1.getUTCFullYear() >= d2.getUTCFullYear();

}

export const computeAndBuildChildCard = (childCardProps, key) => {
    function computeTitle(providerType) {
        switch (providerType) {
            case 'FACEBOOK':
                return "Facebook";
            case 'INSTAGRAM':
                return "Instagram"
            case 'LINKEDIN':
                return "Linkedin";
            case 'TWITTER':
                return "Twitter"
            default: {
                return "Pinterest"
            }
        }
    }


    return Object.keys(childCardProps[key]).map((c) => {
        return {
            id: childCardProps[key][c][0]?.id,
            socialMediaPostId: childCardProps[key][c][0]?.socialMediaPostId,
            title: computeTitle(c),
            imageUrl: computeImageURL(c),
        }

    })

}

export function computeImageURL(providerType) {
    switch (providerType) {
        case 'FACEBOOK':
            return fb;
        case 'INSTAGRAM':
            return instagram_img
        case 'LINKEDIN':
            return linkedin;
        case 'TWITTER':
            return "Twitter"
        default: {
            return Pinterest
        }
    }
}

export function getEnumValue(providerType) {
    switch (providerType) {
        case 'FACEBOOK':
            return "Facebook";
        case 'INSTAGRAM':
            return "Instagram";
        case 'LINKEDIN':
            return "Linkedin";
        case 'TWITTER':
            return "Twitter"
        default: {
            return "Pinterest"
        }
    }
}

export const dateFormat = (date, appendURL) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const isoDateString = `${year}-${month}-${day}T00:00:00.000+00:00`;
    return isoDateString;
}


export const notConnectedSocialMediaAccount = (provider, connectedList) => {
    if (connectedList === undefined || (Array.isArray(connectedList) && connectedList.filter(c => c.provider !== "GOOGLE").length === 0)) {
        return true;
    }

    return !connectedList.some(curProv => curProv?.provider === provider);
}
export const socialMediaAccountHasConnectedPages = (provider, socialMediaAccountList = [], connectedPagesList = []) => {
    if (!isNullOrEmpty(provider) && !isNullOrEmpty(socialMediaAccountList) && !isNullOrEmpty(connectedPagesList)) {
        const connectedAccount = socialMediaAccountList?.find(socialMediaAccount => socialMediaAccount.provider === provider)
        return connectedAccount && connectedPagesList?.some(connectedPage => connectedPage?.socialMediaAccountId === connectedAccount?.id)
    }
    return false;
}


export const isPageConnected = (connectedPaged, currentPage) => {

    const c = connectedPaged.some((obj) => {
        return obj?.pageId === currentPage?.id;
    });
    return c;
}

export const computeAndReturnSummedDateValues = (data, socialMediaType) => {

    switch (socialMediaType) {
        case "FACEBOOK":
        case "INSTAGRAM": {
            const result = data.reduce((accumulator, current) => {
                const date = current.end_time.split('T')[0]; // Extract the date part

                if (accumulator[date]) {
                    accumulator[date].value += current.value;
                } else {
                    accumulator[date] = {"count": current.value, "endDate": date};
                }

                return accumulator;
            }, {})

            return Object.values(result);
        }
        case "PINTEREST": {
            const result = data?.map(dailyMetricsData => {
                return {
                    endDate: dailyMetricsData?.date,
                    count: dailyMetricsData?.metrics?.IMPRESSION
                }
            })
            return result
        }
        case "LINKEDIN": {
            if (data[0]?.hasOwnProperty("followerGains")) {
                return data?.map(element => {
                    return {
                        endDate: convertUnixTimestampToDateTime(element?.timeRange?.start / 1000)?.date,
                        count: element?.followerGains?.organicFollowerGain + element?.followerGains?.paidFollowerGain
                    }
                })
            } else {
                return data?.map(element => {
                    return {
                        endDate: convertUnixTimestampToDateTime(element?.timeRange?.start / 1000)?.date,
                        count: element?.totalShareStatistics?.impressionCount
                    }
                })
            }
        }
    }
}


export const calculatePercentageGrowth = async (data) => {
    for (let i = 1; i < data.length; i++) {
        const currentCount = data[i].count;
        const previousCount = data[i - 1].count;
        if (previousCount === 0) {
            data[i].percentageGrowth = currentCount * 100; // Show 300% instead of 0
        } else {
            data[i].percentageGrowth = ((currentCount - previousCount) / previousCount) * 100;
        }
    }
    if (data.length > 0) {
        data.shift()
    }


    return data;
}


export const generateUnixTimestampFor = (daysAgo) => {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (isNullOrEmpty(daysAgo.toString())) {
        return "";
    }
    if (daysAgo === "now") {
        return Math.floor(currentDate.getTime() / 1000);
    } else {

        const daysAgoDate = new Date(currentDate);
        daysAgoDate.setDate(currentDate.getDate() - daysAgo);
        return Math.floor(daysAgoDate.getTime() / 1000);
    }
}

export const convertToHashtag = (str) => {
    if (str.startsWith('#')) {
        return str;
    } else if (str) {
        return `#${str}`;
    }
    return ""
}
const eliminateDuplicateHashTags = (hashtags) => {
    const uniqueSet = new Set(hashtags);
    const uniqueHashTags = Array.from(uniqueSet);
    return uniqueHashTags;
}

export const convertSentenceToHashtags = (sentence) => {
    let words = sentence.replace("\n", " #").split(' ');
    // Eliminate Duplicate Tags
    if (words[words.length - 1] === "") {
        words = eliminateDuplicateHashTags(words)
    }
    const hashtags = words.map(word => convertToHashtag(word));
    const result = hashtags.join(' ');
    return result;
}
export const getCommentCreationTime = (date) => {
    const currentDate = new Date();
    const createdDate = new Date(date);
    let timeDifference = currentDate - createdDate;
    if (timeDifference < 0) {
        timeDifference = timeDifference - timeDifference
    }
    if (timeDifference < 10000) {
        return 'just now'
    }
    const seconds = Math.floor(timeDifference / 1000);
    if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export const handleShowCommentReplyBox = (showReplyBox, index) => {
    let updatedShowReplyBox = new Array(showReplyBox?.size).fill(false)
    updatedShowReplyBox[index] = true;
    return updatedShowReplyBox

}
export const handleShowCommentReplies = (showCommentReply, index) => {
    let updatedShowCommentReply = [...showCommentReply]
    updatedShowCommentReply[index] = !showCommentReply[index];
    return updatedShowCommentReply

}
export const getMentionedUserCommentFormat = (replyComment, socialMediaType) => {
    switch (socialMediaType) {
        case "FACEBOOK": {
            return !replyComment?.message.includes(replyComment?.mentionedPageName) ? replyComment?.message : replyComment?.message.replace(replyComment?.mentionedPageName, `@[${replyComment?.mentionedPageId}]`)
        }
        case "LINKEDIN": {
            if (replyComment?.mentionedUser?.length > 0) {
                const mentionedUsers = replyComment?.mentionedUser?.filter(mentionedUser => replyComment?.message?.includes(mentionedUser?.name))
                if (mentionedUsers?.length > 0) {
                    return {
                        actor: replyComment?.actor,
                        object: replyComment?.object,
                        attributes: mentionedUsers?.map(mentionedUser => {
                            const idType = getLinkedinIdTypeFromUrn(mentionedUser?.id);
                            return {
                                length: mentionedUser?.name?.length,
                                start: replyComment?.message?.indexOf(mentionedUser?.name),
                                value: {
                                    [idType]: {
                                        [idType]: mentionedUser?.id
                                    }
                                }
                            }
                        }),
                        message: replyComment?.message,
                        parentComment: replyComment?.parentComment
                    }
                }
            }
            return {
                actor: replyComment?.actor,
                object: replyComment?.object,
                message: replyComment?.message,
                parentComment: replyComment?.parentComment,
            };
            break;

        }
        default: {

        }
    }
}

export const getLinkedinIdTypeFromUrn = (urn = null) => {
    if (urn === null) {
        return null;
    }
    const parts = urn.split(':');
    if (parts.length >= 3) {
        return parts[2];
    } else {
        return null;
    }
}

export const getUpdateCommentMessage = (commentToUpdate, socialMediaType) => {
    switch (socialMediaType) {
        case "FACEBOOK": {
            let updatedMessage = commentToUpdate?.message
            if (commentToUpdate?.message_tags?.length === 0) {
                return commentToUpdate?.message
            }
            const mentionedAccounts = commentToUpdate?.message_tags?.filter(tags => tags?.type === "user")
            if (mentionedAccounts?.length === 0) {
                return commentToUpdate?.message
            } else {
                mentionedAccounts?.map(accounts => {
                    updatedMessage = updatedMessage?.replace(accounts?.name, `@[${accounts?.id}]`)
                })
            }
            return updatedMessage
            break;
        }
        case "LINKEDIN": {
            let updatedMessage = {
                text: commentToUpdate?.updatedMessage,
                actor: commentToUpdate?.comment?.actor,
                commentId: commentToUpdate?.comment?.id,
                parentObjectUrn: commentToUpdate?.comment?.hasOwnProperty("parentComment") ? commentToUpdate?.comment?.parentComment : commentToUpdate?.comment?.object,
            }
            if (commentToUpdate?.mentionedUsers?.length > 0) {
                const currentMentionedUsers = commentToUpdate?.mentionedUsers?.filter(mentionedUser => commentToUpdate?.updatedMessage?.includes(mentionedUser?.name))
                if (currentMentionedUsers?.length > 0) {
                    updatedMessage = {
                        ...updatedMessage,
                        attributes: currentMentionedUsers?.map(mentionedUser => {
                            const idType = getLinkedinIdTypeFromUrn(mentionedUser?.id);
                            return {
                                length: mentionedUser?.name?.length,
                                start: commentToUpdate?.updatedMessage?.indexOf(mentionedUser?.name),
                                value: {
                                    [idType]: {
                                        [idType]: mentionedUser?.id
                                    }
                                }
                            }
                        })
                    }
                }
            }
            return updatedMessage
            break;
        }
        default: {

        }
    }

}

export const getFormattedDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = {year: 'numeric', month: 'short', day: 'numeric'};
    return date.toLocaleString(undefined, options);
}

// Function to convert an image URL to a File object
export async function urlToFile(imageUrl, fileNameWithExtension, mediaType) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const fileExtension = (mediaType === "IMAGE") ? `image/${fileNameWithExtension.split(".")[1]}` : `video/${fileNameWithExtension.split(".")[1]}`;

        // const file = new File([blob], fileNameWithExtension, {type: fileExtension});
        const file = blobToFile(blob, fileNameWithExtension, fileExtension);
        return file;
    } catch (error) {
        console.error("Error converting URL to File:", error);
        return null;
    }
}

export const blobToFile = (blob, fileName, fileType) => {
    return new File([blob], fileName, {type: fileType});
}

export const base64StringToFile = (base64String, fileName, fileType) => {
    try {
        const byteCharacters = atob(base64String); // Decode the Base64 string
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {type: fileType});


        // return new File([blob], fileName, {type: fileType});
        return blobToFile(blob, fileName, fileType);
    } catch (error) {
        console.error("Error converting base64 to File:", error);
        return null;
    }
}

// Function to convert a list of image URLs to a list of File objects
export async function urlsToFiles(fileUrlList) {
    const files = [];
    for (const fileUrl of fileUrlList) {
        const file = await urlToFile(fileUrl.imageURL);
        if (file) {
            files.push({socialMediaPostId: fileUrl.socialMediaPostId, file: file});
        }
    }

    return files;
}

export const getImagePostList = async (postData) => {


    return postData.flatMap(post => post.attachments).map(async attachment => {
        let file = null;

        if (attachment.mediaType === "IMAGE") {
            file = await urlToFile(attachment.imageURL, attachment?.attachmentName, attachment.mediaType);
        } else {
            file = await urlToFile(attachment.sourceURL, attachment?.attachmentName, attachment.mediaType);
        }
        const attachmentList = {
            file: file,
            url: attachment.sourceURL || attachment.imageURL,
            attachmentReferenceId: attachment.id,
            attachmentReferenceName: attachment.attachmentName,
            attachmentReferenceURL: attachment.sourceURL || attachment.imageURL,
            mediaType: attachment.mediaType,
            pageId: attachment.pageId
        }

        return attachmentList;

    }) || [];
};


export const groupByKey = (data) => {

    const groupedData = data.reduce((result, item) => {
        const key = item?.fileName;
        if (!result[key]) {
            result[key] = item;
        }
        return result;
    }, {});

    return Object.values(groupedData);

}


export function trimToNull(str) {
    const trimmed = str.trim();

    return trimmed.length === 0 ? null : trimmed;
}


export const baseAxios = axios.create();
baseAxios?.interceptors?.request.use(
    response => {
        // List Of Urls that does not requires Token to Call API
        const exemptedURLs = ["/auth/register", "/auth/login", "/auth/forgot-password", "/auth/reset-password"]
        const isExempted = exemptedURLs.some(url => {
            return response.url.includes(url)
        })
        if (isTokenValid() || isExempted) {
            return response
        } else {
            window.location.href = '/login';
            localStorage.clear();
        }
    },
    error => Promise.reject(error)
)
baseAxios.interceptors.response.use(
    response => response,
    error => {
        const exemptedURLs = ["/api/auth/login", "https://graph.facebook.com/v17.0", "https://api.openai.com/"]
        const isExempted = exemptedURLs.some(url => {
            return error?.request?.responseURL?.includes(url);
        })
        if (error?.response?.status === 403 && !isExempted) {
            window.location.href = '/login';
            localStorage.clear();
        }
        return Promise.reject(error)
    }
)

export const isTokenValid = () => {
    let token;
    try {
        token = jwtDecode(localStorage.getItem("token"));
    } catch (error) {
        return false;
    }
    return token?.exp > Math.floor(Date.now() / 1000);
}

export const isNullOrEmpty = (value) => {
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    return value === null || value === undefined || value?.trim() === ""
}
export const isReplyCommentEmpty = (replyComment) => {
    if (replyComment === null || replyComment === undefined || replyComment === "") {
        return true
    }
    return replyComment?.message === null || replyComment?.message === undefined || replyComment?.message?.trim() === "" || replyComment?.message?.trim() === replyComment?.mentionedPageName
}
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
export const isErrorInInstagramMention = (socialMediaType, error) => {
    return socialMediaType === "INSTAGRAM" && error?.response?.data?.error?.code === 20 && error?.response?.data?.error?.error_subcode === 1772179

}
export const getInitialLetterCap = (word) => {
    if (isNullOrEmpty(word)) {
        return ""
    }
    return word.charAt(0).toUpperCase() + word.slice(1);

}

export const getQueryForGraphData = (socialMediaType, selectedGraphDays) => {
    switch (socialMediaType) {
        case "FACEBOOK": {
            return {
                createdFrom: generateUnixTimestampFor(selectedGraphDays),
                createdTo: generateUnixTimestampFor(1)
            }
        }
        case "INSTAGRAM": {
            return {
                createdFrom: generateUnixTimestampFor(selectedGraphDays - 1),
                createdTo: generateUnixTimestampFor("now")
            }

        }
        case "PINTEREST": {
            //For Pinterest last 2 days data is not available and want to fetch one more day data for percentage check
            return {
                startDate: getDatesForPinterest(selectedGraphDays),
                endDate: getDatesForPinterest("now")
            }

        }
        case "LINKEDIN": {
            return {
                createdFrom: generateUnixTimestampFor(selectedGraphDays) * 1000,
                createdTo: generateUnixTimestampFor("now") * 1000
            }

        }


    }

}
export const convertUnixTimestampToDateTime = (unixTimestamp) => {
    if (isNullOrEmpty(unixTimestamp.toString())) {
        return null
    }
    // Convert Unix timestamp to milliseconds
    const timestampInMilliseconds = unixTimestamp * 1000;

    // Create a new Date object
    const dateObject = new Date(timestampInMilliseconds);

    // Extract date components
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    // Extract time components
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');

    // Format the date and time
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:${minutes}`;

    return {date: formattedDate, time: formattedTime};
}
export const getFormattedPostTime = (inputDate, format = "") => {

    const inputDateObject = new Date(inputDate);
    let options;
    if (format === "") {
        options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
    }
    if (format === "DD-Mon") {
        options = {
            day: 'numeric',
            month: 'short',
        };
    }

    const outputDate = inputDateObject.toLocaleString('en-US', options);
    return outputDate;
};
export const getFormattedAccountReachAndEngagementData = (data, socialMediaType) => {


    let formattedData = {
        engagement: {
            presentData: null,
            previousData: {
                data: null,
                dateRange: null
            }
        },
        reach: {
            presentData: null,
            previousData: {
                data: null,
                dateRange: null
            }
        }
    }
    switch (socialMediaType) {
        case "FACEBOOK": {
            const engagement = data?.filter(data => data?.name === "page_post_engagements")[0]?.values
            const reach = data?.filter(data => data?.name === "page_impressions_unique")[0]?.values
            const totalEngagementForPreviousDate = engagement.slice(0, (engagement?.length) / 2);
            const totalEngagementForPresentDate = engagement.slice((engagement?.length) / 2)
            const totalReachForPreviousDate = reach.slice(0, (reach?.length) / 2);
            const totalReachForPresentDate = reach.slice((reach?.length) / 2)
            formattedData = {
                engagement: {
                    presentData: totalEngagementForPresentDate.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.value;
                    }, 0),
                    previousData: {
                        data: totalEngagementForPreviousDate.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.value;
                        }, 0),
                        dateRange: `${getFormattedPostTime(totalEngagementForPreviousDate[0]?.end_time, "DD-Mon") + "-" + getFormattedPostTime(totalEngagementForPreviousDate[totalEngagementForPreviousDate?.length - 1]?.end_time, "DD-Mon")}`
                    }
                },
                reach: {
                    presentData: totalReachForPresentDate.reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.value;
                    }, 0),
                    previousData: {
                        data: totalReachForPreviousDate.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.value;
                        }, 0),
                        dateRange: `${getFormattedPostTime(totalReachForPreviousDate[0]?.end_time, "DD-Mon") + "-" + getFormattedPostTime(totalReachForPreviousDate[totalEngagementForPreviousDate?.length - 1]?.end_time, "DD-Mon")}`
                    }
                }

            }
            return formattedData;
        }
        case "INSTAGRAM": {
            const presentReach = data?.presentData?.filter(data => data?.name === "reach")[0]?.total_value?.value
            const presentEngagement = data?.presentData?.filter(data => data?.name === "accounts_engaged")[0]?.total_value?.value
            const previousReach = data?.previousData?.data?.filter(data => data?.name === "reach")[0]?.total_value?.value
            const previousEngagement = data?.previousData?.data?.filter(data => data?.name === "accounts_engaged")[0]?.total_value?.value
            formattedData = {
                engagement: {
                    presentData: presentEngagement,
                    previousData: {
                        data: previousEngagement,
                        dateRange: data?.previousData?.dateRange
                    }
                },
                reach: {
                    presentData: presentReach,
                    previousData: {
                        data: previousReach,
                        dateRange: data?.previousData?.dateRange
                    }
                }
            }
            return formattedData;
        }
        case "PINTEREST": {
            const readyData = data?.all?.daily_metrics?.filter(insightsData => insightsData?.data_status === "READY");
            const totalDays = Math.floor(readyData?.length);
            const previousData = readyData?.slice(0, totalDays / 2);
            const presentData = readyData?.slice((totalDays / 2) * -1);
            const dateRange = getFormattedPostTime(new Date(previousData[0]?.date), "DD-Mon") + "-" + getFormattedPostTime(new Date(previousData[(totalDays / 2) - 1]?.date), "DD-Mon")
            const summedPreviousData = filterAndSumPinterestUserAnalyticsDataFor(previousData, previousData?.length, ["IMPRESSION", "ENGAGEMENT"]);
            const summedPresentData = filterAndSumPinterestUserAnalyticsDataFor(presentData, presentData?.length, ["IMPRESSION", "ENGAGEMENT"]);
            formattedData = {
                engagement: {
                    presentData: summedPresentData?.ENGAGEMENT,
                    previousData: {
                        data: summedPreviousData?.ENGAGEMENT,
                        dateRange: dateRange
                    }
                },
                reach: {
                    presentData: summedPresentData?.IMPRESSION,
                    previousData: {
                        data: summedPreviousData?.IMPRESSION,
                        dateRange: dateRange
                    }
                }
            }
            return formattedData;
        }
        case "LINKEDIN": {
            const statisticsData = data?.timeBound?.elements;
            const totalDays = Math.floor(statisticsData?.length);
            const previousData = statisticsData?.slice(0, totalDays / 2);
            const presentData = statisticsData?.slice((totalDays / 2) * -1);
            const dateRange = getFormattedPostTime(previousData[0]?.timeRange?.start, "DD-Mon") + "-" + getFormattedPostTime(previousData[previousData?.length - 1]?.timeRange?.start, "DD-Mon")
            const summedPreviousData = filterAndSumLinkedinOrgStatisticsDataFor(previousData, previousData?.length, ["impressionCount", "engagement"]);
            const summedPresentData = filterAndSumLinkedinOrgStatisticsDataFor(presentData, presentData?.length, ["impressionCount", "engagement"]);
            formattedData = {
                engagement: {
                    presentData: summedPresentData?.engagement,
                    previousData: {
                        data: summedPreviousData?.engagement,
                        dateRange: dateRange
                    }
                },
                reach: {
                    presentData: summedPresentData?.impressionCount,
                    previousData: {
                        data: summedPreviousData?.impressionCount,
                        dateRange: dateRange
                    }
                }
            }
            return formattedData;
            break;
        }
    }
}
export const calculatePercentageGrowthFor = (previousValue, currentValue, decimalPlaces = 2) => {
    if ((currentValue === null || currentValue === undefined) && (previousValue === null || previousValue === undefined)) {
        return ""
    }
    if (previousValue === 0) {
        return (currentValue * 100).toFixed(decimalPlaces)
    } else {
        return (((currentValue - previousValue) / previousValue) * 100).toFixed(decimalPlaces);
    }

}
export const getChartFormattedDataForInsights = (data, socialMediaType) => {
    if (data === null || data === undefined) {
        return []
    }
    switch (socialMediaType) {
        case "INSTAGRAM":
        case "LINKEDIN":
        case "FACEBOOK": {
            if (data?.Accounts_Reached !== undefined && data?.Followers !== undefined) {
                const accountsReachedPercentage = data?.Accounts_Reached?.map(reach => parseFloat(reach?.percentageGrowth));
                const followersPercentage = data?.Followers?.map(followers => parseFloat(followers?.percentageGrowth));

                // Find the highest and lowest values
                const highestValue = Math.max(...accountsReachedPercentage, ...followersPercentage);
                const lowestValue = Math.min(...accountsReachedPercentage, ...followersPercentage);
                let formattedDate = [];
                for (let i = 0; i < data?.Accounts_Reached?.length; i++) {
                    formattedDate = [...formattedDate, {
                        x_axis: data?.Accounts_Reached[i]?.endDate,
                        account_reach: data?.Accounts_Reached[i]?.percentageGrowth.toFixed(2),
                        followers: data?.Followers[i]?.percentageGrowth.toFixed(2),
                        amt: i === 0 ? lowestValue : i === 1 ? highestValue : 0
                    }]
                }
                return formattedDate;
            }
        }
        case "PINTEREST": {
            const accountsReachedPercentage = data?.Accounts_Reached?.map(reach => parseFloat(reach?.percentageGrowth));
            // Find the highest and lowest values
            const highestValue = Math.max(...accountsReachedPercentage);
            const lowestValue = Math.min(...accountsReachedPercentage);
            let formattedDate = [];
            for (let i = 0; i < data?.Accounts_Reached?.length; i++) {
                formattedDate = [...formattedDate, {
                    x_axis: data?.Accounts_Reached[i]?.endDate,
                    account_reach: data?.Accounts_Reached[i]?.percentageGrowth.toFixed(2),
                    amt: i === 0 ? lowestValue : i === 1 ? highestValue : 0
                }]
            }
            return formattedDate;
        }
    }


}
export const extractParameterFromUrl = (url, parameterName) => {
    const urlSearchParams = new URLSearchParams(new URL(url).search);
    return urlSearchParams.get(parameterName);
}

export const getFormattedPostWithInsightsApiResponse = (insightsData, postIds, socialMediaType) => {
    let response = {};
    switch (socialMediaType) {
        case SocialAccountProvider?.FACEBOOK: {
            insightsData?.map(res => {
                response = res.hasOwnProperty("error") ? {...response, [res?.id]: res} : {
                    ...response,
                    [res?.data?.id]: res?.data
                }
            })
            return response;
        }
        case SocialAccountProvider?.INSTAGRAM: {
            postIds?.map(postId => {
                response = insightsData[postId] === undefined ? {
                    ...response,
                    [postId]: {id: postId, error: {message: "Object does not exist"}}
                } : {...response, [postId]: insightsData[postId]}
            })
            return response;
        }
        case SocialAccountProvider?.PINTEREST: {
            postIds?.map(postId => {
                response = insightsData[postId].hasOwnProperty("error") ? {
                    ...response,
                    [postId]: {id: postId, error: insightsData[postId]}
                } : {...response, [postId]: insightsData[postId]}
            })
            return response;
        }
        case SocialAccountProvider?.LINKEDIN: {
            postIds?.map(postId => {
                response = insightsData[postId].hasOwnProperty("error") ? {
                    ...response,
                    [postId]: {id: postId, error: insightsData[postId]?.error}
                } : {...response, [postId]: insightsData[postId]}
            })
            return response;
        }
    }
}


export const getFormattedPostDataForSlider = (data, socialMediaType) => {
    if (data === null || data === undefined) {
        return []
    }
    let formattedData = {}
    let errorResponse = {id: data?.id, hasError: true, errorInfo: {}}
    switch (socialMediaType) {
        case SocialAccountProvider.INSTAGRAM?.toUpperCase(): {
            if (data?.hasOwnProperty("error")) {
                return {
                    ...errorResponse,
                    errorInfo: {
                        isDeletedFromSocialMedia: data?.error?.message?.includes("Object does not exist"),
                        errorMessage: data?.error?.message
                    }
                }
            }
            formattedData = {
                total_like: data?.like_count,
                total_comment: data?.comments_count,
                total_share: data?.insights?.data?.filter(cur => cur.name === "shares")?.length === 0 ? "N/A" : data?.insights?.data?.filter(cur => cur.name === "shares")[0]?.values[0]?.value,
                account_reach: data?.insights?.data?.filter(cur => cur.name === "reach")[0]?.values[0]?.value,
                creation_time: data?.timestamp,
                attachments: getAttachmentsData(data, socialMediaType),
            }
            return formattedData
        }
        case SocialAccountProvider.FACEBOOK?.toUpperCase(): {
            if (data?.hasOwnProperty("error")) {
                return {
                    ...errorResponse,
                    errorInfo: {
                        isDeletedFromSocialMedia: data?.error?.message?.includes("Object does not exist"),
                        errorMessage: data?.error?.message
                    }
                }
            }
            formattedData = {
                total_like: data?.likes?.summary?.total_count,
                total_comment: data?.comments?.summary?.total_count,
                total_share: data?.shares?.count || 0,
                account_reach: data?.insights?.data[0]?.values[0]?.value,
                creation_time: data?.created_time,
                attachments: getAttachmentsData(data, socialMediaType),
            }
            return formattedData
        }
        case SocialAccountProvider.PINTEREST?.toUpperCase(): {
            if (data?.hasOwnProperty("error")) {
                return {
                    ...errorResponse,
                    errorInfo: {
                        isDeletedFromSocialMedia: data?.error?.status === "404",
                        errorMessage: data?.error?.message
                    }
                }
            }
            formattedData = {
                total_like: data?.pin_metrics?.all_time?.reaction,
                total_comment: data?.pin_metrics?.all_time?.comment,
                total_save: data?.pin_metrics?.all_time?.save,
                account_reach: data?.pin_metrics?.all_time?.impression,
                creation_time: data?.created_at,
                attachments: getAttachmentsData(data, socialMediaType),
            }
            return formattedData;
        }
        case SocialAccountProvider.LINKEDIN?.toUpperCase(): {
            if (data?.hasOwnProperty("error")) {
                return {
                    ...errorResponse,
                    errorInfo: {
                        isDeletedFromSocialMedia: data?.error?.status === "404",
                        errorMessage: data?.error?.message || ErrorFetchingPost
                    }
                }
            }
            formattedData = {
                total_like: data?.shareStatistics?.totalShareStatistics?.likeCount,
                total_comment: data?.shareStatistics?.totalShareStatistics?.commentCount,
                total_share: data?.shareStatistics?.totalShareStatistics?.shareCount,
                account_reach: data?.shareStatistics?.totalShareStatistics?.impressionCount,
                creation_time: data?.postInfo?.createdAt,
                attachments: getAttachmentsData(data, socialMediaType),
            }
            return formattedData;
        }
    }

}
export const getAttachmentsData = (data, socialMediaType) => {
    if (data === undefined || data === null || socialMediaType === undefined || socialMediaType === null) {
        return []
    }
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK?.toUpperCase(): {
            if (data?.attachments?.data?.[0]?.type === undefined) {
                return []
            } else if (data?.attachments?.data?.[0]?.type === "album") {
                return data?.attachments?.data?.[0]?.subattachments?.data?.map(attachment => {
                    return {
                        mediaType: "IMAGE",
                        imageURL: attachment?.media?.image?.src,
                        pageId: data?.id,
                    }
                })
            } else if (data?.attachments?.data?.[0]?.type === "photo") {
                return [{
                    mediaType: "IMAGE",
                    imageURL: data?.attachments?.data?.[0]?.media?.image?.src,
                    pageId: data?.id,

                }]
            } else {
                return [{
                    mediaType: "VIDEO",
                    imageURL: data?.attachments?.data?.[0]?.media?.image?.src,
                    sourceURL: data?.attachments?.data?.[0]?.media?.source,
                    pageId: data?.id,
                }]
            }

        }
        case SocialAccountProvider.LINKEDIN?.toUpperCase(): {
            if (data?.attachments?.length === 0) {
                return []
            } else {
                return data?.attachments?.map(attachment => {
                    if (attachment?.id?.startsWith("urn:li:image")) {
                        return {
                            mediaType: "IMAGE",
                            imageURL: attachment?.downloadUrl,
                            pageId: data?.postInfo?.id,
                        }
                    }
                    if (attachment?.id?.startsWith("urn:li:video")) {
                        return {
                            mediaType: "VIDEO",
                            sourceURL: attachment?.downloadUrl,
                            pageId: data?.postInfo?.id,
                            imageURL: attachment?.thumbnail,
                        }
                    }

                })
            }
            break;
        }
        case SocialAccountProvider.INSTAGRAM?.toUpperCase(): {
            if (data?.media_type === undefined) {
                return []
            } else if (data?.media_type === "IMAGE") {
                return [{
                    mediaType: "IMAGE",
                    imageURL: data?.media_url,
                    pageId: data?.id,
                }]
            } else if (data?.media_type === "CAROUSEL_ALBUM") {
                return data?.children?.data?.map(attachment => {
                    return {
                        mediaType: "IMAGE",
                        imageURL: attachment?.media_url,
                        pageId: data?.id,
                    }
                })
            } else {
                return [{
                    mediaType: "VIDEO",
                    sourceURL: data?.media_url,
                    pageId: data?.id,
                }]
            }
        }
        case SocialAccountProvider.PINTEREST?.toUpperCase(): {
            if (data?.media === undefined || data?.media === null) {
                return []
            }
            if (data?.media?.media_type === "image") {
                return [{
                    mediaType: "IMAGE",
                    imageURL: data?.media?.images?.["1200x"]?.url,
                    pageId: data?.id,
                }]
            } else {
                return [{
                    mediaType: "VIDEO",
                    sourceURL: data?.media?.video_url !== null ? data?.media?.video_url : data?.media?.images?.["1200x"]?.url,
                    pageId: data?.id,
                }]
            }
        }
    }

}
export const filterGenderAgeDataFromFacebookDemographicData = (data, key) => {

    if (data === null || data === undefined) {
        return null
    }
    switch (key) {
        case "AGE" : {
            const age_range = [...new Set(Object.keys(data)?.map(key => {
                return key.slice(2)
            }))]
            const sorted_age_range = age_range?.sort((a, b) => {
                const [startA, endA] = a.split('-').map(age => parseInt(age));
                const [startB, endB] = b.split('-').map(age => parseInt(age));
                return startA - startB;
            })
            return sorted_age_range?.map(ageRange => {
                return {
                    age_range: ageRange,
                    value: (data["M." + ageRange] || 0) + (data["F." + ageRange] || 0) + (data["U." + ageRange] || 0)
                }
            })
        }
        case "GENDER" : {
            return [{
                gender: "M",
                value: Object.keys(data)?.filter(key => {
                    return key.startsWith("M")
                })?.reduce((sum, key) => sum + data[key], 0)
            },
                {
                    gender: "F",
                    value: Object.keys(data)?.filter(key => {
                        return key.startsWith("F")
                    })?.reduce((sum, key) => sum + data[key], 0)
                },
                {
                    gender: "U",
                    value: Object.keys(data)?.filter(key => {
                        return key.startsWith("U")
                    })?.reduce((sum, key) => sum + data[key], 0)
                }
            ]
        }
    }
}
export const getFormattedDemographicData = (data, key, socialMediaType) => {
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK.toUpperCase(): {
            let formattedData;
            if (data?.data?.data?.length > 0) {
                let demographicData;
                if (key === "CITY") {
                    demographicData = data?.data?.data?.filter(data => data?.name === "page_fans_city")
                }
                if (key === "COUNTRY") {
                    demographicData = data?.data?.data?.filter(data => data?.name === "page_fans_country")
                }
                if (key === "AGE" || key === "GENDER") {
                    demographicData = data?.data?.data?.filter(data => data?.name === "page_fans_gender_age")
                }
                if (demographicData?.length > 0) {
                    if (key === "CITY") {
                        formattedData = Object.keys(demographicData[0]?.values[0]?.value)?.map(cur => {
                            return {
                                city_name: cur,
                                value: demographicData[0]?.values[0]?.value[cur]
                            }
                        })
                    }
                    if (key === "COUNTRY") {
                        formattedData = Object.keys(demographicData[0]?.values[0]?.value)?.map(cur => {
                            return {
                                country_code: cur,
                                value: demographicData[0]?.values[0]?.value[cur]
                            }
                        })
                    }
                    if (key === "AGE" || key === "GENDER") {
                        return filterGenderAgeDataFromFacebookDemographicData(demographicData[0]?.values[0]?.value, key)
                    }
                } else {
                    formattedData = null
                }

            } else {
                formattedData = null
            }
            return formattedData
        }
        case SocialAccountProvider.INSTAGRAM.toUpperCase(): {
            let formattedData;
            if (data?.data?.data[0]?.total_value?.breakdowns[0]?.results === undefined || data?.data?.data[0]?.total_value?.breakdowns[0]?.results === null || data?.data?.data[0]?.total_value?.breakdowns[0]?.results?.length === 0) {
                formattedData = null
            } else {
                formattedData = data?.data?.data[0]?.total_value?.breakdowns[0]?.results?.map(data => {
                    if (key === "CITY") {
                        return {
                            city_name: data?.dimension_values[0],
                            value: data?.value
                        }
                    }
                    if (key === "COUNTRY") {
                        return {
                            country_code: data?.dimension_values[0],
                            value: data?.value
                        }
                    }
                    if (key === "GENDER") {
                        return {
                            gender: data?.dimension_values[0],
                            value: data?.value
                        }
                    }
                    if (key === "AGE") {
                        return {
                            age_range: data?.dimension_values[0],
                            value: data?.value
                        }
                    }

                })
            }
            return formattedData
        }
        case SocialAccountProvider.LINKEDIN.toUpperCase(): {
            let formattedData;
            const keyData= data?.elements?.filter(data=>data.hasOwnProperty(key))
            if (keyData?.length===0) {
                formattedData= null;
            }else{
                if(key==="followerCountsByGeoCountry"){
                    formattedData= keyData[0]?.followerCountsByGeoCountry?.map(data=> {
                        return {
                            country_name:data?.geo,
                            value:data?.followerCounts?.organicFollowerCount + data?.followerCounts?.paidFollowerCount
                        }
                    });
                }
            }
            return formattedData
        }
    }
}

export const computeStartEndDate = (date, appendPart) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const isoDateString = `${year}-${month}-${day}${appendPart}`;
    return isoDateString;
}

export function sliderValueToVideoTime(duration, sliderValue) {
    return Math.round(duration * sliderValue / 100)
}

export const formatMessage = (message = null, values = []) => {
    if (isNullOrEmpty(message)) {
        return ""
    }
    let replacedMessage = message;
    for (let i = 0; i < values.length; i++) {
        replacedMessage = replacedMessage.replace('{' + i + '}', values[i]);
    }
    return replacedMessage;
}
export const getDatesForPinterest = (daysAgo) => {
    if (isNullOrEmpty(daysAgo.toString())) {
        return "";
    }
    const date = daysAgo === "now" ? new Date() : new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

}
export const filterAndSumPinterestUserAnalyticsDataFor = (data = null, days = null, fieldsToFilter = []) => {
    let response = {
        PIN_CLICK_RATE: "N/A",
        VIDEO_START: "N/A",
        SAVE_RATE: "N/A",
        QUARTILE_95_PERCENT_VIEW: "N/A",
        SAVE: "N/A",
        OUTBOUND_CLICK_RATE: "N/A",
        VIDEO_V50_WATCH_TIME: "N/A",
        ENGAGEMENT_RATE: "N/A",
        OUTBOUND_CLICK: "N/A",
        PIN_CLICK: "N/A",
        VIDEO_10S_VIEW: "N/A",
        IMPRESSION: "N/A",
        ENGAGEMENT: "N/A",
        VIDEO_MRC_VIEW: "N/A",
        VIDEO_AVG_WATCH_TIME: "N/A"
    }
    if (data === null || fieldsToFilter === null || fieldsToFilter?.length === 0) {
        return response;
    }
    response = {}
    const totalDays = data?.length;
    for (let i = 1; i <= days; i++) {
        const singleDayData = data[totalDays - i];
        if (singleDayData?.data_status === "READY") {
            for (let j = 0; j < fieldsToFilter?.length; j++) {
                const key = fieldsToFilter[j];
                response = {
                    ...response,
                    [key]: (response[key] === null || response[key] === undefined) ? singleDayData?.metrics[key] : singleDayData?.metrics[key] + response[key]
                }
            }
        }

    }
    return response;
}
export const filterAndSumLinkedinOrgStatisticsDataFor = (data = null, days = null, fieldsToFilter = []) => {
    let response = {
        uniqueImpressionsCount: "N/A",
        shareCount: "N/A",
        engagement: "N/A",
        clickCount: "N/A",
        likeCount: "N/A",
        impressionCount: "N/A",
        commentCount: "N/A"
    }
    if (data === null || fieldsToFilter === null || fieldsToFilter?.length === 0) {
        return response;
    }
    response = {}
    for (let i = 0; i < days; i++) {
        const singleDayData = data[i];
        for (let j = 0; j < fieldsToFilter?.length; j++) {
            const key = fieldsToFilter[j];
            if (key === "engagement") {
                response = {
                    ...response,
                    [key]: (response[key] === null || response[key] === undefined) ? singleDayData?.totalShareStatistics[key] * singleDayData?.totalShareStatistics["impressionCount"] : (singleDayData?.totalShareStatistics[key] * singleDayData?.totalShareStatistics["impressionCount"]) + response[key]
                }
            } else {
                response = {
                    ...response,
                    [key]: (response[key] === null || response[key] === undefined) ? singleDayData?.totalShareStatistics[key] : singleDayData?.totalShareStatistics[key] + response[key]
                }
            }
        }
    }
    return response;
}
export const getFormattedTotalFollowersCountData = (data, socialMediaType) => {
    let response;
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK?.toUpperCase():
        case SocialAccountProvider.INSTAGRAM?.toUpperCase(): {
            response = {
                id: data?.id,
                name: data?.name,
                followers_count: data?.followers_count
            }
            break;
        }
        case SocialAccountProvider.PINTEREST?.toUpperCase(): {
            response = {
                id: data?.id,
                name: data?.business_name,
                followers_count: data?.follower_count
            }
            break;
        }
        case SocialAccountProvider.LINKEDIN?.toUpperCase(): {
            response = {
                followers_count: data?.all_time?.firstDegreeSize
            }
            break;
        }
    }
    return response;
}
export const getLinkedInUrnId = (id = null, type = null) => {
    if (isNullOrEmpty(id)) {
        return "";
    }
    return `urn:li:${type}:${id}`;

}
export const getFormattedLinkedinObject = (id, data) => {
    if (data === null || data === undefined) {
        return null;
    }
    let logo_url = "";
    if (data.hasOwnProperty("logoV2")) {
        const elements = data?.logoV2["original~"]?.elements;
        logo_url = elements[elements.length - 1]?.identifiers[0]?.identifier;
    }
    return {
        id: getLinkedInUrnId(id, Linkedin_URN_Id_Types.ORGANIZATION),
        name: data?.localizedName,
        logo_url: logo_url
    }
}
export const extractMentionedUsernamesFromLinkedinComments = (comment = null) => {
    let usernames = []
    if (comment === null || comment?.attributes?.length === 0) {
        return usernames;
    }
    comment?.attributes.forEach(attribute => {
        const {start, length} = attribute;
        const name = comment?.text.substr(start, length);
        usernames.push(name.trim());
    });
    return usernames;
}

export const extractCommentersProfileDataForLinkedin = (comment = null) => {
    let commentersProfileData = {
        name: "",
        profilePicUrl: ""
    }
    if (comment === null) {
        return commentersProfileData;
    }
    if (comment["actor~"]?.hasOwnProperty("logoV2")) {
        commentersProfileData = {
            profilePicUrl: comment["actor~"]?.logoV2["original~"]?.elements[comment["actor~"]?.logoV2["original~"]?.elements?.length - 1]?.identifiers[0]?.identifier,
            name: comment["actor~"]?.localizedName
        }
    } else if (comment["actor~"]?.hasOwnProperty("profilePicture")) {
        commentersProfileData = {
            profilePicUrl: comment["actor~"]?.profilePicture["displayImage~"]?.elements[comment["actor~"]?.profilePicture["displayImage~"]?.elements?.length - 1]?.identifiers[0]?.identifier,
            name: comment["actor~"]?.localizedFirstName + " " + comment["actor~"]?.localizedLastName
        }
    } else {

        commentersProfileData = {
            profilePicUrl: default_user_icon,
            name: comment["actor~"]?.localizedName !== undefined ? comment["actor~"]?.localizedName : comment["actor~"]?.localizedFirstName !== undefined ? comment["actor~"]?.localizedFirstName + " " + comment["actor~"]?.localizedLastName : "Username"
        }
    }
    return commentersProfileData;

}

export const removeDuplicatesObjectsFromArray = (array = [], fieldToCompare) => {
    if (array?.length === 0) {
        return []
    }
    const seen = new Set();
    return array.filter(item => {
        const value = item[fieldToCompare];
        if (!seen.has(value)) {
            seen.add(value);
            return true;
        }
        return false;
    });
}
export const getLoggedInLinkedinActorObject = (type = null, name = "", profilePicUrl = "") => {
    if (type === null) {
        return null;
    }
    let actor;
    switch (type) {
        case "ORGANIZATION": {
            actor = {
                localizedName: name,
                logoV2: {
                    "original~": {
                        elements: [
                            {
                                identifiers: [
                                    {
                                        identifier: profilePicUrl
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
            break;
        }
        default: {

        }
    }
    return actor
}

export const extractIdFromLinkedinMessageAtrributes = (attribute = null) => {
    if (attribute === null) {
        return null
    }
    const firstLevelKey = Object.keys(attribute?.value)[0]
    const secondLevelKey = Object.keys(attribute?.value[firstLevelKey])[0]
    return attribute?.value[firstLevelKey][secondLevelKey]
}

export const createOptionListForSelectTag = (data = null, label, value, additionalOption = null) => {
    let list = [];
    if (data === null) {
        return list;
    }
    if (Array.isArray(data)) {
        list = data?.map(cur => {
            return {
                value: cur[value],
                label: cur[label],
            }
        })
    } else if (typeof data === 'object') {
        list = Object.keys(SocialAccountProvider)?.map(cur => {
            return {
                value: SocialAccountProvider[cur],
                label: getInitialLetterCap(SocialAccountProvider[cur]),
            }
        })
    }
    if (additionalOption !== null) {
        list = [...additionalOption, ...list]
    }
    return list
}

export const getValueOrDefault = (value, defaultValue) => {
    if (isNullOrEmpty(value)) {
        return defaultValue
    }
    return value
}

// Helper function to load image based on its type
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', error => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

export async function getCroppedImg(imageSrc, crop, zoom) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    /* setting canvas width & height allows us to 
    resize from the original image resolution */
    canvas.width = 250
    canvas.height = 250

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        canvas.width,
        canvas.height
    )

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob)
        }, 'image/jpeg')
    })
    // const imageBitmap = await createImage(image);        
    // const canvas = document.createElement('canvas');
    // const ctx = canvas.getContext('2d');    
    // // Set the canvas size based on the crop area and zoom level
    // const scaleX = imageBitmap.width / image.width;
    // const scaleY = imageBitmap.height / image.height;
    // canvas.width = crop.width * scaleX * zoom;
    // canvas.height = crop.height * scaleY * zoom;

    // // Draw the cropped image on the canvas
    // ctx.drawImage(
    //   imageBitmap,
    //   crop.x * scaleX,
    //   crop.y * scaleY,
    //   crop.width * scaleX * zoom,
    //   crop.height * scaleY * zoom,
    //   0,
    //   0,
    //   canvas.width,
    //   canvas.height
    // );

    // // Convert the canvas content to a Blob
    // return new Promise((resolve) => {
    //   canvas.toBlob((blob) => {
    //     resolve(blob);
    //   }, 'image/jpeg');
    // });
}

export const concatenateString = (originalString, maxLength) => {
    if (originalString?.length <= maxLength) {
        return originalString;
    } else {
        return originalString?.substring(0, maxLength) + "...";
    }
};

export const isCreatePostRequestValid = (requestBody, files) => {
    let shouldBreak = false;
    Object.keys(requestBody)?.forEach(key => {
        if (shouldBreak) return true;
        switch (key) {
            case "postPageInfos": {
                if (requestBody.postPageInfos?.length === 0) {
                    showErrorToast(SelectAtleastOnePage);
                    shouldBreak = true;
                }
                break;
            }
            case "caption":
            case "hashTag": {
                if (isNullOrEmpty(requestBody.caption) && isNullOrEmpty(requestBody.hashTag)) {
                    showErrorToast(formatMessage(IsRequired, ["Caption"]));
                    shouldBreak = true;
                }
                break;
            }
            case "pinTitle": {
                if (isNullOrEmpty(requestBody.pinTitle) && requestBody.postPageInfos?.filter(page => page?.provider === "PINTEREST")?.length > 0) {
                    showErrorToast(formatMessage(IsRequired, ["Pin Title"]));
                    shouldBreak = true;
                }
                break;
            }
            case "destinationUrl": {
                if (isNullOrEmpty(requestBody.destinationUrl) && requestBody.postPageInfos?.filter(page => page?.provider === "PINTEREST")?.length > 0) {
                    showErrorToast(formatMessage(IsRequired, ["Destination Url"]));
                    shouldBreak = true;
                }
                break;
            }
            case "attachments": {
                const hasAttachments = requestBody.attachments?.length > 0;
                const isPostedOnFaceBook = requestBody.postPageInfos?.filter(page => page?.provider === "FACEBOOK")?.length > 0
                const isPostedOnInstagram = requestBody.postPageInfos?.filter(page => page?.provider === "INSTAGRAM")?.length > 0
                const isPostedOnLinkedin = requestBody.postPageInfos?.filter(page => page?.provider === "LINKEDIN")?.length > 0
                const isPostedOnPinterest = requestBody.postPageInfos?.filter(page => page?.provider === "PINTEREST")?.length > 0
                if (hasAttachments) {
                    if (files.some(file => file?.mediaType === "IMAGE") && files.some(file => file?.mediaType === "VIDEO")) {
                        showErrorToast(OnlyImageOrVideoCanBePosted);
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "IMAGE" && files?.length > 10) {
                        showErrorToast(formatMessage(MultiMediaLimit, ["10", "images"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "VIDEO" && files?.length > 1) {
                        showErrorToast(formatMessage(MultiMediaLimit, ["1", "video"]));
                        shouldBreak = true;
                        break;
                    }

                }
                if (isPostedOnPinterest) {
                    if (!hasAttachments) {
                        showErrorToast(formatMessage(IsRequiredFor, ["Image or video", "pinterest"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files?.length > 1) {
                        showErrorToast(PinterestImageLimitation);
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "IMAGE" && files.some(file => (file?.file?.size / 1048576) > 20)) {
                        showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "20 mb", "image", "pinterest"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "VIDEO") {
                        if (files.some(file => (file?.file?.size / 1048576) > 50)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "50 mb", "video", "pinterest"]));
                            shouldBreak = true;
                            break;
                        }
                        if ((files[0]?.duration / 60) > 5) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "5 min", "video", "pinterest"]));
                            shouldBreak = true;
                            break;
                        }
                        if (files[0]?.duration < 4) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["Less", "4 sec", "video", "pinterest"]));
                            shouldBreak = true;
                            break;
                        }

                    }
                }
                if (isPostedOnLinkedin && hasAttachments) {
                    if (files[0]?.mediaType === "IMAGE") {
                        const isInValidImageDimension = files.some(file => {
                            const imageDimensions = getImageHeightAndWidth(file?.url)
                            return (imageDimensions.height >= 6012 || imageDimensions.width >= 6012)
                        })
                        if (isInValidImageDimension) {
                            showErrorToast(InvalidImageDimension);
                            shouldBreak = true;
                            break;
                        }
                    }
                    if (files[0]?.mediaType === "VIDEO") {
                        const extension = files[0]?.fileName?.substring(files[0]?.fileName?.lastIndexOf('.') + 1);
                        if (extension !== "mp4" && extension !== "MP4") {
                            showErrorToast(formatMessage(VideoFormatNotSupported, ["mp4", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                        if (files.some(file => (file?.file?.size / 1048576) > 50)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "50 mb", "video", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                        if (files.some(file => (file?.file?.size / 1024) < 75)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "75 kb", "video", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                        if ((files[0]?.duration / 60) > 30) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "30 min", "video", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                        if (files[0]?.duration < 3) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["Less", "3 sec", "video", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                    }
                }
                if (isPostedOnInstagram) {
                    if (!hasAttachments) {
                        showErrorToast(formatMessage(IsRequiredFor, ["Image or video", "instagram"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "IMAGE") {
                        if (files.some(file => (file?.file?.size / 1048576) > 8)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "8 mb", "image", "instagram"]));
                            shouldBreak = true;
                            break;
                        }
                        const isInValidAspectRatio = files.some(file => {
                            const aspectRatio = getImageAspectRatio(file?.url)
                            return (aspectRatio < 0.8 || aspectRatio > 1.91)
                        })
                        if (isInValidAspectRatio) {
                            showErrorToast(InvalidAspectRatio);
                            shouldBreak = true;
                            break;
                        }
                    }
                    if (files[0]?.mediaType === "VIDEO") {
                        if (files.some(file => (file?.file?.size / 1048576) > 50)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "50 mb", "video", "instagram"]));
                            shouldBreak = true;
                            break;
                        }
                        if ((files[0]?.duration / 60) > 15) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "15 min", "video", "instagram"]));
                            shouldBreak = true;
                            break;
                        }
                        if (files[0]?.duration < 3) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["Less", "3 sec", "video", "instagram"]));
                            shouldBreak = true;
                            break;
                        }
                    }
                }
                if (isPostedOnFaceBook && hasAttachments) {
                    if (files[0]?.mediaType === "IMAGE" && files.some(file => (file?.file?.size / 1048576) > 10)) {
                        showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "10 mb", "image", "facebook"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "VIDEO") {
                        if (files.some(file => (file?.file?.size / 1048576) > 50)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "50 mb", "video", "facebook"]));
                            shouldBreak = true;
                            break;
                        }
                        if ((files[0]?.duration / 3600) > 4) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "4 hours", "video", "facebook"]));
                            shouldBreak = true;
                            break;
                        }

                    }
                }
                break;
            }

        }
    });
    return !shouldBreak;
}

export const getFileFromAttachmentSource = (attachment) => {
    return new Promise((resolve, reject) => {
        // Decode base64 string to binary data
        const binaryData = atob(attachment?.attachmentSource);

        // Convert binary data to array buffer
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
        }

        // Create Blob object from array buffer
        const blob = new Blob([uint8Array], {type: 'application/octet-stream'});

        // Generate URL for Blob object
        const fileName = attachment?.fileName;
        const fileType = 'application/octet-stream';
        // const file = new File([blob], fileName, {type: fileType});
        const file = blobToFile(blob, fileName, fileType);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    id: attachment?.id,
                    file: file,
                    url: URL.createObjectURL(blob),
                    mediaType: attachment?.mediaType,
                    fileName: attachment?.fileName,
                    height: img.height,
                    width: img.width
                });
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
};


export const isUpdatePostRequestValid = (requestBody, files, oldAttachments) => {

    let shouldBreak = false;
    Object.keys(requestBody)?.forEach(key => {
        if (shouldBreak) return true;
        switch (key) {
            case "postPageInfos": {
                if (requestBody.postPageInfos?.length === 0) {
                    showErrorToast(SelectAtleastOnePage);
                    shouldBreak = true;
                }
                break;
            }
            case "caption":
            case "hashTag": {
                if (isNullOrEmpty(requestBody.caption) && isNullOrEmpty(requestBody.hashTag)) {
                    showErrorToast(formatMessage(IsRequired, ["Caption"]));
                    shouldBreak = true;
                }
                break;
            }
            case "pinTitle": {
                if (isNullOrEmpty(requestBody.pinTitle) && requestBody.postPageInfos?.filter(page => page?.provider === "PINTEREST")?.length > 0) {
                    showErrorToast(formatMessage(IsRequired, ["Pin Title"]));
                    shouldBreak = true;
                }
                break;
            }
            case "destinationUrl": {
                if (isNullOrEmpty(requestBody.destinationUrl) && requestBody.postPageInfos?.filter(page => page?.provider === "PINTEREST")?.length > 0) {
                    showErrorToast(formatMessage(IsRequired, ["Destination Url"]));
                    shouldBreak = true;
                }
                break;
            }
            case "attachments": {
                const hasAttachments = requestBody.attachments?.length > 0;
                const newlyAddedAttachments = files?.filter(attachment => attachment?.id === null || attachment?.id === undefined);
                const allAttachments = [...oldAttachments, ...newlyAddedAttachments];

                if (hasAttachments) {
                    if (files.some(file => file?.mediaType === "IMAGE") && files.some(file => file?.mediaType === "VIDEO")) {
                        showErrorToast(OnlyImageOrVideoCanBePosted);
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "IMAGE" && files?.length > 10) {
                        showErrorToast(formatMessage(MultiMediaLimit, ["10", "images"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "VIDEO" && files?.length > 1) {
                        showErrorToast(formatMessage(MultiMediaLimit, ["1", "video"]));
                        shouldBreak = true;
                        break;
                    }

                }
                const isPostedOnPinterest = requestBody.postPageInfos?.filter(page => page?.provider === "PINTEREST")?.length > 0
                if (isPostedOnPinterest) {
                    if (!hasAttachments) {
                        showErrorToast(formatMessage(IsRequiredFor, ["Image or video", "pinterest"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files?.length > 1) {
                        showErrorToast(PinterestImageLimitation);
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "IMAGE" && allAttachments.some(attachment => (attachment?.file?.size / 1048576) > 20)) {
                        showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "20 mb", "image", "pinterest"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "VIDEO") {
                        if (newlyAddedAttachments.some(attachment => (attachment?.file?.size / 1048576) > 50) || oldAttachments?.some(attachment => (attachment?.fileSize / 1048576) > 200)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "50 mb", "video", "pinterest"]));
                            shouldBreak = true;
                            break;
                        }
                        if ((allAttachments?.[0]?.duration / 60) > 5) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "5 min", "video", "pinterest"]));
                            shouldBreak = true;
                            break;
                        }
                        if (allAttachments?.[0]?.duration < 4) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["Less", "4 sec", "video", "pinterest"]));
                            shouldBreak = true;
                            break;
                        }

                    }
                }
                const isPostedOnLinkedin = requestBody.postPageInfos?.filter(page => page?.provider === "LINKEDIN")?.length > 0
                if (isPostedOnLinkedin && hasAttachments) {

                    if (files[0]?.mediaType === "IMAGE") {
                        const isInValidImageDimension = allAttachments.some(file => {
                            const imageDimensions = (file?.id === undefined || file?.id === null) ? getImageHeightAndWidth(file?.url) : {
                                height: file?.height,
                                width: file?.width
                            };
                            return (imageDimensions.height >= 6012 || imageDimensions.width >= 6012)
                        })
                        if (isInValidImageDimension) {
                            showErrorToast(InvalidImageDimension);
                            shouldBreak = true;
                            break;
                        }
                    }
                    if (files[0]?.mediaType === "VIDEO") {
                        const extension = allAttachments?.[0]?.fileName?.substring(files[0]?.fileName?.lastIndexOf('.') + 1);
                        if (extension !== undefined && extension !== "mp4" && extension !== "MP4") {
                            showErrorToast(formatMessage(VideoFormatNotSupported, ["mp4", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                        if (newlyAddedAttachments.some(attachment => (attachment?.file?.size / 1048576) > 50) || oldAttachments.some(attachment => (attachment?.fileSize / 1048576) > 200)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "50 mb", "video", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                        if (newlyAddedAttachments.some(attachment => (attachment?.file?.size / 1024) < 75) || oldAttachments.some(attachment => (attachment?.fileSize / 1024) < 75)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "75 kb", "video", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                        if ((allAttachments?.[0]?.duration / 60) > 30) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "30 min", "video", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                        if (allAttachments?.[0]?.duration < 3) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["Less", "3 sec", "video", "linkedin"]));
                            shouldBreak = true;
                            break;
                        }
                    }
                }
                const isPostedOnInstagram = requestBody.postPageInfos?.filter(page => page?.provider === "INSTAGRAM")?.length > 0
                if (isPostedOnInstagram) {
                    if (!hasAttachments) {
                        showErrorToast(formatMessage(IsRequiredFor, ["Image or video", "instagram"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "IMAGE") {
                        if (allAttachments.some(attachment => (attachment?.file?.size / 1048576) > 8)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "8 mb", "image", "instagram"]));
                            shouldBreak = true;
                            break;
                        }
                        const isInValidAspectRatio = allAttachments.some(file => {
                            const aspectRatio = (file?.id === undefined || file?.id === null) ? getImageAspectRatio(file?.url) : file?.width / file?.height;
                            return (aspectRatio < 0.8 || aspectRatio > 1.91)
                        })
                        if (isInValidAspectRatio) {
                            showErrorToast(InvalidAspectRatio);
                            shouldBreak = true;
                            break;
                        }
                    }
                    if (files[0]?.mediaType === "VIDEO") {
                        if (files.some(file => (file?.file?.size / 1048576) > 50)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "50 mb", "video", "instagram"]));
                            shouldBreak = true;
                            break;
                        }
                        if ((files[0]?.duration / 60) > 15) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "15 min", "video", "instagram"]));
                            shouldBreak = true;
                            break;
                        }
                        if (files[0]?.duration < 3) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["Less", "3 sec", "video", "instagram"]));
                            shouldBreak = true;
                            break;
                        }
                    }
                }
                const isPostedOnFaceBook = requestBody.postPageInfos?.filter(page => page?.provider === "FACEBOOK")?.length > 0
                if (isPostedOnFaceBook && hasAttachments) {
                    if (files[0]?.mediaType === "IMAGE" && allAttachments.some(file => (file?.file?.size / 1048576) > 10)) {
                        showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "10 mb", "image", "facebook"]));
                        shouldBreak = true;
                        break;
                    }
                    if (files[0]?.mediaType === "VIDEO") {
                        if (allAttachments.some(file => (file?.file?.size / 1048576) > 50)) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "50 mb", "video", "facebook"]));
                            shouldBreak = true;
                            break;
                        }
                        if ((allAttachments[0]?.duration / 3600) > 4) {
                            showErrorToast(formatMessage(MultiMediaSizeLimit, ["More", "4 hours", "video", "facebook"]));
                            shouldBreak = true;
                            break;
                        }

                    }
                }
                break;
            }

        }
    });
    return !shouldBreak;
}


export const getImageAspectRatio = (imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    while (!img.complete) {
        // This loop will keep running until the image is loaded
    }

    return img.naturalWidth / img.naturalHeight;
};

export const isImageValid = (imageUrl, socialMediaType) => {
    if (imageUrl === null || imageUrl === undefined) {
        return true
    }
    switch (socialMediaType) {
        case "FACEBOOK":
        case "INSTAGRAM":
        case "LINKEDIN": {
            return fetch(imageUrl).then(res => {
                return res.ok
            })
        }
        case "PINTEREST": {
            const img = new Image();
            img.src = imageUrl;
            if (img.naturalHeight !== 0) {
                return true
            } else {
                return false
            }
        }

    }

};
export const isPageInfoAvailableFromSocialMediaFor = (socialMedia = [], data) => {
    if (isNullOrEmpty(socialMedia) || data === null || data === undefined) {
        return false;
    }
    return socialMedia.every(socialMediaType => {

        switch (socialMediaType) {
            case "FACEBOOK": {
                return data?.facebook?.facebookPageList !== undefined && data?.facebook?.facebookPageList !== null
            }
            case "INSTAGRAM": {
                return data?.instagram?.data !== undefined && data?.instagram?.data !== null
            }
            case "LINKEDIN": {
                return data?.linkedin?.data !== undefined && data?.linkedin?.data !== null
            }
            case "PINTEREST": {
                return data?.pinterest?.data !== undefined && data?.pinterest?.data !== null
            }
        }
    })

}

export const getImageHeightAndWidth = (imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    while (!img.complete) {
        // This loop will keep running until the image is loaded
    }
    return {
        height: img.naturalHeight,
        width: img.naturalWidth
    }
};

export const getVideoDurationById = async (attachmentId) => {
    return new Promise((resolve, reject) => {
        const mediaElement = document.createElement("video");
        mediaElement.src = `${import.meta.env.VITE_APP_API_BASE_URL}/attachments/${attachmentId}`;

        mediaElement.onloadedmetadata = () => {
            resolve({
                duration: mediaElement.duration,
            });
        };
        mediaElement.onerror = (error) => {
            reject(error);
        };
    });

};


//insight page utils
export const fetchCssForInsightPageListOption = (curPage, selectedPage) => {
    if (selectedPage && curPage && selectedPage.pageId === curPage.pageId) {
        return {
            background: '#F4F8FE',
            ':hover': {
                backgroundColor: '#F4F8FE',
            },
        };
    }
    return {
        ':hover': {
            backgroundColor: '#F4F8FE',
        },
    };
};


export const getPagesDataFromSocialMedia = (socialMediaType, data) => {

    switch (socialMediaType) {
        case "FACEBOOK": {
            return data.facebook?.facebookPageList;
        }
        case "INSTAGRAM": {
            return data.instagram?.data;
        }
        case "LINKEDIN": {
            return Object?.keys(data.linkedin?.data?.results || {})?.map((key) => {
                return {id: getLinkedInUrnId(key, "organization"), ...data.linkedin?.data?.results[key]}
            });
        }
        case "PINTEREST": {
            return data.pinterest?.data?.items;
        }
    }
}
export const getImageUrl = (socialMediaType, data) => {
    switch (socialMediaType) {
        case "FACEBOOK": {
            return data?.picture?.data?.url || "";
        }
        case "INSTAGRAM": {
            return data?.profile_picture_url || "";
        }
        case "LINKEDIN": {
            if (data?.hasOwnProperty("logoV2")) {
                const elements = data?.logoV2["original~"]?.elements;
                return elements[elements.length - 1]?.identifiers[0]?.identifier;
            }
            return "";
        }
        case "PINTEREST": {
            return data?.media?.image_cover_url || "";
        }
    }
}
export const getUpdatedNameAndImageUrlForConnectedPages = (page, data) => {
    let updatedImageUrl;
    let updatedName;
    switch (page.socialMediaType) {
        case "FACEBOOK": {
            updatedImageUrl = data.facebook?.facebookPageList?.filter(c => c.id === page.pageId)[0]?.picture?.data?.url || null;
            updatedName = data.facebook?.facebookPageList?.filter(c => c.id === page.pageId)[0]?.name || page?.name;
            break;
        }
        case "INSTAGRAM": {
            updatedImageUrl = data.instagram?.data?.filter(c => c.id === page.pageId)[0]?.profile_picture_url || null;
            updatedName = data.instagram?.data?.filter(c => c.id === page.pageId)[0]?.name || page?.name;
            break;
        }
        case "LINKEDIN": {
            const linkedinPageList = Object?.keys(data.linkedin?.data?.results || {})?.map((key) => {
                return {id: getLinkedInUrnId(key, "organization"), ...data.linkedin?.data?.results[key]}
            })?.filter(c => c.id === page.pageId)
            updatedName = linkedinPageList?.[0]?.localizedName || page?.name
            if (linkedinPageList?.[0]?.hasOwnProperty("logoV2")) {
                const elements = linkedinPageList[0]?.logoV2["original~"]?.elements;
                updatedImageUrl = elements[elements.length - 1]?.identifiers[0]?.identifier;
            } else {
                updatedImageUrl = null;
            }
            break;
        }
        case "PINTEREST": {
            updatedImageUrl = data.pinterest?.data?.items?.filter(c => c.id === page.pageId)[0]?.media?.image_cover_url || null
            updatedName = data.pinterest?.data?.items?.filter(c => c.id === page.pageId)[0]?.name || page?.name
            break;
        }
    }
    return {
        ...page,
        isPageUpdated: (page?.name !== updatedName || page?.imageUrl !== updatedImageUrl || !isImageValid(page?.imageUrl, page?.socialMediaType)),
        imageUrl: updatedImageUrl,
        name: updatedName
    }

};

export function convertTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day}`;
}

export const getFormattedInsightProfileInfo = (data, socialMediaType) => {
    let response;
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK?.toUpperCase(): {
            response = {
                id: data?.id,
                name: data?.name,
                followers: data?.followers_count,
                likes: data?.fan_count,
                about: data?.about,
                imageUrl: data?.picture?.data?.url
            }
            break;
        }
        case SocialAccountProvider.INSTAGRAM.toUpperCase() : {
            response = {
                id: data?.id,
                name: data?.name,
                followers: data?.followers_count,
                following: data?.follows_count,
                about: data?.biography,
                total_posts: data?.media_count,
                imageUrl: data?.profile_picture_url
            }
            break;
        }
        case SocialAccountProvider.PINTEREST?.toUpperCase(): {
            response = {
                id: data?.id,
                name: data?.business_name,
                followers: data?.follower_count,
                following: data?.following_count,
                about: data?.about,
                total_posts: data?.pin_count,
                imageUrl: data?.profile_image
            }
            break;
        }
        case SocialAccountProvider.LINKEDIN?.toUpperCase(): {
            response = {
                followers_count: data?.all_time?.firstDegreeSize
            }
            break;
        }
    }
    return response;
}
export const createSocialMediaProfileViewInsightsQuery = (queryObject, socialMediaType) => {
    switch (socialMediaType) {
        case "FACEBOOK": {
            return {
                period: "day",
                access_token: queryObject.access_token,
                since: generateUnixTimestampFor(queryObject.days + 1),
                until: generateUnixTimestampFor(1),
            }
        }
        case "INSTAGRAM": {
            return {
                period: "day",
                access_token: queryObject.access_token,
                since: generateUnixTimestampFor(queryObject.days),
                until: generateUnixTimestampFor("now"),
                metric: "profile_views"
            }
        }
        case "LINKEDIN": {
            return {
                q: "organization",
                organizationId: queryObject.pageId,
                startDate: generateUnixTimestampFor(queryObject.days)*1000,
                endDate: generateUnixTimestampFor("now")*1000,
                fields: "timeRange,totalPageStatistics:(views:(allPageViews))",
                timeGranularityType: "DAY"
            }
        }
        case "PINTEREST": {
            return {}

        }

    }

}

export function objectToQueryString(obj) {
    return Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&');
}

export const getFormattedInsightsForProfileViews = (data, socialMediaType) => {
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK?.toUpperCase():
        case SocialAccountProvider.INSTAGRAM?.toUpperCase(): {
            return Array.isArray(data.data) && data.data.length > 0 ? data.data[0].values || [] : [];
        }
        case SocialAccountProvider.LINKEDIN?.toUpperCase(): {
            return Array.isArray(data?.elements) && data?.elements?.length > 0 ? data?.elements || [] : [];
        }
        case SocialAccountProvider.PINTEREST?.toUpperCase(): {
            break;
        }

    }
    return {};
}