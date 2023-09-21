import {useSelector} from "react-redux";
import jwt_decode from "jwt-decode";

export const getToken = () => {
    const token = useSelector((state) => state.user.token);
    return token;
};

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

