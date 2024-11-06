import jsondata from "../../../locales/data/initialdata.json";
import ReactDOMServer from 'react-dom/server';
import {
    LoginSocialFacebook,
    LoginSocialLinkedin,
    LoginSocialPinterest,
} from "reactjs-social-login";
import {
    computeAndSocialAccountJSON,
    formatMessage,
    getFormattedLinkedinObject,
    getInitialLetterCap,
    getLinkedInUrnId,
    isNullOrEmpty,
} from "../../../utils/commonUtils";
import {
    commonConnectSocialAccountButtonStyle,
    DisconnectAccountWarning,
    Linkedin_URN_Id_Types,
} from "../../../utils/contantData";
import {
    FacebookLoginButton,
    LinkedInLoginButton,
} from "react-social-login-buttons";
import fb_img from "../../../images/fb.svg";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {showErrorToast} from "../../common/components/Toast";
import Swal from "sweetalert2";
import ConnectPagesModal from "../../modals/views/facebookModal/ConnectPagesModal";
import default_user_icon from "../../../images/default_user_icon.svg";
import {SocialAccountProvider} from "../../../utils/contantData";
import AccountAlreadyConnectedWarningModal from "./AccountAlreadyConnectedWarningModal";
import {
    SomethingWentWrong,
    enabledSocialMedia,
} from "../../../utils/contantData";
import crossIcon from "../../../images/cross_img.svg";
import {
    useConnectSocialAccountMutation,
    useDisconnectSocialAccountMutation,
    useGetAllFacebookPagesQuery,
    useGetAllInstagramBusinessAccountsQuery,
    useGetAllLinkedinPagesQuery,
    useGetAllPinterestBoardsQuery,
    useGetConnectedSocialAccountQuery,
} from "../../../app/apis/socialAccount";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {addyApi} from "../../../app/addyApi";

import FacebookImg from "../../../images/modal_facebook_image.svg?react";
import LinkedinImg from "../../../images/modal_linkedin_image.svg";
import InstagramImg from "../../../images/modal_instagram_image.svg";
import PinterestImg from "../../../images/modal_pintrest_image.svg";
import {useGetAllConnectedPagesQuery} from "../../../app/apis/pageAccessTokenApi";
import {getConnectedSocialMediaAccount} from "../../../utils/dataFormatterUtils";
import NotFoundPopup from "../../common/components/NotFoundPopup";
import InstagramGuidePopup from "../../common/components/InstagramGuidePopup";
import {Image} from "react-bootstrap";
import {Skeleton} from "antd";

const SocialAccounts = ({}) => {
    const dispatch = useDispatch();
    // const [checkForDisablePages, setCheckForDisablePages] = useState(true);

    const [currentConnectedFacebookPages, setCurrentConnectedFacebookPages] = useState(null);
    const [currentConnectedInstagramPages, setCurrentConnectedInstagramPages] = useState(null);
    const [currentConnectedPinterestPages, setCurrentConnectedPinterestPages] = useState(null);
    const [currentConnectedLinkedinPages, setCurrentConnectedLinkedinPages] = useState(null);
    const [accountAlreadyConnectedWarningModal, setAccountAlreadyConnectedWarningModal,] = useState({
        showModal: false,
        socialMediaType: null,
    });
    const [facebookDropDown, setFacebookDropDown] = useState(false);
    const [instagramDropDown, setInstagramDropDown] = useState(false);
    const [pinterestDropDown, setPinterestDropDown] = useState(false);
    const [linkedinDropDown, setLinkedinDropDown] = useState(false);

    const [showFacebookModal, setShowFacebookModal] = useState(false);
    const [showInstagramModal, setShowInstagramModal] = useState(false);
    const [showPinterestModal, setShowPinterestModal] = useState(false);
    const [showLinkedinModal, setShowLinkedinModal] = useState(false);

    const [showInstagramGuide, setShowInstagramGuide] = useState(false);
    const [showNoBusinessAccountModal, setShowNoBusinessAccountModal] = useState(false);
    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("");
    const connectedSocialAccount = getConnectedSocialMediaAccount(getConnectedSocialAccountApi?.data || []);

    const [connectSocialAccount, connectSocialAccountApi] = useConnectSocialAccountMutation();

    const [disconnectSocialAccount, disconnectSocialAccountApi] = useDisconnectSocialAccountMutation();
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("");

    const getAllFacebookPagesApi = useGetAllFacebookPagesQuery({
        providerId: connectedSocialAccount?.facebook?.providerId,
        accessToken: connectedSocialAccount?.facebook?.accessToken,
    }, {skip: !enabledSocialMedia?.isFacebookEnabled || isNullOrEmpty(connectedSocialAccount.facebook),});

    const getAllInstagramPagesApi = useGetAllInstagramBusinessAccountsQuery(connectedSocialAccount?.instagram?.accessToken, {skip: !enabledSocialMedia?.isInstagramEnabled || isNullOrEmpty(connectedSocialAccount.instagram),});

    const getAllPinterestPagesApi = useGetAllPinterestBoardsQuery(connectedSocialAccount?.pinterest?.id, {skip: !enabledSocialMedia?.isPinterestEnabled || isNullOrEmpty(connectedSocialAccount.pinterest),});

    const getAllLinkedinPagesApi = useGetAllLinkedinPagesQuery({
        q: "roleAssignee",
        role: "ADMINISTRATOR",
        state: "APPROVED",
    }, {skip: !enabledSocialMedia?.isLinkedinEnabled || isNullOrEmpty(connectedSocialAccount.linkedin),});

    useEffect(() => {
        if (enabledSocialMedia?.isLinkedinEnabled && getAllConnectedPagesApi?.data && Array.isArray(getAllConnectedPagesApi?.data) && !isNullOrEmpty(getAllLinkedinPagesApi?.data)) {
            const connectedLinkedinSocialAccount = getConnectedSocialAccountApi?.data?.filter((socialAccount) => socialAccount?.provider === "LINKEDIN")[0];
            const connectedLinkedinPages = getAllConnectedPagesApi?.data?.filter((pageData) => pageData?.socialMediaAccountId === connectedLinkedinSocialAccount?.id);
            const linkedinPages = getAllLinkedinPagesApi?.data?.results === null || getAllLinkedinPagesApi?.data?.results === undefined ? {} : getAllLinkedinPagesApi?.data?.results;
            const currentConnectedLinkedinPagesIds = Object.keys(linkedinPages)?.filter((LinkedinPageId) => connectedLinkedinPages?.some((linkedinPage) => linkedinPage?.pageId === getLinkedInUrnId(LinkedinPageId, Linkedin_URN_Id_Types.ORGANIZATION)));
            const currentConnectedLinkedinPages = currentConnectedLinkedinPagesIds?.map((pageId) => {
                return getFormattedLinkedinObject(pageId, linkedinPages[pageId]);
            });
            setCurrentConnectedLinkedinPages(currentConnectedLinkedinPages || null);
        }
    }, [getAllConnectedPagesApi?.data, getAllLinkedinPagesApi?.data]);

    useEffect(() => {
        if (enabledSocialMedia?.isPinterestEnabled && getAllConnectedPagesApi?.data && Array.isArray(getAllConnectedPagesApi?.data) && !isNullOrEmpty(getAllPinterestPagesApi?.data)) {
            const connectedPinterestSocialAccount = getConnectedSocialAccountApi?.data?.filter((socialAccount) => socialAccount?.provider === "PINTEREST")[0];
            const connectedPinterestBoards = getAllConnectedPagesApi?.data?.filter((pageData) => pageData?.socialMediaAccountId === connectedPinterestSocialAccount?.id);
            const currentConnectedPinterestBoards = getAllPinterestPagesApi?.data?.items?.filter((board) => connectedPinterestBoards?.some((pinBoard) => pinBoard?.pageId === board?.id));
            setCurrentConnectedPinterestPages(currentConnectedPinterestBoards || []);
        }
    }, [getAllConnectedPagesApi?.data, getAllPinterestPagesApi?.data]);

    useEffect(() => {
        if (enabledSocialMedia?.isInstagramEnabled && getAllConnectedPagesApi?.data && Array.isArray(getAllConnectedPagesApi?.data) && !isNullOrEmpty(getAllInstagramPagesApi?.data)) {
            const connectedInstagramSocialAccount = getConnectedSocialAccountApi?.data?.filter((socialAccount) => socialAccount?.provider === "INSTAGRAM")[0];
            const connectedInstagramPages = getAllConnectedPagesApi?.data?.filter((pageData) => pageData?.socialMediaAccountId === connectedInstagramSocialAccount?.id);
            const currentConnectedInstagramPages = getAllInstagramPagesApi?.data?.filter((page) => connectedInstagramPages?.some((instaPage) => instaPage?.pageId === page?.id));
            setCurrentConnectedInstagramPages(currentConnectedInstagramPages || []);
            // List of pages to remove from the database incase user has deactivated page but it will still be present in our db
            // const pagesToRemove = connectedInstagramPages?.filter(page =>
            //     !getAllInstagramPagesApi?.data?.some(fbPage => fbPage?.id === page?.pageId)
            // );
            // if (!isNullOrEmpty(pagesToRemove)) {
            //     checkForDisablePages && removeDisabledPages(pagesToRemove)
            // } else {
            //     setCheckForDisablePages(false);
            // }
        }
    }, [getAllConnectedPagesApi?.data, getAllInstagramPagesApi?.data]);

    useEffect(() => {
        if (enabledSocialMedia?.isFacebookEnabled && getAllConnectedPagesApi?.data && Array.isArray(getAllConnectedPagesApi?.data)) {
            const connectedFacebookSocialAccount = getConnectedSocialAccountApi?.data?.filter((socialAccount) => socialAccount?.provider === "FACEBOOK")[0];
            const connectedFacebookPages = getAllConnectedPagesApi?.data?.filter((pageData) => pageData?.socialMediaAccountId === connectedFacebookSocialAccount?.id);
            const currentConnectedFaceBookPages = getAllFacebookPagesApi?.data?.filter((page) => connectedFacebookPages?.some((fbPage) => fbPage?.pageId === page?.id));
            setCurrentConnectedFacebookPages(currentConnectedFaceBookPages || []);
            // List of pages to remove from the database incase user has deactivated page but it will still be present in our db

            // const pagesToRemove = connectedFacebookPages?.filter(page =>
            //     !facebookPageList?.some(fbPage => fbPage?.id === page?.pageId)
            // );
            // if (!isNullOrEmpty(pagesToRemove)) {
            //     checkForDisablePages && removeDisabledPages(pagesToRemove)
            // } else {
            //     setCheckForDisablePages(false);
            // }
        }
    }, [getAllConnectedPagesApi?.data, getAllFacebookPagesApi?.data]);

    const connectSocialMediaAccountToCustomer = (object, socialMediaType) => {
        object
            .then(async (res) => {
                // Check if socialAccountData has a value
                if (res?.socialAccountData?.name) {
                    await handleRTKQuery(
                        async () => {
                            return await connectSocialAccount(res.socialAccountData).unwrap();
                        },
                        () => {
                            dispatch(addyApi.util.invalidateTags(["getConnectedSocialAccountApi", "getSocialMediaPostsByCriteriaApi"]));
                        },
                        (response) => {
                            if (response.status === 409) {
                                setAccountAlreadyConnectedWarningModal({
                                    showModal: true,
                                    socialMediaType: socialMediaType,
                                });
                            }
                        }
                    );
                }
            })
            .catch((error) => {
                showErrorToast(error?.response?.data?.message || error?.message);
            });
    };

    const handleShowModal = (socialMediaType) => {
        switch (socialMediaType) {
            case SocialAccountProvider.FACEBOOK: {
                isNullOrEmpty(getAllFacebookPagesApi?.data) ? setShowNoBusinessAccountModal(true) : setShowFacebookModal(true)
                break;
            }
            case SocialAccountProvider.INSTAGRAM: {
                isNullOrEmpty(getAllInstagramPagesApi?.data) ? setShowNoBusinessAccountModal(true) : setShowInstagramModal(true)
                break;
            }
            case SocialAccountProvider.LINKEDIN: {
                isNullOrEmpty(getAllLinkedinPagesApi?.data)  ? setShowNoBusinessAccountModal(true) : setShowLinkedinModal(true)
                break;
            }
            case SocialAccountProvider.PINTEREST: {
                (isNullOrEmpty(getAllPinterestPagesApi?.data) || isNullOrEmpty(getAllPinterestPagesApi?.data?.items)) ? setShowNoBusinessAccountModal(true) : setShowPinterestModal(true)
                break;
            }
        }
    }

    // const removeDisabledPages = (disabledPages, x) => {
    //     const updatedData = disabledPages?.map(page => {
    //         return {
    //             pageId: page.pageId,
    //             name: page.name,
    //             imageUrl: page.imageUrl,
    //             access_token: page.access_token,
    //             socialMediaAccountId: page.socialMediaAccountId
    //         }
    //     })
    //     const requestBody = {
    //         token: token,
    //         pagesToDisconnect: updatedData
    //     }
    //     // dispatch(disconnectDisabledPages(requestBody)).then(res => {
    //     //     setCheckForDisablePages(false)
    //     // })
    //
    // }

    const disConnectSocialMediaAccountToCustomer = (socialMediaType) => {
        const socialMediaImg = getInitialLetterCap(
            SocialAccountProvider[socialMediaType]
        );
        let imageUrl;
        if (socialMediaImg === "Linkedin") {
            imageUrl = ReactDOMServer.renderToStaticMarkup(<LinkedinImg />);
        }
        if (socialMediaImg === "Facebook") {
            imageUrl = ReactDOMServer.renderToStaticMarkup(<FacebookImg />);
        }
        if (socialMediaImg === "Instagram") {
            imageUrl = ReactDOMServer.renderToStaticMarkup(<InstagramImg />);
        }
        if (socialMediaImg === "Pinterest") {
            imageUrl = ReactDOMServer.renderToStaticMarkup(<PinterestImg />);
        }
        Swal.fire({
            // imageUrl: success_img,
            // imageUrl:addyLogo,
            html: `
               <div class="swal_content">
                <div class="swal_images">
                ${imageUrl}
                </div>
                <h2 class="disconnect_title">Disconnect ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} Account</h2>
                <p class="disconnect_paragraph">${formatMessage(DisconnectAccountWarning, [getInitialLetterCap(SocialAccountProvider[socialMediaType])])}</p>
                </div>
              `,
            // title: `Disconnect ${getInitialLetterCap(SocialAccountProvider[socialMediaType])} Account`,
            // text: formatMessage(DisconnectAccountWarning,[getInitialLetterCap(SocialAccountProvider[socialMediaType])]),
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#F07C33",
            reverseButtons: true,
            cancelButtonColor: "#E6E9EC",
            customClass: {
                confirmButton: "YesButton",
                container: "custom_swaldisconnect_container",
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (socialMediaType === "INSTAGRAM") {
                    currentConnectedFacebookPages?.length === 0 ? setFacebookDropDown(true) : setFacebookDropDown(false);
                    setCurrentConnectedInstagramPages([]);
                }
                if (socialMediaType === "FACEBOOK") {
                    currentConnectedInstagramPages?.length === 0 ? setInstagramDropDown(true) : setInstagramDropDown(false);
                    setCurrentConnectedFacebookPages([]);
                }
                if (socialMediaType === "PINTEREST") {
                    currentConnectedPinterestPages?.length === 0 ? setPinterestDropDown(true) : setPinterestDropDown(false);
                    setCurrentConnectedPinterestPages([]);
                }
                if (socialMediaType === "LINKEDIN") {
                    currentConnectedLinkedinPages?.length === 0 ? setLinkedinDropDown(true) : setLinkedinDropDown(false);
                    setCurrentConnectedLinkedinPages([]);
                }
                await handleRTKQuery(
                    async () => {
                        const socialMediaAccountId = getConnectedSocialAccountApi?.data?.find((c) => c.provider === socialMediaType)?.id;
                        return await disconnectSocialAccount(socialMediaAccountId).unwrap();
                    },
                    () => {
                        dispatch(addyApi.util.invalidateTags(["getConnectedSocialAccountApi", "getSocialMediaPostsByCriteriaApi"]));
                    },
                    () => {
                        Swal.fire({
                            imageUrl: crossIcon,
                            title: "Error",
                            confirmButtonColor: "#F07C33",
                            text: `An error occurred while disconnecting your ${getInitialLetterCap(SocialAccountProvider[socialMediaType])}  account. Please try again later.`,
                            customClass: {confirmButton: "confirmButton",},
                        });
                    }
                );
            }
        });
    };


    return (
        <div className="col-lg-5 col-xl-4 col-sm-12  pe-0">
            {/* social media */}
            <div className="cmn_background social_media_wrapper">
                <div className="social_media_account">
                    <h3>{jsondata.socialAccount}</h3>
                </div>
                {/*facebook connect starts */}
                {
                    enabledSocialMedia?.isFacebookEnabled && (
                        <>
                            {
                                (getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching ) ?
                                    <SkeletonEffect count={1} className={"mt-2"}/>
                                    : getConnectedSocialAccountApi?.data?.filter((c) => c?.provider === "FACEBOOK")?.length === 0 ?
                                        <div className="social_media_outer">
                                            <div className="social_media_content">
                                                <i
                                                    className={`fa-brands fa-facebook`}
                                                    style={{color: "#0866ff", fontSize: "24px"}}
                                                />
                                            
                                                <div>
                                                    <h5 className="">Facebook account</h5>
                                                    <h6 className="cmn_headings">www.facebook.com</h6>
                                                </div>
                                            </div>

                                            <LoginSocialFacebook
                                                isDisabled={connectSocialAccountApi?.isLoading || connectSocialAccountApi?.isFetching || getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching}
                                                appId={`${import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID}`}
                                                redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                                onResolve={(response) => {
                                                    setFacebookDropDown(true);
                                                    setInstagramDropDown(false);
                                                    setPinterestDropDown(false);
                                                    setLinkedinDropDown(false);
                                                    connectSocialMediaAccountToCustomer(computeAndSocialAccountJSON(response, SocialAccountProvider.FACEBOOK, setShowNoBusinessAccountModal), SocialAccountProvider.FACEBOOK);
                                                }}
                                                scope={`${import.meta.env.VITE_APP_FACEBOOK_SCOPE}`}
                                                onReject={(error) => {
                                                }}
                                            >
                                                <FacebookLoginButton
                                                    text={"Connect"}
                                                    className={"facebook_connect"}
                                                    icon={() => null}
                                                    preventActiveStyles={true}
                                                    style={commonConnectSocialAccountButtonStyle}
                                                />
                                            </LoginSocialFacebook>
                                        </div>
                                        :
                                        <div className=" cmn_drop_down dropdown">
                                            <div className="dropdown_header">
                                                <div className="social_media_outer cursor-pointer">
                                                    <div
                                                        className="social_media_content"
                                                        onClick={() => setFacebookDropDown(!facebookDropDown)}
                                                    >
                                                        <div className={"social_media_icon"}>
                                                            <Image className="cmn_width" src={fb_img} alt="fb_image"/>

                                                            <h2 className={`pagecount ${currentConnectedFacebookPages?.length === undefined ? "blink" : ""}`}>
                                                                {
                                                                    (currentConnectedFacebookPages !== null && currentConnectedFacebookPages !== undefined) ? currentConnectedFacebookPages?.length : 0
                                                                }
                                                            </h2>
                                                        </div>

                                                        <div className="text-start flex-grow-1">
                                                            <h5 className="userName">
                                                                {
                                                                    (getConnectedSocialAccountApi?.data && getConnectedSocialAccountApi?.data?.find((c) => c?.provider === "FACEBOOK")?.name) || "facebook"
                                                                }
                                                            </h5>
                                                            <h4 className="connect_text">Connected</h4>
                                                        </div>
                                                        <div className={facebookDropDown ? "upside-down" : ""}>
                                                            <svg
                                                                width="14"
                                                                height="8"
                                                                viewBox="0 0 14 8"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    id="Icon"
                                                                    d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                                    stroke="#5F6D7E"
                                                                    strokeWidth="1.67"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {
                                                    facebookDropDown === true &&
                                                    <ul className="menu_items">
                                                        {
                                                            (getAllFacebookPagesApi?.isLoading || getAllFacebookPagesApi?.isFetching) ?
                                                                <SkeletonEffect count={3} className={"mt-2"}/>
                                                                : currentConnectedFacebookPages?.length === 0 ?
                                                                    <div className={"no-page-connected-outer text-center"}>
                                                                        <div>No active connections at the moment.</div>
                                                                    </div>
                                                                    :
                                                                    <>
                                                                        {
                                                                            currentConnectedFacebookPages?.map((data, index) => {
                                                                                return (
                                                                                    <li key={index}>
                                                                                        <div
                                                                                            className="user_profileInfo_wrapper">
                                                                                            <div className="user_Details">
                                                                                                <Image
                                                                                                    src={
                                                                                                        data?.picture?.data?.url ||
                                                                                                        default_user_icon
                                                                                                    }
                                                                                                    height="30px"
                                                                                                    width="30px"
                                                                                                    alt="profile picture addy"
                                                                                                />
                                                                                                <h4 className="cmn_text_style">
                                                                                                    {data.name}
                                                                                                </h4>
                                                                                            </div>
                                                                                            <h4 className={"connect_text"}>Connected</h4>
                                                                                        </div>
                                                                                    </li>
                                                                                );
                                                                            })
                                                                        }


                                                                    </>
                                                        }
                                                        <li>
                                                            {
                                                                getAllFacebookPagesApi?.data && Array.isArray(getAllFacebookPagesApi?.data) &&
                                                                <div className="connectDisconnect_btn_outer">
                                                                    <button
                                                                        className="DisConnectBtn cmn_connect_btn"
                                                                        onClick={() => disConnectSocialMediaAccountToCustomer("FACEBOOK")}
                                                                    >
                                                                        Disconnect
                                                                    </button>
                                                                    <button
                                                                        className="ConnectBtn cmn_connect_btn"
                                                                        onClick={() => {
                                                                            handleShowModal(SocialAccountProvider.FACEBOOK)
                                                                        }}>
                                                                        {
                                                                            currentConnectedFacebookPages?.length === 0 ? "Connect Now" : "Manage Pages"
                                                                        }

                                                                    </button>
                                                                </div>

                                                            }
                                                        </li>
                                                    </ul>
                                                }
                                            </div>
                                        </div>
                            }
                        </>
                    )}
                {/*facebook connect ends */}

                {/* start instagram connect */}
                {
                    enabledSocialMedia?.isInstagramEnabled && (
                        <>
                            {
                                (getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching  ) ?
                                    <SkeletonEffect count={1} className={"mt-2"}/>
                                    : getConnectedSocialAccountApi?.data?.filter((c) => c.provider === "INSTAGRAM").length === 0 ?
                                        <div className="social_media_outer">
                                            <div className="social_media_content">
                                            <img src="/assets/instagram_logo.svg" alt="instagram logo"  />

                                                <div>
                                                    <h5 className=""> Instagram account</h5>
                                                    <h6 className="cmn_headings">www.instagram.com</h6>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setShowInstagramGuide(true);
                                                }}
                                                className="facebook_connect connect_buttoon"
                                            >
                                                Connect
                                            </button>
                                        </div>
                                        :
                                        <div className=" cmn_drop_down dropdown">
                                            <div className="dropdown_header">
                                                <div className="social_media_outer cursor-pointer">
                                                    <div
                                                        className="social_media_content"
                                                        onClick={() => setInstagramDropDown(!instagramDropDown)}
                                                    >
                                                       <img src="/assets/instagram_logo.svg" alt="instagram logo"  />
                                                        <h2
                                                            className={`pagecount ${currentConnectedInstagramPages?.length === undefined ? "blink" : ""}`}
                                                        >
                                                            {
                                                                currentConnectedInstagramPages !== null && currentConnectedInstagramPages !== undefined ? currentConnectedInstagramPages?.length : 0
                                                            }
                                                        </h2>

                                                        {/*<Image className="cmn_width " src={fb_img}/>*/}
                                                        <div className="text-start flex-grow-1">
                                                            <h5 className="userName">
                                                                {
                                                                    (getConnectedSocialAccountApi.data && getConnectedSocialAccountApi.data.find((c) => c.provider === "INSTAGRAM")?.name) || "instagram"
                                                                }
                                                            </h5>
                                                            <h4 className="connect_text">Connected</h4>
                                                        </div>
                                                        <div className={instagramDropDown ? "upside-down" : ""}>
                                                            <svg
                                                                width="14"
                                                                height="8"
                                                                viewBox="0 0 14 8"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    id="Icon"
                                                                    d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                                    stroke="#5F6D7E"
                                                                    strokeWidth="1.67"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {
                                                    instagramDropDown === true &&
                                                    <ul className="menu_items">
                                                        {
                                                            (getAllInstagramPagesApi?.isLoading || getAllInstagramPagesApi?.isFetching) ?
                                                                <SkeletonEffect count={3} className={"mt-2"}/>
                                                                : currentConnectedInstagramPages?.length === 0 ?
                                                                    <div className={"no-page-connected-outer text-center"}>
                                                                        <div>No active connections at the moment.</div>
                                                                    </div>
                                                                    :
                                                                    <>
                                                                        {currentConnectedInstagramPages?.map(
                                                                            (data, index) => {
                                                                                return (
                                                                                    <li key={index}>
                                                                                        <div
                                                                                            className="user_profileInfo_wrapper">
                                                                                            <div className="user_Details">
                                                                                                <Image
                                                                                                    src={
                                                                                                        data.profile_picture_url ||
                                                                                                        default_user_icon
                                                                                                    }
                                                                                                    height="30px"
                                                                                                    width="30px"
                                                                                                    alt="profile picture"
                                                                                                />
                                                                                                <h4 className="cmn_text_style">
                                                                                                    {data.name}
                                                                                                </h4>
                                                                                            </div>
                                                                                            <h4 className={"connect_text"}>
                                                                                                Connected
                                                                                            </h4>
                                                                                        </div>
                                                                                    </li>
                                                                                );
                                                                            }
                                                                        )}

                                                                    </>
                                                        }
                                                        <li>
                                                            {getAllInstagramPagesApi?.data &&
                                                                Array.isArray(getAllInstagramPagesApi?.data) && (
                                                                    <div
                                                                        className="connectDisconnect_btn_outer">
                                                                        <button
                                                                            className="DisConnectBtn cmn_connect_btn"
                                                                            onClick={() =>
                                                                                disConnectSocialMediaAccountToCustomer(
                                                                                    "INSTAGRAM"
                                                                                )
                                                                            }
                                                                        >
                                                                            Disconnect
                                                                        </button>
                                                                        <button
                                                                            className="ConnectBtn cmn_connect_btn"
                                                                            onClick={() => {
                                                                                handleShowModal(SocialAccountProvider.INSTAGRAM)
                                                                            }}
                                                                        >
                                                                            {
                                                                                currentConnectedInstagramPages?.length === 0 ? "Connect Now" : "Manage Pages"
                                                                            }

                                                                        </button>
                                                                    </div>
                                                                )}
                                                        </li>
                                                    </ul>
                                                }
                                            </div>
                                        </div>
                            }
                        </>
                    )}
                {/* end instagram connect */}

                {/* start linkedin connect */}

                {
                    enabledSocialMedia?.isLinkedinEnabled && (
                        <>
                            {
                                (getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching) ?
                                    <SkeletonEffect count={1} className={"mt-2"}/>
                                    : getConnectedSocialAccountApi?.data?.filter((c) => c.provider === "LINKEDIN").length === 0 ?
                                        <div className="social_media_outer">
                                            <div className="social_media_content">
                                            <img src="/assets/linkedin_logo.svg" alt="instagram logo"  />

                                                <div>
                                                    <h5 className=""> Linkedin account</h5>
                                                    <h6 className="cmn_headings">in.linkedin.com</h6>
                                                </div>
                                            </div>

                                            <LoginSocialLinkedin
                                                isDisabled={connectSocialAccountApi?.isLoading || connectSocialAccountApi?.isFetching || getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching}
                                                redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                                client_id={`${import.meta.env.VITE_APP_LINKEDIN_CLIENT_ID}`}
                                                client_secret={`${import.meta.env.VITE_APP_LINKEDIN_CLIENT_SECRET}`}
                                                scope={`${import.meta.env.VITE_APP_LINKEDIN_SCOPE}`}
                                                onResolve={(response) => {
                                                    setLinkedinDropDown(true);
                                                    setInstagramDropDown(false);
                                                    setPinterestDropDown(false);
                                                    setFacebookDropDown(false);
                                                    connectSocialMediaAccountToCustomer(computeAndSocialAccountJSON(response, SocialAccountProvider.LINKEDIN, setShowNoBusinessAccountModal), SocialAccountProvider.LINKEDIN);
                                                }}
                                                onReject={(error) => {
                                                    showErrorToast(SomethingWentWrong);
                                                }}
                                            >
                                                <LinkedInLoginButton
                                                    text={"Connect"}
                                                    className={"facebook_connect"}
                                                    icon={() => null}
                                                    preventActiveStyles={true}
                                                    style={commonConnectSocialAccountButtonStyle}
                                                />
                                            </LoginSocialLinkedin>
                                        </div>
                                        :
                                        <div className=" cmn_drop_down dropdown">
                                            <div className="dropdown_header">
                                                <div className="social_media_outer cursor-pointer">
                                                    <div
                                                        className="social_media_content"
                                                        onClick={() => setLinkedinDropDown(!linkedinDropDown)}
                                                    >
                                                                                                   <img src="/assets/linkedin_logo.svg" alt="instagram logo"  />

                                                        <h2 className={`pagecount ${currentConnectedLinkedinPages?.length === undefined ? "blink" : ""}`}>
                                                            {
                                                                currentConnectedLinkedinPages !== null ? currentConnectedLinkedinPages?.length : 0
                                                            }
                                                        </h2>

                                                        <div className="text-start flex-grow-1">
                                                            <h5 className="userName">
                                                                {
                                                                    (getConnectedSocialAccountApi.data && getConnectedSocialAccountApi.data.find((c) => c.provider === "LINKEDIN")?.name) || "linkedin"
                                                                }
                                                            </h5>
                                                            <h4 className="connect_text">Connected</h4>
                                                        </div>


                                                        <div className={linkedinDropDown ? "upside-down" : ""}>
                                                            <svg
                                                                width="14"
                                                                height="8"
                                                                viewBox="0 0 14 8"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    id="Icon"
                                                                    d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                                    stroke="#5F6D7E"
                                                                    strokeWidth="1.67"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {
                                                    linkedinDropDown &&
                                                    <ul className="menu_items">
                                                        {
                                                            (getAllLinkedinPagesApi?.isLoading || getAllLinkedinPagesApi?.isFetching) ?
                                                                <SkeletonEffect count={3} className={"mt-2"}/>
                                                                : currentConnectedLinkedinPages?.length === 0 ?
                                                                    <div className={"no-page-connected-outer text-center"}>
                                                                        <div>No active connections at the moment.</div>
                                                                    </div>
                                                                    :
                                                                    <>
                                                                        {
                                                                            currentConnectedLinkedinPages?.map((data, index) => {
                                                                                return (
                                                                                    <li key={index}>
                                                                                        <div
                                                                                            className="user_profileInfo_wrapper">
                                                                                            <div className="user_Details">
                                                                                                <Image
                                                                                                    src={data?.logo_url || default_user_icon}
                                                                                                    height="30px"
                                                                                                    width="30px"
                                                                                                    alt="profile pricture"
                                                                                                />
                                                                                                <h4 className="cmn_text_style">
                                                                                                    {data?.name}
                                                                                                </h4>
                                                                                            </div>
                                                                                            <h4 className={"connect_text"}>Connected</h4>
                                                                                        </div>
                                                                                    </li>
                                                                                );
                                                                            })
                                                                        }

                                                                    </>
                                                        }
                                                        <li>
                                                            {
                                                                getAllLinkedinPagesApi?.data && getAllLinkedinPagesApi?.data?.results && Object.keys(getAllLinkedinPagesApi?.data?.results)?.length > 0 &&
                                                                <div className="connectDisconnect_btn_outer">
                                                                    <button
                                                                        className="DisConnectBtn cmn_connect_btn"
                                                                        onClick={() => disConnectSocialMediaAccountToCustomer("LINKEDIN")}
                                                                    >
                                                                        Disconnect
                                                                    </button>
                                                                    <button
                                                                        className="ConnectBtn cmn_connect_btn"
                                                                        onClick={() => {
                                                                            handleShowModal(SocialAccountProvider.LINKEDIN)
                                                                        }}>
                                                                        {
                                                                            currentConnectedLinkedinPages?.length === 0 ? "Connect Now" : "Manage Pages"
                                                                        }

                                                                    </button>
                                                                </div>
                                                            }
                                                        </li>
                                                    </ul>
                                                }
                                            </div>
                                        </div>
                            }
                        </>
                    )}
                {/* end linkedin connect */}

                {/* start Pinterest connect */}
                {
                    enabledSocialMedia?.isPinterestEnabled && (
                        <>
                            {
                                getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching ?
                                    <SkeletonEffect count={1} className={"mt-2"}/>
                                    : getConnectedSocialAccountApi?.data?.filter((c) => c.provider === "PINTEREST").length === 0 ?
                                        <div className="social_media_outer">
                                            <div className="social_media_content">
                                                <i
                                                    className="fa-brands fa-pinterest"
                                                    style={{color: "#e60023", fontSize: "24px"}}
                                                />
                                                <div>
                                                    <h5 className=""> Pinterest account</h5>
                                                    <h6 className="cmn_headings">www.pinterest.com</h6>
                                                </div>
                                            </div>

                                            <LoginSocialPinterest
                                                isDisabled={connectSocialAccountApi?.isLoading || connectSocialAccountApi?.isFetching || getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching}
                                                client_id={`${import.meta.env.VITE_APP_PINTEREST_CLIENT_ID}`}
                                                client_secret={`${import.meta.env.VITE_APP_PINTEREST_CLIENT_SECRET}`}
                                                scope={`${import.meta.env.VITE_APP_PINTEREST_SCOPE}`}
                                                redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                                onResolve={(response) => {
                                                    setPinterestDropDown(true);
                                                    setInstagramDropDown(false);
                                                    setFacebookDropDown(false);
                                                    connectSocialMediaAccountToCustomer(computeAndSocialAccountJSON(response, SocialAccountProvider.PINTEREST, setShowNoBusinessAccountModal), SocialAccountProvider.PINTEREST);
                                                }}
                                                onReject={(error) => {
                                                }}
                                            >
                                                <FacebookLoginButton
                                                    text={"Connect"}
                                                    className={"facebook_connect"}
                                                    icon={() => null}
                                                    preventActiveStyles={true}
                                                    style={commonConnectSocialAccountButtonStyle}
                                                />
                                            </LoginSocialPinterest>
                                        </div>
                                        :
                                        <div className=" cmn_drop_down dropdown">
                                            <div className="dropdown_header">
                                                <div className="social_media_outer cursor-pointer">
                                                    <div
                                                        className="social_media_content"
                                                        onClick={() => setPinterestDropDown(!pinterestDropDown)}
                                                    >
                                                        <i className="fa-brands fa-pinterest pinterest-icon"/>
                                                        <h2 className={`pagecount ${currentConnectedPinterestPages?.length === undefined ? "blink" : ""}`}>
                                                            {
                                                                currentConnectedPinterestPages !== null ? currentConnectedPinterestPages?.length : 0
                                                            }
                                                        </h2>
                                                        <div className="text-start flex-grow-1">
                                                            <h5 className="userName">
                                                                {
                                                                    (getConnectedSocialAccountApi.data && getConnectedSocialAccountApi.data.find((c) => c.provider === "PINTEREST")?.name) || "pinterest"
                                                                }
                                                            </h5>
                                                            <h4 className="connect_text">Connected</h4>
                                                        </div>
                                                        <div className={pinterestDropDown ? "upside-down" : ""}>
                                                            <svg
                                                                width="14"
                                                                height="8"
                                                                viewBox="0 0 14 8"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    id="Icon"
                                                                    d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                                    stroke="#5F6D7E"
                                                                    strokeWidth="1.67"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {
                                                    pinterestDropDown === true &&
                                                    <ul className="menu_items">
                                                        {
                                                            (getAllPinterestPagesApi?.isLoading || getAllPinterestPagesApi?.isFetching) ?
                                                                <SkeletonEffect count={3} className={"mt-2"}/>
                                                                : currentConnectedPinterestPages?.length === 0 ?
                                                                    <div className={"no-page-connected-outer text-center"}>
                                                                        <div>No active connections at the moment.</div>
                                                                    </div>
                                                                    :
                                                                    <>
                                                                        {
                                                                            currentConnectedPinterestPages?.map(
                                                                                (data, index) => {
                                                                                    return (
                                                                                        <li key={index}>
                                                                                            <div
                                                                                                className="user_profileInfo_wrapper">
                                                                                                <div
                                                                                                    className="user_Details">
                                                                                                    <Image
                                                                                                        src={data.media?.image_cover_url || default_user_icon}
                                                                                                        height="30px"
                                                                                                        width="30px"
                                                                                                        alt="profile picture"
                                                                                                    />
                                                                                                    <h4 className="cmn_text_style">
                                                                                                        {data.name}
                                                                                                    </h4>
                                                                                                </div>
                                                                                                <h4 className={"connect_text"}>
                                                                                                    Connected
                                                                                                </h4>
                                                                                            </div>
                                                                                        </li>
                                                                                    );
                                                                                })
                                                                        }

                                                                    </>
                                                        }
                                                        <li>
                                                            {
                                                                getAllPinterestPagesApi?.data && getAllPinterestPagesApi?.data?.items && Array.isArray(getAllPinterestPagesApi?.data?.items) &&
                                                                <div className="connectDisconnect_btn_outer">
                                                                    <button
                                                                        className="DisConnectBtn cmn_connect_btn"
                                                                        onClick={() => disConnectSocialMediaAccountToCustomer("PINTEREST")}
                                                                    >
                                                                        Disconnect
                                                                    </button>
                                                                    <button
                                                                        className="ConnectBtn cmn_connect_btn"
                                                                        onClick={() => {
                                                                            handleShowModal(SocialAccountProvider.PINTEREST)
                                                                        }}>
                                                                        {
                                                                            currentConnectedPinterestPages?.length === 0 ? "Connect Now":"Manage Pages"
                                                                        }

                                                                    </button>
                                                                </div>
                                                            }
                                                        </li>
                                                    </ul>
                                                }
                                            </div>
                                        </div>
                            }
                        </>
                    )}
                {/* end pinterest connect */}
            </div>
            {
                enabledSocialMedia?.isFacebookEnabled && showFacebookModal &&
                <ConnectPagesModal
                    showModal={showFacebookModal}
                    setShowModal={setShowFacebookModal}
                    allPagesList={getAllFacebookPagesApi?.data || []}
                    connectedPagesList={getAllConnectedPagesApi?.data}
                    noPageFoundMessage={"No Page Found, Please connect another account."}
                    socialMediaType={SocialAccountProvider.FACEBOOK}
                    socialMediaAccountInfo={getConnectedSocialAccountApi?.data?.filter((account) => account.provider === "FACEBOOK")[0]}
                />

            }
            {
                enabledSocialMedia?.isInstagramEnabled && showInstagramModal &&
                <ConnectPagesModal
                    showModal={showInstagramModal}
                    setShowModal={setShowInstagramModal}
                    allPagesList={getAllInstagramPagesApi?.data || []}
                    connectedPagesList={getAllConnectedPagesApi?.data}
                    noPageFoundMessage={"No Page Found, Please connect another account."}
                    socialMediaType={SocialAccountProvider.INSTAGRAM}
                    socialMediaAccountInfo={getConnectedSocialAccountApi?.data?.filter((account) => account.provider === "INSTAGRAM")[0]}
                />
            }
            {
                enabledSocialMedia?.isPinterestEnabled && showPinterestModal &&
                <ConnectPagesModal
                    showModal={showPinterestModal}
                    setShowModal={setShowPinterestModal}
                    allPagesList={getAllPinterestPagesApi?.data?.items || []}
                    connectedPagesList={getAllConnectedPagesApi?.data}
                    noPageFoundMessage={"No Board Found!"}
                    socialMediaType={SocialAccountProvider.PINTEREST}
                    socialMediaAccountInfo={getConnectedSocialAccountApi?.data?.filter((account) => account.provider === "PINTEREST")[0]}
                />
            }
            {
                enabledSocialMedia?.isLinkedinEnabled && showLinkedinModal &&
                <ConnectPagesModal
                    showModal={showLinkedinModal}
                    setShowModal={setShowLinkedinModal}
                    allPagesList={Object.keys(getAllLinkedinPagesApi?.data?.results || {})?.map((key) => {
                        return getFormattedLinkedinObject(key, getAllLinkedinPagesApi?.data?.results[key]);
                    })}
                    connectedPagesList={getAllConnectedPagesApi?.data}
                    noPageFoundMessage={"No Page Found, Please connect another account."}
                    socialMediaType={SocialAccountProvider.LINKEDIN}
                    socialMediaAccountInfo={getConnectedSocialAccountApi?.data?.filter((account) => account.provider === "LINKEDIN")[0]}
                />
            }

            {
                accountAlreadyConnectedWarningModal?.showModal &&
                <AccountAlreadyConnectedWarningModal
                    accountAlreadyConnectedWarningModal={accountAlreadyConnectedWarningModal}
                    setAccountAlreadyConnectedWarningModal={setAccountAlreadyConnectedWarningModal}
                />

            }
            {
                showInstagramGuide &&
                <InstagramGuidePopup
                    setFacebookDropDown={setFacebookDropDown}
                    connectSocialMediaAccountToCustomer={connectSocialMediaAccountToCustomer}
                    setInstagramDropDown={setInstagramDropDown}
                    setPinterestDropDown={setPinterestDropDown}
                    setLinkedinDropDown={setLinkedinDropDown}
                    connectSocialAccountApi={connectSocialAccountApi}
                    show={showInstagramGuide}
                    setShow={setShowInstagramGuide}
                />
            }
            {
                showNoBusinessAccountModal &&
                <NotFoundPopup
                    show={showNoBusinessAccountModal}
                    setShow={setShowNoBusinessAccountModal}
                />
            }
        </div>
    );
};
export default SocialAccounts;
