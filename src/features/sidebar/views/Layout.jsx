import React, {useEffect, useState} from 'react'
import {Link, useLocation, useNavigate} from "react-router-dom"
import default_user_icon from '../../../images/default_user_icon.svg'
import addy_logo from '../../../images/addylogo.png'
import {BiLogOut} from "react-icons/bi";
import './Layout.css'
import {SidebarMenuItems} from "../SidebarMenu.jsx";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import {getUserInfo} from "../../../app/actions/userActions/userActions";
import {useDispatch, useSelector} from "react-redux";
import Swal from "sweetalert2";
import {getInitialLetterCap} from "../../../utils/commonUtils";
import {SocialAccountProvider} from "../../../utils/contantData";
import {
    disconnectSocialAccountAction,
    getAllConnectedSocialAccountAction
} from "../../../app/actions/socialAccountActions/socialAccountActions";
import {getAllSocialMediaPostsByCriteria} from "../../../app/actions/postActions/postActions";
import {getFacebookConnectedPages} from "../../../app/actions/facebookActions/facebookActions";

const Layout = () => {

    const [sidebar, setSidebar] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const {pathname} = location;
    const splitLocation = pathname.split("/");
    const token = getToken();
    const dispatch = useDispatch();
    const userData = useSelector(state => state.user.userInfoReducer.data);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);

    const show_sidebar = () => {
        setSidebar(!sidebar)
    }

    useEffect(() => {
        if (token && !userData) {
            const decodeJwt = decodeJwtToken(token);
            const requestBody = {
                customerId: decodeJwt.customerId,
                token: token
            }
            // Dispatch the API call only when userData is not available
            dispatch(getUserInfo(requestBody));
        }
    }, [token, userData, dispatch])

    useEffect(()=>{
        const decodeJwt = decodeJwtToken(token);
        if(getAllConnectedSocialAccountData?.data===undefined ||connectedPagesData?.facebookConnectedPages===undefined ){
            dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt.customerId, token: token}))
            dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
        }

    },[])

    const LogOut = () => {
        Swal.fire({
            icon: 'warning',
            title: `Logout`,
            text: `Are you sure you want to logout?`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        });

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
                                src={userData?.profilePic ? "data:image/jpeg; base64," + userData?.profilePic : default_user_icon}
                                className='profile_img'/>
                            <div>
                                <h3 className='profile_container'>{userData?.fullName || "name"}</h3>
                                <h4 className="profile_container">{userData?.email }</h4>
                            </div>
                        </div>
                    </div>
                    <ul className='sidebar_item'>
                        {
                            SidebarMenuItems && SidebarMenuItems?.map((item, index) => (
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
                            <div className=' sidebar_item_outers Profile_Img_outer'>
                                {/* <img className='userimg'  src={userData?.profilePic ? "data:image/jpeg; base64," + userData?.profilePic : default_user_icon}/> */}
                                <Link to="/profile"><img className='userimg'  src={userData?.profilePic ? "data:image/jpeg; base64," + userData?.profilePic : default_user_icon}/> Profile </Link>
                            </div>
                        </li>
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