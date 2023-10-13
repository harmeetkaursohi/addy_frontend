import CommonLoader from "../../../common/components/CommonLoader";
import noAccountData from "../../../../images/no_social_account.png";
import Dropdown from "react-bootstrap/Dropdown";
import {
    computeImageURL,
    getCustomDateEarlierUnixDateTime,
    isPageConnected,
    notConnectedSocialMediaAccount
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

export const DashboardReports = () => {

    const reportSectionData = useSelector(state => state.socialAccount.getSocialMediaReportByProviderTypeReducer);
    const reportGraphSectionData = useSelector(state => state.socialAccount.getSocialMediaGraphByProviderTypeReducer);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const connectedPagesReducer = useSelector(state => state.facebook.getFacebookConnectedPagesReducer);
    const facebookPageListReducer = useSelector(state => state.facebook.getFacebookPageReducer);

    const dispatch = useDispatch();
    const [reportSelectedAccountType, setReportSelectedAccountType] = useState("FACEBOOK");
    const [reportSelectedAccountData, setReportSelectedAccountData] = useState(null);
    const [reportSelectPages, setReportSelectedPages] = useState(null);
    const [allAvailablePages, setAllAvailablePages] = useState([]);
    const [allSelected, isAllSelected] = useState(true);
    const [graphDaysSelected, setGraphDaysSelected] = useState(9);


    useEffect(() => {

        if (getAllConnectedSocialAccountData?.data && connectedPagesReducer?.facebookConnectedPages && Array.isArray(connectedPagesReducer?.facebookConnectedPages) && Array.isArray(facebookPageListReducer?.facebookPageList)) {

            if (reportSelectedAccountType) {
                setAllAvailablePages(facebookPageListReducer?.facebookPageList?.map(c => {
                    return {...c, isConnected: isPageConnected(connectedPagesReducer?.facebookConnectedPages, c)}
                }))
                isAllSelected(true)
                setReportSelectedAccountData(getAllConnectedSocialAccountData?.data.find(c => c.provider === reportSelectedAccountType))
                setReportSelectedPages(connectedPagesReducer?.facebookConnectedPages);
            }
        }

    }, [connectedPagesReducer, facebookPageListReducer, getAllConnectedSocialAccountData]);

    useEffect(() => {
        if (reportSelectPages) {
            handleFetchSocialMediaReport(null, null, false)
        }

    }, [reportSelectPages]);

    useEffect(() => {
        if (graphDaysSelected) {
            handleFetchSocialMediaReport(null, null, true);
        }
    }, [graphDaysSelected]);

    const handleFetchSocialMediaReport = (socialAccountData, pages, searchGraphOnly = false) => {

        !searchGraphOnly && dispatch(getSocialMediaReportByProviderTypeAction({
            pages: pages === null ? reportSelectPages : pages,
            socialAccountType: reportSelectedAccountType,
            socialAccountData: socialAccountData === null ? reportSelectedAccountData : socialAccountData
        }))

        dispatch(getSocialMediaGraphByProviderTypeAction({
            pages: pages === null ? reportSelectPages : pages,
            socialAccountType: reportSelectedAccountType,
            socialAccountData: socialAccountData === null ? reportSelectedAccountData : socialAccountData,
            query: {
                createdFrom: getCustomDateEarlierUnixDateTime(graphDaysSelected),
                createdTo: getCustomDateEarlierUnixDateTime(1)
            }
        }))
    }

    const handleClick = (type, pageParams) => {
        isAllSelected(type === "All");
        setReportSelectedPages(pageParams);
    }

    return (

        <>

            <div className="col-lg-7 col-xl-8 col-sm-12">

                {getAllConnectedSocialAccountData?.loading || connectedPagesReducer?.loading || facebookPageListReducer?.loading ?
                    <div className="cmn_background p-5 text-center ">
                        <CommonLoader/>
                    </div> :

                    (getAllConnectedSocialAccountData?.data === null || (Array.isArray(getAllConnectedSocialAccountData?.data) && getAllConnectedSocialAccountData?.data.filter(c => c.provider !== "GOOGLE").length === 0))

                        ?

                        <div className="cmn_background p-5 text-center ">
                            <img src={noAccountData} alt="" className="img-fluid"/>
                        </div>

                        :

                        allAvailablePages?.filter(c => c.isConnected === true).length === 0 ?

                            <div className="cmn_background p-5 text-center ">
                                <img src={noAccountData} className="img-fluid" alt=""/>
                            </div>

                            :

                            <div className="post_activity_outer cmn_background">

                                <Dropdown className="dropdown_btn">

                                    <Dropdown.Toggle variant="success" id="dropdown-basic"
                                                     className="social_dropdowns"
                                                     disabled={getAllConnectedSocialAccountData?.laoding || reportSectionData?.loading || reportGraphSectionData?.loading}>
                                        <img src={computeImageURL(reportSelectedAccountType)}
                                             className="me-3"
                                             alt={SocialAccountProvider[reportSelectedAccountType]}/>{SocialAccountProvider[reportSelectedAccountType]}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {Object.keys(SocialAccountProvider).map(cur => (

                                            <Dropdown.Item
                                                disabled={notConnectedSocialMediaAccount(cur, getAllConnectedSocialAccountData?.data)}
                                                onClick={() => {
                                                    setReportSelectedAccountData(getAllConnectedSocialAccountData?.data.find(c => c.provider === cur))
                                                    setReportSelectedAccountType(cur)

                                                }}><img width={24}
                                                        src={computeImageURL(cur)}
                                                        className="me-3"/>{SocialAccountProvider[cur]}
                                            </Dropdown.Item>
                                        ))

                                        }
                                    </Dropdown.Menu>
                                </Dropdown>

                                <div className={"tabs_pages"}>

                                    <div className={"d-flex gap-3"} style={{paddingRight: '2px'}}>
                                        <button
                                            disabled={reportSectionData?.loading || reportGraphSectionData?.loading}
                                            className={allSelected ? "btn-with-fixed-width report_section_selected_btn position-relative" : "position-relative btn-with-fixed-width"}
                                            onClick={(e) => {
                                                handleClick("All", connectedPagesReducer?.facebookConnectedPages)
                                            }}>

                                            All Pages
                                        </button>

                                        {Array.isArray(allAvailablePages) && allAvailablePages.length > 0 &&

                                            allAvailablePages.sort((a, b) => (b.isConnected - a.isConnected)).map(curBtn => (
                                                <button
                                                    disabled={reportSectionData?.loading || reportGraphSectionData?.loading}
                                                    className={curBtn?.isConnected === true ? reportSelectPages?.find(c => c.pageId === curBtn?.id) && !allSelected ? "btn-with-fixed-width report_section_selected_btn" : "btn-with-fixed-width" : "btn-with-fixed-width report_section_disable_btn position-relative"}
                                                    onClick={(e) => {
                                                        handleClick("single", connectedPagesReducer?.facebookConnectedPages?.filter(curP => curP.pageId === curBtn?.id))
                                                    }
                                                    }>
                                                    <button className="not_connect">Not Connected</button>
                                                    {curBtn?.name}</button>
                                            ))
                                        }


                                    </div>
                                </div>


                                {reportSectionData?.loading ?

                                    //loader component
                                    <DashBoardReportLoader />
                                    :
                                    <div className="followers_outer ">

                                        {reportSectionData?.data &&
                                            Object.keys(reportSectionData?.data).map(curKey => (

                                                <div className="followers_wrapper ">
                                                    <h5>{curKey.replace(/_/g, ' ')}</h5>
                                                    <div className="followers_inner_content">
                                                        <h2> {reportSectionData?.data[curKey]?.lifeTime || 0}</h2>
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
                                }

                                {/* chart */}
                                <div className="page_title_header">
                                    <div className="page_title_container">
                                        <div className="page_title_dropdown">
                                            <h3 className="cmn_white_text instagram_overview_heading">{SocialAccountProvider[reportSelectedAccountType]?.charAt(0)?.toUpperCase() + SocialAccountProvider[reportSelectedAccountType]?.slice(1)} Overview</h3>
                                        </div>
                                        <div className="days_outer">
                                            <select className=" dropdown_days box_shadow"
                                                    onChange={(e) => setGraphDaysSelected(e?.target?.value || 8)}
                                                    disabled={connectedPagesReducer?.loading || facebookPageListReducer?.loading || reportGraphSectionData?.loading}>
                                                <option value={9}>Last 7 days</option>
                                                <option value={17}>Last 15 days</option>
                                                <option value={32}> Last 30 days</option>
                                            </select>
                                        </div>

                                    </div>
                                    {/*<Chart/>*/}

                                    <div className="account_info mt-2">

                                        <LineGraph reportData={reportGraphSectionData}/>

                                    </div>
                                </div>

                            </div>}

            </div>


        </>
    )

}