import {useSelector} from "react-redux";
import CryptoJS from 'crypto-js';
import jwt_decode from "jwt-decode";

export const getToken = () => {
    const token = useSelector((state) => state.user.token);
    return token;
};

export const decryptedToken = (token) => {
    return CryptoJS.AES.decrypt(token, import.meta.env.VITE_APP_SECRET_KEY).toString(CryptoJS.enc.Utf8);
}

export const decodeJwtToken = (token) => {
    return jwt_decode(token);
}

export const setAuthenticationHeader = (token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    return config;
}

export const setAuthenticationHeaderWithMultipart = (token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    };

    return config;
}

