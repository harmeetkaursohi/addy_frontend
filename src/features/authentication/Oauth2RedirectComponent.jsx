// import React, { useEffect } from 'react'
// import { Navigate, useLocation } from 'react-router-dom';

// const Oauth2RedirectComponent = () => {
//     const pathName = useLocation();
//     const queryparam = new URLSearchParams(pathName.search)
//     const token = queryparam.get("token")
//     const status = queryparam.get("status")
//     const error = queryparam.get("error")




//     useEffect(() => {
//         console.log("token---->",token);
//         console.log("status---->",status);
//         if (token && status == "SUCCESS") {
//             localStorage.setItem("token", token);
//             window.location.href="/dashboard"
//         }
//     }, [])

//     return (
//         <>
//             {localStorage.getItem("token") ? <Navigate to="/dashboard" /> :
//                 <Navigate to="/login" state={{ from: location.pathname, error: error }} />
//             }
//         </>
//     )
// }

// export default Oauth2RedirectComponent;

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
            {/* {getToken() ? <Navigate to="/dashboard" state={{ from: location.pathname }} /> :
                <Navigate to="/login" state={{ from: location.pathname, error: error }} />
            } */}
        </>
    );
};

export default Oauth2RedirectComponent;