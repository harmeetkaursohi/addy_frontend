import CommonLoader from "../../../common/components/CommonLoader";
import noAccountData from "../../../../images/no_social_account.svg";
import noPageData from "../../../../images/no_connected_ac_bg.svg";
import Dropdown from "react-bootstrap/Dropdown";
import {IoLocationOutline} from "react-icons/io5";
import {LuBarChart3} from "react-icons/lu";
import {HiMiniArrowUpRight} from "react-icons/hi2";
import send_icon from "../../../../images/send_icon.svg"
import {
    computeImageURL, getImageUrl,
    getInitialLetterCap, getPagesDataFromSocialMedia, getQueryForGraphData, isNullOrEmpty,
    socialMediaAccountHasConnectedPages
} from "../../../../utils/commonUtils";
import {SocialAccountProvider} from "../../../../utils/contantData";
import jsondata from "../../../../locales/data/initialdata.json";
import polygon_img from "../../../../images/polygon.svg";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getSocialMediaGraphByProviderTypeAction, getSocialMediaReportByProviderTypeAction
} from "../../../../app/actions/socialAccountActions/socialAccountActions";
import {LineGraph} from "./LineGraph";
import {DashBoardReportLoader} from "./DashBoardReportLoader";
import default_user_icon from "../../../../images/default_user_icon.svg"
import {getToken} from "../../../../app/auth/auth";
import avg_bar from "../../../../images/avg_bar.svg"
import followers_bar from "../../../../images/followers_bar.svg"

export const DashboardReports = () => {

    const token = getToken();
    const reportSectionData = useSelector(state => state.socialAccount.getSocialMediaReportByProviderTypeReducer);
    const reportGraphSectionData = useSelector(state => state.socialAccount.getSocialMediaGraphByProviderTypeReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesReducer = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const facebookPageListReducer = useSelector(state => state.facebook.getFacebookPageReducer);
    const instagramBusinessAccountsData = useSelector(state => state.socialAccount.getAllInstagramBusinessAccountsReducer);
    const pinterestBoardsData = useSelector(state => state.socialAccount.getAllPinterestBoardsReducer);
    const getAllLinkedinPagesData = useSelector(state => state.socialAccount.getAllLinkedinPagesReducer);

    const [connectedPagesToSelectedSocialMediaAccount, setConnectedPagesToSelectedSocialMediaAccount] = useState([])
    const [selectedPage, setSelectedPage] = useState(null);
    const dispatch = useDispatch();
    const [reportSelectedAccountType, setReportSelectedAccountType] = useState("");
    const [reportSelectedAccountData, setReportSelectedAccountData] = useState(null);
    const [graphDaysSelected, setGraphDaysSelected] = useState(9);


    useEffect(() => {
        if (getAllConnectedSocialAccountData?.data && connectedPagesReducer?.facebookConnectedPages && Array.isArray(connectedPagesReducer?.facebookConnectedPages)) {
            let selectedSocialMediaAccount = getAllConnectedSocialAccountData?.data?.find(c => c.provider === reportSelectedAccountType.toUpperCase() && connectedPagesReducer?.facebookConnectedPages?.some(connectedPage => connectedPage?.socialMediaAccountId === c?.id))
            //  In case any account is disconnected and it was selected on reports section selectedSocialMediaAccount will be null so set 1st account selected
            if (selectedSocialMediaAccount === null || selectedSocialMediaAccount === undefined) {
                if (connectedPagesReducer?.facebookConnectedPages?.length > 0) {
                    selectedSocialMediaAccount = getAllConnectedSocialAccountData?.data?.find(accountData => accountData?.id === connectedPagesReducer?.facebookConnectedPages[0].socialMediaAccountId)
                }
                setReportSelectedAccountType(selectedSocialMediaAccount?.provider || "")
            }
            setReportSelectedAccountData(selectedSocialMediaAccount);
            let connectedPagesToSelectedSocialMediaAccount = connectedPagesReducer?.facebookConnectedPages?.filter(pageData => pageData?.socialMediaAccountId === selectedSocialMediaAccount?.id);
            const pagesDataFromSocialMedia = getPagesDataFromSocialMedia(selectedSocialMediaAccount?.provider, {
                facebook: facebookPageListReducer,
                instagram: instagramBusinessAccountsData,
                linkedin: getAllLinkedinPagesData,
                pinterest: pinterestBoardsData,
            });
            // Get Updated Image Url For Dropdown
            connectedPagesToSelectedSocialMediaAccount = connectedPagesToSelectedSocialMediaAccount?.map((page) => {
                return {
                    ...page,
                    imageUrl: getImageUrl(selectedSocialMediaAccount?.provider, pagesDataFromSocialMedia?.filter(c => c.id === page.pageId)[0])
                }
            });
            setConnectedPagesToSelectedSocialMediaAccount(connectedPagesToSelectedSocialMediaAccount)
            if (!isNullOrEmpty(connectedPagesToSelectedSocialMediaAccount)) {
                selectedSocialMediaAccount?.provider === "PINTEREST" ? setSelectedPage(selectedSocialMediaAccount) : setSelectedPage(connectedPagesToSelectedSocialMediaAccount[0])
            } else {
                setSelectedPage(null)
            }
        }
    }, [connectedPagesReducer, getAllConnectedSocialAccountData, reportSelectedAccountType]);


    useEffect(() => {
        setGraphDaysSelected(9)
    }, [reportSelectedAccountType]);

    useEffect(() => {
        if (selectedPage) {
            handleFetchSocialMediaReport(null, null, false)
        }
    }, [selectedPage]);

    useEffect(() => {
        if (graphDaysSelected) {
            handleFetchSocialMediaReport(null, null, true);
        }
    }, [graphDaysSelected]);


    const handleFetchSocialMediaReport = (socialAccountData, pages, searchGraphOnly = false) => {
        if (selectedPage && reportSelectedAccountData && (reportSelectedAccountData?.provider === "PINTEREST" ? (selectedPage.id === reportSelectedAccountData.id) : (selectedPage.socialMediaAccountId === reportSelectedAccountData.id))) {
            !searchGraphOnly && dispatch(getSocialMediaReportByProviderTypeAction({
                token: token,
                pages: [selectedPage],
                socialMediaType: reportSelectedAccountType,
                socialAccountData: reportSelectedAccountData
            }))

            dispatch(getSocialMediaGraphByProviderTypeAction({
                token: token,
                pages: [selectedPage],
                socialMediaType: reportSelectedAccountType,
                socialAccountData: reportSelectedAccountData,
                query: getQueryForGraphData(reportSelectedAccountType, graphDaysSelected)
            }))
        }

    }


    return (

        <>

            <div className="col-lg-7 col-xl-8 col-sm-12 dashboardReport_outer">


                {getAllConnectedSocialAccountData?.loading || connectedPagesReducer?.loading || facebookPageListReducer?.loading || instagramBusinessAccountsData?.loading || pinterestBoardsData?.loading || getAllLinkedinPagesData?.loading ?
                    <div className="cmn_background p-5 text-center ">
                        <CommonLoader classname={"cmn_loader_outer"}/>
                    </div> :

                    (getAllConnectedSocialAccountData?.data === null || (Array.isArray(getAllConnectedSocialAccountData?.data) && getAllConnectedSocialAccountData?.data.filter(c => c.provider !== "GOOGLE").length === 0))

                        ?

                        <div className="cmn_background p-5 text-center ">
                            <img src={noAccountData} alt="" className="img-fluid"/>
                        </div>

                        :

                        // allAvailablePages?.filter(c => c.isConnected === true).length === 0 ?
                        isNullOrEmpty(connectedPagesToSelectedSocialMediaAccount) ?
                            <div className=" p-5 text-center ">
                                <h6 className="no_acc_title">No Page is Connected yet!</h6>
                                <h3 className="connected_heading mt-3">Click on Connect to add your <br></br>pages in
                                    Addy.</h3>
                                <img src={noPageData} className="img-fluid mt-5" alt=""/>
                            </div>

                            :

                            <div className="post_activity_outer mx-2">

                                <div
                                    className="d-flex gap-3 align-items-center postActivity_InnerWrapper dropdown_btn_Outer_container">

                                    {
                                        false && <div className="days_outer">
                                            <select className="custom_select_days dropdown_days "
                                                    value={graphDaysSelected}
                                                    onChange={(e) => setGraphDaysSelected(e?.target?.value || 8)}
                                                    disabled={connectedPagesReducer?.loading || facebookPageListReducer?.loading || reportGraphSectionData?.loading}>
                                                <option value={9}>Last 7 days</option>
                                                <option value={17}>Last 15 days</option>
                                                {
                                                    reportSelectedAccountType === "INSTAGRAM" ?
                                                        <option value={30}> Last 28 days</option> :
                                                        <option value={32}> Last 30 days</option>
                                                }

                                            </select>
                                        </div>
                                    }
                                    {
                                        false && <Dropdown className="dropdown_btn">

                                            <Dropdown.Toggle variant="success" id="dropdown-basic"
                                                             className="social_dropdowns"
                                                             disabled={getAllConnectedSocialAccountData?.loading || reportSectionData?.loading || reportGraphSectionData?.loading}>
                                                <img src={computeImageURL(reportSelectedAccountType)}
                                                     className="me-3 review-post-icon"
                                                     alt={SocialAccountProvider[reportSelectedAccountType]}/>
                                                {SocialAccountProvider[reportSelectedAccountType]}

                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {Object.keys(SocialAccountProvider).map((cur, index) => (

                                                    <div className="filters_outer" key={index}

                                                         disabled={!socialMediaAccountHasConnectedPages(cur, getAllConnectedSocialAccountData?.data, connectedPagesReducer?.facebookConnectedPages)}
                                                         onClick={() => {
                                                             setReportSelectedAccountData(getAllConnectedSocialAccountData?.data.find(c => c.provider === cur))
                                                             setReportSelectedAccountType(cur)
                                                             setGraphDaysSelected(9)


                                                         }}>
                                                        <div className="choose_platform_dropdown">
                                                            <img width={24}
                                                                 src={computeImageURL(cur)}
                                                            />
                                                            <h5 className="inter_font">{getInitialLetterCap(SocialAccountProvider[cur])}</h5>
                                                            <input type="checkbox"/>

                                                        </div>

                                                    </div>
                                                ))

                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    }
                                    <Dropdown className="dropdown_btn">

                                        <Dropdown.Toggle variant="success" id="dropdown-basic"
                                                         className="social_dropdowns"
                                                         disabled={getAllConnectedSocialAccountData?.loading || reportSectionData?.loading || reportGraphSectionData?.loading}>
                                            <img src={computeImageURL(reportSelectedAccountType)}
                                                 className="me-3 review-post-icon"
                                                 alt={SocialAccountProvider[reportSelectedAccountType]}/>{SocialAccountProvider[reportSelectedAccountType]}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {Object.keys(SocialAccountProvider).map((cur, index) => (

                                                <Dropdown.Item key={index}
                                                               disabled={!socialMediaAccountHasConnectedPages(cur, getAllConnectedSocialAccountData?.data, connectedPagesReducer?.facebookConnectedPages)}
                                                               onClick={() => {
                                                                   setReportSelectedAccountData(getAllConnectedSocialAccountData?.data.find(c => c.provider === cur))
                                                                   setReportSelectedAccountType(cur)
                                                                   setGraphDaysSelected(9)


                                                               }}><img width={24}
                                                                       src={computeImageURL(cur)}
                                                                       className="me-3"/> {getInitialLetterCap(SocialAccountProvider[cur])}
                                                </Dropdown.Item>
                                            ))

                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown className="dropdown_btn facebook_pages">

                                        <Dropdown.Toggle variant="success" id="dropdown-basic"
                                                         className="social_dropdowns"
                                                         disabled={getAllConnectedSocialAccountData?.loading || reportSectionData?.loading || reportGraphSectionData?.loading}>
                                            <img
                                                src={selectedPage?.imageUrl ? selectedPage?.imageUrl : default_user_icon}
                                                className="me-3 dropdown-page-logo"
                                                alt={""}/>{selectedPage?.name}
                                        </Dropdown.Toggle>

                                        {
                                            reportSelectedAccountType === "PINTEREST" ?
                                                <Dropdown.Menu>
                                                    <Dropdown.Item className="d-flex"
                                                                   onClick={() => {
                                                                       setSelectedPage(reportSelectedAccountData)
                                                                   }}><img width={24}
                                                                           src={reportSelectedAccountData?.imageUrl ? reportSelectedAccountData?.imageUrl : default_user_icon}
                                                                           className="me-3"/>
                                                        <span>{reportSelectedAccountData.name}</span>
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>

                                                :
                                                <Dropdown.Menu>
                                                    {connectedPagesToSelectedSocialMediaAccount?.map((page, index) => (

                                                        <Dropdown.Item key={index}
                                                                       className="d-flex"
                                                            // disabled={notConnectedSocialMediaAccount(cur, getAllConnectedSocialAccountData?.data)}
                                                                       onClick={() => {
                                                                           setSelectedPage(page)
                                                                           // setReportSelectedAccountData(getAllConnectedSocialAccountData?.data.find(c => c.provider === cur))
                                                                           // setReportSelectedAccountType(cur)


                                                                       }}><img width={24}
                                                                               src={page?.imageUrl ? page?.imageUrl : default_user_icon}
                                                                               className="me-3"/>
                                                            <span>{page.name}</span>
                                                        </Dropdown.Item>
                                                    ))

                                                    }
                                                </Dropdown.Menu>

                                        }


                                    </Dropdown>
                                </div>


                                {
                                    reportSectionData?.loading ?

                                        //loader component
                                        <DashBoardReportLoader/>
                                        :
                                        <>
                                            {

                                                //TODO-:enable this when api implemented....
                                                false && <div className="Performing_Post_container">
                                                    <h3 className="cmn_text_heading">Dashboard <span
                                                        className="overview_heading nunito_font">Overview</span></h3>
                                                    <ul className="post_performing_list">
                                                        <li className="box_shadow">
                                                            <h4 className="cmn_text_style nunito_font">Avg Impression</h4>
                                                            <div className="postdata_wrapper">

                                                                <img src={avg_bar}/>
                                                                <div>
                                                                    <h5 className="cmn_text_heading">3.5k</h5>
                                                                    <span className="d-flex align-items-center gap-1"><div
                                                                        className="HiMiniArrowUpRight"><HiMiniArrowUpRight/></div> 89%</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li className="box_shadow">
                                                            <h4 className="cmn_text_style nunito_font">Followers</h4>
                                                            <div className="postdata_wrapper">

                                                                <img src={followers_bar}/>
                                                                <div>
                                                                    <h5 className="cmn_text_heading">3.5k</h5>
                                                                    <span className="d-flex align-items-center gap-1"><div
                                                                        className="HiMiniArrowUpRight"><HiMiniArrowUpRight/></div> 89%</span>
                                                                </div>

                                                            </div>
                                                        </li>

                                                        <li className="box_shadow">
                                                            <h4 className="cmn_text_style nunito_font">Avg Reach</h4>
                                                            <div className="postdata_wrapper">

                                                                <img src={avg_bar}/>
                                                                <div>
                                                                    <h5 className="cmn_text_heading">80%</h5>
                                                                    <span className="d-flex align-items-center gap-1"><div
                                                                        className="HiMiniArrowUpRight"><HiMiniArrowUpRight/></div> 89%</span>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            }
                                            <div className="followers_outer mt-4">

                                                {reportSectionData?.data &&
                                                    Object.keys(reportSectionData?.data).map((curKey, index) => (

                                                        <div className="followers_wrapper " key={index}>

                                                            <h5>{curKey.replace(/_/g, ' ')}
                                                                {
                                                                    ["INSTAGRAM", "PINTEREST", "FACEBOOK"].includes(reportSelectedAccountType) &&
                                                                    <span
                                                                        className={"90-day-txt"}> {curKey === 'Post_Activity' && reportSelectedAccountType === "FACEBOOK" ? '(90 days)' : reportSelectedAccountType !== "FACEBOOK" ? '(90 days)' : ''}  </span>
                                                                }

                                                            </h5>
                                                            <div className="followers_inner_content">
                                                                <h2> {reportSectionData?.data[curKey]?.lifeTime || 0
                                                                }</h2>
                                                                <div className="monthly_growth">
                                                                    <button className="cmn_followers_btn">
                                                                        <img src={polygon_img} className="polygon_img"/>
                                                                        {reportSectionData?.data[curKey]?.month || 0}
                                                                    </button>
                                                                    <h6 className="cmn_headings">{jsondata.monthlyGrowth}</h6>
                                                                </div>
                                                            </div>
                                                        </div>


                                                    ))
                                                }

                                            </div>
                                        </>
                                }

                                {/* chart */}
                                <div className="page_title_header mb-0">
                                    <div className="page_title_container">
                                        <div className="page_title_dropdown">
                                            <h3 className="cmn_white_text instagram_overview_heading">{SocialAccountProvider[reportSelectedAccountType]?.charAt(0)?.toUpperCase() + SocialAccountProvider[reportSelectedAccountType]?.slice(1)} Overview</h3>
                                        </div>
                                        <div className="days_outer">
                                            <select className=" dropdown_days box_shadow"
                                                    value={graphDaysSelected}
                                                    onChange={(e) => setGraphDaysSelected(e?.target?.value || 8)}
                                                    disabled={connectedPagesReducer?.loading || facebookPageListReducer?.loading || reportGraphSectionData?.loading}>
                                                <option value={9}>Last 7 days</option>
                                                <option value={17}>Last 15 days</option>
                                                {
                                                    reportSelectedAccountType === "INSTAGRAM" ?
                                                        <option value={30}> Last 28 days</option> :
                                                        <option value={32}> Last 30 days</option>
                                                }

                                            </select>
                                        </div>

                                    </div>
                                    {/* <Chart/> */}

                                    <div className="account_info mt-2">

                                        <LineGraph reportData={reportGraphSectionData}/>

                                    </div>
                                </div>

                                {/* Performing Post */}
                                {
                                    false && <div className="Performing_Post_container">
                                        <h3 className="nunito_font">Performing Post</h3>
                                        <ul className="post_performing_list">
                                            <li className="box_shadow">
                                                <h4 className="cmn_text_style nunito_font">Organic Visitors</h4>
                                                <div className="d-flex gap-2 align-items-center p-3">
                                                    <div className="postdata_container ">
                                                        <IoLocationOutline/>
                                                    </div>
                                                    <h5 className="performing_post_heading nunito_font">3.5k</h5>

                                                </div>
                                            </li>
                                            <li className="box_shadow">
                                                <h4 className="cmn_text_style nunito_font">Visitors from Ads</h4>
                                                <div className="d-flex gap-2 align-items-center p-3">
                                                    <div className="postdata_container">
                                                        <LuBarChart3/>
                                                    </div>
                                                    <h5 className="performing_post_heading nunito_font">3.5k</h5>

                                                </div>
                                            </li>

                                            <li className="box_shadow">
                                                <h4 className="cmn_text_style nunito_font">Ads click rate</h4>
                                                <div className=" d-flex gap-2 align-items-center p-3">
                                                    <div className="postdata_container ">
                                                        <img src={send_icon} height="18px" width="18px"/>

                                                    </div>
                                                    <h5 className="performing_post_heading nunito_font">80%</h5>

                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                }

                            </div>
                }

            </div>


        </>
    )

}
