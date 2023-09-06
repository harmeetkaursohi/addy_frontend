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
import { useLocation } from "react-router-dom";

const Dashboard = () => {
const pathName=useLocation()
const queryparam= new URLSearchParams(pathName.search)
const status=queryparam.get("status")
console.log(status,"accesstoken")
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
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={fb_img}/>
                                            <div>
                                                <h5 className="">Facebook account</h5>
                                                <h6 className="cmn_headings">www.facebook.com</h6>
                                            </div>
                                        </div>
                                        <a  href={`${import.meta.env.VITE_APP_OAUTH2_BASE_URL}/facebook?redirect_uri=http://127.0.0.1:5173/dashboard&customerId=64f80ff7bb722f1224aca1d6`} className="cmn_btn_color cmn_connect_btn connect_btn ">Connect</a>
                                        
                                    </div>
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
                                        <button className="cmn_btn_color cmn_connect_btn disconnect_btn ">Disconnect
                                        </button>
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


        </>
    )
}
export default Dashboard