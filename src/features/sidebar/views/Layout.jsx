import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom"
import profile_img from '../../../images/profile_img.png'
import addy_logo from '../../../images/addylogo.png'
import {BiLogOut} from "react-icons/bi";
import './Layout.css'
import {sidebarMenuItems} from '../sidebarMenu'
import axios from "axios";
import {decodeJwtToken, getToken, setAuthenticationHeader} from "../../../app/auth/auth.js";
import {showErrorToast} from "../../common/components/Toast.jsx";

const Layout = () => {

    const [sidebar, setSidebar] = useState(true);
    const [userData, setUserData] = useState(null);

    const token = getToken();

    useEffect(() => {
        if (token) {
            const decodeJwt = decodeJwtToken(token);
            axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/customers/${decodeJwt.customerId}`, setAuthenticationHeader(token)).then(res => {
                setUserData({
                    username: res.data.username,
                    profilePic: res.data.profilePic,
                    email: res.data.email,
                })
                return res.data;
            }).catch(error => {
                showErrorToast(error.response.data.message);
                return thunkAPI.rejectWithValue(error.response);
            });
        }
    }, []);


    const show_sidebar = () => {
        setSidebar(!sidebar)
    }

    const navigate = useNavigate();
    const location = useLocation();
    const {pathname} = location;
    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");
    const LogOut = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <>
            <section className='sidebar_container'>
                <div className={sidebar ? "sidebar_content sidebar_wrapper" : "sidebar_wrapper"}>
                    <i className="fa fa-bars bar_icon" aria-hidden="true" onClick={show_sidebar}></i>
                    <div className={sidebar ? "user_Profile_outer user_profile_outer" : "user_profile_outer"}>
                        <div className='logo_outer'>
                            <img src={addy_logo} className='addy_logo'/>
                        </div>
                        <div className='user_profile_wrapper'>
                            <img
                                src={userData?.profilePic ? "data:image/jpeg; base64," + userData?.profilePic : profile_img}
                                 className='profile_img'/>
                            <div>
                                <h3 className='profile_container'>{userData?.username || "username"}</h3>
                                <h4 className="profile_container">{userData?.email || "abc@demo.com"}</h4>
                            </div>
                        </div>
                    </div>
                    <ul className='sidebar_item'>
                        {
                            sidebarMenuItems &&  sidebarMenuItems?.map((item, index) => (
                                <li key={index}
                                    className={item.path === '/' + splitLocation[1] ? "sidebar_container_items sidebar_item_outer bar text-center" : 'sidebar_item_outer'}
                                    onClick={() => {
                                        navigate(item.path)
                                    }}>
                                    <div
                                        className={item.path === '/' + splitLocation[1] ? 'sidebar_inner_content' : "sidebar_item_outers"}>
                                        {item.icon}
                                        <h6 className=''>{item.name} </h6>
                                    </div>
                                </li>

                            ))
                        }
                        <li className='sidebar_container_items sidebar_item_outer  text-center sidebar_item_outer'>
                            <div className=' sidebar_item_outers'>
                                <BiLogOut/>
                                <h6 className='' onClick={LogOut}>Logout </h6>
                            </div>
                        </li>
                    </ul>
                </div>


            </section>
        </>
    )
}

export default Layout;