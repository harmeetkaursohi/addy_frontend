import { useSelector } from "react-redux";
import CryptoJS from 'crypto-js';

export const getToken = () => {
    const token = useSelector((state) => state.user.token);
    const decryptedBytes = CryptoJS.DES.decrypt(token, import.meta.env.VITE_APP_SECRET_KEY);
    const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
};