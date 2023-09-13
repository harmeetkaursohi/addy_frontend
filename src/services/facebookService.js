import axios from 'axios';

export async function exchangeForLongLivedToken(shortLivedToken) {
    const url = `${import.meta.env.VITE_APP_FACEBOOK_BASE_URL}/oauth/access_token`;
    const client_Id = import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID;
    const client_secret = import.meta.env.VITE_APP_FACEBOOK_CLIENT_SECRET;

    const params = {
        grant_type: 'fb_exchange_token',
        client_id: client_Id,
        fb_exchange_token: shortLivedToken,
        client_secret: client_secret
    };

    try {
        const response = await axios.get(url, {params});

        if (response.status === 200 && response.data && response.data.access_token) {
            return response.data.access_token;
        } else {
            throw new Error('Something went wrong!');
        }
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

