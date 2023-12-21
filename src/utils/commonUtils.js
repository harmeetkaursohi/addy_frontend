import * as yup from "yup";
import {Linkedin_URN_Id_Types,SocialAccountProvider} from "./contantData.js";
import {exchangeForLongLivedToken, getAllFacebookConnectedSocialMediaAccounts} from "../services/facebookService.js";
import {decodeJwtToken} from "../app/auth/auth.js";
import {facebookPageConnect, getFacebookConnectedPages} from "../app/actions/facebookActions/facebookActions.js";
import fb from "../images/fb.svg";
import instagram_img from "../images/instagram.png";
import linkedin from "../images/linkedin.svg";
import {getAllSocialMediaPostsByCriteria} from "../app/actions/postActions/postActions";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const validationSchemas = {

    login: yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required')
    }),

    register: yup.object().shape({
        fullName: yup.string().required('Full Name is required'),
        username: yup.string().required('Username is required'),
        email: yup.string().required('Email is required').email('Invalid email format'),
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

    forgetPassword: yup.object().shape({
        email: yup.string().required('Email is required').email('Invalid email format'),
    }),
};


export const computeAndSocialAccountJSONForFacebook = async (jsonObj, tokenProvider) => {
    const longLivedToken = await exchangeForLongLivedToken(jsonObj?.data?.accessToken);
    if (tokenProvider === SocialAccountProvider.INSTAGRAM) {
        const facebookConnectedSocialMediaAccountsData = await getAllFacebookConnectedSocialMediaAccounts(longLivedToken);
        const instagramBusinessAccount = facebookConnectedSocialMediaAccountsData?.filter(accountData => {
            return accountData.hasOwnProperty("instagram_business_account")
        })
        if (isNullOrEmpty(instagramBusinessAccount)) {
            return null;
        }
    }
    const token = localStorage.getItem("token");
    const decodeJwt = decodeJwtToken(token);
    return {
        customerId: decodeJwt.customerId, token: token, socialAccountData: {
            name: jsonObj?.data?.name || null,
            email: jsonObj?.data?.email || null,
            imageUrl: jsonObj?.data?.picture?.data?.url || null,
            provider: getKeyFromValueOfObject(SocialAccountProvider, tokenProvider) || null,
            providerId: jsonObj?.data?.userID || null,
            accessToken: longLivedToken || null,
            pageAccessToken: []
        }
    }
}
export const computeAndSocialAccountJSONForLinkedIn = async (jsonObj) => {
    const imageArray = jsonObj?.data?.profilePicture?.["displayImage~"]?.elements
    const token = localStorage.getItem("token");
    const decodeJwt = decodeJwtToken(token);
    return {
        customerId: decodeJwt.customerId, token: token, socialAccountData: {
            name: (jsonObj?.data?.localizedFirstName + " " + jsonObj?.data?.localizedLastName) || null,
            email: null,
            imageUrl: (imageArray === undefined || imageArray === null || imageArray?.length === 0) ? null : imageArray[imageArray?.length - 1]?.identifiers[0]?.identifier,
            provider: getKeyFromValueOfObject(SocialAccountProvider, jsonObj.provider) || null,
            providerId: jsonObj?.data?.id || null,
            accessToken: jsonObj?.data?.access_token || null,
            refreshToken: jsonObj?.data?.refresh_token,
            pageAccessToken: []
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
    if (data) {
        let requestBody = {
            customerId: decodeJwt?.customerId, pageAccessTokenDTO: {
                pageId: data?.id,
                name: data?.name,
                about: data?.about,
                socialMediaAccountId: socialMediaAccountInfo.id
            }, token: token
        };
        switch (socialMediaAccountInfo?.provider) {
            case "FACEBOOK": {
                requestBody = {
                    ...requestBody, pageAccessTokenDTO: {
                        ...requestBody.pageAccessTokenDTO,
                        imageUrl: data.picture?.data?.url,
                        access_token: data?.access_token,
                    }
                }
                break;
            }
            case "INSTAGRAM": {
                requestBody = {
                    ...requestBody, pageAccessTokenDTO: {
                        ...requestBody.pageAccessTokenDTO,
                        imageUrl: data?.profile_picture_url,
                        access_token: socialMediaAccountInfo.accessToken,
                    }
                }
                break;
            }
            case "LINKEDIN": {
                requestBody = {
                    ...requestBody, pageAccessTokenDTO: {
                        ...requestBody.pageAccessTokenDTO,
                        imageUrl: data?.logo_url,
                        access_token: socialMediaAccountInfo.accessToken,
                    }
                }
                break;
            }
            default: {

            }
        }
        dispatch(facebookPageConnect(requestBody)).then((response) => {
            dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            dispatch(getAllSocialMediaPostsByCriteria({token: token, query: {limit: 5, postStatus: ["SCHEDULED"]}}));
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

    console.log("file.tpye", file?.type)
    console.log("file.name", file?.name)
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
                resolve({file: file, url: videoUrl, mediaType: "VIDEO", fileName: file?.name});
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
    return list; // return the sorted list
}

export const redirectToURL = (redirectedURL) => {
    window.open(redirectedURL, '_blank');
}

export const isPlannerPostEditable = (feedPostDate) => {
    return (new Date(feedPostDate).getTime() - 15 * 60 * 1000) - new Date().getTime() > 0;
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
                return "Linkdin";
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
            return "Pinterest"
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

export const dateFormat = (date) => {
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

export const computeAndReturnSummedDateValues = (data) => {

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


export function getCustomDateEarlierUnixDateTime(dateToElapse) {
    if (dateToElapse === 0) {
        return Math.floor(new Date().getTime() / 1000);
    }
    let currentDate = new Date();
    let unixValue = new Date(currentDate.getTime() - (dateToElapse * 24 * 60 * 60 * 1000)).getTime() / 1000;

    return Math.floor(unixValue);


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
    let words = sentence.split(' ');
    // words=handleEnterOnHashtag(words);

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
export const getTagCommentsFormat = (replyComment) => {
    return !replyComment?.message.includes(replyComment?.mentionedPageName) ? replyComment?.message : replyComment?.message.replace(replyComment?.mentionedPageName, `@[${replyComment?.mentionedPageId}]`)
}
export const getUpdateCommentMessage = (commentToUpdate) => {
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

        const file = new File([blob], fileNameWithExtension, {type: fileExtension});
        return file;
    } catch (error) {
        console.error("Error converting URL to File:", error);
        return null;
    }
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


        return new File([blob], fileName, {type: fileType});
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
    console.log("postData---->", postData);

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
        return response

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
export const generateUnixTimestampFor = (daysAgo) => {
    const currentDate = new Date();
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

export const getQueryForGraphData = (socialMediaType, selectedGraphDays) => {
    switch (socialMediaType) {
        case "FACEBOOK": {
            return {
                createdFrom: getCustomDateEarlierUnixDateTime(selectedGraphDays),
                createdTo: getCustomDateEarlierUnixDateTime(1)
            }
        }
        case "INSTAGRAM": {
            return {
                createdFrom: generateUnixTimestampFor(selectedGraphDays - 1),
                createdTo: generateUnixTimestampFor("now")
            }

            break;
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
export const extractIdFromLinkedinUrnId = (urnId = null) => {
    if (isNullOrEmpty(urnId)) {
        return null;
    }
    const lastColonIndex = urnId.lastIndexOf(':');
    if (lastColonIndex !== -1) {
        return urnId.substring(lastColonIndex + 1);
    } else {
        return null;
    }
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
            const reach = data?.filter(data => data?.name === "page_impressions")[0]?.values
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
            return formattedData
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
            return formattedData
        }
        case "LINKEDIN": {
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
    return formattedDate
}
export const extractParameterFromUrl = (url, parameterName) => {
    const urlSearchParams = new URLSearchParams(new URL(url).search);
    return urlSearchParams.get(parameterName);
}
export const getFormattedPostDataForSlider = (data, socialMediaType) => {
    if (data === null || data === undefined) {
        return []
    }
    let formattedData = {}
    switch (socialMediaType) {
        case SocialAccountProvider.INSTAGRAM.toUpperCase(): {
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
        case SocialAccountProvider.FACEBOOK.toUpperCase(): {
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
        case SocialAccountProvider.LINKEDIN.toUpperCase(): {
            break;
        }
    }

}
export const getAttachmentsData = (data, socialMediaType) => {
    if (data === undefined || data === null) {
        return []
    }
    switch (socialMediaType) {
        case SocialAccountProvider.FACEBOOK.toUpperCase(): {
            if (data?.attachments?.data[0]?.type === undefined) {
                return []
            } else if (data?.attachments?.data[0]?.type === "album") {
                return data?.attachments?.data[0]?.subattachments?.data?.map(attachment => {
                    return {
                        mediaType: "IMAGE",
                        imageURL: attachment?.media?.image?.src,
                        pageId: data?.id,
                    }
                })
            } else if (data?.attachments?.data[0]?.type === "photo") {
                return [{
                    mediaType: "IMAGE",
                    imageURL: data?.attachments?.data[0]?.media?.image?.src,
                    pageId: data?.id,

                }]
            } else {
                return [{
                    mediaType: "VIDEO",
                    imageURL: data?.attachments?.data[0]?.media?.image?.src,
                    sourceURL: data?.attachments?.data[0]?.media?.source,
                    pageId: data?.id,
                }]
            }

        }
        case SocialAccountProvider.INSTAGRAM.toUpperCase(): {
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
        case SocialAccountProvider.LINKEDIN.toUpperCase(): {
            break;
        }
    }

}
export const filterGenderAgeDataFromFacebookDemographicData = (data, key) => {

    console.log("filterGenderAgeDataFromFacebookDemographicData", data, key)
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
            break;
        }
    }
}