import * as yup from "yup";
import {SocialAccountProvider} from "./contantData.js";
import {exchangeForLongLivedToken} from "../services/facebookService.js";
import {decodeJwtToken} from "../app/auth/auth.js";
import {facebookPageConnect, getFacebookConnectedPages} from "../app/actions/facebookActions/facebookActions.js";
import fb from "../images/fb.svg";
import instagram_img from "../images/instagram.png";
import linkedin from "../images/linkedin.svg";
import {getAllSocialMediaPostsByCriteria} from "../app/actions/postActions/postActions";

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


export const computeAndSocialAccountJSONForFacebook = async (jsonObj) => {

    const longLivedToken = await exchangeForLongLivedToken(jsonObj?.data?.accessToken);
    const token = localStorage.getItem("token");
    const decodeJwt = decodeJwtToken(token);

    return {
        customerId: decodeJwt.customerId, token: token, socialAccountData: {
            name: jsonObj?.data?.name || null,
            email: jsonObj?.data?.email || null,
            imageUrl: jsonObj?.data?.picture?.data?.url || null,
            provider: getKeyFromValueOfObject(SocialAccountProvider, jsonObj?.provider) || null,
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


export const facebookPageConnectAction = (dispatch, token, facebookData) => {
    const decodeJwt = decodeJwtToken(token);
    if (facebookData) {
        const requestBody = {
            customerId: decodeJwt?.customerId, pageAccessTokenDTO: {
                pageId: facebookData?.id,
                name: facebookData?.name,
                imageUrl: facebookData.picture?.data?.url,
                about: facebookData?.about,
                access_token: facebookData?.access_token
            }, token: token
        }
        dispatch(facebookPageConnect(requestBody)).then((response) => {
            dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            dispatch(getAllSocialMediaPostsByCriteria({token: token, query: {limit: 5, postStatus: "SCHEDULED"}}));
        }).catch((error) => {
            console.log("--->error", error)
        })
    }
}

// Define a function to convert combined date and time string to Unix timestamp
export function convertToUnixTimestamp(scheduleDate, scheduleTime) {
    const combinedDateTimeString = `${scheduleDate}T${scheduleTime}:00`;
    const scheduleDateTime = new Date(combinedDateTimeString);
    const unixTimestamp = scheduleDateTime.getTime() / 1000; // Convert to Unix time (seconds since epoch)
    return unixTimestamp;
}


// Function to validate schedule date and time
export const validateScheduleDateAndTime = (scheduleDate, scheduleTime) => {
    const inputDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const currentDate = new Date();
    const minAllowedDate = new Date(currentDate.getTime() + 10 * 60000);
    return inputDateTime >= minAllowedDate;
};

export const checkDimensions = (file, socialMediaPostId = "") => {

    if (file.type.startsWith('image/')) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const imageUrl = URL.createObjectURL(file);
            img.src = imageUrl;
            img.onload = () => {
                resolve({file: file, url: imageUrl});
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
                resolve({file: file, url: videoUrl});
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


export const extractHashtags = (hastTag) => {
    const hashtagRegex = /#[A-Za-z0-9_-]+/g;
    return !hastTag.match(hashtagRegex) || [];
}

export const redirectToURL = (redirectedURL) => {
    window.open(redirectedURL, '_blank');
}

// Function to convert an image URL to a File object
export async function urlToBlob(imageUrl) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Generate a random string for the filename
        const randomString = Math.random().toString(36).substring(7);
        const timestamp = new Date().getTime();
        const fileExtension = blob.type.split("/")[1];
        const filename = `${timestamp}_${randomString}.${fileExtension}`;

        // Create a File object with the blob
        const file = new File([blob], filename, {type: blob.type});
        return file;
    } catch (error) {
        console.error("Error converting URL to File:", error);
        return null;
    }
}

// Function to convert a list of image URLs to a list of File objects
export async function urlsToFiles(fileUrlList) {
    const files = [];
    for (const fileUrl of fileUrlList) {
        const file = await urlToBlob(fileUrl.imageURL);
        if (file) {
            files.push({socialMediaPostId: fileUrl.socialMediaPostId, file: file});
        }
    }

    return files;
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
    } else {
        return `#${str}`;
    }
}

export const convertSentenceToHashtags = (sentence) => {
    const words = sentence.split(' ');
    const hashtags = words.map(word => convertToHashtag(word));
    const result = hashtags.join(' ');
    return result;
}

