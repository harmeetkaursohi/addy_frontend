import axios from "axios";

export const fetchUserProfile = async (accessToken) => {
    try {
        const response = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {Authorization: `Bearer ${accessToken}`}
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching LinkedIn user information:', error);
    }
};