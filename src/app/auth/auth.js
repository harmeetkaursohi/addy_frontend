import {useSelector} from "react-redux";
import jwt_decode from "jwt-decode";

export const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
};

export const decodeJwtToken = (token) => {
    try {
        return jwt_decode(token);
    } catch (error) {
        window.location.href="/login";
        localStorage.clear();
    }
}

export const setAuthenticationHeader = (token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
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

