import axios from 'axios';

export async function exchangeForLongLivedToken(shortLivedToken) {
    const url = 'https://graph.facebook.com/v17.0/oauth/access_token';

    const params = {
        grant_type: 'fb_exchange_token',
        client_id: '688937182693504',
        fb_exchange_token: shortLivedToken,
        client_secret: 'f758b83170899e5e9c9c1baa5342c877'
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

