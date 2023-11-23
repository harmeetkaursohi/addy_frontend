import {useEffect} from 'react';
import {useLocation, Navigate, useParams} from 'react-router-dom';
import {getToken} from '../../app/auth/auth';

const Oauth2RedirectComponent = () => {
    const location = useLocation();
    const {mediaType} = useParams();
    console.log("mediaType------>", mediaType);

    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');
    const jwtToken = getUrlParameter('access_token');
    const error = getUrlParameter('error');
   // console.log("jwtToken", jwtToken)
    console.log("token----->", token);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            window.location.href="/dashboard";
        }
        else{
            window.location.href="/login";
        }
    }, []);

    useEffect(() => {
        const jwtToken = getAccessTokenFromHash();
        console.log("jwtToken", jwtToken);
    }, [location.search]);


    const getAccessTokenFromHash = () => {
        const hash = location.hash;
        const tokenIndex = hash.indexOf('access_token=');

        if (tokenIndex !== -1) {
            const tokenStart = tokenIndex + 'access_token='.length;
            const tokenEnd = hash.indexOf('&', tokenStart);
            const jwtToken = hash.substring(tokenStart, tokenEnd !== -1 ? tokenEnd : undefined);

            return jwtToken;
        }

        return null;
    };


    return (
        <>
        </>
    );
};

export default Oauth2RedirectComponent;