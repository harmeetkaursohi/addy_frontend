import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';


const Oauth2RedirectComponent = () => {
    const location = useLocation();

    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        console.log("name======>",name)
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        console.log("results======>",results)
        console.log("if results==null======>",decodeURIComponent(results[1].replace(/\+/g, ' ')))
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));

    };

    const token = getUrlParameter('token');
    const error = getUrlParameter('error');

    console.log("token======>",token)
    console.log("error======>",error)
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            // window.location.href = "/dashboard"
        } else {
            localStorage.setItem("errorInOAuth","true")
            // window.location.href = "/login"
        }
    }, []);

    return (
        <>
        </>
    );
};

export default Oauth2RedirectComponent;