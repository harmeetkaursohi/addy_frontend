import React, {useEffect, useState} from "react";
import "../views/insight.css"
import {Dropdown} from "react-bootstrap";
import SideBar from "../../../sidebar/views/Layout";
import instagram_img from "../../../../images/instagram.png";
import {Tabs, Tab} from "react-bootstrap";
import {FiArrowDownRight, FiArrowUpRight} from "react-icons/fi";
import Chart from "../../../react_chart/views/Chart";
import DonutChart from "../../DonutsChart";
import HorizontalBarChart from "../../horizontalbar";
import Carousel from "../../slider/Slider";
import {useDispatch, useSelector} from "react-redux";
import {
    getAllByCustomerIdAction,
    getSocialMediaGraphByProviderTypeAction
} from "../../../../app/actions/socialAccountActions/socialAccountActions";
import {getToken} from "../../../../app/auth/auth";
import linkedin_img from "../../../../images/linkedin.svg"
import up_arrow from "../../../../images/up_arrow_.svg"
import {
    getAccountReachedAndAccountEngaged, getDemographicsInsight,
    getPostDataWithInsights,
    getTotalFollowers
} from "../../../../app/actions/InsightActions/insightAction";
import {getPostByPageIdAndPostStatus} from "../../../../app/actions/postActions/postActions";
import {
    calculatePercentageGrowthFor, generateUnixTimestampFor,
    getQueryForGraphData
} from "../../../../utils/commonUtils";
import {RotatingLines} from "react-loader-spinner";
import {Country} from 'country-state-city';


const Insight = () => {
    const enabledSocialMedia = {
        isFaceBookEnabled: `${import.meta.env.VITE_APP_ENABLE_FACEBOOK}` === "true",
        isInstagramEnabled: `${import.meta.env.VITE_APP_ENABLE_INSTAGRAM}` === "true",
        isLinkedinEnabled: `${import.meta.env.VITE_APP_ENABLE_LINKEDIN}` === "true",
        isPinterestEnabled: `${import.meta.env.VITE_APP_ENABLE_PINTEREST}` === "true",
    }
    const dispatch = useDispatch();
    const token = getToken();
    const getAllByCustomerIdData = useSelector(state => state.socialAccount.getAllByCustomerIdReducer);
    const getTotalFollowersData = useSelector(state => state.insight.getTotalFollowersReducer);
    const getAccountReachedAndAccountEngagedData = useSelector(state => state.insight.getAccountReachedAndAccountEngagedReducer);
    const getDemographicsInsightData = useSelector(state => state.insight.getDemographicsInsightReducer);
    const getPostByPageIdAndPostStatusData = useSelector(state => state.post.getPostByPageIdAndPostStatusReducer);
    const reportGraphSectionData = useSelector(state => state.socialAccount.getSocialMediaGraphByProviderTypeReducer);
    const [connectedFacebookPages, setConnectedFacebookPages] = useState(null);
    const [connectedInstagramPages, setConnectedInstagramPages] = useState(null);
    const [connectedLinkedinPages, setConnectedLinkedinPages] = useState(null);
    const [connectedPinterestBoards, setConnectedPinterestBoards] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);
    const [selectedPeriodForReachAndEngagement, setSelectedPeriodForReachAndEngagement] = useState(7);
    const [selectedPeriodForDemographics, setSelectedPeriodForDemographics] = useState("last_14_days");
    const [selectedPeriodForGraph, setSelectedPeriodForGraph] = useState(7);
    const [selectedPageForGraph, setSelectedPageForGraph] = useState(null);
    const [selectedInsightSection, setSelectedInsightSection] = useState("Overview");


    const handleSelectedPeriodForReachAndEngagement = (e) => {
        e.preventDefault();
        setSelectedPeriodForReachAndEngagement(parseInt(e.target.value))
    }
    const handleSelectedPeriodForDemographics = (e) => {
        e.preventDefault();
        setSelectedPeriodForDemographics(e.target.value)
    }
    const handleSelectedGraphPeriod = (e) => {
        e.preventDefault();
        setSelectedPeriodForGraph(parseInt(e.target.value))
    }


    useEffect(() => {
        dispatch(getAllByCustomerIdAction({
            token: token
        }))
    }, [])
    useEffect(() => {
        if (!getAllByCustomerIdData?.loading && getAllByCustomerIdData?.data !== null && getAllByCustomerIdData?.data !== undefined && getAllByCustomerIdData?.data?.length > 0) {
            const socialAccountData = Object.groupBy(getAllByCustomerIdData?.data, ({provider}) => provider)
            socialAccountData["FACEBOOK"]?.length > 0 ? setConnectedFacebookPages(socialAccountData["FACEBOOK"][0]?.pageAccessToken) : setConnectedFacebookPages([])
            socialAccountData["INSTAGRAM"]?.length > 0 ? setConnectedInstagramPages(socialAccountData["INSTAGRAM"][0]?.pageAccessToken) : setConnectedInstagramPages([])
            socialAccountData["LINKEDIN"]?.length > 0 ? setConnectedLinkedinPages(socialAccountData["LINKEDIN"][0]?.pageAccessToken) : setConnectedLinkedinPages([])
            socialAccountData["PINTEREST"]?.length > 0 ? setConnectedPinterestBoards(socialAccountData["PINTEREST"][0]?.pageAccessToken) : setConnectedPinterestBoards([])
        }

    }, [getAllByCustomerIdData])

    const handleSelectPage = (socialMediaType, page) => {
        setSelectedPage({...page, socialMediaType: socialMediaType})
        if (selectedPageForGraph === null || selectedPageForGraph?.socialMediaType !== socialMediaType) {
            setSelectedPageForGraph({...page, socialMediaType: socialMediaType})
        }
        if (socialMediaType === "PINTEREST") {
            const button = document.getElementById('uncontrolled-tab-example-tab-Overview');
            if(button){
                button.click();
            }
            setSelectedInsightSection("Overview")
        }
    }

    const handleGraphPageChange = (pageId, socialMediaType) => {
        let selectedPage;
        switch (socialMediaType) {
            case "FACEBOOK": {
                selectedPage = connectedFacebookPages?.find(page => page?.id === pageId)
                break;
            }
            case "INSTAGRAM": {
                selectedPage = connectedInstagramPages?.find(page => page?.id === pageId)
                break;
            }
        }
        setSelectedPageForGraph({...selectedPage, socialMediaType: socialMediaType})
    }
    useEffect(() => {
        if (selectedPage !== null && selectedPage !== undefined) {
            dispatch(getPostByPageIdAndPostStatus({
                token: token,
                requestBody: {
                    postStatuses: ["PUBLISHED"],
                    pageIds: [selectedPage?.pageId]
                }
            }))
        }
    }, [selectedPage])
    useEffect(() => {
        if (getPostByPageIdAndPostStatusData?.data !== null && getPostByPageIdAndPostStatusData?.data !== undefined && Object.keys(getPostByPageIdAndPostStatusData?.data)?.length > 0) {
            dispatch(getPostDataWithInsights({
                socialMediaType: selectedPage?.socialMediaType,
                pageAccessToken: selectedPage?.access_token,
                token: token,
                postIds: getPostByPageIdAndPostStatusData?.data[selectedPage?.pageId]?.map(post => post.postPageInfos[0]?.socialMediaPostId)
            }))
        }
    }, [getPostByPageIdAndPostStatusData])

    useEffect(() => {
        if (selectedPage !== null && selectedPage !== undefined && selectedInsightSection === "Overview") {
            dispatch(getTotalFollowers({
                token: token,
                socialMediaType: selectedPage?.socialMediaType,
                pageAccessToken: selectedPage?.access_token,
                pageId: selectedPage?.pageId
            }))

        }
    }, [selectedPage, selectedInsightSection])


    useEffect(() => {
        if (selectedPeriodForReachAndEngagement && selectedPage && selectedInsightSection === "Overview") {
            dispatch(getAccountReachedAndAccountEngaged({
                token: token,
                socialMediaType: selectedPage?.socialMediaType,
                pageAccessToken: selectedPage?.access_token,
                pageId: selectedPage?.pageId,
                period: selectedPeriodForReachAndEngagement
            }))
        }
    }, [selectedPeriodForReachAndEngagement, selectedPage, selectedInsightSection])


    useEffect(() => {
        if (selectedPeriodForGraph && selectedPage && selectedInsightSection === "Overview") {
            dispatch(getSocialMediaGraphByProviderTypeAction({
                token: token,
                pages: [selectedPageForGraph],
                socialMediaType: selectedPageForGraph?.socialMediaType,
                query: getQueryForGraphData(selectedPage?.socialMediaType, selectedPeriodForGraph + 2)
            }))
        }
    }, [selectedPeriodForGraph, selectedPageForGraph, selectedInsightSection])

    useEffect(() => {
        if (selectedPeriodForDemographics && selectedPage && selectedInsightSection === "Demographics") {
            dispatch(getDemographicsInsight({
                socialMediaType: selectedPage?.socialMediaType,
                pageAccessToken: selectedPage?.access_token,
                pageId: selectedPage?.pageId,
                period: selectedPeriodForDemographics
            }))
        }
    }, [selectedPeriodForDemographics, selectedPage, selectedInsightSection])


    return (
        <section>
            <SideBar/>
            <div className="insight_wrapper cmn_container">
                <div className="insight_outer  cmn_wrapper_outer">
                    <h2 className="insight_heading cmn_text_style">Insights</h2>
                    <div className="insight_inner_content">
                        <h5 className="Choose_platform_title">Choose PlatForm</h5>

                        <div className="social_media_dropdown">


                            {
                                enabledSocialMedia.isFaceBookEnabled &&
                                <Dropdown className="chooseplatfrom_dropdown_btn">
                                    <Dropdown.Toggle
                                        variant="success"
                                        id="dropdown-basic"
                                        className="instagram_dropdown"
                                    >
                                        <i className={`fa-brands fa-facebook me-3 `}
                                           style={{color: "#0866ff", fontSize: "20px"}}/>

                                        Facebook
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>


                                        <Dropdown.Item>
                                            <ul className="Social_media_wrapper">
                                                {
                                                    connectedFacebookPages?.map((page, index) => {
                                                        return (
                                                            <li key={index} onClick={() => {
                                                                handleSelectPage("FACEBOOK", page)
                                                            }}>
                                                                <div className="Social_media_platform">
                                                                    <i className={`fa-brands fa-facebook me-3 `}
                                                                       style={{color: "#0866ff", fontSize: "20px"}}/>
                                                                    <h3>{page.name}</h3>
                                                                </div>

                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            }
                            {
                                enabledSocialMedia.isInstagramEnabled &&
                                <Dropdown className="chooseplatfrom_dropdown_btn">
                                    <Dropdown.Toggle
                                        variant="success"
                                        id="dropdown-basic"
                                        className="instagram_dropdown"
                                    >
                                        <img src={instagram_img} className="me-3  "
                                             style={{height: "18px", width: "18px"}}/>
                                        Instagram
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>
                                            <ul className="Social_media_wrapper">
                                                {
                                                    connectedInstagramPages?.map((page, index) => {
                                                        return (
                                                            <li key={index} onClick={() => {
                                                                handleSelectPage("INSTAGRAM", page)
                                                            }}>
                                                                <div className="Social_media_platform">
                                                                    <img src={instagram_img} className=""/>
                                                                    <h3>{page.name}</h3>
                                                                </div>

                                                            </li>
                                                        );
                                                    })
                                                }

                                            </ul>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            }
                            {
                                enabledSocialMedia.isPinterestEnabled &&
                                <Dropdown className="chooseplatfrom_dropdown_btn">
                                    <Dropdown.Toggle
                                        variant="success"
                                        id="dropdown-basic"
                                        className="instagram_dropdown"
                                    >
                                        <i className={`fa-brands fa-pinterest me-3 `}
                                           style={{color: "#e60023", fontSize: "20px"}}/>

                                        Pinterest
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>


                                        <Dropdown.Item>
                                            <ul className="Social_media_wrapper">
                                                {
                                                    connectedPinterestBoards?.map((board, index) => {
                                                        return (
                                                            <li key={index} onClick={() => {
                                                                handleSelectPage("PINTEREST", board)
                                                            }}>
                                                                <div className="Social_media_platform">
                                                                    <i className={`fa-brands fa-pinterest me-3 `}
                                                                       style={{color: "#e60023", fontSize: "20px"}}/>
                                                                    <h3>{board.name}</h3>
                                                                </div>

                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            }

                            {/*TODO: Linkedin dropdown */}
                            {
                                enabledSocialMedia.isLinkedinEnabled &&
                                <Dropdown className="chooseplatfrom_dropdown_btn">
                                    <Dropdown.Toggle
                                        variant="success"
                                        id="dropdown-basic"
                                        className="instagram_dropdown"
                                    >
                                        <img src={linkedin_img} className="me-3  "/>
                                        Linkedin
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>


                                            <ul className="Social_media_wrapper">
                                                {
                                                    connectedLinkedinPages?.map((page, index) => {
                                                        return (
                                                            <li key={index} onClick={() => {
                                                                handleSelectPage("LINKEDIN", page)
                                                            }}>
                                                                <div className="Social_media_platform">
                                                                    <img src={linkedin_img} className="me-3  "/>
                                                                    <h3>{page.name}</h3>
                                                                </div>

                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            }
                        </div>
                        {/* ============ */}

                        {
                            selectedPage === null || selectedPage === undefined ?
                                <div className={"select-page-outer"}>
                                    <img src={up_arrow} className={"me-2 arrow-up-image"}></img>
                                    <div className={"select-page-text-outer ms-2"}>
                                        <div className={"no-account-txt text-center mb-3"}>No Account is Selected yet
                                        </div>
                                        <div className={"select-account-txt"}>Please select page from these platforms to
                                            check insights.
                                        </div>
                                    </div>

                                </div>

                                :
                                <>
                                    <div className="content_outer">
                                        <div className="Social_media_platform Content_Container_box">
                                            {
                                                selectedPage?.socialMediaType === "FACEBOOK" &&
                                                <i className={`fa-brands fa-facebook me-3 `}
                                                   style={{color: "#0866ff", fontSize: "20px"}}/>
                                            }
                                            {
                                                selectedPage?.socialMediaType === "INSTAGRAM" &&
                                                <img src={instagram_img} className="me-3  "/>
                                            }
                                            {
                                                selectedPage?.socialMediaType === "LINKEDIN" &&
                                                <img src={linkedin_img} className="me-3  "/>
                                            }
                                            <h3>{selectedPage?.name}</h3>
                                        </div>
                                    </div>


                                    {/* slider  */}
                                    <Carousel selectedPage={selectedPage}/>

                                    {/* tabs  */}
                                    <div className="overview_tabs_outer">
                                        <div className="days_outer reach-engagement-select">
                                            {
                                                selectedInsightSection === "Overview" &&
                                                <select className=" days_option box_shadow"
                                                        value={selectedPeriodForReachAndEngagement}
                                                        onChange={handleSelectedPeriodForReachAndEngagement}>
                                                    <option value={7}>Last 7 days</option>
                                                    <option value={15}>Last 15 days</option>
                                                    <option value={28}>Last 28 days</option>
                                                </select>
                                            }
                                            {
                                                selectedInsightSection === "Demographics" &&
                                                <select disabled={selectedPage?.socialMediaType === "FACEBOOK"}
                                                        className=" days_option box_shadow"
                                                        value={selectedPeriodForDemographics}
                                                        onChange={handleSelectedPeriodForDemographics}>
                                                    {
                                                        selectedPage?.socialMediaType === "FACEBOOK" &&
                                                        <option value={""}>Lifetime</option>
                                                    }
                                                    {
                                                        selectedPage?.socialMediaType === "INSTAGRAM" && <>
                                                            <option value={"last_14_days"}>Last 14 days</option>
                                                            <option value={"last_30_days"}>Last 30 days</option>
                                                            <option value={"last_90_days"}>Last 90 days</option>
                                                        </>
                                                    }

                                                </select>
                                            }
                                        </div>
                                        <Tabs
                                            onSelect={(eventKey) => {
                                                setSelectedInsightSection(eventKey)
                                            }}
                                            defaultActiveKey="Overview"
                                            id="uncontrolled-tab-example"
                                            className="overview_tabs"
                                        >

                                            {/* overview tab */}
                                            <Tab eventKey="Overview" title="Overview">
                                                {

                                                    !getAccountReachedAndAccountEngagedData?.loading &&
                                                    <>
                                                        {
                                                            getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.data < getAccountReachedAndAccountEngagedData?.data?.reach?.presentData ?
                                                                < h3 className="overview_text">
                                                                    You reached{" "}
                                                                    <span
                                                                        className="hightlighted_text color-growth">+{calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.reach?.presentData, 2)}% </span>more
                                                                    accounts compared
                                                                    to {getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.dateRange}
                                                                </h3> :
                                                                <h3 className="overview_text">
                                                                    This indicates a decline of <span
                                                                    className="hightlighted_text color-decline">{Math.abs(calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.reach?.presentData, 2))}% </span> in
                                                                    the number of
                                                                    accounts reached compared to the period
                                                                    of {getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.dateRange}.
                                                                </h3>
                                                        }
                                                    </>
                                                }


                                                <div className="account_reach_overview_wrapper">
                                                    <div className="account_reach_overview_outer">
                                                        <h5 className="cmn_text_style">Accounts Reached</h5>

                                                        <h4 className="cmn_text_style">
                                                            {
                                                                getAccountReachedAndAccountEngagedData?.loading ?
                                                                    <span><i className="fa fa-spinner fa-spin"/>
                                                                    </span> : getAccountReachedAndAccountEngagedData?.data?.reach?.presentData
                                                            }

                                                            {
                                                                !getAccountReachedAndAccountEngagedData?.loading && <>
                                                                    {
                                                                        getAccountReachedAndAccountEngagedData?.data?.reach?.presentData >= getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.data ?
                                                                            <>
                                                                                <FiArrowUpRight className="top_Arrow"/>
                                                                                <span
                                                                                    className="hightlighted_text color-growth">+{calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.reach?.presentData, 2)}%</span>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <FiArrowDownRight className="top_Arrow"/>
                                                                                <span
                                                                                    className="hightlighted_text color-decline">{Math.abs(calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.reach?.presentData, 2))}%</span>
                                                                            </>
                                                                    }
                                                                </>
                                                            }
                                                        </h4>
                                                    </div>
                                                    <div className="account_reach_overview_outer">
                                                        <h5 className="cmn_text_style">Accounts Engaged</h5>

                                                        <h4 className="cmn_text_style">
                                                            {
                                                                getAccountReachedAndAccountEngagedData?.loading ?
                                                                    <span><i className="fa fa-spinner fa-spin"/>
                                                                    </span> : getAccountReachedAndAccountEngagedData?.data?.engagement?.presentData
                                                            }

                                                            {
                                                                !getAccountReachedAndAccountEngagedData?.loading && <>
                                                                    {
                                                                        getAccountReachedAndAccountEngagedData?.data?.engagement?.presentData >= getAccountReachedAndAccountEngagedData?.data?.engagement?.previousData?.data ?
                                                                            <>
                                                                                <FiArrowUpRight className="top_Arrow"/>
                                                                                <span
                                                                                    className="hightlighted_text color-growth">+{calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.engagement?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.engagement?.presentData, 2)}%</span>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <FiArrowDownRight className="top_Arrow"/>
                                                                                <span
                                                                                    className="hightlighted_text color-decline">{Math.abs(calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.engagement?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.engagement?.presentData, 2))}%</span>
                                                                            </>
                                                                    }
                                                                </>
                                                            }
                                                        </h4>
                                                    </div>
                                                    <div className="account_reach_overview_outer">
                                                        <h5 className="cmn_text_style">Total Followers</h5>

                                                        <h4 className="cmn_text_style">
                                                            {
                                                                getTotalFollowersData?.loading ?
                                                                    <span><i className="fa fa-spinner fa-spin"/>
                                                                    </span> : (getTotalFollowersData?.data?.followers_count === null || getTotalFollowersData?.data?.followers_count === undefined) ? "N/A" : getTotalFollowersData?.data?.followers_count
                                                            }
                                                        </h4>
                                                    </div>
                                                </div>

                                                {/* account reach graph */}
                                                <div className="account_reach_graph_outer">
                                                    <h3 className="cmn_text_style">Audience Growth</h3>
                                                    <div className="page_title_header">
                                                        <div className="page_title_container">
                                                            <div className="page_title_dropdown">
                                                                {
                                                                    selectedPage?.socialMediaType === "PINTEREST" &&
                                                                    <div>
                                                                        {
                                                                            getAllByCustomerIdData?.data?.find(socialMediaAccount => socialMediaAccount?.provider === "PINTEREST")?.name
                                                                        }
                                                                    </div>

                                                                }
                                                                {
                                                                    selectedPage?.socialMediaType === "FACEBOOK" &&
                                                                    <select
                                                                        className="page_title_options cmn_headings"
                                                                        value={selectedPageForGraph?.id}
                                                                        onChange={(e) => {
                                                                            handleGraphPageChange(e.target.value, "FACEBOOK")
                                                                        }}>
                                                                        {
                                                                            connectedFacebookPages?.map((page, index) => {
                                                                                return <option key={index}
                                                                                               value={page?.id}>{page.name}</option>
                                                                            })
                                                                        }
                                                                    </select>

                                                                }
                                                                {
                                                                    selectedPage?.socialMediaType === "INSTAGRAM" &&
                                                                    <select
                                                                        className="page_title_options cmn_headings"
                                                                        value={selectedPageForGraph?.id}
                                                                        onChange={(e) => {
                                                                            handleGraphPageChange(e.target.value, "INSTAGRAM")
                                                                        }}>
                                                                        {
                                                                            connectedInstagramPages?.map((page, index) => {
                                                                                return <option key={index}
                                                                                               value={page?.id}>{page.name}</option>
                                                                            })
                                                                        }
                                                                    </select>

                                                                }


                                                                <h3 className="cmn_white_text instagram_overview_heading">
                                                                    {selectedPage?.socialMediaType} Overview
                                                                </h3>
                                                            </div>
                                                            <div className="days_outer">
                                                                <select className=" days_option box_shadow"
                                                                        value={selectedPeriodForGraph}
                                                                        onChange={handleSelectedGraphPeriod}>
                                                                    <option value={7}>Last 7 days</option>
                                                                    <option value={15}>Last 15 days</option>
                                                                    <option value={28}>Last 28 days</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <Chart
                                                            selectedPage={selectedPage}
                                                            isLoading={reportGraphSectionData?.loading}
                                                            graphData={reportGraphSectionData?.data}/>
                                                        <div className="account_info mt-2">
                                                            {
                                                                reportGraphSectionData?.data?.Accounts_Reached !== undefined &&
                                                                <div className="account_group">
                                                                    <div
                                                                        className="account_reached cmn_chart_btn"></div>
                                                                    <h4 className="cmn_headings">Accounts Reached</h4>
                                                                </div>
                                                            }
                                                            {
                                                                reportGraphSectionData?.data?.Followers !== undefined &&
                                                                <div className="account_group">
                                                                    <div className="total_follower cmn_chart_btn"></div>
                                                                    <h4 className="cmn_headings">Total Followers</h4>
                                                                </div>
                                                            }


                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>
                                            {/* Demographics tabs */}
                                            {
                                                selectedPage?.socialMediaType !== "PINTEREST" &&
                                                <Tab eventKey="Demographics" title="Demographics">
                                                    <h2 className="cmn_headings Review_Heading">Review your audience
                                                        demographics as
                                                        of
                                                        the last day of the reporting period.</h2>
                                                    <div className="row">
                                                        {/* audience by age */}
                                                        <div className="col-xl-6 col-lg-6 xol-md-12 col-sm-12">

                                                            <div
                                                                className={"Donuts_container cmn_insight_wrapper_style " + (getDemographicsInsightData?.data?.age !== null ? "cmn_height" : "")}>
                                                                <h3 className="cmn_text_style">Audience by Age</h3>

                                                                {
                                                                    getDemographicsInsightData?.loading ?
                                                                        <div
                                                                            className="text-center insights-loader cmn_height">
                                                                            <RotatingLines
                                                                                strokeColor="#F07C33"
                                                                                strokeWidth="5"
                                                                                animationDuration="0.75"
                                                                                width="96"
                                                                                visible={true}
                                                                            />
                                                                        </div> :
                                                                        getDemographicsInsightData?.data?.age ?
                                                                            <HorizontalBarChart
                                                                                graphData={getDemographicsInsightData?.data?.age}/> :
                                                                            <DemographicDatNotAvailable
                                                                                message={"Demographic data isn't available for age"}/>
                                                                }

                                                            </div>


                                                            {/* audience top countries */}
                                                            <div
                                                                className="Donuts_container cmn_insight_wrapper_style ">
                                                                <h3 className="cmn_text_style">Audience Top
                                                                    Countries</h3>

                                                                {
                                                                    getDemographicsInsightData?.loading ?
                                                                        <div
                                                                            className="text-center insights-loader mt-5">
                                                                            <RotatingLines
                                                                                strokeColor="#F07C33"
                                                                                strokeWidth="5"
                                                                                animationDuration="0.75"
                                                                                width="96"
                                                                                visible={true}
                                                                            />
                                                                        </div> :
                                                                        getDemographicsInsightData?.data?.country ?
                                                                            <ul className="top_city_list scroll-y">
                                                                                {
                                                                                    getDemographicsInsightData?.data?.country?.map(country => {
                                                                                        const countryInfo = Country.getCountryByCode(country?.country_code);
                                                                                        return (
                                                                                            <li>
                                                                                                <h4>{countryInfo?.flag + " " + countryInfo?.name} </h4>
                                                                                                <h4>{country?.value}</h4>
                                                                                            </li>
                                                                                        );
                                                                                    })
                                                                                } </ul> :
                                                                            <DemographicDatNotAvailable
                                                                                message={"Demographic data isn't available for country"}/>
                                                                }


                                                            </div>
                                                        </div>

                                                        {/* audience by gender */}
                                                        <div className="col-xl-6 col-lg-6 xol-md-12 col-sm-12">
                                                            <div>
                                                                <div
                                                                    className="Donuts_container cmn_insight_wrapper_style">
                                                                    <h3 className="cmn_text_style">Audience by
                                                                        Gender</h3>
                                                                    {
                                                                        getDemographicsInsightData?.loading ?
                                                                            <div
                                                                                className="text-center insights-loader cmn_height ">
                                                                                <RotatingLines
                                                                                    strokeColor="#F07C33"
                                                                                    strokeWidth="5"
                                                                                    animationDuration="0.75"
                                                                                    width="96"
                                                                                    visible={true}
                                                                                />
                                                                            </div> :
                                                                            getDemographicsInsightData?.data?.gender ?
                                                                                <DonutChart
                                                                                    graphData={getDemographicsInsightData?.data?.gender}/> :
                                                                                <DemographicDatNotAvailable
                                                                                    message={"Demographic data isn't available for gender"}/>
                                                                    }

                                                                </div>

                                                            </div>

                                                            {/* audience top cities */}
                                                            <div
                                                                className="Donuts_container cmn_insight_wrapper_style ">
                                                                <h3 className="cmn_text_style">Audience Top Cities</h3>

                                                                {
                                                                    getDemographicsInsightData?.loading ?
                                                                        <div
                                                                            className="text-center insights-loader mt-5">
                                                                            <RotatingLines
                                                                                strokeColor="#F07C33"
                                                                                strokeWidth="5"
                                                                                animationDuration="0.75"
                                                                                width="96"
                                                                                visible={true}
                                                                            />
                                                                        </div> :
                                                                        getDemographicsInsightData?.data?.city ?

                                                                            <ul className="top_city_list scroll-y">
                                                                                {
                                                                                    getDemographicsInsightData?.data?.city?.map(city => {
                                                                                        return (
                                                                                            <li>
                                                                                                <h4>{city?.city_name}</h4>
                                                                                                <h4>{city?.value}</h4>
                                                                                            </li>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </ul> :
                                                                            <DemographicDatNotAvailable
                                                                                message={"Demographic data isn't available for city"}/>
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                </Tab>
                                            }
                                        </Tabs>
                                    </div>
                                </>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Insight;

const DemographicDatNotAvailable = ({className = "", message = ""}) => {
    return (
        <div className={"" + className}>{message}</div>
    );
}