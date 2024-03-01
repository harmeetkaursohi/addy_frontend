import React, {useEffect, useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom"
import addy_crop_logo from '../../../images/cropLogo.png'
import addy_logo from '../../../images/addylogo.png'
import {BiLogOut} from "react-icons/bi";
import './Layout.css'
import {SidebarMenuItems} from "../SidebarMenu.jsx";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import {getUserInfo} from "../../../app/actions/userActions/userActions";
import {useDispatch, useSelector} from "react-redux";
import Swal from "sweetalert2";
import {
    getAllConnectedSocialAccountAction
} from "../../../app/actions/socialAccountActions/socialAccountActions";
import {getFacebookConnectedPages} from "../../../app/actions/facebookActions/facebookActions";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";

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

    useEffect(() => {
        const decodeJwt = decodeJwtToken(token);
        if (getAllConnectedSocialAccountData?.data === undefined || connectedPagesData?.facebookConnectedPages === undefined) {
            dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt.customerId, token: token}))
            dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
        }
    }, [])

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

                <div  onClick={show_sidebar} className={`cmn_forward_arrow ${sidebar? " forward_arrow":'right_forward_arrow'} `}>
                    {sidebar ? <IoIosArrowForward  /> : <IoIosArrowBack />}

                </div>
                <div className={sidebar ? "sidebar_content sidebar_wrapper" : "sidebar_wrapper"}>

                    <div className="user_profile_outer">
                            {sidebar?
                            <img src={addy_crop_logo} height="45px" width="45px" className='mt-4'/>:

                            <img src={addy_logo} className='addy_logo'/>

                            }
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
                            <div className=' sidebar_item_outers' onClick={LogOut}>
                                <BiLogOut/>
                                <h6 className='' >Logout </h6>
                            </div>
                        </li>
                    </ul>
                </div>



            </section>
        </>
    )
}

export default Layout;