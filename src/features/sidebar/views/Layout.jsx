import React, {useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import addy_logo from "../../../images/addylogoo.png";
import "./Layout.css";
import {SidebarMenuItems} from "../SidebarMenu.jsx";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import {useDispatch, useSelector} from "react-redux";
import Swal from "sweetalert2";
import {getFacebookConnectedPages} from "../../../app/actions/facebookActions/facebookActions";
import {useAppContext} from "../../common/components/AppProvider.jsx";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {FaBars} from "react-icons/fa";
import {RxCross2} from "react-icons/rx";
import default_user_icon from '../../../images/default_user_icon.svg'
import logout_img from '../../../images/log-out.svg'
import {subscribeNotifications} from "../../../services/addyService";

import logout_image from "../../../images/logout_img.png"
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect.jsx";
import {
    getUpdatedNameAndImageUrlForConnectedPages,
    isPageInfoAvailableFromSocialMediaFor
} from "../../../utils/commonUtils";
import {updatePageAccessTokenByIds} from "../../../app/actions/pageAccessTokenAction/pageAccessTokenAction";
import {useLazyGetUserInfoQuery} from "../../../app/apis/userApi";
import {useGetConnectedSocialAccountQuery} from "../../../app/apis/socialAccount";

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {pathname} = location;
    const splitLocation = pathname.split("/");
    const token = getToken();
    const dispatch = useDispatch();

    const [getUserInfo, getUserInfoApi] = useLazyGetUserInfoQuery()
    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")

    const facebookPageListReducer = useSelector(state => state.facebook.getFacebookPageReducer);
    const instagramBusinessAccountsData = useSelector(state => state.socialAccount.getAllInstagramBusinessAccountsReducer);
    const pinterestBoardsData = useSelector(state => state.socialAccount.getAllPinterestBoardsReducer);
    const getAllLinkedinPagesData = useSelector(state => state.socialAccount.getAllLinkedinPagesReducer);
    const connectedPagesData = useSelector((state) => state.facebook.getFacebookConnectedPagesReducer);


    const unseenNotificationsCount = useSelector(state => state.notification.unseenNotificationsCountReducer)
    const {sidebar, show_sidebar} = useAppContext();


    useEffect(() => {
        subscribeNotifications(dispatch);
    }, []);

    useEffect(() => {
        if (getConnectedSocialAccountApi?.data?.length > 0 && connectedPagesData?.facebookConnectedPages?.length > 0) {
            // First Map -> Insert socialMediaType in each page
            // Second Map -> Getting latest imageUrl if Updated or url expired
            // Third Filter -> Filter all the pages whose images we need to updated
            let pageInfoFromSocialMedia = {
                facebook: facebookPageListReducer,
                instagram: instagramBusinessAccountsData,
                linkedin: getAllLinkedinPagesData,
                pinterest: pinterestBoardsData,
            }
            let allConnectedPages = connectedPagesData?.facebookConnectedPages?.map((page) => {
                return {
                    ...page,
                    socialMediaType: getConnectedSocialAccountApi?.data?.filter(account => account.id === page.socialMediaAccountId)[0]?.provider
                }
            })
            const connectedSocialMediaTypes = Array.from(new Set(allConnectedPages.map(page => page.socialMediaType)));
            if (isPageInfoAvailableFromSocialMediaFor(connectedSocialMediaTypes, pageInfoFromSocialMedia)) {
                let pageImagesToUpdate = allConnectedPages?.map(page => {
                        return getUpdatedNameAndImageUrlForConnectedPages(page, pageInfoFromSocialMedia)
                    }
                ).filter(page => page?.isPageUpdated)
                pageImagesToUpdate?.length > 0 && dispatch(updatePageAccessTokenByIds({
                    token: token,
                    ids: pageImagesToUpdate?.map(page => page.id).join(","),
                    data: pageImagesToUpdate
                }))
            }
        }
    }, [connectedPagesData, getConnectedSocialAccountApi])


    useEffect(() => {
        if (token && !getUserInfoApi.data) {
            getUserInfo("");
        }
    }, [token, getUserInfoApi.data]);

    useEffect(() => {
        const decodeJwt = decodeJwtToken(token);
        if (getConnectedSocialAccountApi?.data === undefined || connectedPagesData?.facebookConnectedPages === undefined) {
            // dispatch(getAllConnectedSocialAccountAction({
            //     customerId: decodeJwt.customerId,
            //     token: token,
            // }));
            dispatch(getFacebookConnectedPages({
                customerId: decodeJwt?.customerId,
                token: token,
            }));
        }
    }, []);

    const LogOut = () => {
        Swal.fire({
            title: `Logout`,
            imageUrl: logout_image,
            html:`<p class="modal_heading">Are you sure you want to logout?</p>`,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Log out",
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
            reverseButtons: true,
            customClass: {
                confirmButton: 'confirmButton',
                cancelButton: 'cancelButton',
                popup:"animated-popup small_swal_popup logout_popup",

            }
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                window.location.href = "/login"
            }
        });
    };

    return (
        <>
            <section className="sidebar_container">

                <div
                    className={
                        sidebar ? "sidebar_content sidebar_wrapper" : " sidebar_wrapper"
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
                            <img src={addy_logo} className={`addy_logo ${sidebar ? "cropped_logo_outer" : ""}`}/>

                        </Link>


                    </div>
                    <div className={"d-flex align-items-center"}>
                        <div
                            className={`user_info_outer ${sidebar ? "px-3 py-2" : ""} ${location.pathname === "/profile" ? "active_bg_color" : ""}`}
                            onClick={() => {
                                navigate("/profile");
                            }}>


                            {
                                getUserInfoApi?.isLoading ?
                                    <SkeletonEffect count={1}/> :
                                    getUserInfoApi.data !== undefined &&
                                    <>
                                        <img
                                            src={getUserInfoApi?.data?.profilePic ? "data:image/jpeg; base64," + getUserInfoApi?.data?.profilePic : default_user_icon}
                                            className='profile_img'/>
                                        <h3 className={sidebar ? "d-none" : ""}>{getUserInfoApi?.data?.fullName || "name"}</h3>
                                    </>
                            }
                        </div>


                    </div>
                    <ul className={sidebar ? "sidebar_item Sidebar_containerbox mt-3" : "sidebar_item "}>
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
                                            delay={{show: 400, hide: 300}}
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
