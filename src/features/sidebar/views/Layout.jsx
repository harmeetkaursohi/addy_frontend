import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import addy_crop_logo from "../../../images/cropLogo.png";
import addy_logo from "../../../images/addy_logo.svg";
import {BiLogOut} from "react-icons/bi";
import "./Layout.css";
import {SidebarMenuItems} from "../SidebarMenu.jsx";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import {getUserInfo} from "../../../app/actions/userActions/userActions";
import {useDispatch, useSelector} from "react-redux";
import Swal from "sweetalert2";
import {getAllConnectedSocialAccountAction} from "../../../app/actions/socialAccountActions/socialAccountActions";
import {getFacebookConnectedPages} from "../../../app/actions/facebookActions/facebookActions";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {useAppContext} from "../../common/components/AppProvider.jsx";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FaArrowRight, FaBars} from "react-icons/fa";
import {RxCross2} from "react-icons/rx";
import profile_img from '../../../images/profile_img.png'
import logout_img from '../../../images/log-out.svg'
import {subscribeNotifications} from "../../../services/addyService";

import logout_bg from "../../../images/logout_bg.svg"
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect.jsx";

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {pathname} = location;
    const splitLocation = pathname.split("/");
    const token = getToken();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userInfoReducer.data);
    const loading = useSelector((state) => state.user.userInfoReducer.loading);

    const getAllConnectedSocialAccountData = useSelector((state) => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector((state) => state.facebook.getFacebookConnectedPagesReducer);
    const unseenNotificationsCount = useSelector(state => state.notification.unseenNotificationsCountReducer)
    const {sidebar, show_sidebar} = useAppContext();


    useEffect(() => {
        subscribeNotifications(dispatch);
    }, []);


    useEffect(() => {
        if (token && !userData) {
            const decodeJwt = decodeJwtToken(token);
            const requestBody = {
                customerId: decodeJwt.customerId,
                token: token,
            };
            // Dispatch the API call only when userData is not available
            dispatch(getUserInfo(requestBody));
        }
    }, [token, userData, dispatch]);

    useEffect(() => {
        const decodeJwt = decodeJwtToken(token);
        if (getAllConnectedSocialAccountData?.data === undefined || connectedPagesData?.facebookConnectedPages === undefined) {
            dispatch(getAllConnectedSocialAccountAction({
                customerId: decodeJwt.customerId,
                token: token,
            }));
            dispatch(getFacebookConnectedPages({
                customerId: decodeJwt?.customerId,
                token: token,
            }));
        }
    }, []);

    const LogOut = () => {
        Swal.fire({
            title: `Logout`,
            imageUrl: logout_bg,
            text: `Are you sure you want to logout?`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Log out",
            confirmButtonColor: "#E05905",
            cancelButtonColor: "#E6E9EC",

            customClass: {
                confirmButton: 'confirmButton',
                cancelButton: 'cancelButton'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        });
    };

    return (
        <>
            <section className="sidebar_container">

                <div
                    className={
                        sidebar ? "sidebar_content sidebar_wrapper bg_light_orange" : "sidebar_wrapper bg_light_orange"
                    }
                >

                    <div
                        onClick={show_sidebar}
                        className={`cmn_forward_arrow ${sidebar ? "text-center" : "text-end"}`}
                    >
                        {sidebar ? <FaBars/> : <RxCross2 className="cross_icon"/>}

                    </div>
                    <div className="user_profile_outer">
                        <Link to="/dashboard">
                            {sidebar ? (
                                <img
                                    src={addy_crop_logo}
                                    height="45px"
                                    width="45px"
                                    className="mt-4"
                                />
                            ) : (
                                <img src={addy_logo} className="addy_logo"/>
                            )}
                        </Link>


                    </div>
                    <div className={sidebar ? "d-none" : "d-flex align-items-center justify-content-evenly mt-4 mb-4"}>
                        <div className="user_info_outer">


                            {loading ? <SkeletonEffect count={1}/> : userData !== undefined &&
                                <>
                                    <img
                                        src={userData?.profilePic ? "data:image/jpeg; base64," + userData?.profilePic : profile_img}
                                        className='profile_img'/>
                                    <h3>{userData?.fullName || "name"}</h3>
                                    <FaArrowRight/>
                                </>
                            }
                        </div>


                    </div>
                    <ul className={sidebar ? "sidebar_item Sidebar_containerbox" : "sidebar_item"}>
                        {SidebarMenuItems &&
                            SidebarMenuItems?.map((item, index) => (
                                <li
                                    key={index}
                                    className={
                                        item.path === "/" + splitLocation[1]
                                            ? "sidebar_container_items sidebar_item_outer"
                                            : "sidebar_item_outer"
                                    }
                                    onClick={() => {
                                        navigate(item.path);
                                    }}
                                >

                                    {sidebar ? (
                                        <OverlayTrigger
                                            placement="right"
                                            overlay={
                                                <Tooltip id="button-tooltip" className="ms-4">
                                                    {item.name}
                                                </Tooltip>
                                            }
                                        >
                                            <div
                                                className={item.path === "/" + splitLocation[1] ? "sidebar_inner_content" : "sidebar_item_outers"}>

                                                {
                                                    (item.name === "Notifications" && unseenNotificationsCount.count !== undefined && unseenNotificationsCount.count > 0) &&
                                                    <h2 className={"notification-count-sidebar "}>{unseenNotificationsCount.count}</h2>
                                                }
                                                {/* <img src={item.icon}/> */}
                                                {item.icon}

                                            </div>

                                        </OverlayTrigger>
                                    ) : (
                                        <div
                                            className={item.path === "/" + splitLocation[1] ? "sidebar_inner_content" : "sidebar_item_outers"}>
                                            {
                                                (item.name === "Notifications" && unseenNotificationsCount.count !== undefined && unseenNotificationsCount.count > 0) &&
                                                <h2 className={"notification-count-sidebar "}>{unseenNotificationsCount.count}</h2>
                                            }
                                            {item.icon}
                                            <h6 className=''>{item.name} </h6>
                                        </div>
                                    )
                                    }


                                </li>
                            ))}
                        <li className=" sidebar_item_outer  sidebar_item_outer">
                            {sidebar ? (
                                <OverlayTrigger
                                    placement="right"
                                    overlay={<Tooltip id="button-tooltip">Logout</Tooltip>}
                                >
                                    <div className="sidebar_item_outers" onClick={LogOut}>
                                        <img src={logout_img}/>

                                    </div>
                                </OverlayTrigger>
                            ) : (
                                <>
                                    <div className="sidebar_item_outers " onClick={LogOut}>
                                        <img src={logout_img}/>
                                        <h6 className="red_color">Logout</h6>
                                    </div>
                                </>
                            )}
                        </li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default Layout;
