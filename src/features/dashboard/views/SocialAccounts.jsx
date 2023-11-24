import jsondata from "../../../locales/data/initialdata.json";
import {LoginSocialFacebook, LoginSocialInstagram} from "reactjs-social-login";
import {computeAndSocialAccountJSONForFacebook, isNullOrEmpty} from "../../../utils/commonUtils";
import {FacebookLoginButton, InstagramLoginButton} from "react-social-login-buttons";
import fb_img from "../../../images/fb.svg";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    disconnectSocialAccountAction,
    getAllConnectedSocialAccountAction, getAllInstagramBusinessAccounts,
    socialAccountConnectActions
} from "../../../app/actions/socialAccountActions/socialAccountActions";
import {getAllSocialMediaPostsByCriteria} from "../../../app/actions/postActions/postActions";
import {showErrorToast} from "../../common/components/Toast";
import Swal from "sweetalert2";
import {decodeJwtToken, getToken} from "../../../app/auth/auth";
import FacebookModal from "../../modals/views/facebookModal/FacebookModal";
import {getAllFacebookPages, getFacebookConnectedPages} from "../../../app/actions/facebookActions/facebookActions";
import {Link} from "react-router-dom";
import {NoInstagramBusinessAccountFound, SocialAccountProvider} from "../../../utils/contantData";
import {getAllFacebookConnectedSocialMediaAccounts} from "../../../services/facebookService";

const SocialAccounts = () => {
    const dispatch = useDispatch();
    const token = getToken();
    const [currentConnectedFacebookPages, setCurrentConnectedFacebookPages] = useState([]);
    const [facebookDropDown, setFacebookDropDown] = useState(false);
    const [instagramDropDown, setInstagramDropDown] = useState(false);
    const [showFacebookModal, setShowFacebookModal] = useState(false);
    const [showInstagramModal, setShowInstagramModal] = useState(false);

    const facebookPageLoading = useSelector(state => state.facebook.getFacebookPageReducer.loading);
    const facebookConnectedPages = useSelector(state => state.facebook.getFacebookConnectedPagesReducer.facebookConnectedPages);
    const facebookPageList = useSelector(state => state.facebook.getFacebookPageReducer.facebookPageList);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const socialAccountConnectData = useSelector(state => state.socialAccount.connectSocialAccountReducer);
    const instagramBusinessAccountsData = useSelector(state => state.socialAccount.getAllInstagramBusinessAccountsReducer);
    useEffect(() => {
        if (facebookConnectedPages && Array.isArray(facebookConnectedPages)) {
            const newIds = facebookConnectedPages.map(c => c.id);
            const objectsToAdd = facebookConnectedPages.filter(obj => !currentConnectedFacebookPages.some(existingObj => existingObj.id === obj.id));
            const objectsToRemove = currentConnectedFacebookPages.filter(obj => !newIds.includes(obj.id));
            const updatedConnectedPages = [...currentConnectedFacebookPages, ...objectsToAdd].filter(obj => !objectsToRemove.some(remObj => remObj.id === obj.id));
            setCurrentConnectedFacebookPages(updatedConnectedPages);
        }
    }, [facebookConnectedPages]);

    useEffect(() => {
        if (token) {
            const decodeJwt = decodeJwtToken(token);
            dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt.customerId, token: token}))
        }
    }, [token])

    useEffect(() => {
        if ((!getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length > 0) && getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'FACEBOOK') !== undefined) {
            let faceBookSocialAccount = getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'FACEBOOK');
            dispatch(getAllFacebookPages({
                providerId: faceBookSocialAccount?.providerId,
                accessToken: faceBookSocialAccount?.accessToken
            })).then((res) => {
                const decodeJwt = decodeJwtToken(token);
                dispatch(getFacebookConnectedPages({customerId: decodeJwt?.customerId, token: token}))
            })
        }
        if (!getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'INSTAGRAM').length > 0) {
            let instagramSocialAccount = getAllConnectedSocialAccountData?.data?.find(c => c.provider === 'INSTAGRAM');
            dispatch(getAllInstagramBusinessAccounts({
                accessToken: instagramSocialAccount?.accessToken
            }))
        }

    }, [getAllConnectedSocialAccountData]);

    const connectSocialMediaAccountToCustomer = (object) => {
        object.then((res) => {
            dispatch(socialAccountConnectActions(res)).then(() => {
                dispatch(getAllConnectedSocialAccountAction(res))
                dispatch(getAllSocialMediaPostsByCriteria({
                    token: token,
                    query: {limit: 5, postStatus: ["SCHEDULED"]}
                }));
            })
        }).catch((error) => {
            showErrorToast(error.response.data.message);
        })
    }


    const disConnectSocialMediaAccountToCustomer = (socialMediaType) => {
        Swal.fire({
            icon: 'warning',
            title: 'Disconnect Facebook Account',
            text: 'Are you sure you want to disconnect your Facebook account?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            confirmButtonColor: "#F07C33",
            cancelButtonColor: "#E6E9EC",
        }).then((result) => {
            if (result.isConfirmed) {
                const decodeJwt = decodeJwtToken(token);
                dispatch(disconnectSocialAccountAction({
                    customerId: decodeJwt?.customerId,
                    socialMediaAccountId: getAllConnectedSocialAccountData?.data?.find(c => c.provider === socialMediaType)?.id,
                    token: token
                })).then((response) => {
                    dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt?.customerId, token: token}));
                    dispatch(getAllSocialMediaPostsByCriteria({
                        token: token,
                        query: {limit: 5, postStatus: ["SCHEDULED"]}
                    }));
                    Swal.fire({
                        icon: 'success',
                        title: 'Facebook Account Disconnected',
                        text: 'Your Facebook account has been disconnected successfully.',
                        showConfirmButton: true,
                        showCancelButton: false,
                        confirmButtonColor: '#F07C33',
                    });
                }).catch((error) => {
                    console.error('Error disconnecting Facebook account:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'An error occurred while disconnecting your Facebook account. Please try again later.',
                    });
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Cancelled',
                    text: 'Your Facebook account is still connected.',
                    icon: 'info',
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonColor: '#E6E9EC'
                });
            }
        });

    }


    const handleLoginClick = () => {
        // Redirect the user to the Instagram login page
        window.location.href = `https://www.facebook.com/v17.0/dialog/oauth?client_id=599924718880412&display=page&extras={'setup':{'channel':'IG_API_ONBOARDING'}}&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement&redirect_uri=https://0f41-103-239-234-102.ngrok-free.app/auth-redirect/instagram`;
    };

    const facebook = () => {
        setShowFacebookModal(true)
    }

    const commonButtonStyle = {
        borderRadius: '5px',
        background: "#F07C33",
        boxShadow: "unset",
        fontSize: "12px",
        color: "#fff",
        border: '1px solid #F07C33',
        height: "39px",
        minWidth: "111px",
        margin: "10px",
        width: "11px",
    };

    return (
        <div className="col-lg-5 col-xl-4 col-sm-12">

            {/* socail media */}
            <div className="cmn_background social_media_wrapper">
                <div className="social_media_account">
                    <h3>{jsondata.socialAccount}</h3>
                </div>

                {/*facebook connect starts */}

                {
                    getAllConnectedSocialAccountData?.loading ?
                        <SkeletonEffect count={1}></SkeletonEffect> :
                        getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length === 0 ?

                            <div className="social_media_outer">
                                <div className="social_media_content">
                                    <i className={`fa-brands fa-facebook`}
                                       style={{color: "#0866ff", fontSize: "24px"}}/>
                                    <div>
                                        <h5 className="">Facebook account</h5>
                                        <h6 className="cmn_headings">www.facebook.com</h6>
                                    </div>
                                </div>

                                <LoginSocialFacebook
                                    isDisabled={socialAccountConnectData?.loading || getAllConnectedSocialAccountData?.loading}
                                    appId={`${import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID}`}
                                    redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                    onResolve={(response) => {
                                        connectSocialMediaAccountToCustomer(computeAndSocialAccountJSONForFacebook(response, SocialAccountProvider.FACEBOOK))
                                    }}
                                    onReject={(error) => {
                                    }}>

                                    <FacebookLoginButton text={"Connect"} className={"facebook_connect"}
                                                         icon={() => null} preventActiveStyles={true}
                                                         style={commonButtonStyle}/>
                                </LoginSocialFacebook>

                            </div>

                            :

                            <div className=" cmn_drop_down dropdown">
                                <div className="dropdown_header">
                                    <div className="social_media_outer">
                                        <div className="social_media_content"
                                             onClick={() => setFacebookDropDown(!facebookDropDown)}>
                                            <img className="cmn_width" src={fb_img}/>
                                            <div className="text-start">
                                                <h5 className="">{getAllConnectedSocialAccountData.data && getAllConnectedSocialAccountData.data.find(c => c.provider === 'FACEBOOK')?.name || "facebook"}</h5>
                                                <h4 className="connect_text cmn_text_style">Connected</h4>
                                            </div>
                                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg"
                                                // onClick={() =>
                                                //     setFacebookDropDown(!facebookDropDown)}
                                                 onClick={() => {
                                                     console.log("asdasdasdasdasd")
                                                 }}
                                            >
                                                <path id="Icon"
                                                      d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                      stroke="#5F6D7E" strokeWidth="1.67"
                                                      strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                    </div>

                                    {
                                        facebookDropDown === true &&

                                        <ul className="menu_items">
                                            {
                                                facebookPageLoading === true ?
                                                    <SkeletonEffect count={3}/> :

                                                    !(getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length === 0) &&
                                                    facebookPageList?.slice(0, 3).map((data, index) => {
                                                        return (
                                                            <>
                                                                <li key={index}>
                                                                    <div
                                                                        className="user_profileInfo_wrapper">
                                                                        <div className="user_Details">
                                                                            <img src={data.picture.data.url}
                                                                                 height="30px"
                                                                                 width="30px"/>
                                                                            <h4 className="cmn_text_style">{data.name}</h4>
                                                                        </div>
                                                                        <h4 className={currentConnectedFacebookPages?.findIndex(c => c?.pageId === data?.id) > -1 ? "connect_text cmn_text_style" : "connect_text_not_connect cmn_text_style"}>{currentConnectedFacebookPages?.findIndex(c => c?.pageId === data?.id) > -1 ? "Connected" : "Not Connected"}</h4>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        )
                                                    })

                                            }
                                            <li>
                                                {
                                                    (facebookPageList && Array.isArray(facebookPageList)) &&
                                                    <div className="connectDisconnect_btn_outer">
                                                        <button className="DisConnectBtn cmn_connect_btn"
                                                                onClick={() => disConnectSocialMediaAccountToCustomer("FACEBOOK")}>
                                                            Disconnect
                                                        </button>
                                                        <button className="ConnectBtn cmn_connect_btn"
                                                                onClick={() => facebook()}>
                                                            Connect More
                                                        </button>
                                                    </div>

                                                }
                                            </li>
                                        </ul>}

                                </div>
                            </div>

                }

                {/*facebook connect ends */}

                {/* start instagram connect */}

                {
                    getAllConnectedSocialAccountData?.loading ?
                        <SkeletonEffect count={1}></SkeletonEffect> :
                        getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'INSTAGRAM').length === 0 ?
                            <div className="social_media_outer">
                                <div className="social_media_content">
                                    <i className="fa-brands fa-instagram"
                                       style={{color: "purple", fontSize: "24px"}}/>
                                    <div>
                                        <h5 className=""> Instagram account</h5>
                                        <h6 className="cmn_headings">www.instagram.com</h6>
                                    </div>
                                </div>

                                {/*<button style={commonButtonStyle} onClick={handleLoginClick}>Connect</button>*/}

                                <LoginSocialFacebook
                                    isDisabled={socialAccountConnectData?.loading || getAllConnectedSocialAccountData?.loading}
                                    appId={`${import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID}`}
                                    redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                    onResolve={(response) => {
                                        const mediaAccount = computeAndSocialAccountJSONForFacebook(response, SocialAccountProvider.INSTAGRAM)
                                        mediaAccount === null || mediaAccount === undefined ? showErrorToast(NoInstagramBusinessAccountFound) : connectSocialMediaAccountToCustomer(mediaAccount)
                                    }}
                                    onReject={(error) => {
                                    }}>

                                    <FacebookLoginButton text={"Connect"} className={"facebook_connect"}
                                                         icon={() => null} preventActiveStyles={true}
                                                         style={commonButtonStyle}/>
                                </LoginSocialFacebook>
                            </div> :

                            <div className=" cmn_drop_down dropdown">
                                <div className="dropdown_header">
                                    <div className="social_media_outer">
                                        <div className="social_media_content"
                                             onClick={() => setInstagramDropDown(!instagramDropDown)}>
                                            <i className="fa-brands fa-instagram"
                                               style={{color: "purple", fontSize: "24px"}}/>
                                            {/*<img className="cmn_width " src={fb_img}/>*/}
                                            <div className="text-start">
                                                <h5 className="">{getAllConnectedSocialAccountData.data && getAllConnectedSocialAccountData.data.find(c => c.provider === 'FACEBOOK')?.name || "facebook"}</h5>
                                                <h4 className="connect_text cmn_text_style">Connected</h4>
                                            </div>
                                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path id="Icon"
                                                      d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
                                                      stroke="#5F6D7E" strokeWidth="1.67"
                                                      strokeLinecap="round"/>
                                            </svg>
                                        </div>
                                    </div>

                                    {
                                        instagramDropDown === true &&

                                        <ul className="menu_items">
                                            {
                                                instagramBusinessAccountsData?.loading ?
                                                    <SkeletonEffect count={3}/> :

                                                    !(instagramBusinessAccountsData?.loading && instagramBusinessAccountsData?.data?.filter(c => c.provider === 'INSTAGRAM').length === 0) &&
                                                    instagramBusinessAccountsData?.data?.slice(0, 3).map((data, index) => {
                                                        return (
                                                            <>
                                                                <li key={index}>
                                                                    <div
                                                                        className="user_profileInfo_wrapper">
                                                                        <div className="user_Details">
                                                                            <img src={data.profile_picture_url}
                                                                                 height="30px"
                                                                                 width="30px"/>
                                                                            <h4 className="cmn_text_style">{data.name}</h4>
                                                                        </div>
                                                                        <h4 className={currentConnectedFacebookPages?.findIndex(c => c?.pageId === data?.id) > -1 ? "connect_text cmn_text_style" : "connect_text_not_connect cmn_text_style"}>{currentConnectedFacebookPages?.findIndex(c => c?.pageId === data?.id) > -1 ? "Connected" : "Not Connected"}</h4>
                                                                    </div>
                                                                </li>
                                                            </>
                                                        )
                                                    })

                                            }
                                            <li>
                                                {
                                                    (instagramBusinessAccountsData?.data && Array.isArray(instagramBusinessAccountsData?.data)) &&
                                                    <div className="connectDisconnect_btn_outer">
                                                        <button className="DisConnectBtn cmn_connect_btn"
                                                                onClick={() => disConnectSocialMediaAccountToCustomer("INSTAGRAM")}
                                                        >
                                                            Disconnect
                                                        </button>
                                                        <button className="ConnectBtn cmn_connect_btn"
                                                                onClick={() => setShowInstagramModal(true)}
                                                        >
                                                            Connect More
                                                        </button>
                                                    </div>

                                                }
                                            </li>
                                        </ul>}

                                </div>
                            </div>


                }

                {/* end instagram connect */}
            </div>
            {showFacebookModal &&
                <FacebookModal showFacebookModal={showFacebookModal} setShowFacebookModal={setShowFacebookModal}
                               facebookPageList={facebookPageList}
                               facebookConnectedPages={facebookConnectedPages} noPageFoundMessage={"No Page Found!"}
                               socialMediaType={SocialAccountProvider.FACEBOOK}
                               socialMediaAccountInfo={getAllConnectedSocialAccountData?.data?.filter(account => account.provider === "FACEBOOK")[0]}/>}
            {showInstagramModal &&
                <FacebookModal showFacebookModal={showInstagramModal} setShowFacebookModal={setShowInstagramModal}
                    // facebookPageList={facebookPageList}
                               facebookPageList={instagramBusinessAccountsData?.data}
                               facebookConnectedPages={facebookConnectedPages} noPageFoundMessage={"No Page Found!"}
                               socialMediaType={SocialAccountProvider.INSTAGRAM}
                               socialMediaAccountInfo={getAllConnectedSocialAccountData?.data?.filter(account => account.provider === "INSTAGRAM")[0]}/>}

        </div>

    );
}
export default SocialAccounts;