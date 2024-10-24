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
import {SocialAccountProvider, enabledSocialMedia} from "../../../../utils/contantData";
import jsondata from "../../../../locales/data/initialdata.json";
import polygon_img from "../../../../images/polygon.svg";
import {useEffect, useState} from "react";
import {LineGraph} from "./LineGraph";
import {DashBoardReportLoader} from "./DashBoardReportLoader";
import default_user_icon from "../../../../images/default_user_icon.svg"
import avg_bar from "../../../../images/avg_bar.svg"
import followers_bar from "../../../../images/followers_bar.svg"
import Arrow_angle from "../../../../images/arrow_angle.svg"
import {
    useGetAllFacebookPagesQuery,
    useGetAllInstagramBusinessAccountsQuery, useGetAllLinkedinPagesQuery, useGetAllPinterestBoardsQuery,
    useGetConnectedSocialAccountQuery
} from "../../../../app/apis/socialAccount";
import {useGetAllConnectedPagesQuery} from "../../../../app/apis/pageAccessTokenApi";
import {getConnectedSocialMediaAccount} from "../../../../utils/dataFormatterUtils";
import {
    useGetSocialMediaGraphReportByPageQuery,
    useGetSocialMediaReportByPageQuery
} from "../../../../app/apis/insightApi";
import SkeletonEffect from "../../../loader/skeletonEffect/SkletonEffect";

export const DashboardReports = () => {

    const getConnectedSocialAccountApi = useGetConnectedSocialAccountQuery("")
    const getAllConnectedPagesApi = useGetAllConnectedPagesQuery("")
    const connectedSocialAccount = getConnectedSocialMediaAccount(getConnectedSocialAccountApi?.data || [])

    const getAllFacebookPagesApi = useGetAllFacebookPagesQuery({
        providerId: connectedSocialAccount?.facebook?.providerId,
        accessToken: connectedSocialAccount?.facebook?.accessToken
    }, {skip: !enabledSocialMedia?.isFacebookEnabled || isNullOrEmpty(connectedSocialAccount.facebook)})

    const getAllInstagramPagesApi = useGetAllInstagramBusinessAccountsQuery(connectedSocialAccount?.instagram?.accessToken, {skip: !enabledSocialMedia?.isInstagramEnabled || isNullOrEmpty(connectedSocialAccount.instagram)})

    const getAllPinterestPagesApi = useGetAllPinterestBoardsQuery(connectedSocialAccount?.pinterest?.id, {skip: !enabledSocialMedia?.isPinterestEnabled || isNullOrEmpty(connectedSocialAccount.pinterest)})

    const getAllLinkedinPagesApi = useGetAllLinkedinPagesQuery({
        q: "roleAssignee",
        role: "ADMINISTRATOR",
        state: "APPROVED"
    }, {skip: !enabledSocialMedia?.isLinkedinEnabled || isNullOrEmpty(connectedSocialAccount.linkedin)})

    const [connectedPagesToSelectedSocialMediaAccount, setConnectedPagesToSelectedSocialMediaAccount] = useState([])
    const [selectedPage, setSelectedPage] = useState(null);
    const [reportSelectedAccountType, setReportSelectedAccountType] = useState("");
    const [reportSelectedAccountData, setReportSelectedAccountData] = useState(null);
    const [graphDaysSelected, setGraphDaysSelected] = useState(9);

    const socialMediaReportApi = useGetSocialMediaReportByPageQuery({
        page: selectedPage
    }, {skip: isNullOrEmpty(selectedPage)})

    const socialMediaGraphReportApi = useGetSocialMediaGraphReportByPageQuery({
        page: selectedPage,
        query: getQueryForGraphData(selectedPage?.provider, graphDaysSelected),
    }, {skip: isNullOrEmpty(selectedPage)})


    useEffect(() => {
        if (getConnectedSocialAccountApi?.data && getAllConnectedPagesApi?.data && Array.isArray(getAllConnectedPagesApi?.data)) {
            let selectedSocialMediaAccount = getConnectedSocialAccountApi?.data?.find(c => c.provider === reportSelectedAccountType.toUpperCase() && getAllConnectedPagesApi?.data?.some(connectedPage => connectedPage?.socialMediaAccountId === c?.id))
            //  In case any account is disconnected and it was selected on reports section selectedSocialMediaAccount will be null so set 1st account selected
            if (selectedSocialMediaAccount === null || selectedSocialMediaAccount === undefined) {
                if (getAllConnectedPagesApi?.data?.length > 0) {
                    const enabledSocialMediaAccounts = getConnectedSocialAccountApi?.data?.filter(accountData => enabledSocialMedia["is" + getInitialLetterCap(accountData.provider.toLowerCase()) + "Enabled"])
                    const enabledSocialMediaAccountIds = enabledSocialMediaAccounts?.map(account => account.id)
                    const enabledPages = getAllConnectedPagesApi?.data?.filter(page => enabledSocialMediaAccountIds.includes(page.socialMediaAccountId))
                    selectedSocialMediaAccount = enabledSocialMediaAccounts?.find(accountData => accountData?.id === enabledPages?.[0]?.socialMediaAccountId)
                }
                setReportSelectedAccountType(selectedSocialMediaAccount?.provider || "")
            }
            setReportSelectedAccountData(selectedSocialMediaAccount);
            let connectedPagesToSelectedSocialMediaAccount = getAllConnectedPagesApi?.data?.filter(pageData => pageData?.socialMediaAccountId === selectedSocialMediaAccount?.id);
            const pagesDataFromSocialMedia = getPagesDataFromSocialMedia(selectedSocialMediaAccount?.provider, {
                facebook: getAllFacebookPagesApi,
                instagram: getAllInstagramPagesApi,
                linkedin: getAllLinkedinPagesApi,
                pinterest: getAllPinterestPagesApi,
            });
            // Get Updated Image Url For Dropdown
            connectedPagesToSelectedSocialMediaAccount = connectedPagesToSelectedSocialMediaAccount?.map((page) => {
                return {
                    ...page,
                    provider:selectedSocialMediaAccount?.provider,
                    imageUrl: getImageUrl(selectedSocialMediaAccount?.provider, pagesDataFromSocialMedia?.filter(c => c.id === page.pageId)[0])
                }
            });
            setConnectedPagesToSelectedSocialMediaAccount(connectedPagesToSelectedSocialMediaAccount)
            if (!isNullOrEmpty(connectedPagesToSelectedSocialMediaAccount)) {
                if (selectedSocialMediaAccount?.provider === "PINTEREST") {
                    (selectedPage === null || selectedPage.id !== selectedSocialMediaAccount?.id) && setSelectedPage(selectedSocialMediaAccount)
                } else {
                    (selectedPage === null || selectedPage.id !== connectedPagesToSelectedSocialMediaAccount[0]?.id) && setSelectedPage(connectedPagesToSelectedSocialMediaAccount[0])
                }
            } else {
                setSelectedPage(null)
            }
        }
    }, [getAllConnectedPagesApi, getConnectedSocialAccountApi, reportSelectedAccountType, getAllFacebookPagesApi, getAllInstagramPagesApi, getAllPinterestPagesApi, getAllLinkedinPagesApi]);


    useEffect(() => {
        setGraphDaysSelected(9)
    }, [reportSelectedAccountType]);


    return (

        <>

            <div className="col-lg-7 col-xl-8 col-sm-12 dashboardReport_outer ps-0">
                {
                   getConnectedSocialAccountApi?.isLoading  || getConnectedSocialAccountApi?.isFetching || getAllConnectedPagesApi?.isLoading || getAllConnectedPagesApi?.isFetching || getAllFacebookPagesApi?.isLoading || getAllFacebookPagesApi?.isFetching || getAllInstagramPagesApi?.isLoading || getAllInstagramPagesApi?.isFetching || getAllPinterestPagesApi?.isLoading || getAllPinterestPagesApi?.isFetching || getAllLinkedinPagesApi?.isLoading || getAllLinkedinPagesApi?.isFetching ?
                        <div className="cmn_background p-5 text-center account_not_connect_imcontainer ">
                            {/*<SkeletonEffect count={1} className={"w-50"}/>*/}
                            {/*<SkeletonEffect count={1} />*/}
                            {/*<SkeletonEffect count={1} />*/}
                            {/*<SkeletonEffect count={1} className={"graph-loader mt-4"} />*/}
                            <CommonLoader classname={"cmn_loader_outer"}/>
                        </div> :

                        ( isNullOrEmpty(connectedPagesToSelectedSocialMediaAccount) || getConnectedSocialAccountApi?.data === null || (Array.isArray(getConnectedSocialAccountApi?.data) && getConnectedSocialAccountApi?.data.filter(c => c.provider !== "GOOGLE").length === 0))
                            ?
                            <div className="cmn_background p-4 text-center account_not_connect_imcontainer">
                               <div className="text-end">
                               <img src={Arrow_angle} alt="" className="img-fluid"/>
                               </div>
                               <div className="not_account_content">
                                <h6>No Account is Connected yet!</h6>
                                <h5>Click on Connect Button to add your pages in Addy.</h5>
                                <img src={noAccountData} alt="" className="img-fluid"/>
                               </div>

                            </div>
                            :
                            // allAvailablePages?.filter(c => c.isConnected === true).length === 0 ?
                            // isNullOrEmpty(connectedPagesToSelectedSocialMediaAccount) ?
                            //     <div className=" p-5 text-center no_acc_container cmn_background">
                            //         <h6 className="no_acc_title">No Page is Connected yet!</h6>
                            //         <h3 className="connected_heading mt-3">Click on Connect to add your <br></br>pages
                            //             in
                            //             Addy.</h3>
                            //         <img src={noPageData} className="img-fluid mt-5" alt=""/>
                            //     </div>

                            //     :

                                <div className="post_activity_outer cmn_background p-3">

                                    <div
                                        className="d-flex gap-3 align-items-center postActivity_InnerWrapper dropdown_btn_Outer_container">

                                        <Dropdown className="dropdown_btn">

                                            <Dropdown.Toggle variant="success" id="dropdown-basic"
                                                             className="social_dropdowns"
                                                             disabled={getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || socialMediaReportApi?.isLoading || socialMediaReportApi?.isFetching || socialMediaGraphReportApi?.isLoading || socialMediaGraphReportApi?.isFetching}>
                                                <img src={computeImageURL(reportSelectedAccountType)}
                                                     className="me-3 review-post-icon"
                                                     alt={SocialAccountProvider[reportSelectedAccountType]}/>{SocialAccountProvider[reportSelectedAccountType]}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {
                                                    Object.keys(SocialAccountProvider).map((cur, index) => (
                                                        <Dropdown.Item
                                                            key={index}
                                                            disabled={!socialMediaAccountHasConnectedPages(cur, getConnectedSocialAccountApi?.data, getAllConnectedPagesApi?.data)}
                                                            onClick={() => {
                                                                setReportSelectedAccountData(getConnectedSocialAccountApi?.data.find(c => c.provider === cur))
                                                                setReportSelectedAccountType(cur)
                                                                setGraphDaysSelected(9)
                                                            }}>
                                                            <img
                                                                width={24}
                                                                src={computeImageURL(cur)}
                                                                className="me-3"/>
                                                            {getInitialLetterCap(SocialAccountProvider[cur])}
                                                        </Dropdown.Item>
                                                    ))
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Dropdown className="dropdown_btn facebook_pages">

                                            <Dropdown.Toggle variant="success" id="dropdown-basic"
                                                             className="social_dropdowns"
                                                             disabled={getConnectedSocialAccountApi?.isLoading || getConnectedSocialAccountApi?.isFetching || socialMediaReportApi?.isLoading || socialMediaReportApi?.isFetching || socialMediaGraphReportApi?.isLoading || socialMediaGraphReportApi?.isFetching}>
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
                                                                           onClick={() => {
                                                                               setSelectedPage(page)
                                                                           }}>
                                                                <img width={24}
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
                                        (socialMediaReportApi?.isLoading || socialMediaReportApi?.isFetching) ?

                                            //loader component
                                            <DashBoardReportLoader/>
                                            :
                                            <>
                                                {
                                                    //TODO-:enable this when api implemented....
                                                    false &&
                                                    <div className="Performing_Post_container">
                                                        <h3 className="cmn_text_heading">Dashboard <span
                                                            className="overview_heading nunito_font">Overview</span>
                                                        </h3>
                                                        <ul className="post_performing_list">
                                                            <li className="box_shadow">
                                                                <h4 className="cmn_text_style nunito_font">Avg
                                                                    Impression</h4>
                                                                <div className="postdata_wrapper">

                                                                    <img src={avg_bar}/>
                                                                    <div>
                                                                        <h5 className="cmn_text_heading">3.5k</h5>
                                                                        <span
                                                                            className="d-flex align-items-center gap-1"><div
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
                                                                        <span
                                                                            className="d-flex align-items-center gap-1"><div
                                                                            className="HiMiniArrowUpRight"><HiMiniArrowUpRight/></div> 89%</span>
                                                                    </div>

                                                                </div>
                                                            </li>

                                                            <li className="box_shadow">
                                                                <h4 className="cmn_text_style nunito_font">Avg
                                                                    Reach</h4>
                                                                <div className="postdata_wrapper">

                                                                    <img src={avg_bar}/>
                                                                    <div>
                                                                        <h5 className="cmn_text_heading">80%</h5>
                                                                        <span
                                                                            className="d-flex align-items-center gap-1"><div
                                                                            className="HiMiniArrowUpRight"><HiMiniArrowUpRight/></div> 89%</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                }
                                                <div className="followers_outer mt-3">

                                                    {
                                                        socialMediaReportApi?.data &&
                                                        Object.keys(socialMediaReportApi?.data).map((curKey, index) => (

                                                            <div className="followers_wrapper " key={index}>
                                                                <h5>{curKey.replace(/_/g, ' ')}
                                                                    {
                                                                        ["INSTAGRAM", "PINTEREST"].includes(reportSelectedAccountType) &&

                                                                        <>
                                                                            {/* <br/>
                                                                            <span
                                                                                className={"90-day-txt"}> {curKey !== 'Followers' ? '(last 90 days)' : ''}  </span> */}

                                                                        </>
                                                                    }
                                                                    {
                                                                        ["FACEBOOK"].includes(reportSelectedAccountType) &&
                                                                        <>
                                                                            {/* <br/>
                                                                            <span
                                                                                className={"90-day-txt"}> {curKey !== 'Followers' ? '(last 2 years)' : ''}  </span> */}
                                                                        </>
                                                                    }

                                                                </h5>
                                                                <div className="followers_inner_content">
                                                                    <h2>
                                                                        {
                                                                            socialMediaReportApi?.data[curKey]?.lifeTime || 0
                                                                        }
                                                                    </h2>
                                                                    <div className="monthly_growth">
                                                                        <span className="cmn_followers_btn">
                                                                            {/* <img src={polygon_img}
                                                                                 className="polygon_img"/> */}
                                                                            {
                                                                                socialMediaReportApi?.data[curKey]?.month || 0
                                                                            }
                                                                        </span>
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
                                                <select className=" dropdown_days box_shadow form-select"
                                                        value={graphDaysSelected}
                                                        onChange={(e) => setGraphDaysSelected(e?.target?.value || 8)}
                                                        disabled={getAllConnectedPagesApi?.isLoading || getAllConnectedPagesApi?.isFetching || getAllFacebookPagesApi?.isLoading || getAllFacebookPagesApi?.isFetching || socialMediaGraphReportApi?.isLoading || socialMediaGraphReportApi?.isFetching}>
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

                                            <LineGraph reportData={socialMediaGraphReportApi}/>

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
