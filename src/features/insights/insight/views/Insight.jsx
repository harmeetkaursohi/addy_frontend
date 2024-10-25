import React, {useEffect, useState} from "react";
import "../views/insight.css"
import {Dropdown} from "react-bootstrap";
import instagram_img from "../../../../images/instagram.png";
import {FiArrowDownRight, FiArrowUpRight} from "react-icons/fi";
import DonutChart from "../../DonutsChart";
import HorizontalBarChart from "../../horizontalbar";
import Carousel from "../../slider/Slider";
import jsondata from "../../../../locales/data/initialdata.json"
import linkedin_img from "../../../../images/linkedin.svg"
import {
    calculatePercentageGrowthFor,
    createPostEngagementInsightsQuery,
    createSocialMediaProfileViewInsightsQuery,
    fetchCssForInsightPageListOption,
    groupBy,
    isNullOrEmpty,

} from "../../../../utils/commonUtils";
import {
    EmptyInsightGridMessage,
    enabledSocialMedia,
    selectGraphDaysOptions,
    SocialAccountProvider
} from "../../../../utils/contantData";
import Loader from "../../../loader/Loader";
import notConnected_img from "../../../../images/no_acc_connect_img.svg";
import ConnectSocialMediaAccount from "../../../common/components/ConnectSocialMediaAccount";
import {useAppContext} from "../../../common/components/AppProvider";
import default_user_icon from "../../../../images/default_user_icon.svg"
import calendar_img from "../../../../images/calender_img.svg"
import ProfileVisitChart from "../../../react_chart/views/Profile_visit_chart";
import no_page_select_bg from "../../../../images/no_page_select_bg.svg"
import no_data_available from "../../../../images/no_data_available.svg"
import {select} from "@syncfusion/ej2-react-schedule";
import cmt_icon from "../../../../images/cmt_icon.svg"
import user_icon from "../../../../images/user_icon.svg"
import bar_icon from "../../../../images/bar_icon.svg"
import heart_icon from "../../../../images/heart_icon.svg"
import PinterestGraph from "../../../react_chart/views/PinterestGraph";
import {RotatingLines} from "react-loader-spinner";
import {useGetConnectedSocialAccountQuery} from "../../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../../app/apis/pageAccessTokenApi";
import {
    useGetAccountsReachAndEngagementQuery,
    useGetDemographicsInsightQuery, useGetPinClicksQuery, useGetPostEngagementsQuery,
    useGetProfileInsightsInfoQuery,
    useGetProfileVisitsInsightsQuery
} from "../../../../app/apis/insightApi";
import SkeletonEffect from "../../../loader/skeletonEffect/SkletonEffect";

const Insight = () => {

    const {sidebar} = useAppContext();

    const [postStackPageNumber, setPostStackPageNumber] = useState(0)
    const [selectedPage, setSelectedPage] = useState(null);
    const [daysForProfileVisitGraph, setDaysForProfileVisitGraph] = useState(7);
    const [selectedDaysForPinClicks, setSelectedDaysForPinClicks] = useState(9)
    const [selectedDaysForPostEngagement, setSelectedDaysForPostEngagement] = useState(7)
    const [selectedPeriodForReachAndEngagement, setSelectedPeriodForReachAndEngagement] = useState(7);
    const [connectedFacebookPages, setConnectedFacebookPages] = useState(null);
    const [connectedInstagramPages, setConnectedInstagramPages] = useState(null);
    const [connectedLinkedinPages, setConnectedLinkedinPages] = useState(null);
    const [connectedPinterestBoards, setConnectedPinterestBoards] = useState(null);

    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")

    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")

    const profileInsightsApi = useGetProfileInsightsInfoQuery({
        socialMediaType: selectedPage?.socialMediaType,
        pageAccessToken: selectedPage?.access_token,
        pageId: selectedPage?.pageId
    }, {skip: isNullOrEmpty(selectedPage)})

    const demographicsInsightApi = useGetDemographicsInsightQuery({
        socialMediaType: selectedPage?.socialMediaType,
        pageAccessToken: selectedPage?.access_token,
        pageId: selectedPage?.pageId
    }, {skip: isNullOrEmpty(selectedPage) || selectedPage?.socialMediaType !== "LINKEDIN"})

    const profileVisitsApi = useGetProfileVisitsInsightsQuery({
        pageId: selectedPage?.pageId,
        socialMediaType: selectedPage?.socialMediaType,
        query: createSocialMediaProfileViewInsightsQuery({
            days: daysForProfileVisitGraph,
            access_token: selectedPage?.access_token,
            pageId: selectedPage?.pageId
        }, selectedPage?.socialMediaType)
    }, {skip: isNullOrEmpty(selectedPage) || isNullOrEmpty(daysForProfileVisitGraph) || selectedPage?.socialMediaType === "PINTEREST"})

    const accountsReachAndEngagementApi = useGetAccountsReachAndEngagementQuery({
        socialMediaType: selectedPage?.socialMediaType,
        pageAccessToken: selectedPage?.access_token,
        pageId: selectedPage?.pageId,
        period: selectedPeriodForReachAndEngagement
    }, {skip: isNullOrEmpty(selectedPage) || isNullOrEmpty(selectedPeriodForReachAndEngagement)})

    const pinClicksApi = useGetPinClicksQuery(selectedDaysForPinClicks, {skip: isNullOrEmpty(selectedPage) || isNullOrEmpty(selectedDaysForPinClicks) || selectedPage?.socialMediaType !== "PINTEREST"})

    const postEngagementsApi = useGetPostEngagementsQuery({
        socialMediaType: selectedPage?.socialMediaType,
        pageId: selectedPage?.pageId,
        query: createPostEngagementInsightsQuery({
            days: selectedDaysForPostEngagement,
            access_token: selectedPage?.access_token,
            pageId: selectedPage?.pageId
        }, selectedPage?.socialMediaType)
    }, {skip: isNullOrEmpty(selectedPage) || isNullOrEmpty(selectedDaysForPostEngagement) || selectedPage?.socialMediaType === "INSTAGRAM"})

    const isAccountInfoLoading = getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isFetching || getAllConnectedPagesApi?.isLoading

    useEffect(() => {
        if (!getConnectedSocialAccountApi?.isLoading && getConnectedSocialAccountApi?.data !== null && getConnectedSocialAccountApi?.data !== undefined && getConnectedSocialAccountApi?.data?.length > 0) {
            const socialAccountData = groupBy(getConnectedSocialAccountApi?.data, "provider")
            socialAccountData["FACEBOOK"]?.length > 0 ? setConnectedFacebookPages(socialAccountData["FACEBOOK"][0]?.pageAccessToken) : setConnectedFacebookPages([])
            socialAccountData["INSTAGRAM"]?.length > 0 ? setConnectedInstagramPages(socialAccountData["INSTAGRAM"][0]?.pageAccessToken) : setConnectedInstagramPages([])
            socialAccountData["LINKEDIN"]?.length > 0 ? setConnectedLinkedinPages(socialAccountData["LINKEDIN"][0]?.pageAccessToken) : setConnectedLinkedinPages([])
            socialAccountData["PINTEREST"]?.length > 0 ? setConnectedPinterestBoards(socialAccountData["PINTEREST"][0]?.pageAccessToken) : setConnectedPinterestBoards([])
        }

    }, [getConnectedSocialAccountApi])

    const handleSelectedPeriodForReachAndEngagement = (e) => {
        setSelectedPeriodForReachAndEngagement(parseInt(e.target.value))
    }

    const handleSelectPage = (socialMediaType, page) => {
        setDaysForProfileVisitGraph(7)
        setSelectedPeriodForReachAndEngagement(7)
        setPostStackPageNumber(0)
        setSelectedDaysForPostEngagement(7)
        setSelectedPage({...page, socialMediaType: socialMediaType})
    }

    return (
            <section>
                <div className={`insight_wrapper ${sidebar ? "cmn_container" : "cmn_Padding"}`}>
                    <div className="cmn_outer">
                        <div className="insight_outer  cmn_wrapper_outer white_bg_color cmn_height_outer">
                            <h2 className="insight_heading cmn_text_style">Insights</h2>
                            <h6 className="cmn_small_heading">{jsondata.insight_heading}</h6>
                            {
                                isAccountInfoLoading  &&
                                <div className={"mt-4"}>
                                    <h5 className="Choose_platform_title">Choose PlatForm</h5>
                                    <div className={"d-flex"}>
                                        <SkeletonEffect count={1} className={"mt-3 h-40 w-75"}/>
                                        <SkeletonEffect count={1} className={"mt-3 h-40 w-75"}/>
                                        <SkeletonEffect count={1} className={"mt-3 h-40 w-75"}/>
                                        <SkeletonEffect count={1} className={"mt-3 h-40 w-75"}/>
                                    </div>
                                </div>

                            }
                            {
                                getConnectedSocialAccountApi?.data?.length > 0 &&
                                <div className="insight_inner_content">
                                    <h5 className="Choose_platform_title">Choose PlatForm</h5>

                                    <div className="social_media_dropdown">
                                        {
                                            enabledSocialMedia.isFacebookEnabled &&
                                            <Dropdown className="chooseplatfrom_dropdown_btn">
                                                <Dropdown.Toggle
                                                    variant="success"
                                                    id="dropdown-basic"
                                                    className="instagram_dropdown"
                                                    disabled={!getConnectedSocialAccountApi?.data?.some(socialMedia => socialMedia.provider === SocialAccountProvider?.FACEBOOK?.toUpperCase())}
                                                >
                                                    <i className={`fa-brands fa-facebook me-2 `}
                                                       style={{color: "#0866ff", fontSize: "20px"}}/>
                                                    Facebook {(!connectedFacebookPages?.length && getConnectedSocialAccountApi?.isLoading) ?
                                                    <Loader className="social-account-loader"/> : (<></>)}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>
                                                        {(!connectedFacebookPages?.length && !getConnectedSocialAccountApi?.isLoading) ?
                                                            <h3 className="noPageHeading">No Page is Connected
                                                                yet</h3> : (<></>)}
                                                        <ul className="Social_media_wrapper">
                                                            {
                                                                connectedFacebookPages?.map((page, index) => {
                                                                    return (
                                                                        <li style={{...fetchCssForInsightPageListOption(page, selectedPage)}}
                                                                            key={index} onClick={() => {
                                                                            handleSelectPage("FACEBOOK", page)
                                                                        }}>
                                                                            <div className="Social_media_platform">
                                                                                <i className={`fa-brands fa-facebook   `}
                                                                                   style={{
                                                                                       color: "#0866ff",
                                                                                       fontSize: "20px"
                                                                                   }}/>
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
                                                    disabled={!getConnectedSocialAccountApi?.data?.some(socialMedia => socialMedia.provider === SocialAccountProvider?.INSTAGRAM?.toUpperCase())}
                                                >
                                                    <img src={instagram_img} className="me-2  "
                                                         style={{height: "18px", width: "18px"}}/>
                                                    Instagram {(!connectedInstagramPages?.length && getConnectedSocialAccountApi?.isLoading) ?
                                                    <Loader className="social-account-loader"/> : (<></>)}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>

                                                        {(!connectedInstagramPages?.length && !getConnectedSocialAccountApi?.isLoading) ?
                                                            <h3 className="noPageHeading">No Page is Connected
                                                                yet</h3> : (<></>)}
                                                        <ul className="Social_media_wrapper">
                                                            {
                                                                connectedInstagramPages?.map((page, index) => {
                                                                    return (
                                                                        <li style={{...fetchCssForInsightPageListOption(page, selectedPage)}}
                                                                            key={index} onClick={() => {
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
                                                    disabled={!getConnectedSocialAccountApi?.data?.some(socialMedia => socialMedia.provider === SocialAccountProvider?.PINTEREST?.toUpperCase())}
                                                >
                                                    <i className={`fa-brands fa-pinterest me-2 `}
                                                       style={{color: "#e60023", fontSize: "20px"}}/>

                                                    Pinterest {(!connectedPinterestBoards?.length && getConnectedSocialAccountApi?.isLoading) ?
                                                    <Loader className="social-account-loader"/> : (<></>)}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>


                                                    <Dropdown.Item>
                                                        {(!connectedPinterestBoards?.length && !getConnectedSocialAccountApi?.isLoading) ?
                                                            <h3 className="noPageHeading">No Page is Connected
                                                                yet</h3> : (<></>)}
                                                        <ul className="Social_media_wrapper">
                                                            {
                                                                connectedPinterestBoards?.map((board, index) => {
                                                                    return (
                                                                        <li
                                                                            style={{...fetchCssForInsightPageListOption(board, selectedPage)}}
                                                                            key={index} onClick={() => {
                                                                            handleSelectPage("PINTEREST", board)
                                                                        }}>
                                                                            <div className="Social_media_platform">
                                                                                <i className={`fa-brands fa-pinterest  `}
                                                                                   style={{
                                                                                       color: "#e60023",
                                                                                       fontSize: "20px"
                                                                                   }}/>
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
                                        {
                                            enabledSocialMedia.isLinkedinEnabled &&
                                            <Dropdown className="chooseplatfrom_dropdown_btn">
                                                <Dropdown.Toggle
                                                    variant="success"
                                                    id="dropdown-basic"
                                                    className="instagram_dropdown"
                                                    disabled={!getConnectedSocialAccountApi?.data?.some(socialMedia => socialMedia.provider === SocialAccountProvider?.LINKEDIN?.toUpperCase())}
                                                >
                                                    <img src={linkedin_img} className="me-2  "/>
                                                    Linkedin {(!connectedLinkedinPages?.length && getConnectedSocialAccountApi?.isLoading) ?
                                                    <Loader className="social-account-loader"/> : (<></>)}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>
                                                        {(!connectedLinkedinPages?.length && !getConnectedSocialAccountApi?.isLoading) ?
                                                            <h3 className="noPageHeading">No Page is Connected
                                                                yet</h3> : (<></>)}
                                                        <ul className="Social_media_wrapper">
                                                            {
                                                                connectedLinkedinPages?.map((page, index) => {
                                                                    return (
                                                                        <li style={{...fetchCssForInsightPageListOption(page, selectedPage)}}
                                                                            key={index} onClick={() => {
                                                                            handleSelectPage("LINKEDIN", page)
                                                                        }}>
                                                                            <div className="Social_media_platform">
                                                                                <img src={linkedin_img} className=" "/>
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


                                    {
                                        (selectedPage === null || selectedPage === undefined) ?
                                            <div className={"select-page-outer"}>
                                                <img src={no_page_select_bg} className="" alt=""/>

                                            </div>

                                            :
                                            <>
                                                {/* profile visit section */}
                                                <div className="row mt-4">
                                                    <div className="col-lg-4 col-md-12 col-sm-12">
                                                        {/* visitors demographics section starts here */}
                                                        {
                                                            selectedPage.socialMediaType === 'LINKEDIN' ?
                                                                <div
                                                                    className="cmn_shadow  insight_followers_outer visitors_container">
                                                                    <div className="d-flex cmn_border visitors_outer">
                                                                        <h3>Visitors Demographics</h3>

                                                                    </div>
                                                                    {(demographicsInsightApi?.data?.country === null || selectedPage.socialMediaType === "PINTEREST")
                                                                        ?
                                                                        <div
                                                                            className={"no_data_available text-center"}>
                                                                            <img className="no_data_available_img"
                                                                                 src={no_data_available}
                                                                                 alt={"coming soon!"}/>
                                                                        </div>
                                                                        :
                                                                        <DonutChart chartData={demographicsInsightApi}
                                                                                    socialMediaType={selectedPage?.socialMediaType}/>}
                                                                </div>

                                                                :
                                                                <div className="user_profile_card_outer cmn_shadow">

                                                                    <div
                                                                        className="user_profile_card_wrapper text-center mt-3">
                                                                        {
                                                                            (profileInsightsApi.isLoading || profileInsightsApi?.isFetching ) ?
                                                                                <>
                                                                                    <SkeletonEffect count={1} className={"profile-insight-img-loader m-auto"}/>
                                                                                    <SkeletonEffect count={1} className={"w-50 mt-2 m-auto"}/>
                                                                                    <SkeletonEffect count={1} className={"w-75 mt-2 m-auto"}/>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <img src={profileInsightsApi?.data?.imageUrl || default_user_icon}/>
                                                                                    <h3 className="cmn_text_style pt-4">{profileInsightsApi?.data?.name}</h3>
                                                                                    <h6 className="cmn_text pt-2">{profileInsightsApi?.data?.about || ""}</h6>
                                                                                </>
                                                                        }

                                                                    </div>

                                                                    {
                                                                        selectedPage?.socialMediaType === "FACEBOOK" &&
                                                                        <ul className="d-flex mt-4 user_info_list">
                                                                            <li>
                                                                                <h3 className="cmn_text">Likes</h3>
                                                                                <h4>{(profileInsightsApi.isLoading || profileInsightsApi?.isFetching ) ?
                                                                                    <SkeletonEffect count={1} className={"mt-2 "}/>
                                                                                    : profileInsightsApi?.data?.likes}</h4>
                                                                            </li>
                                                                            <li>
                                                                                <h3 className="cmn_text">Followers</h3>
                                                                                <h4>{(profileInsightsApi.isLoading || profileInsightsApi?.isFetching) ?
                                                                                    <SkeletonEffect count={1} className={"w-50 m-auto   mt-2 "}/>
                                                                                    : profileInsightsApi?.data?.followers}</h4>
                                                                            </li>
                                                                        </ul>
                                                                    }
                                                                    {
                                                                        selectedPage?.socialMediaType !== "FACEBOOK" &&
                                                                        <ul className="d-flex mt-4 user_info_list">
                                                                            <li>
                                                                                <h3 className="cmn_text">Post</h3>
                                                                                <h4 className="">{(profileInsightsApi.isLoading || profileInsightsApi?.isFetching ) ?
                                                                                    <SkeletonEffect count={1} className={"mt-2 "}/>
                                                                                    : profileInsightsApi?.data?.total_posts}</h4>
                                                                            </li>
                                                                            <li>
                                                                                <h3 className="cmn_text">Followers</h3>
                                                                                <h4>{(profileInsightsApi.isLoading || profileInsightsApi?.isFetching ) ?
                                                                                    <SkeletonEffect count={1} className={"w-50 m-auto mt-2 "}/>
                                                                                    : profileInsightsApi?.data?.followers}</h4>
                                                                            </li>
                                                                            <li>
                                                                                <h3 className="cmn_text">Following</h3>
                                                                                <h4>{(profileInsightsApi.isLoading || profileInsightsApi?.isFetching ) ?
                                                                                    <SkeletonEffect count={1} className={"w-50 m-auto mt-2 "}/>
                                                                                    : profileInsightsApi?.data?.following}</h4>
                                                                            </li>
                                                                        </ul>
                                                                    }
                                                                </div>}

                                                    </div>
                                                    <div className="col-lg-8 col-md-12 col-sm-12">
                                                        <div className="page_title_header mb-0 Profile_visit_container">
                                                            <div className="page_title_container ps-0">
                                                                <div className="page_title_dropdown">
                                                                    <div className={"profile-visit-text ms-4"}>Profile
                                                                        Visit
                                                                    </div>
                                                                </div>
                                                                <div className="days_outer">

                                                                    <Dropdown className="days_dropdown">
                                                                        <Dropdown.Toggle id="dropdown-basic">
                                                                            <img src={calendar_img} alt=""
                                                                                 className="me-2" height="20px"
                                                                                 width="20px"/>
                                                                            {`Last ${daysForProfileVisitGraph} days`}
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu>
                                                                            {selectGraphDaysOptions.map((c, i) => (

                                                                                <Dropdown.Item
                                                                                    key={i}
                                                                                    onClick={() => {
                                                                                        setDaysForProfileVisitGraph(c.days);
                                                                                    }}>
                                                                                    {c.label}
                                                                                </Dropdown.Item>
                                                                            ))}
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>

                                                                </div>
                                                            </div>

                                                            <div className="profile_visit_graph_outer mt-2">
                                                                {(selectedPage.socialMediaType === "PINTEREST" || (Array.isArray(profileVisitsApi?.data) && profileVisitsApi?.data?.length === 0))
                                                                    ?
                                                                    <div className={"no_data_available text-center"}>
                                                                        <img className="no_data_available_img  "
                                                                             src={no_data_available}
                                                                             alt={"coming soon!"}/>
                                                                    </div>
                                                                    :
                                                                    <ProfileVisitChart
                                                                        graphData={profileVisitsApi}
                                                                        socialMediaType={selectedPage?.socialMediaType}/>
                                                                }
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-4 mb-4">
                                                    {
                                                        false &&
                                                        <div className="col-lg-4 col-md-12 col-sm-12">
                                                            <div
                                                                className="cmn_shadow  insight_followers_outer visitors_container">
                                                                <div className="d-flex cmn_border visitors_outer">
                                                                    <h3>Followers</h3>

                                                                </div>
                                                                {(demographicsInsightApi?.data?.country === null || selectedPage.socialMediaType === "PINTEREST")
                                                                    ?
                                                                    <div className={"no_data_available text-center"}>
                                                                        <img className="no_data_available_img"
                                                                             src={no_data_available}
                                                                             alt={"coming soon!"}/>
                                                                    </div>
                                                                    :
                                                                    <DonutChart chartData={demographicsInsightApi}
                                                                                socialMediaType={selectedPage?.socialMediaType}/>}
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        false && <div className="col-lg-8 col-md-12 col-sm-12">
                                                            <div
                                                                className="cmn_shadow visitors_container insight_demographic_outer">
                                                                <div className="d-flex cmn_border visitors_outer">
                                                                    <h3>Demographics</h3>
                                                                </div>
                                                                {(selectedPage.socialMediaType === 'LINKEDIN' || selectedPage.socialMediaType === "PINTEREST" || selectedPage.socialMediaType === 'INSTAGRAM' || selectedPage.socialMediaType === 'FACEBOOK')
                                                                    ?
                                                                    <div className={"no_data_available text-center"}>
                                                                        <img className="no_data_available_img"
                                                                             src={no_data_available} alt={"coming soon!"}/>
                                                                    </div>
                                                                    :
                                                                    <HorizontalBarChart
                                                                        demographicData={demographicsInsightApi}/>}
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className={"mb-4"}></div>
                                                </div>
                                                {/* profile visit section end */}

                                                <div className="overview_tabs_outer cmn_insight_box_shadow">
                                                    <div className="days_outer reach-engagement-select">

                                                        <h3 className="overview_title">Overview</h3>

                                                        <select className=" dropdown_days box_shadow form-select w-auto"
                                                                value={selectedPeriodForReachAndEngagement}
                                                                onChange={handleSelectedPeriodForReachAndEngagement}>
                                                            <option value={7}>Last 7 days</option>
                                                            <option value={15}>Last 15 days</option>
                                                            <option value={28}>Last 28 days</option>
                                                        </select>
                                                    </div>


                                                    {!accountsReachAndEngagementApi?.isLoading && !accountsReachAndEngagementApi?.isFetching &&
                                                        <>
                                                            {
                                                                accountsReachAndEngagementApi?.data?.reach?.previousData?.data < accountsReachAndEngagementApi?.data?.reach?.presentData ?
                                                                    < h3 className="overview_text">
                                                                        You reached{" "}
                                                                        <span
                                                                            className="hightlighted_text color-growth ">+{calculatePercentageGrowthFor(accountsReachAndEngagementApi?.data?.reach?.previousData?.data, accountsReachAndEngagementApi?.data?.reach?.presentData, 2)}% </span>more
                                                                        accounts compared
                                                                        to {accountsReachAndEngagementApi?.data?.reach?.previousData?.dateRange}
                                                                    </h3> :
                                                                    <h3 className="overview_text">
                                                                        This indicates a decline of <span
                                                                        className="hightlighted_text">{Math.abs(calculatePercentageGrowthFor(accountsReachAndEngagementApi?.data?.reach?.previousData?.data, accountsReachAndEngagementApi?.data?.reach?.presentData, 2))}% </span> in
                                                                        the number of
                                                                        accounts reached compared to the period
                                                                        of {accountsReachAndEngagementApi?.data?.reach?.previousData?.dateRange}.
                                                                    </h3>
                                                            }
                                                        </>
                                                    }

                                                    {/* Accounts Reached */}
                                                    <div className="account_reach_overview_wrapper">
                                                        <div className="account_reach_overview_outer light_blue">
                                                            <div className="cmt_icon_outer">
                                                                <img src={bar_icon}/>

                                                            </div>
                                                            <h4 className="cmn_text_style">
                                                                {
                                                                    accountsReachAndEngagementApi?.isLoading || accountsReachAndEngagementApi?.isFetching ?
                                                                        <span><i className="fa fa-spinner fa-spin"/>
                                                                    </span> :
                                                                        accountsReachAndEngagementApi?.data?.reach?.presentData

                                                                }


                                                            </h4>

                                                            <h5 className="cmn_text_style">Accounts Reached</h5>
                                                            <div className="mt-3">
                                                                {
                                                                    (!accountsReachAndEngagementApi?.isLoading && !accountsReachAndEngagementApi?.isFetching) && <>
                                                                        {
                                                                            accountsReachAndEngagementApi?.data?.reach?.presentData >= accountsReachAndEngagementApi?.data?.reach?.previousData?.data ?
                                                                                <>
                                                                                    <FiArrowUpRight
                                                                                        className="top_Arrow"/>
                                                                                    <span
                                                                                        className="hightlighted_text color-growth post_growth">+{calculatePercentageGrowthFor(accountsReachAndEngagementApi?.data?.reach?.previousData?.data, accountsReachAndEngagementApi?.data?.reach?.presentData, 2)}%</span>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <FiArrowDownRight
                                                                                        className="top_Arrow"/>
                                                                                    <span
                                                                                        className="hightlighted_text post_growth">{Math.abs(calculatePercentageGrowthFor(accountsReachAndEngagementApi?.data?.reach?.previousData?.data, accountsReachAndEngagementApi?.data?.reach?.presentData, 2))}%</span>
                                                                                </>
                                                                        }
                                                                    </>
                                                                }

                                                            </div>

                                                        </div>
                                                        {/* acccount Engaged */}
                                                        <div className="account_reach_overview_outer light_orange">
                                                            <div className="cmt_icon_outer">
                                                                <img src={user_icon}/>

                                                            </div>


                                                            <h4 className="cmn_text_style">
                                                                {
                                                                    accountsReachAndEngagementApi?.isLoading || accountsReachAndEngagementApi?.isFetching ?
                                                                        <span><i className="fa fa-spinner fa-spin"/>
                                                                    </span> : accountsReachAndEngagementApi?.data?.engagement?.presentData
                                                                }


                                                            </h4>
                                                            <h5 className="cmn_text_style">Accounts Engaged</h5>
                                                            <div className="mt-3">
                                                                {!accountsReachAndEngagementApi?.isLoading && !accountsReachAndEngagementApi?.isFetching && <>
                                                                    {
                                                                        accountsReachAndEngagementApi?.data?.engagement?.presentData >= accountsReachAndEngagementApi?.data?.engagement?.previousData?.data ?
                                                                            <>
                                                                                <FiArrowUpRight
                                                                                    className="top_Arrow"/>
                                                                                <span
                                                                                    className="hightlighted_text color-growth post_growth">+{calculatePercentageGrowthFor(accountsReachAndEngagementApi?.data?.engagement?.previousData?.data, accountsReachAndEngagementApi?.data?.engagement?.presentData, 2)}%</span>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <FiArrowDownRight
                                                                                    className="top_Arrow"/>
                                                                                <span
                                                                                    className="hightlighted_text post_growth">{Math.abs(calculatePercentageGrowthFor(accountsReachAndEngagementApi?.data?.engagement?.previousData?.data, accountsReachAndEngagementApi?.data?.engagement?.presentData, 2))}%</span>
                                                                            </>
                                                                    }
                                                                </>
                                                                }

                                                            </div>

                                                        </div>
                                                        {/* acccount followers */}
                                                        <div className="account_reach_overview_outer light_purple">
                                                            <div className="cmt_icon_outer">
                                                                <img src={cmt_icon}/>
                                                            </div>
                                                            <h4 className="cmn_text_style">
                                                                {
                                                                    (profileInsightsApi.isLoading || profileInsightsApi?.isFetching) ?
                                                                        <span><i className="fa fa-spinner fa-spin"/>
                                                                    </span> : (profileInsightsApi?.data?.followers === null || profileInsightsApi?.data?.followers === undefined) ? "N/A" : profileInsightsApi?.data?.followers
                                                                }
                                                            </h4>
                                                            <h5 className="cmn_text_style">Total Followers</h5>
                                                        </div>

                                                        {/* acccount likes */}
                                                        <div className="account_reach_overview_outer light_green">

                                                            <div className="cmt_icon_outer">
                                                                <img src={heart_icon}/>
                                                            </div>
                                                            <h4 className="cmn_text_style">
                                                                {
                                                                    (profileInsightsApi.isLoading || profileInsightsApi?.isFetching) ?
                                                                        <span><i className="fa fa-spinner fa-spin"/>
                                                                    </span> : (profileInsightsApi?.data?.likes === null || profileInsightsApi?.data?.likes === undefined) ? "N/A" : profileInsightsApi?.data?.likes
                                                                }
                                                            </h4>
                                                            <h5 className="cmn_text_style">Accounts likes</h5>
                                                        </div>

                                                    </div>

                                                </div>

                                                {/* pin click section starts here */}
                                                {
                                                    selectedPage?.socialMediaType === "PINTEREST" &&
                                                    <div className="row">
                                                        <div className="col-lg-12 col-sm-12 col-md-12">
                                                            <div
                                                                className="page_title_header mb-0 Profile_visit_container">
                                                                <div className="page_title_container ps-0">
                                                                    <div className="page_title_dropdown">
                                                                        <div className={"profile-visit-text ms-4"}>Pin
                                                                            Click
                                                                        </div>
                                                                    </div>
                                                                    <select
                                                                        value={selectedDaysForPinClicks}
                                                                        onChange={(e) => {
                                                                            setSelectedDaysForPinClicks(e.target.value)
                                                                        }}
                                                                        className=" days_option box_shadow"
                                                                    >
                                                                        <option value={9}>Last 7 days</option>
                                                                        <option value={17}>Last 15 days</option>
                                                                        <option value={30}>Last 28 days</option>
                                                                    </select>
                                                                </div>

                                                                <div className="profile_visit_graph_outer mt-2">
                                                                    <PinterestGraph
                                                                        graphData={pinClicksApi?.data}
                                                                        isLoading={pinClicksApi?.isLoading || pinClicksApi?.isFetching}
                                                                    />

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>
                                                }
                                                {/* {interaction section start here} */}
                                                {
                                                    selectedPage?.socialMediaType !== "INSTAGRAM" &&
                                                    <div className="interaction_wrapper cmn_insight_box_shadow mt-5">
                                                        <div
                                                            className="days_outer reach-engagement-select interaction_outer">

                                                            <h3 className="overview_title">Interactions</h3>
                                                            {
                                                                <select
                                                                    value={selectedDaysForPostEngagement}
                                                                    className=" dropdown_days box_shadow form-select w-auto"
                                                                    onChange={(e) => {
                                                                        setSelectedDaysForPostEngagement(e.target.value)
                                                                    }}
                                                                >
                                                                    <option value={7}>Last 7 days</option>
                                                                    <option value={15}>Last 15 days</option>
                                                                    <option value={28}>Last 28 days</option>
                                                                </select>

                                                            }
                                                        </div>
                                                        <div className="interaction_graph_outer">
                                                            {
                                                                (postEngagementsApi?.isLoading || postEngagementsApi?.isFetching ) ?
                                                                    <div
                                                                        className="d-flex justify-content-center profile-visit-graph ">
                                                                        <RotatingLines
                                                                            strokeColor="#F07C33"
                                                                            strokeWidth="5"
                                                                            animationDuration="0.75"
                                                                            width="70"
                                                                            visible={true}
                                                                        />
                                                                    </div> :
                                                                    <HorizontalBarChart
                                                                        graphData={postEngagementsApi?.data}
                                                                        socialMediaType={selectedPage?.socialMediaType}
                                                                    />
                                                            }
                                                        </div>

                                                    </div>
                                                }

                                                {/* {interaction section end here} */}


                                                <button
                                                    className=" post_stack mt-5 "
                                                    style={{display: 'inline-block'}}
                                                > Posts stacks
                                                </button>
                                                {/* slider  */}
                                                <Carousel
                                                    postStackPageNumber={postStackPageNumber}
                                                    setPostStackPageNumber={setPostStackPageNumber}
                                                    selectedPage={selectedPage}
                                                />


                                            </>
                                    }
                                </div>

                            }
                            {
                                getConnectedSocialAccountApi?.data?.length === 0 &&
                                <div className={"no-account-connected-insights-outer mt-4 mb-3"}>
                                    <ConnectSocialMediaAccount image={notConnected_img}
                                                               message={EmptyInsightGridMessage}/>
                                </div>
                            }


                        </div>
                    </div>
                </div>
            </section>
        );
};

export default Insight;