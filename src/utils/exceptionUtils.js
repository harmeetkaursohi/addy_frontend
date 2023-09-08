import {showErrorToast} from "../features/common/components/Toast.jsx";
import axios from 'axios';

// Axios Interceptor for handling global errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

// Function for handling errors and showing toasts
export const handleApiError = (error) => {
    if (error.response) {
        const {status, data} = error.response;

        // Handle specific error status codes
        switch (status) {
            case 400:
                // Handle Bad Request errors
                showErrorToast('Bad Request: ' + (data.message || 'Invalid request.'));
                break;
            case 401:
                // Handle Unauthorized errors
                showErrorToast('Unauthorized: ' + (data.message || 'You are not authorized.'));
                break;
            case 403:
                // Handle Forbidden errors
                localStorage.removeItem("token");
                showErrorToast('Access Denied: ' + (data.message || 'You do not have access.'));
                window.location.href = "/login";
                break;
            case 404:
                // Handle Not Found errors
                showErrorToast('Not Found: ' + (data.message || 'Resource not found.'));
                break;
            default:
                // Handle other error status codes
                showErrorToast('Error ' + status + ': ' + (data.message || 'An error occurred.'));
        }
    } else if (error.request) {
        // Handle network errors (e.g., no internet connection)
        showErrorToast('Network error. Please try again later.');
    } else {
        // Handle other errors
        showErrorToast('An error occurred.');
    }

    return Promise.reject(error);
};
