import * as yup from "yup";
import {SocialAccountProvider} from "./contantData.js";
import {exchangeForLongLivedToken} from "../services/facebookService.js";
import {decodeJwtToken} from "../app/auth/auth.js";
import {facebookPageConnect, getFacebookConnectedPages} from "../app/actions/facebookActions/facebookActions.js";
import {showErrorToast} from "../features/common/components/Toast";
import fb from "../images/fb.svg";
import instagram_img from "../images/instagram.png";
import linkedin from "../images/linkedin.svg";

const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;

export const validationSchemas = {
    login: yup.object().shape({
        username: yup.string().required('Username is required').email('Invalid email format'), password: yup.string()
            .min(5, 'Password must be at least 5 characters')
            .required('Password is required')
    }),

    register: yup.object().shape({
        fullName: yup.string().required('Full Name is required'),
        username: yup.string().required('Username is required'),
        email: yup.string().required('Email is required').email('Invalid email format'),
        contactNo: yup.number().required('Contact No is required')
    }),

    createPassword: yup.object().shape({
        password: yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
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
export const validateScheduleDateAndTime = (postStatus, scheduleDate, scheduleTime) => {
    if (postStatus === 'SCHEDULED') {
        if (!scheduleDate && !scheduleTime) {
            showErrorToast("Please enter scheduleDate and scheduleTime!!");
            return;
        }
    }

    const inputDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const currentDate = new Date();
    const minAllowedDate = new Date(currentDate.getTime() + 10 * 60000);

    if (!(inputDateTime >= minAllowedDate)) {
        showErrorToast("Schedule date and time must be at least 10 minutes in the future.");
        return;
    }
};

export const checkDimensions = (file, referenceId = "") => {

    if (file.type.startsWith('image/')) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const imageUrl = URL.createObjectURL(file);
            img.src = imageUrl;
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                resolve({file: file, dimension: {width: width, height: height}, url: imageUrl});
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
                const width = mediaElement.videoWidth;
                const height = mediaElement.videoHeight;
                resolve({file: file, dimension: {width: width, height: height}, url: videoUrl});
            };
            mediaElement.onerror = (error) => {
                reject(error);
            };
        });
    }
};


export const handleSeparateCaptionHashtag = (inputText) => {
    const hashtagIndex = inputText.indexOf('#');
    if (hashtagIndex !== -1) {
        const extractedCaption = inputText.substring(0, hashtagIndex).trim();
        const extractedHashtag = inputText.substring(hashtagIndex).trim();
        return {caption: extractedCaption, hashtag: extractedHashtag}

    } else {
        return {caption: extractedCaption, hashtag: ''};
    }
};

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
            files.push({referenceId: fileUrl.referenceId, file: file});
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
            postDate: new Date(c),
            childCardContent: computeAndBuildChildCard(currentObject[c], Object.keys(currentObject[c])[0])
        });
    })
    console.log("a---->", a);

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

    function computeImageURL(providerType) {
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


    return Object.keys(childCardProps[key]).map((c) => {

        console.log("c--->",c);
        return {
            id: childCardProps[key][c][0]?.id,
            socialMediaPostId: childCardProps[key][c][0]?.referenceId,
            title: computeTitle(c),
            imageUrl: computeImageURL(c),
        }

    })

}





