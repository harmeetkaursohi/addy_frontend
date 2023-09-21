import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { getToken } from '../../app/auth/auth';

const Oauth2RedirectComponent = () => {
    const location = useLocation();

    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');
    const error = getUrlParameter('error');

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            window.location.href="/dashboard";
        }else{
            window.location.href="/login";  
        }
    }, []);


    return (
        <>
        </>
    );
};

export default Oauth2RedirectComponent;