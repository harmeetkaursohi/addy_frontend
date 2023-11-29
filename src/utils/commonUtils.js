import * as yup from "yup";
import {SocialAccountProvider} from "./contantData.js";
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


export const facebookPageConnectAction = (dispatch, token, facebookData, socialMediaAccountInfo) => {
    const decodeJwt = decodeJwtToken(token);
    if (facebookData) {
        const requestBody = {
            customerId: decodeJwt?.customerId, pageAccessTokenDTO: {
                pageId: facebookData?.id,
                name: facebookData?.name,
                imageUrl: socialMediaAccountInfo?.provider === "FACEBOOK" ? facebookData.picture?.data?.url : facebookData?.profile_picture_url,
                about: facebookData?.about,
                access_token: socialMediaAccountInfo?.provider === "FACEBOOK" ? facebookData?.access_token : socialMediaAccountInfo.accessToken,
                socialMediaAccountId: socialMediaAccountInfo.id
            }, token: token
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
            postDate: new Date(c).getTime(),
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
                return "Intagram"
            case 'LINKEDIN':
                return "Linkdin";
                break;
            case 'TWITTER':
                return "Twitter"
                break;
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
            break;
        case 'TWITTER':
            return "Twitter"
            break;
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
            break;
        case 'TWITTER':
            return "Twitter"
            break;
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
    console.log("------>dateToElapse", dateToElapse);
    if (dateToElapse === 0) {
        return Math.floor(new Date().getTime() / 1000);
    }
    let currentDate = new Date();
    let unixValue = new Date(currentDate.getTime() - dateToElapse * 24 * 60 * 60 * 1000).getTime() / 1000;

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

export const parseCommentsForFacebook = (data, hasParentComment, parentComments) => {
    const getMessageTags = (messageTags) => {
        if (messageTags?.length === 0 || messageTags?.length === undefined || messageTags?.length === null) {
            return []
        } else {
            return messageTags?.map(tags => {
                return {
                    id: tags?.id,
                    name: tags?.name,
                    type: tags?.type
                }
            })
        }
    }


    const getCommentsStructure = (data) => {
        return data?.map(comment => {
            return {
                id: comment?.id,
                message: comment?.message,
                like_count: comment?.like_count,
                reply_count: comment?.comment_count,
                created_time: comment?.created_time,
                attachment: comment?.attachment,
                can_comment: comment?.can_comment,
                can_like: comment?.can_like,
                user_likes: comment?.user_likes,
                can_remove: comment?.can_remove,
                reply: [],
                from: {
                    id: comment?.from?.id,
                    name: comment?.from?.name,
                    picture: comment?.from?.picture?.data?.url

                },
                message_tags: getMessageTags(comment?.message_tags)

            }
        })
    }
    if (hasParentComment) {
        const parentCommentIndex = parentComments.findIndex(comment => comment.id === data?.data[0]?.parent?.id);
        let updatedParentComments = [...parentComments];
        updatedParentComments[parentCommentIndex] = {
            ...updatedParentComments[parentCommentIndex],
            reply: getCommentsStructure(data?.data)
        }
        return updatedParentComments
    } else {
        return getCommentsStructure(data?.data)
    }
}
export const parseComments = (socialMediaType, data, hasParentComment, parentComments) => {
    //  When There Are No Comments
    if (data?.data?.length === 0) {
        return [];
    }
    switch (socialMediaType) {
        case "FACEBOOK": {
            return parseCommentsForFacebook(data, hasParentComment, parentComments)
        }
        case "INSTAGRAM": {

        }
        case "LINKEDIN": {

        }
        case "PINTEREST": {

        }
    }
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
    if(isNullOrEmpty(word)){
        return ""
    }
    return word.charAt(0).toUpperCase() + word.slice(1);

}