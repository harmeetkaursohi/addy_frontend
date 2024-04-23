import React, {useEffect, useState} from "react";
import "../views/insight.css"
import {Dropdown} from "react-bootstrap";
import instagram_img from "../../../../images/instagram.png";
import {FiArrowDownRight, FiArrowUpRight} from "react-icons/fi";
import DonutChart from "../../DonutsChart";
import HorizontalBarChart from "../../horizontalbar";
import Carousel from "../../slider/Slider";
import {useDispatch, useSelector} from "react-redux";
import {
    getAllByCustomerIdAction,
} from "../../../../app/actions/socialAccountActions/socialAccountActions";
import {getToken} from "../../../../app/auth/auth";
import linkedin_img from "../../../../images/linkedin.svg"
import {
    getAccountReachedAndAccountEngaged,
    getDemographicsInsight,
    getPostDataWithInsights,
    getProfileInsightsInfo,
    getProfileVisitsInsightsInfo
} from "../../../../app/actions/InsightActions/insightAction";
import {getPostByPageIdAndPostStatus} from "../../../../app/actions/postActions/postActions";
import {
    calculatePercentageGrowthFor, createSocialMediaProfileViewInsightsQuery,
    fetchCssForInsightPageListOption,
} from "../../../../utils/commonUtils";
import {enabledSocialMedia, selectGraphDaysOptions, SocialAccountProvider} from "../../../../utils/contantData";
import Loader from "../../../loader/Loader";
import CommonLoader from "../../../common/components/CommonLoader";
import ConnectSocialMediaAccount from "../../../common/components/ConnectSocialMediaAccount";
import {resetReducers} from "../../../../app/actions/commonActions/commonActions";
import {useAppContext} from "../../../common/components/AppProvider";
import default_user_icon from "../../../../images/default_user_icon.svg"
import calendar_img from "../../../../images/calender_img.svg"
import ProfileVisitChart from "../../../react_chart/views/Profile_visit_chart";
import no_page_select_bg from "../../../../images/no_page_select_bg.svg"
import no_data_available from "../../../../images/no_data_available.png"
import {select} from "@syncfusion/ej2-react-schedule";

const Insight = () => {
    const dispatch = useDispatch();
    const token = getToken();
    const {sidebar} = useAppContext();

    const getAllByCustomerIdData = useSelector(state => state.socialAccount.getAllByCustomerIdReducer);
    const getProfileInfoReducer = useSelector(state => state.insight.getProfileInfoReducer);
    const getProfileVisitsInsightsInfoReducerData = useSelector(state => state.insight.getProfileVisitsInsightsInfoReducer);
    const getAccountReachedAndAccountEngagedData = useSelector(state => state.insight.getAccountReachedAndAccountEngagedReducer);
    const getDemographicsInsightData = useSelector(state => state.insight.getDemographicsInsightReducer);
    const getPostByPageIdAndPostStatusData = useSelector(state => state.post.getPostByPageIdAndPostStatusReducer);
    const getPostDataWithInsightsData = useSelector((state) => state.insight.getPostDataWithInsightsReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesData = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);

    const [connectedFacebookPages, setConnectedFacebookPages] = useState(null);
    const [connectedInstagramPages, setConnectedInstagramPages] = useState(null);
    const [connectedLinkedinPages, setConnectedLinkedinPages] = useState(null);
    const [connectedPinterestBoards, setConnectedPinterestBoards] = useState(null);


    const [selectedPage, setSelectedPage] = useState(null);
    const [selectedPeriodForReachAndEngagement, setSelectedPeriodForReachAndEngagement] = useState(7);
    const [selectedDaysForProfileVisitGraph, setSelectedDaysForProfileVisitGraph] = useState(null);


    const [insightsCacheData, setInsightCacheData] = useState({
        getPostByPageIdAndPostStatusDataCache: {},
        getPostDataWithInsightsDataCache: []
    });

    const handleSelectedPeriodForReachAndEngagement = (e) => {
        e.preventDefault();
        setSelectedPeriodForReachAndEngagement(parseInt(e.target.value))
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
        setSelectedDaysForProfileVisitGraph(null)
        dispatch(resetReducers({sliceNames: ["getDemographicsInsightReducer"]}))
        setSelectedPage({...page, socialMediaType: socialMediaType})
    }


    useEffect(() => {
        if (selectedPage !== null && selectedPage !== undefined) {
            setSelectedDaysForProfileVisitGraph(7);
            setInsightCacheData({
                getPostByPageIdAndPostStatusDataCache: {},
                getPostDataWithInsightsDataCache: []
            })
        }
    }, [selectedPage])

    useEffect(() => {
        if (selectedPage !== null && selectedPage !== undefined) {
            dispatch(resetReducers({sliceNames: ["getPostDataWithInsightsReducer"]}))
            dispatch(getPostByPageIdAndPostStatus({
                token: token,
                requestBody: {
                    postStatuses: ["PUBLISHED"],
                    pageIds: [selectedPage?.pageId],
                    pageSize: 3,
                    pageNumber: 0
                }
            }));
        }
    }, [selectedPage])


    useEffect(() => {
        if (selectedPage !== null && selectedPage !== undefined) {
            dispatch(getProfileInsightsInfo({
                token: token,
                socialMediaType: selectedPage?.socialMediaType,
                pageAccessToken: selectedPage?.access_token,
                pageId: selectedPage?.pageId
            }))
        }
    }, [selectedPage])

    useEffect(() => {
        if (selectedPeriodForReachAndEngagement && selectedPage) {
            dispatch(getAccountReachedAndAccountEngaged({
                token: token,
                socialMediaType: selectedPage?.socialMediaType,
                pageAccessToken: selectedPage?.access_token,
                pageId: selectedPage?.pageId,
                period: selectedPeriodForReachAndEngagement
            }))
        }
    }, [selectedPeriodForReachAndEngagement, selectedPage])

    useEffect(() => {
        if (getPostByPageIdAndPostStatusData?.data?.data !== null && getPostByPageIdAndPostStatusData?.data?.data !== undefined && Object.keys(getPostByPageIdAndPostStatusData?.data?.data)?.length > 0) {
            const updatedInsightsCacheData = {
                ...insightsCacheData,
                getPostByPageIdAndPostStatusDataCache: {
                    ...insightsCacheData?.getPostByPageIdAndPostStatusDataCache,
                    [getPostByPageIdAndPostStatusData?.data?.pageNumber]: getPostByPageIdAndPostStatusData?.data
                }
            }
            setInsightCacheData(updatedInsightsCacheData)
            dispatch(getPostDataWithInsights({
                socialMediaType: selectedPage?.socialMediaType,
                pageAccessToken: selectedPage?.access_token,
                token: token,
                insightsCache: updatedInsightsCacheData,
                pageId: selectedPage?.pageId,
                postIds: getPostByPageIdAndPostStatusData?.data?.data[selectedPage?.pageId]?.map(post => post.postPageInfos[0]?.socialMediaPostId)
            }))
        }
    }, [getPostByPageIdAndPostStatusData])


    useEffect(() => {
        if (getPostDataWithInsightsData?.data !== undefined && getPostDataWithInsightsData?.data !== null) {
            const postWithInsightsDataArray = Object.keys(getPostDataWithInsightsData?.data)?.map(socialMediaPostId => {
                return {[socialMediaPostId]: getPostDataWithInsightsData?.data[socialMediaPostId]}
            })
            const seen = new Set();
            let withoutDuplicates = [...insightsCacheData?.getPostDataWithInsightsDataCache, ...postWithInsightsDataArray]?.filter(postWithInsightData => {
                let postId = Object?.keys(postWithInsightData)[0];
                if (!seen.has(postId)) {
                    seen.add(postId);
                    return true;
                }
                return false;
            })

            setInsightCacheData({
                ...insightsCacheData,
                getPostDataWithInsightsDataCache: [...withoutDuplicates]
            })
        }
    }, [getPostDataWithInsightsData]);

    useEffect(() => {
        if (selectedPage !== undefined && selectedPage !== null) {
            dispatch(getDemographicsInsight({
                socialMediaType: selectedPage?.socialMediaType,
                pageAccessToken: selectedPage?.access_token,
                pageId: selectedPage?.pageId,
            }))
        }
    }, [selectedPage])


    useEffect(() => {
        if (selectedPage !== null && selectedPage !== undefined && selectedDaysForProfileVisitGraph !== null && selectedDaysForProfileVisitGraph !== undefined) {
            let query = {
                token: token,
                pages: [selectedPage],
                pageId: selectedPage?.pageId,
                socialMediaType: selectedPage?.socialMediaType,
                query: createSocialMediaProfileViewInsightsQuery({
                    days: selectedDaysForProfileVisitGraph,
                    access_token: selectedPage.access_token,
                    pageId:selectedPage?.pageId
                }, selectedPage?.socialMediaType)
            }
            dispatch(getProfileVisitsInsightsInfo(query))
        }
    }, [selectedDaysForProfileVisitGraph])


    return (
        <section>
            <div className={`insight_wrapper ${sidebar ? "cmn_container" : "cmn_Padding"}`}>
                <div className="cmn_outer">
                    <div className="insight_outer  cmn_wrapper_outer white_bg_color cmn_height_outer">
                        <h2 className="insight_heading cmn_text_style">Insights</h2>
                        <h6 className="cmn_small_heading"> Assess post performance and audience engagement across
                            multiple social media platforms.</h6>
                        {
                            (getAllConnectedSocialAccountData?.loading || connectedPagesData?.loading) ?
                                <CommonLoader></CommonLoader> :
                                getAllConnectedSocialAccountData?.data?.length > 0 &&
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
                                                    disabled={!getAllConnectedSocialAccountData?.data?.some(socialMedia => socialMedia.provider === SocialAccountProvider?.FACEBOOK?.toUpperCase())}
                                                >
                                                    <i className={`fa-brands fa-facebook me-2 `}
                                                       style={{color: "#0866ff", fontSize: "20px"}}/>
                                                    Facebook {(!connectedFacebookPages?.length && getAllByCustomerIdData?.loading) ?
                                                    <Loader className="social-account-loader"/> : (<></>)}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>
                                                        {(!connectedFacebookPages?.length && !getAllByCustomerIdData?.loading) ?
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
                                                                                <i className={`fa-brands fa-facebook me-3  `}
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
                                                    disabled={!getAllConnectedSocialAccountData?.data?.some(socialMedia => socialMedia.provider === SocialAccountProvider?.INSTAGRAM?.toUpperCase())}
                                                >
                                                    <img src={instagram_img} className="me-2  "
                                                         style={{height: "18px", width: "18px"}}/>
                                                    Instagram {(!connectedInstagramPages?.length && getAllByCustomerIdData?.loading) ?
                                                    <Loader className="social-account-loader"/> : (<></>)}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>

                                                        {(!connectedInstagramPages?.length && !getAllByCustomerIdData?.loading) ?
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
                                                    disabled={!getAllConnectedSocialAccountData?.data?.some(socialMedia => socialMedia.provider === SocialAccountProvider?.PINTEREST?.toUpperCase())}
                                                >
                                                    <i className={`fa-brands fa-pinterest me-2 `}
                                                       style={{color: "#e60023", fontSize: "20px"}}/>

                                                    Pinterest {(!connectedPinterestBoards?.length && getAllByCustomerIdData?.loading) ?
                                                    <Loader className="social-account-loader"/> : (<></>)}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>


                                                    <Dropdown.Item>
                                                        {(!connectedPinterestBoards?.length && !getAllByCustomerIdData?.loading) ?
                                                            <h3 className="noPageHeading">No Page is Connected
                                                                yet</h3> : (<></>)}
                                                        <ul className="Social_media_wrapper">
                                                            {
                                                                connectedPinterestBoards?.map((board, index) => {
                                                                    return (
                                                                        <li style={{...fetchCssForInsightPageListOption(board, selectedPage)}}
                                                                            key={index} onClick={() => {
                                                                            handleSelectPage("PINTEREST", board)
                                                                        }}>
                                                                            <div className="Social_media_platform">
                                                                                <i className={`fa-brands fa-pinterest me-3 `}
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
                                                    disabled={!getAllConnectedSocialAccountData?.data?.some(socialMedia => socialMedia.provider === SocialAccountProvider?.LINKEDIN?.toUpperCase())}
                                                >
                                                    <img src={linkedin_img} className="me-2  "/>
                                                    Linkedin {(!connectedLinkedinPages?.length && getAllByCustomerIdData?.loading) ?
                                                    <Loader className="social-account-loader"/> : (<></>)}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>
                                                        {(!connectedLinkedinPages?.length && !getAllByCustomerIdData?.loading) ?
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
                                                        <div className="user_profile_card_outer cmn_shadow">

                                                            <div className="user_profile_card_wrapper text-center mt-3">
                                                                {
                                                                    getProfileInfoReducer.loading ?
                                                                        <i
                                                                            style={{fontSize: "60px"}}
                                                                            className="fa fa-spinner fa-spin"/> :
                                                                        <img
                                                                            src={getProfileInfoReducer?.data?.imageUrl || default_user_icon}/>
                                                                }
                                                                <h3 className="cmn_text_style pt-4">{getProfileInfoReducer?.data?.name}</h3>
                                                                <h6 className="cmn_text pt-2">
                                                                    {
                                                                        getProfileInfoReducer?.data?.about || ""
                                                                    }
                                                                </h6>
                                                            </div>

                                                            {
                                                                selectedPage?.socialMediaType === "FACEBOOK" &&
                                                                <ul className="d-flex mt-4 user_info_list">
                                                                    <li>
                                                                        <h3 className="cmn_text">Likes</h3>
                                                                        <h4>{getProfileInfoReducer.loading ?
                                                                            <i className="fa fa-spinner fa-spin"/> : getProfileInfoReducer?.data?.likes}</h4>
                                                                    </li>
                                                                    <li>
                                                                        <h3 className="cmn_text">Followers</h3>
                                                                        <h4>{getProfileInfoReducer.loading ?
                                                                            <i className="fa fa-spinner fa-spin"/> : getProfileInfoReducer?.data?.followers}</h4>
                                                                    </li>
                                                                </ul>
                                                            }
                                                            {
                                                                selectedPage?.socialMediaType !== "FACEBOOK" &&
                                                                <ul className="d-flex mt-4 user_info_list">
                                                                    <li>
                                                                        <h3 className="cmn_text">Post</h3>
                                                                        <h4 className="">{getProfileInfoReducer.loading ?
                                                                            <i className="fa fa-spinner fa-spin"/> : getProfileInfoReducer?.data?.total_posts}</h4>
                                                                    </li>
                                                                    <li>
                                                                        <h3 className="cmn_text">Followers</h3>
                                                                        <h4>{getProfileInfoReducer.loading ?
                                                                            <i className="fa fa-spinner fa-spin"/> : getProfileInfoReducer?.data?.followers}</h4>
                                                                    </li>
                                                                    <li>
                                                                        <h3 className="cmn_text">Following</h3>
                                                                        <h4>{getProfileInfoReducer.loading ?
                                                                            <i className="fa fa-spinner fa-spin"/> : getProfileInfoReducer?.data?.following}</h4>
                                                                    </li>
                                                                </ul>
                                                            }
                                                        </div>
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
                                                                            {`Last ${selectedDaysForProfileVisitGraph} days`}
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu>
                                                                            {selectGraphDaysOptions.map((c,i)=> (
                                                                             
                                                                                <Dropdown.Item
                                                                                key={i}
                                                                                    onClick={() => {
                                                                                        setSelectedDaysForProfileVisitGraph(c.days);
                                                                                    }}>
                                                                                    {c.label}
                                                                                </Dropdown.Item>
                                                                            ))}
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>

                                                                </div>
                                                            </div>

                                                            <div className="profile_visit_graph_outer mt-2">
                                                                {(selectedPage.socialMediaType === 'LINKEDIN' || selectedPage.socialMediaType === "PINTEREST" || (Array.isArray(getProfileVisitsInsightsInfoReducerData?.data) && getProfileVisitsInsightsInfoReducerData?.data?.length === 0))
                                                                    ?
                                                                    <div className={"no_data_available text-center"}>
                                                                        <img src={no_data_available}
                                                                             alt={"coming soon!"}/>
                                                                    </div>
                                                                    :
                                                                    <ProfileVisitChart
                                                                        graphData={getProfileVisitsInsightsInfoReducerData}/>
                                                                }
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-4 mb-4">
                                                    <div className="col-lg-4 col-md-12 col-sm-12">
                                                        <div className="cmn_shadow visitors_container">
                                                            <div className="d-flex cmn_border visitors_outer">
                                                                <h3>Followers</h3>

                                                            </div>
                                                            {(getDemographicsInsightData?.data?.country === null ||  selectedPage.socialMediaType === "PINTEREST")
                                                                ?
                                                                <div className={"no_data_available text-center"}>
                                                                    <img src={no_data_available} alt={"coming soon!"}/>
                                                                </div>
                                                                :
                                                                <DonutChart chartData={getDemographicsInsightData} socialMediaType={selectedPage?.socialMediaType}/>}
                                                        </div>
                                                    </div>
                                                    {
                                                        false && <div className="col-lg-8 col-md-12 col-sm-12">
                                                            <div className="cmn_shadow visitors_container">
                                                                <div className="d-flex cmn_border visitors_outer">
                                                                    <h3>Demographics</h3>
                                                                </div>
                                                                {(selectedPage.socialMediaType === 'LINKEDIN' || selectedPage.socialMediaType === "PINTEREST" || selectedPage.socialMediaType === 'INSTAGRAM' || selectedPage.socialMediaType === 'FACEBOOK')
                                                                    ?
                                                                    <div className={"no_data_available text-center"}>
                                                                        <img src={no_data_available} alt={"coming soon!"}/>
                                                                    </div>
                                                                    :
                                                                    <HorizontalBarChart
                                                                        demographicData={getDemographicsInsightData}/>}
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className={"mb-4"}></div>
                                                </div>
                                                {/* profile visit section end */}


                                                <div className="overview_tabs_outer">
                                                    <div className="days_outer reach-engagement-select">

                                                        <button className="overview_btn">Overview</button>

                                                        <select className=" days_option box_shadow"
                                                                value={selectedPeriodForReachAndEngagement}
                                                                onChange={handleSelectedPeriodForReachAndEngagement}>
                                                            <option value={7}>Last 7 days</option>
                                                            <option value={15}>Last 15 days</option>
                                                            <option value={28}>Last 28 days</option>
                                                        </select>
                                                    </div>


                                                    {!getAccountReachedAndAccountEngagedData?.loading &&
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
                                                                        className="hightlighted_text">{Math.abs(calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.reach?.presentData, 2))}% </span> in
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
                                                                                    <FiArrowUpRight
                                                                                        className="top_Arrow"/>
                                                                                    <span
                                                                                        className="hightlighted_text color-growth">+{calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.reach?.presentData, 2)}%</span>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    <FiArrowDownRight
                                                                                        className="top_Arrow"/>
                                                                                    <span
                                                                                        className="hightlighted_text">{Math.abs(calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.reach?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.reach?.presentData, 2))}%</span>
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

                                                                {!getAccountReachedAndAccountEngagedData?.loading && <>
                                                                    {
                                                                        getAccountReachedAndAccountEngagedData?.data?.engagement?.presentData >= getAccountReachedAndAccountEngagedData?.data?.engagement?.previousData?.data ?
                                                                            <>
                                                                                <FiArrowUpRight
                                                                                    className="top_Arrow"/>
                                                                                <span
                                                                                    className="hightlighted_text color-growth">+{calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.engagement?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.engagement?.presentData, 2)}%</span>
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <FiArrowDownRight
                                                                                    className="top_Arrow"/>
                                                                                <span
                                                                                    className="hightlighted_text">{Math.abs(calculatePercentageGrowthFor(getAccountReachedAndAccountEngagedData?.data?.engagement?.previousData?.data, getAccountReachedAndAccountEngagedData?.data?.engagement?.presentData, 2))}%</span>
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
                                                                    getProfileInfoReducer?.loading ?
                                                                        <span><i className="fa fa-spinner fa-spin"/>
                                                                    </span> : (getProfileInfoReducer?.data?.followers === null || getProfileInfoReducer?.data?.followers === undefined) ? "N/A" : getProfileInfoReducer?.data?.followers
                                                                }
                                                            </h4>
                                                        </div>
                                                    </div>

                                                </div>

                                                <button className="overview_btn mt-5 "
                                                        style={{display: 'inline-block'}}> Posts stacks
                                                </button>
                                                {/* slider  */}
                                                <Carousel selectedPage={selectedPage} cacheData={insightsCacheData}/>


                                            </>
                                    }
                                </div>

                        }
                        {
                            getAllConnectedSocialAccountData?.data?.length === 0 &&
                            <div className={"no-account-connected-insights-outer mt-4 mb-3"}>
                                <ConnectSocialMediaAccount messageFor={"ACCOUNT"}/>
                            </div>

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
        <div className={"demographic_data " + className}>{message}</div>
    );
}
