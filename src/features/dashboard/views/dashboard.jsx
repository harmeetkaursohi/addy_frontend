import Header from "../../head/views/Header"
import SideBar from "../../sidebar/views/Layout"
import './dashboard.css'
import Dropdown from 'react-bootstrap/Dropdown';
import polygon_img from '../../../images/polygon.svg'
import fb_img from '../../../images/fb.svg'
import tiktok_img from '../../../images/tiktok.svg'
import twitter_img from '../../../images/twitter.svg'
import instagram_img from '../../../images/instagram.png'
import linkedin_img from '../../../images/linkedin.svg'
import user_img from '../../../images/user.png'
import right_arrow_icon from '../../../images/right_arrow_icon.svg'
import Chart from "../../react_chart/views/chart";

const Dashboard = () => {
    return (
        <>
            <SideBar />
            <div className="cmn_container">
                <div className="cmn_wrapper_outer">
                    <Header />
                    <div className="dashboard_outer">
                        <div className="row">
                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="post_activity_outer cmn_background">
                                    <Dropdown className="dropdown_btn">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic" className="instagram_dropdown">
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
                                    <h5>Followers</h5>
                                    <div className="followers_inner_content">
                                    <h2>15,452</h2>
                                    <div className="monthly_growth">
                                    <button className="cmn_followers_btn">
                                        <img src={polygon_img} className="polygon_img"/>
                                        1255</button>
                                    <h6 className="cmn_headings">monthly growth</h6>
                                    </div>
                                    </div>
                                    </div>
                                    <div className="followers_wrapper">
                                    <h5>Accounts Reached </h5>
                                    <div className="followers_inner_content">
                                    <h2>15,452</h2>
                                    <div className="monthly_growth">
                                    <button className="cmn_followers_btn">
                                        <img src={polygon_img} className="polygon_img"/>
                                        1255</button>
                                    <h6 className="cmn_headings">monthly growth</h6>
                                    </div>
                                    </div>
                                    </div>
                                    <div className="followers_wrapper">
                                    <h5>Post Activity</h5>
                                    <div className="followers_inner_content">
                                    <h2>15,452</h2>
                                    <div className="monthly_growth">
                                    <button className="cmn_followers_btn">
                                        <img src={polygon_img} className="polygon_img"/>
                                        1255</button>
                                    <h6 className="cmn_headings">monthly growth</h6>
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
                                    <h3 className="cmn_white_text instagram_overview_heading">Instagram Overview</h3>
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
                                <div className="cmn_background social_media_wrapper">
                                    <div className="social_media_account">
                                        <h3>Social accounts</h3>
                                        <h6>See More <img src={right_arrow_icon} height="11px" width="11px"/></h6>
                                    </div>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img className="cmn_width" src={fb_img}/>
                                         <div>
                                           <h5 className="">Facebook account</h5>
                                            <h6 className="cmn_headings">www.facebook.com</h6>
                                           </div>
                                        </div>
                                        <button className="cmn_btn_color cmn_connect_btn connect_btn ">Connect</button>
                                    </div>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img  className="cmn_width"src={twitter_img}/>
                                           <div>
                                           <h5 className="">Twitter account</h5>
                                            <h6 className="cmn_headings">www.twitter.com</h6>
                                           </div>
                                        </div>
                                        <button className="cmn_btn_color cmn_connect_btn disconnect_btn ">Disconnect</button>
                                    </div>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img  className="cmn_width"src={instagram_img}/>
                                           <div>
                                           <h5 className=""> Instagram account</h5>
                                            <h6 className="cmn_headings">www.facebook.com</h6>
                                           </div>
                                        </div>
                                        <button className="cmn_btn_color cmn_connect_btn disconnect_btn ">Disconnect</button>
                                    </div>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img  className="cmn_width"src={linkedin_img}/>
                                           <div>
                                           <h5 className="">Linkedin account</h5>
                                            <h6 className="cmn_headings">www.facebook.com</h6>
                                           </div>
                                        </div>
                                        <button className="cmn_btn_color cmn_connect_btn connect_btn ">Connect</button>
                                    </div>
                                    <div className="social_media_outer">
                                        <div className="social_media_content">
                                            <img  className="cmn_width"src={tiktok_img}/>
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
                        <div className="upcoming_post_outer">
                        <h2>Upcoming Posts</h2>
                        <form>
                        <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="upcoming_post_container">
                         <div className="post_outer">
                          <div className="user_outer">
                            <img src={user_img} />
                            <h6 className="cmn_white_text">John Doe</h6>
                          </div>
                          <button className="cmn_btn_color cmn_white_text Tomorrow_btn"> 
                          <img src={polygon_img} className="polygon_img"/>
                            Tomorrow</button>
                         </div>

                            </div>
                         <div className="post_content">
                            <h6 className="cmn_headings">31 September, 2022</h6>
                            <h4>Back-end developer - Remote</h4>
                            <p className="cmn_headings" style={{fontSize:"14px"}}>Cursus purus, diam, aliquet scelerisque dignissim tellus aenean viverra. In risus elit vel id tincidunt vel. Nunc ac ipsum.</p>
                            <div className="delete_btn_outer">
                              <button className="delete_post_btn cmn_white_text ">Delete Post</button>
                              <button className="cmn_blue_bg cmn_white_text change_post_btn ms-2">Change Post</button>
                            </div>
                         </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className="upcoming_post_container">
                         <div className="post_outer">
                          <div className="user_outer">
                            <img src={user_img} />
                            <h6 className="cmn_white_text">John Doe</h6>
                          </div>
                          <button className="cmn_btn_color cmn_white_text Tomorrow_btn"> 
                          <img src={polygon_img} className="polygon_img"/>
                            Tomorrow</button>
                         </div>

                            </div>
                         <div className="post_content">
                            <h6 className="cmn_headings">31 September, 2022</h6>
                            <h4>Back-end developer - Remote</h4>
                            <p className="cmn_headings" style={{fontSize:"14px"}}>Cursus purus, diam, aliquet scelerisque dignissim tellus aenean viverra. In risus elit vel id tincidunt vel. Nunc ac ipsum.</p>
                            <div className="delete_btn_outer">
                              <button className="delete_post_btn cmn_white_text  ">Delete Post</button>
                              <button className="cmn_blue_bg cmn_white_text change_post_btn ms-2">Change Post</button>
                            </div>
                         </div>
                        </div>
                        </div>

                        </form>
                        </div>
                    </div>

                </div>

            </div>



        </>
    )
}
export default Dashboard