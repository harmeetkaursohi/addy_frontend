import Header from "../../head/views/Header"
import SideBar from "../../sidebar/views/Layout"
import './Dashboard.css'
import Dropdown from 'react-bootstrap/Dropdown';
import polygon_img from '../../../images/polygon.svg'
import fb_img from '../../../images/fb.svg'
import tiktok_img from '../../../images/tiktok.svg'
import twitter_img from '../../../images/twitter.svg'
import instagram_img from '../../../images/instagram.png'
import linkedin_img from '../../../images/linkedin.svg'
import right_arrow_icon from '../../../images/right_arrow_icon.svg'
import Chart from "../../react_chart/views/Chart.jsx";
import UpcomingPost from "../../upcomingPost/views/UpcomingPost.jsx";
import jsondata from '../../../locales/data/initialdata.json'
import {useEffect, useState} from "react";
import FacebookModal from "../../modals/views/facebookModal/FacebookModal";
import {useDispatch, useSelector} from "react-redux";
import {decodeJwtToken, getToken, setAuthenticationHeader} from "../../../app/auth/auth.js";
import {getAllFacebookPages, getFacebookConnectedPages} from "../../../app/actions/facebookActions/facebookActions.js";
import {LoginSocialFacebook, LoginSocialInstagram} from "reactjs-social-login";
import {FacebookLoginButton, InstagramLoginButton} from "react-social-login-buttons";
import {computeAndSocialAccountJSONForFacebook} from "../../../utils/commonUtils.js";
import {
    disconnectSocialAccountAction,
    getAllConnectedSocialAccountAction,
    socialAccountConnectActions
} from "../../../app/actions/socialAccountActions/socialAccountActions.js";
import SkeletonEffect from "../../loader/skeletonEffect/SkletonEffect";
import ConfirmModal from "../../common/components/ConfirmModal.jsx";
import axios from "axios";
import {showErrorToast} from "../../common/components/Toast.jsx";

const Dashboard = () => {

    const [showFacebookModal, setShowFacebookModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [facebookDropDown, setFacebookDropDown] = useState(false)
    const [userData, setUserData] = useState(null);
    const dispatch = useDispatch();
    const token = getToken();

    const facebookPageList = useSelector(state => state.facebook.getFacebookPageReducer.facebookPageList);
    const facebookPageLoading = useSelector(state => state.facebook.getFacebookPageReducer.loading);
    const facebookConnectedPages = useSelector(state => state.facebook.getFacebookConnectedPagesReducer.facebookConnectedPages);

    const socialAccountConnectData = useSelector(state => state.socialAccount.connectSocialAccountReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);

    useEffect(() => {
        if (token) {
            const decodeJwt = decodeJwtToken(token);
            dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt.customerId, token: token}))
        }
    }, [])


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

    }, [getAllConnectedSocialAccountData]);


    const facebook = () => {
        setShowFacebookModal(true)
    }


    const connectSocialMediaAccountToCustomer = (object) => {
        object.then((res) => {
            dispatch(socialAccountConnectActions(res)).then(() => {
                dispatch(getAllConnectedSocialAccountAction(res))
            })
        }).catch((error) => {
            console.log("--->error", error)
        })
    }

    const disConnectSocialMediaAccountToCustomer = () => {
        const decodeJwt = decodeJwtToken(token);
        dispatch(disconnectSocialAccountAction({
            customerId: decodeJwt?.customerId,
            socialAccountId: getAllConnectedSocialAccountData?.data?.find(c => c.provider === "FACEBOOK")?.id,
            token: token
        })).then(() => {
            dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt?.customerId, token: token}))
        }).catch((error) => {
            console.log("--->error", error)
        });
    }

    const confirmModalHandler = () => {
        setShowConfirmModal(true)
    }

    return (
        <>
            <SideBar/>
            <div className="cmn_container">
                <div className="cmn_wrapper_outer">
                    <Header userData={userData}/>
                    <div className="dashboard_outer">
                        <div className="row">
                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="post_activity_outer cmn_background">
                                    <Dropdown className="dropdown_btn">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic"
                                                         className="social_dropdowns">
                                            <img src={instagram_img} className="me-3"/>Instagram
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <div className="followers_outer ">
                                        <div className="followers_wrapper ">
                                            <h5>{jsondata.followers}</h5>
                                            <div className="followers_inner_content">
                                                <h2>15,452</h2>
                                                <div className="monthly_growth">
                                                    <button className="cmn_followers_btn">
                                                        <img src={polygon_img} className="polygon_img"/>
                                                        1255
                                                    </button>
                                                    <h6 className="cmn_headings">{jsondata.monthlyGrowth}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="followers_wrapper">
                                            <h5>{jsondata.accountsReach} </h5>
                                            <div className="followers_inner_content">
                                                <h2>15,452</h2>
                                                <div className="monthly_growth">
                                                    <button className="cmn_followers_btn">
                                                        <img src={polygon_img} className="polygon_img"/>
                                                        1255
                                                    </button>
                                                    <h6 className="cmn_headings">{jsondata.monthlyGrowth}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="followers_wrapper">
                                            <h5>{jsondata.postActivity}</h5>
                                            <div className="followers_inner_content">
                                                <h2>15,452</h2>
                                                <div className="monthly_growth">
                                                    <button className="cmn_followers_btn">
                                                        <img src={polygon_img} className="polygon_img"/>
                                                        1255
                                                    </button>
                                                    <h6 className="cmn_headings">{jsondata.monthlyGrowth}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* chart */}
                                    <div className="page_title_header">
                                        <div className="page_title_container">
                                            <div className="page_title_dropdown">
                                                <select className="page_title_options cmn_headings">
                                                    <option>Page title</option>
                                                    <option>22</option>
                                                    <option>22</option>
                                                </select>
                                                <h3 className="cmn_white_text instagram_overview_heading">Instagram
                                                    Overview</h3>
                                            </div>
                                            <div className="days_outer">
                                                <select className=" dropdown_days box_shadow">
                                                    <option>Last 7 days</option>
                                                    <option>Last 7 days</option>
                                                    <option>Last 7 days</option>
                                                </select>
                                            </div>

                                        </div>
                                        <Chart/>
                                        <div className="account_info mt-2">
                                            <div className="account_group">
                                                <div className="account_reached cmn_chart_btn">
                                                </div>
                                                <h4 className="cmn_headings">Accounts Reached</h4>
                                            </div>
                                            <div className="account_group">
                                                <div className="total_follower cmn_chart_btn">
                                                </div>
                                                <h4 className="cmn_headings">Total Followers</h4>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-12 col-sm-12">

                                {/* socail media */}
                                <div className="cmn_background social_media_wrapper">

                                    <div className="social_media_account">
                                        <h3>{jsondata.socialAccount}</h3>
                                        <h6>{jsondata.seemore}<img src={right_arrow_icon} height="11px" width="11px"/>
                                        </h6>
                                    </div>

                                    {/*facebook connect starts */}

                                    {!getAllConnectedSocialAccountData?.loading && getAllConnectedSocialAccountData?.data?.filter(c => c.provider === 'FACEBOOK').length === 0 ?

                                        <div className="social_media_outer">
                                            <div className="social_media_content">
                                                <img className="cmn_width" src={fb_img}/>
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
                                                    console.log("fb response", response)
                                                    connectSocialMediaAccountToCustomer(computeAndSocialAccountJSONForFacebook(response))
                                                }}
                                                onReject={(error) => {
                                                }}
                                            >

                                                <FacebookLoginButton text={"Connect"} className={"facebook_connect"}
                                                                     icon={() => null} preventActiveStyles={true}
                                                                     style={{
                                                                         borderRadius: '5px',
                                                                         background: "#F07C33",
                                                                         boxShadow: "unset",
                                                                         fontSize: "12px",
                                                                         color: "#fff",
                                                                         border: '1px solid #F07C33',
                                                                         height: "39px",
                                                                         minWidth: "111px",
                                                                         margin: "0px"
                                                                     }}/>
                                            </LoginSocialFacebook>

                                        </div>

                                        :

                                        <div className=" cmn_drop_down dropdown">
                                            <div className="dropdown_header">
                                                <div className="social_media_outer">
                                                    <div className="social_media_content">
                                                        <img className="cmn_width" src={fb_img}/>
                                                        <div className="text-start">
                                                            <h5 className="">{getAllConnectedSocialAccountData.data && getAllConnectedSocialAccountData.data.find(c => c.provider === 'FACEBOOK')?.name || "facebook"}</h5>
                                                            <h4 className="connect_text cmn_text_style">Connected</h4>
                                                        </div>
                                                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg"
                                                             onClick={() => setFacebookDropDown(!facebookDropDown)}>
                                                            <path id="Icon"
                                                                  d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1"
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
                                                                            <li href="#/action-2" key={index}>
                                                                                <div
                                                                                    className="user_profileInfo_wrapper">
                                                                                    <div className="user_Details">
                                                                                        <img src={data.picture.data.url}
                                                                                             height="30px"
                                                                                             width="30px"/>
                                                                                        <h4 className="cmn_text_style">{data.name}</h4>
                                                                                    </div>
                                                                                    <h4 className={facebookConnectedPages?.findIndex(c => c?.pageId === data?.id) > -1 ? "connect_text cmn_text_style" : "connect_text_not_connect cmn_text_style"}>{facebookConnectedPages?.findIndex(c => c?.pageId === data?.id) > -1 ? "Connected" : "Not Connected"}</h4>
                                                                                </div>
                                                                            </li>
                                                                        </>
                                                                    )
                                                                })

                                                        }
                                                        <li>
                                                            <div className="connectDisconnect_btn_outer">
                                                                <button className="DisConnectBtn  cmn_connect_btn"
                                                                        disabled={getAllConnectedSocialAccountData?.loading}
                                                                        onClick={() => {
                                                                            confirmModalHandler()
                                                                        }}
                                                                >
                                                                    Disconnect
                                                                </button>
                                                                <button className="ConnectBtn cmn_connect_btn"
                                                                        onClick={() => facebook()}>Connect More
                                                                </button>
                                                            </div>
                                                        </li>
                                                    </ul>}

                                            </div>
                                        </div>
                                    }

                                    {/*facebook connect ends */}


                                    {/* */}
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={twitter_img}/>
                                            <div>
                                                <h5 className="">Twitter account</h5>
                                                <h6 className="cmn_headings">www.twitter.com</h6>
                                            </div>
                                        </div>
                                        <button
                                            className="cmn_btn_color cmn_connect_btn disconnect_btn ">Disconnect
                                        </button>
                                    </div>
                                    {/* instagram */}
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={instagram_img}/>
                                            <div>
                                                <h5 className=""> Instagram account</h5>
                                                <h6 className="cmn_headings">www.facebook.com</h6>
                                            </div>
                                        </div>

                                        <LoginSocialInstagram
                                            client_id={`${import.meta.env.VITE_APP_INSTAGRAM_CLIENT_ID}`}
                                            client_secret={`${import.meta.env.VITE_APP_INSTAGRAM_CLIENT_SECRET}`}
                                            scope={`${import.meta.env.VITE_APP_INSTAGRAM_SCOPE}`}
                                            redirect_uri={`${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/dashboard`}
                                            onResolve={(response) => {
                                                console.log("------>response", response);
                                            }}
                                            onReject={(error) => {
                                                console.log("------>error", error);
                                                console.log(error);
                                            }}
                                        >
                                            <InstagramLoginButton text={"Connect"}
                                                                  className={"facebook_connect"}
                                                                  icon={() => null}
                                                                  preventActiveStyles={true}
                                                                  style={{
                                                                      borderRadius: '5px',
                                                                      background: "#F07C33",
                                                                      boxShadow: "unset",
                                                                      fontSize: "12px",
                                                                      color: "#fff",
                                                                      border: '1px solid #F07C33',
                                                                      height: "39px",
                                                                      minWidth: "111px",
                                                                      margin: "0px"
                                                                  }}/>
                                        </LoginSocialInstagram>


                                    </div>
                                    <div className="cmn_drop_down">
                                        <div className="social_media_outer">
                                            <div className="social_media_content">
                                                <img className="cmn_width" src={linkedin_img}/>
                                                <div>
                                                    <h5 className="">Linkedin account</h5>
                                                    <h6 className="cmn_headings">www.facebook.com</h6>
                                                </div>
                                            </div>
                                            <button
                                                className="cmn_btn_color cmn_connect_btn connect_btn ">Connect
                                            </button>
                                        </div>
                                    </div>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={tiktok_img}/>
                                            <div>
                                                <h5 className="">Tiktok account</h5>
                                                <h6 className="cmn_headings">www.facebook.com</h6>
                                            </div>
                                        </div>
                                        <button
                                            className="cmn_btn_color cmn_connect_btn connect_btn ">Connect
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* upcoming post */}
                        <UpcomingPost/>
                    </div>

                </div>

            </div>
            {showFacebookModal &&
                <FacebookModal showFacebookModal={showFacebookModal} setShowFacebookModal={setShowFacebookModal}
                               facebookPageList={facebookPageList}
                               facebookConnectedPages={facebookConnectedPages}/>}

            {showConfirmModal &&
                <ConfirmModal
                    confirmModalAction={disConnectSocialMediaAccountToCustomer}
                    setShowConfirmModal={setShowConfirmModal}
                    showConfirmModal={showConfirmModal}
                    icon={"warning"}
                    title={"Are you sure ?"}
                    confirmMessage={"You want to disconnect from facebook account ?"}
                />}
        </>
    )
}
export default Dashboard