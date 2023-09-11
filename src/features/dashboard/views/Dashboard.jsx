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
import {decodeJwtToken, getToken} from "../../../app/auth/auth.js";

import {
    facebookPageConnect,
    getAllFacebookPages,
    getFacebookConnectedPages
} from "../../../app/actions/facebookActions/facebookActions.js";
import {useNavigate} from "react-router-dom";
import {resetFacebookReducer} from "../../../app/slices/facebookSlice/facebookSlice.js";
import {LoginSocialFacebook, LoginSocialInstagram} from "reactjs-social-login";
import {FacebookLoginButton, InstagramLoginButton} from "react-social-login-buttons";
import {computeAndSocialAccountJSONForFacebook} from "../../../utils/commonUtils.js";
import {
    getAllConnectedSocialAccountAction,
    socialAccountConnectActions
} from "../../../app/actions/socialAccountActions/socialAccountActions.js";

const Dashboard = () => {

    const [showFacebookModal, setShowFacebookModal] = useState(false)
    const [facebookData, setFacebookData] = useState(null)
    const [userInfo, setUserInfo] = useState(null);
    const [handleClick, setHandleClick] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const token = getToken();


    const facebookPageList = useSelector(state => state.facebook.getFacebookPageReducer.facebookPageList);
    const facebookConnectedPages = useSelector(state => state.facebook.getFacebookConnectedPagesReducer.facebookConnectedPages);

    const socialAccountConnectData = useSelector(state => state.socialAccount.connectSocialAccountReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);


    console.log("@@@ getAllConnectedSocialAccountData ::: ", getAllConnectedSocialAccountData)

    useEffect(() => {
        if (token) {
            const decodeJwt = decodeJwtToken(token);
            console.log("@@@ decodeJwt ::: ", decodeJwt)
            setUserInfo(decodeJwt);
            dispatch(getAllConnectedSocialAccountAction({customerId: decodeJwt.customerId , token:token}))
        }
    }, [token])


    useEffect(() => {
        if (userInfo) {
            dispatch(getAllFacebookPages({customerId: userInfo?.customerId, token: token, navigate: navigate}))
        }
    }, [userInfo])


    const facebook = () => {
        setShowFacebookModal(true)
    }

    // useEffect(() => {
    //     if (handleClick && userInfo?.customerId) {
    //         handleFacebookConnect()
    //         setHandleClick(false);
    //         dispatch(getFacebookConnectedPages({customerId: userInfo?.customerId, token: token}))
    //     }
    //
    // }, [handleClick]);

    // useEffect(() => {
    //     if (!facebookPageList?.loading && userInfo?.customerId) {
    //         dispatch(getFacebookConnectedPages({customerId: userInfo?.customerId, token: token}))
    //     }
    // }, [facebookPageList]);


    // const handleFacebookConnect = () => {
    //
    //     if (facebookData) {
    //         const requestBody = {
    //             customerId: userInfo?.customerId,
    //             pageAccessTokenDTO: {
    //                 pageId: facebookData.id,
    //                 name: facebookData.name,
    //                 imageUrl: facebookData.imageUrl,
    //                 about: facebookData.about,
    //                 access_token: facebookData.access_token
    //             },
    //             token: token
    //         }
    //         dispatch(facebookPageConnect(requestBody));
    //     }
    //     dispatch(resetFacebookReducer())
    // }


    const connectSocialMediaAccountToCustomer = (object) => {

        object.then((res)=>{
            dispatch(socialAccountConnectActions(res)).then(() => {
                console.log("then res====>",res)
                dispatch(getAllConnectedSocialAccountAction(res))
            })
        }).catch((error)=>{
            console.log("--->error",error)
        })

    }


    console.log("socialAccountConnectData",socialAccountConnectData.data)




    return (
        <>
            <SideBar/>
            <div className="cmn_container">
                <div className="cmn_wrapper_outer">
                    <Header/>
                    <div className="dashboard_outer">
                        <div className="row">
                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="post_activity_outer cmn_background">
                                    <Dropdown className="dropdown_btn">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic"
                                                         className="instagram_dropdown">
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
                                    <Dropdown className={'cmn_drop_down'}>
                                        <Dropdown.Toggle id="dropdown-facebook">
                                            <div className="social_media_outer">
                                                <div className="social_media_content">
                                                    <img className="cmn_width" src={fb_img} />
                                                    <div>
                                                        <h5 className="">Facebook account</h5>
                                                        <h6 className="cmn_headings">https://www.facebook.com</h6>
                                                    </div>
                                                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path id="Icon" d="M13 1L7.70711 6.29289C7.31658 6.68342 6.68342 6.68342 6.29289 6.29289L1 1" stroke="#5F6D7E" stroke-width="1.67" stroke-linecap="round"/>
                                                    </svg>

                                                </div>

                                            </div>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="menu_items ">

                                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                            <Dropdown.Item href="" className="connect_more_btn ">Connect More</Dropdown.Item>

                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={fb_img}/>
                                            <div>
                                                <h5 className="">Facebook account</h5>
                                                <h6 className="cmn_headings">www.facebook.com</h6>
                                            </div>
                                        </div>

                                        {!getAllConnectedSocialAccountData?.loading &&  getAllConnectedSocialAccountData?.data?.filter(c=>c.provider==='FACEBOOK').length===0 &&
                                            <LoginSocialFacebook
                                            isDisabled={socialAccountConnectData?.loading || getAllConnectedSocialAccountData?.loading}
                                            appId="688937182693504"
                                            onResolve={(response) => {
                                                connectSocialMediaAccountToCustomer(computeAndSocialAccountJSONForFacebook(response))
                                            }}
                                            onReject={(error) => {
                                            }}
                                        >

                                            <FacebookLoginButton text={"Connect"} className={"facebook_connect"}
                                                                 icon={() => null} preventActiveStyles={true} style={{
                                                borderRadius: '10px',
                                                background: "#F07C33",
                                                boxShadow: "unset",
                                                fontSize: "12px",
                                                color: "#fff",
                                                border: '1px solid #F07C33'
                                            }}/>
                                        </LoginSocialFacebook>}





                                    </div>

                                    {/* */}
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={twitter_img}/>
                                            <div>
                                                <h5 className="">Twitter account</h5>
                                                <h6 className="cmn_headings">www.twitter.com</h6>
                                            </div>
                                        </div>
                                        <button className="cmn_btn_color cmn_connect_btn disconnect_btn ">Disconnect
                                        </button>
                                    </div>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={instagram_img}/>
                                            <div>
                                                <h5 className=""> Instagram account</h5>
                                                <h6 className="cmn_headings">www.facebook.com</h6>
                                            </div>
                                        </div>

                                        <LoginSocialInstagram
                                            client_id="258452007021390"
                                            client_secret="952c05ad1f2a53f09eb37fd62ba1547d"
                                            scope="user_profile"
                                            redirect_uri="https://baee-45-127-193-129.ngrok-free.app/dashboard"
                                            onResolve={(response) => {
                                                console.log("------>response", response);
                                            }}
                                            onReject={(error) => {
                                                console.log("------>error", error);
                                                console.log(error);
                                            }}
                                        >
                                            <InstagramLoginButton text={"Connect"} className={"facebook_connect"}
                                                                  icon={() => null} preventActiveStyles={true} style={{
                                                borderRadius: '10px',
                                                background: "#F07C33",
                                                boxShadow: "unset",
                                                fontSize: "12px",
                                                color: "#fff",
                                                border: '1px solid #F07C33'
                                            }}/>
                                        </LoginSocialInstagram>


                                    </div>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={linkedin_img}/>
                                            <div>
                                                <h5 className="">Linkedin account</h5>
                                                <h6 className="cmn_headings">www.facebook.com</h6>
                                            </div>
                                        </div>
                                        <button className="cmn_btn_color cmn_connect_btn connect_btn ">Connect</button>
                                    </div>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={tiktok_img}/>
                                            <div>
                                                <h5 className="">Tiktok account</h5>
                                                <h6 className="cmn_headings">www.facebook.com</h6>
                                            </div>
                                        </div>
                                        <button className="cmn_btn_color cmn_connect_btn connect_btn ">Connect</button>
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
                               facebookPageList={facebookPageList} setFacebookData={setFacebookData}
                               facebookConnectedPages={facebookConnectedPages} setHandleClick={setHandleClick}/>}

        </>
    )
}
export default Dashboard