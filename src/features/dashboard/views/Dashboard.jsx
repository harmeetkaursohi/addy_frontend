import Header from "../../head/views/Header"
import './Dashboard.css'
import React, {useEffect, useState} from "react";
import {getToken} from "../../../app/auth/auth.js";
import ScheduledComponent from "../../unPublishedPages/views/ScheduledComponent";
import {DashboardReports} from "./reports/DashboardReports";
import SocialAccounts from "./SocialAccounts";
import ConnectSocialAccountModal from "../../common/components/ConnectSocialAccountModal";
import {useAppContext} from "../../common/components/AppProvider.jsx";
import {useGetUserInfoQuery} from "../../../app/apis/userApi";
import {
    useGetSocialMediaPostsByCriteriaQuery
} from "../../../app/apis/postApi";
import NotFoundPopup from "../../common/components/NotFoundPopup.jsx";

const Dashboard = () => {
    const {sidebar} = useAppContext();

    const [showConnectAccountModal, setShowConnectAccountModal] = useState(false)
    const {data: userData} = useGetUserInfoQuery("")

    const getSocialMediaPostsByCriteriaApi = useGetSocialMediaPostsByCriteriaQuery({
        limit: 6,
        sort: "feedPostDate",
        sortOrder: "asc",
        period: "MONTH",
        postStatus: ["SCHEDULED"]
    })

    useEffect(() => {
        document.title = 'Dashboard';
    }, []);


    return (
        <>
            <div className={sidebar ? 'cmn_container' : "cmn_Padding"}>
                <div className="cmn_outer">
                    <div className="cmn_wrapper_outer white_bg_color">
                        <Header userData={userData} setShowConnectAccountModal={setShowConnectAccountModal}/>
                        <div className="dashboard_outer">

                            <div className="row">
                                <DashboardReports/>
                                <SocialAccounts/>
                            </div>

                        </div>

                    </div>

                </div>
                <NotFoundPopup/>
                {/* upcoming post */}
            
                    <ScheduledComponent scheduledData={getSocialMediaPostsByCriteriaApi}/>               

            </div>
            {
                showConnectAccountModal &&
                <ConnectSocialAccountModal
                    showModal={showConnectAccountModal}
                    setShowModal={setShowConnectAccountModal}
                />
            }
        </>
    )
}
export default Dashboard