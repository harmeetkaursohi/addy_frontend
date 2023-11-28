import {useEffect, useState} from 'react';
import {useLocation, useParams, useNavigate} from 'react-router-dom';
import {showErrorToast} from "../common/components/Toast";
import {SomethingWentWrong} from "../../utils/contantData";
import {isNullOrEmpty} from "../../utils/commonUtils";

const Oauth2RedirectComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(null);
    const {mediaType} = useParams();

    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');
    const error = getUrlParameter('error');


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

    useEffect(() => {
        if (location && isNullOrEmpty(token)) {
            const access_token = getAccessTokenFromHash();
            access_token ? setAccessToken(access_token) : showErrorToast(SomethingWentWrong)
        }
    }, [location])

    useEffect(() => {
        if (token && isNullOrEmpty(accessToken)) {
            localStorage.setItem("token", token);
            navigate("/dashboard")
        } else {
            navigate("/login")
        }
    }, []);

    return (
        <>
        </>
    );
};

export default Oauth2RedirectComponent;