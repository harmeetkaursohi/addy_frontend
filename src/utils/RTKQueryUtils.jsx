import {showErrorToast} from "../features/common/components/Toast";

export const handleRTKQuery = async (fetchData, onSuccess, onFailure, onComplete) => {
    try {
        const response = await fetchData();
        onSuccess?.(response)
    } catch (error) {
        onFailure?.(error)
    } finally {
        onComplete?.();
    }
}

export const getAuthorizationHeader = () => {
    return {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
}

export const handleQueryError = async (queryFulfilled) => {
    queryFulfilled.catch(error => {
        showErrorToast(error.error.data.message);
    })
}