import * as yup from "yup";
import {SocialAccountProvider} from "./contantData.js";
import {exchangeForLongLivedToken} from "../services/facebookService.js";
import {decodeJwtToken} from "../app/auth/auth.js";
import {facebookPageConnect, getFacebookConnectedPages} from "../app/actions/facebookActions/facebookActions.js";

const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;

export const validationSchemas = {
    login: yup.object().shape({
        username: yup.string().required('Username is required').email('Invalid email format'),
        password: yup.string()
            .min(5, 'Password must be at least 5 characters')
            .required('Password is required')
    }),

    register: yup.object().shape({
        username: yup.string().required('Username is required'),
        email: yup.string().required('Email is required').email('Invalid email format'),
        contactNo: yup.number().required('Contact No is required')
    }),

    createPassword: yup.object().shape({
        password: yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        // .matches(passwordPattern, 'Password must meet the specified criteria'),
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
        customerId: decodeJwt.customerId,
        token: token,
        socialAccountData: {
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


export const facebookPageConnectAction = (dispatch,token, facebookData) => {
    console.log("---->",token)
    const decodeJwt = decodeJwtToken(token);
    if (facebookData) {
        const requestBody = {
            customerId: decodeJwt?.customerId,
            pageAccessTokenDTO: {
                pageId: facebookData?.id,
                name: facebookData?.name,
                imageUrl: facebookData.picture?.data?.url,
                about: facebookData?.about,
                access_token: facebookData?.access_token
            },
            token: token
        }
        dispatch(facebookPageConnect(requestBody)).then((response) => {
            console.log(response)
            dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
        }).catch((error) => {
            console.log("--->error", error)
        })
    }
}





