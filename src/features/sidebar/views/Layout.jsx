import React, {useEffect} from "react";
import ReactDOMServer from 'react-dom/server';
import {Link, useLocation, useNavigate} from "react-router-dom";
import Addy_logo from "../../../images/addylogoo.svg?react";
import "./Layout.css";
import {SidebarMenuItems} from "../SidebarMenu.jsx";
import {useDispatch} from "react-redux";
import Swal from "sweetalert2";
import {FaBars} from "react-icons/fa";
import {RxCross2} from "react-icons/rx";
import default_user_icon from '../../../images/default_user_icon.svg'
import Logout from '../../../images/Logout.svg?react'
import Logout_img from '../../../images/log-out.svg?react'
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect.jsx";
import {
    getUpdatedNameAndImageUrlForConnectedPages, isNullOrEmpty,
    isPageInfoAvailableFromSocialMediaFor
} from "../../../utils/commonUtils";
import {useGetUserInfoQuery} from "../../../app/apis/userApi";
import {
    useGetAllFacebookPagesQuery,
    useGetAllInstagramBusinessAccountsQuery, useGetAllLinkedinPagesQuery,
    useGetAllPinterestBoardsQuery,
    useGetConnectedSocialAccountQuery
} from "../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery, useUpdatePageByIdsMutation} from "../../../app/apis/pageAccessTokenApi";
import {enabledSocialMedia} from "../../../utils/contantData";
import {getConnectedSocialMediaAccount} from "../../../utils/dataFormatterUtils";
import {useAppContext} from "../../common/components/AppProvider";

const Layout = () => {

    const {sidebar, show_sidebar} = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const {pathname} = location;
    const splitLocation = pathname.split("/");
    const dispatch = useDispatch();

    const [updatePageByIds, updatePageByIdsApi] = useUpdatePageByIdsMutation("")
    const getUserInfoApi = useGetUserInfoQuery("")
    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")

    const connectedSocialAccount = getConnectedSocialMediaAccount(getConnectedSocialAccountApi?.data || [])

    const getAllFacebookPagesApi = useGetAllFacebookPagesQuery({
        providerId: connectedSocialAccount?.facebook?.providerId,
        accessToken: connectedSocialAccount?.facebook?.accessToken
    }, {skip: !enabledSocialMedia?.isFacebookEnabled || isNullOrEmpty(connectedSocialAccount.facebook)})

    const getAllInstagramPagesApi = useGetAllInstagramBusinessAccountsQuery(connectedSocialAccount?.instagram?.accessToken,
        {skip: !enabledSocialMedia?.isInstagramEnabled || isNullOrEmpty(connectedSocialAccount.instagram)})

    const getAllPinterestPagesApi = useGetAllPinterestBoardsQuery(connectedSocialAccount?.pinterest?.id,
        {skip: !enabledSocialMedia?.isPinterestEnabled || isNullOrEmpty(connectedSocialAccount.pinterest)})

    const getAllLinkedinPagesApi = useGetAllLinkedinPagesQuery({
        q: "roleAssignee",
        role: "ADMINISTRATOR",
        state: "APPROVED"
    }, {skip: !enabledSocialMedia?.isLinkedinEnabled || isNullOrEmpty(connectedSocialAccount.linkedin)})

    useEffect(() => {
        if (getConnectedSocialAccountApi?.data?.length > 0 && !getConnectedSocialAccountApi?.isLoading && !getConnectedSocialAccountApi?.isFetching && getAllConnectedPagesApi?.data?.length > 0 && !getAllConnectedPagesApi?.isLoading && !getAllConnectedPagesApi?.isFetching ) {
            // First Map -> Insert socialMediaType in each page
            // Second Map -> Getting latest imageUrl if Updated or url expired
            // Third Filter -> Filter all the pages whose images we need to updated
            let pageInfoFromSocialMedia = {
                facebook: getAllFacebookPagesApi,
                instagram: getAllInstagramPagesApi,
                linkedin: getAllLinkedinPagesApi,
                pinterest: getAllPinterestPagesApi,
            }
            let allConnectedPages = getAllConnectedPagesApi?.data?.map((page) => {
                return {
                    ...page,
                    socialMediaType: getConnectedSocialAccountApi?.data?.filter(account => account.id === page.socialMediaAccountId)[0]?.provider
                }
            })
            const connectedSocialMediaTypes = Array.from(new Set(allConnectedPages.map(page => page.socialMediaType)));
            if (isPageInfoAvailableFromSocialMediaFor(connectedSocialMediaTypes, pageInfoFromSocialMedia)) {
                let pageImagesToUpdate = allConnectedPages?.map(page => {
                        return getUpdatedNameAndImageUrlForConnectedPages(page, pageInfoFromSocialMedia)
                    }).filter(page => page?.isPageUpdated)

                const requestBody = {
                    ids: pageImagesToUpdate?.map(page => page.id).join(","),
                    data: pageImagesToUpdate
                }
                pageImagesToUpdate?.length > 0 && updatePageByIds(requestBody)
            }
        }
    }, [getAllConnectedPagesApi, getConnectedSocialAccountApi])

    const LogOut = (e) => {
        e.stopPropagation();
    
        const svgMarkup = ReactDOMServer.renderToStaticMarkup(<Logout />);
    
        Swal.fire({
            // title: `Logout`,
            html: `
                <div class="swal-content mt-2">
                    <div class="swal-images">
                        ${svgMarkup}
                    </div>
                    <h2 class="swal2-title mt-2" id="swal2-title" style="display: block;">Logout</h2>
                    <p class="modal_heading">Are you sure you want to logout?</p>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Log out",
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
            reverseButtons: true,
            customClass: {
                confirmButton: 'confirmButton',
                cancelButton: 'cancelButton',
                popup: "animated-popup small_swal_popup logout_popup",
            }
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        });
    };
const Profile =() =>{
    navigate('/profile')
}
    return (
        <>
            <section className="sidebar_container">

                <div
                    className={
                        sidebar ? "sidebar_content sidebar_wrapper" : " sidebar_wrapper"
                    }
                >

                    <div
                        
                        className={`cmn_forward_arrow ${sidebar ? "text-center" : "text-end"}`}
                    >
                        {sidebar ? <FaBars onClick={show_sidebar}/> : <RxCross2 onClick={show_sidebar} className="cross_icon"/>}

                    </div>
                    <div className="user_profile_outer">
                        <Link to="/dashboard">
                            <Addy_logo className={`addy_logo ${sidebar ? "cropped_logo_outer" : ""}`}/>

                        </Link>


                    </div>
                
                    <ul className={sidebar ? "sidebar_item Sidebar_containerbox " : "sidebar_item "}>
                        {SidebarMenuItems &&
                            SidebarMenuItems?.map((item, index) => (
                                <li key={index} className={item.path === "/" + splitLocation[1] ? "sidebar_active" : ""}>
                                    <Link to={item.path}>    {item.icon} <span>{item.name}</span></Link>
                                </li>
                               
                            ))}

                             <li className="log_out">
                                     {
                                         getUserInfoApi?.isLoading || getUserInfoApi?.isFetching ?
                                    <SkeletonEffect count={1}/> :
                                    getUserInfoApi.data !== undefined &&
                                    <div className="profile_link cursor-pointer">
                                        <img onClick={Profile}
                                            src={getUserInfoApi?.data?.profilePic ? "data:image/jpeg; base64," + getUserInfoApi?.data?.profilePic : default_user_icon}
                                            className='profile_img mobile_profile'/>
                                     
                                        <span onClick={Profile} className="flex-grow-1">   <h3 className={sidebar ? "d-none" : ""}>{getUserInfoApi?.data?.fullName || "name"}</h3>
                                        <h4 className={sidebar ? "d-none" : ""} title={getUserInfoApi?.data?.email}>{getUserInfoApi?.data?.email.slice(0,15) + "..." || "email"}</h4></span> <Logout_img onClick={(e)=>{LogOut(e)}} className="logout_icon me-0"/>
                                </div>
                                      } 
                                </li>
                       
                    </ul>
                </div>
            </section>
        </>
    );
};

export default Layout;
