import {useEffect, useState} from 'react';
import {useLocation, Navigate, useParams, useNavigate} from 'react-router-dom';
import {getToken} from '../../app/auth/auth';
import {showErrorToast} from "../common/components/Toast";
import {SomethingWentWrong} from "../../utils/contantData";
import {isNullOrEmpty} from "../../utils/commonUtils";

const Oauth2RedirectComponent = () => {
    const location = useLocation();
    const navigate=useNavigate();
    const [accessToken,setAccessToken] = useState(null);
    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    const token = getUrlParameter('token');
    const error = getUrlParameter('error');
    console.log("accessToken--->",token)
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

    useEffect(()=>{
        if(location && isNullOrEmpty(token)){
            const access_token=getAccessTokenFromHash();
            access_token ?setAccessToken(access_token) :showErrorToast(SomethingWentWrong)
        }
    },[location])


    const {mediaType} = useParams();






    // const jwtToken = getUrlParameter('access_token');


    console.log("token----->", token);
    // console.log("mediaType------>", mediaType);

    useEffect(() => {
        if (token && isNullOrEmpty(accessToken)) {
            localStorage.setItem("token", token);
            navigate("/dashboard")

            // window.location.href="/dashboard";
        }
        else{
            navigate("/login")
            // window.location.href="/login";
        }
    }, []);

    // useEffect(() => {
    //     const jwtToken = getAccessTokenFromHash();
    //     console.log("jwtToken", jwtToken);
    // }, [location.search]);





    return (
        <>
        </>
    );
};

export default Oauth2RedirectComponent;