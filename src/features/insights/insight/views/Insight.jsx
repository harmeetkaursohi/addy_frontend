import React from "react";
import "../views/insight.css"
import { Dropdown } from "react-bootstrap";
import SideBar from "../../../sidebar/views/Layout";
import instagram_img from "../../../../images/instagram.png";
import { Tabs, Tab } from "react-bootstrap";
import { FiArrowUpRight } from "react-icons/fi";
import Chart from "../../../react_chart/views/Chart";
import DonutChart from "../../DonutsChart";
import HorizontalBarChart from "../../horizontalbar";
import Carousel from "../../../slider/Slider";

const Insight = () => {
  return (
    <section>
      <SideBar />
      <div className="insight_wrapper cmn_container">
        <div className="insight_outer  cmn_wrapper_outer">
          <h2 className="insight_heading cmn_text_style">Insights</h2>
          <div className="insight_inner_content">
            <h5 className="Choose_platform_title">Choose PlatForm</h5>

            <div className="social_media_dropdown">
              <Dropdown className="chooseplatfrom_dropdown_btn">
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className="instagram_dropdown"
                >
                  <img src={instagram_img} className="me-3  " />
                  Instagram
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <ul className="Social_media_wrapper">
                    <li>
                      <div className="Social_media_platform">
                        <img src={instagram_img} className="" />
                        <h3>Select All</h3>
                      </div>
                      <input
                        type="checkbox"
                        className="Social_media_platform_checkbox"
                      />
                    </li>
                    <li>
                      <div className="Social_media_platform">
                        <img src={instagram_img} className="" />
                        <h3>Ultivic Private Limited</h3>
                      </div>
                      <input type="checkbox"  className="Social_media_platform_checkbox"/>
                    </li>
                    <li>
                      <div className="Social_media_platform">
                        <img src={instagram_img} className="" />
                        <h3>Just_clicks_13</h3>
                      </div>
                      <input type="checkbox"  className="Social_media_platform_checkbox"/>
                    </li>
                  </ul>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown className="chooseplatfrom_dropdown_btn">
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className="instagram_dropdown"
                >
                  <img src={instagram_img} className="me-3  " />
                Facebook
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <ul className="Social_media_wrapper">
                    <li>
                      <div className="Social_media_platform">
                        <img src={instagram_img} className="" />
                        <h3>Select All</h3>
                      </div>
                      <input
                        type="checkbox"
                        className="Social_media_platform_checkbox"
                      />
                    </li>
                    <li>
                      <div className="Social_media_platform">
                        <img src={instagram_img} className="" />
                        <h3>Ultivic Private Limited</h3>
                      </div>
                      <input type="checkbox"  className="Social_media_platform_checkbox"/>
                    </li>
                    <li>
                      <div className="Social_media_platform">
                        <img src={instagram_img} className="" />
                        <h3>Just_clicks_13</h3>
                      </div>
                      <input type="checkbox"  className="Social_media_platform_checkbox"/>
                    </li>
                  </ul>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown className="chooseplatfrom_dropdown_btn">
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className="instagram_dropdown"
                >
                  <img src={instagram_img} className="me-3  " />
                 Linkedin
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <ul className="Social_media_wrapper">
                    <li>
                      <div className="Social_media_platform">
                        <img src={instagram_img} className="" />
                        <h3>Select All</h3>
                      </div>
                      <input
                        type="checkbox"
                        className="Social_media_platform_checkbox"
                      />
                    </li>
                    <li>
                      <div className="Social_media_platform">
                        <img src={instagram_img} className="" />
                        <h3>Ultivic Private Limited</h3>
                      </div>
                      <input type="checkbox"  className="Social_media_platform_checkbox"/>
                    </li>
                    <li>
                      <div className="Social_media_platform">
                        <img src={instagram_img} className="" />
                        <h3>Just_clicks_13</h3>
                      </div>
                      <input type="checkbox"  className="Social_media_platform_checkbox"/>
                    </li>
                  </ul>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {/* ============ */}
            
              <div className="content_outer">
                <div className="Social_media_platform Content_Container_box">
                  <img src={instagram_img} className="" />
                  <h3>Just clicks</h3>
                </div>
              </div>
           

            {/* slider  */}
            <Carousel/>

            {/* tabs  */}
            <div className="overview_tabs_outer">
              <Tabs
                defaultActiveKey="Overview"
                id="uncontrolled-tab-example"
                className="overview_tabs"
              >
                {/* overview tab */}
                <Tab eventKey="Overview" title="Overview">
                  <h3 className="overview_text">
                    You reached{" "}
                    <span className="hightlighted_text">+290% </span>more
                    accounts compared to 30 Nov- 6 Dec
                  </h3>
                  <div className="account_reach_overview_wrapper">
                    <div className="account_reach_overview_outer">
                      <h5 className="cmn_text_style">Accounts Reached</h5>

                      <h4 className="cmn_text_style">
                        277 <FiArrowUpRight className="top_Arrow" />
                        <span className="hightlighted_text">+290%</span>
                      </h4>
                    </div>
                    <div className="account_reach_overview_outer">
                      <h5 className="cmn_text_style">Accounts Reached</h5>

                      <h4 className="cmn_text_style">
                        277 <FiArrowUpRight className="top_Arrow" />
                        <span className="hightlighted_text">+290%</span>
                      </h4>
                    </div>
                    <div className="account_reach_overview_outer">
                      <h5 className="cmn_text_style">Accounts Reached</h5>

                      <h4 className="cmn_text_style">
                        277 <FiArrowUpRight className="top_Arrow" />
                        <span className="hightlighted_text">+290%</span>
                      </h4>
                    </div>
                  </div>

                  {/* account reach graph */}
                  <div className="account_reach_graph_outer">
                  <h3 className="cmn_text_style">Audience Growth</h3>
                  <div className="page_title_header">
                    <div className="page_title_container">
                      <div className="page_title_dropdown">
                        <select className="page_title_options cmn_headings">
                          <option>Page title</option>
                          <option>22</option>
                          <option>22</option>
                        </select>
                        <h3 className="cmn_white_text instagram_overview_heading">
                          Instagram Overview
                        </h3>
                      </div>
                      <div className="days_outer">
                        <select className=" days_option box_shadow">
                          <option>Last 7 days</option>
                          <option>Last 7 days</option>
                          <option>Last 7 days</option>
                        </select>
                      </div>
                    </div>
                    <Chart />
                    <div className="account_info mt-2">
                      <div className="account_group">
                        <div className="account_reached cmn_chart_btn"></div>
                        <h4 className="cmn_headings">Accounts Reached</h4>
                      </div>
                      <div className="account_group">
                        <div className="total_follower cmn_chart_btn"></div>
                        <h4 className="cmn_headings">Total Followers</h4>
                      </div>
                    </div>
                  </div>
                  </div>
                </Tab>
                {/* Demographics tabs */}
                <Tab eventKey="Demographics" title="Demographics">
                  <h2 className="cmn_headings Review_Heading">Review your audience demographics as of the last day of the reporting period.</h2>
                  <div className="row">
                    {/* audience by age */}
                  <div className="col-xl-6 col-lg-6 xol-md-12 col-sm-12">

                  <div className="Donuts_container cmn_insight_wrapper_style cmn_height">
                         <h3 className="cmn_text_style">Audience by Age</h3>
                        <HorizontalBarChart/>
                </div>


                      {/* audience top countries */}
                      <div className="Donuts_container cmn_insight_wrapper_style ">
                        <h3 className="cmn_text_style">Audience Top Countries</h3>
                          <ul className="top_city_list">
                            <li>
                                <h4>Chicago</h4>
                                <h4>7</h4>
                            </li>
                            <li>
                                <h4>New York</h4>
                                <h4>3</h4>
                            </li>
                            <li>
                                <h4>Austin</h4>
                                <h4>5</h4>
                            </li>
                          </ul>
                        </div>
                  </div>

                  {/* audience by gender */}
                    <div className="col-xl-6 col-lg-6 xol-md-12 col-sm-12">
                        <div>
                        <div className="Donuts_container cmn_insight_wrapper_style">
                         <h3 className="cmn_text_style">Audience by Gender</h3>
                        <DonutChart/>
                        </div>

                        </div>

                        {/* audience top cities */}
                        <div className="Donuts_container cmn_insight_wrapper_style">
                        <h3 className="cmn_text_style">Audience Top Cities</h3>
                          <ul className="top_city_list">
                            <li>
                                <h4>Chicago</h4>
                                <h4>7</h4>
                            </li>
                            <li>
                                <h4>New York</h4>
                                <h4>3</h4>
                            </li>
                            <li>
                                <h4>Austin</h4>
                                <h4>5</h4>
                            </li>
                          </ul>
                        </div>
                    </div>

                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Insight;
