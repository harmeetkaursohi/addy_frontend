import {baseAxios} from "../utils/commonUtils";
import axios from "axios";

export const sendChatSaveRequest = async (authToken, senderId, messageText) => {
    const url = `${import.meta.env.VITE_APP_API_BASE_URL}/chat/save`;

    try {
        // Create FormData object
        const formData = new FormData();
        formData.append('senderId', senderId);
        formData.append('messages.senderId', senderId);
        formData.append('messages.text', messageText);

        // Make the POST request with axios
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Unexpected response status: ' + response.status);
        }
    } catch (error) {
        console.error('Error sending chat save request:', error);
        throw error;
    }
}

export const fetchChatById = async (authToken,size,page, params = { sortBy: 'createdAt', size: 10, page: 0 }) => {
    const queryString = new URLSearchParams(params).toString();

    // const url = `${import.meta.env.VITE_APP_API_BASE_URL}/chat/${chatId}/messages?sortBy=createdAt&size=10&page=0`;
    const url = `${import.meta.env.VITE_APP_API_BASE_URL}/chat/messages?size=${size}&page=${page}`;
    try {
        const response = await baseAxios.get(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        return response.data; // Adjust this based on your API's response structure
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const fetchAllChatById = async (authToken) => {
    const url = `${import.meta.env.VITE_APP_API_BASE_URL}/chat/all/messages`;
    try {
        const response = await baseAxios.get(url, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

