import Header from "../../head/views/Header"
import SideBar from "../../sidebar/views/Layout"
import './Dashboard.css'
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { getToken} from "../../../app/auth/auth.js";
import ScheduledComponent from "../../unPublishedPages/views/ScheduledComponent";
import {DashboardReports} from "./reports/DashboardReports";
import SocialAccounts from "./SocialAccounts";
import {getAllSocialMediaPostsByCriteria} from "../../../app/actions/postActions/postActions";
import ConnectSocialAccountModal from "../../common/components/ConnectSocialAccountModal";
import { useAppContext } from "../../common/components/AppProvider.jsx";

const Dashboard = () => {
    const { sidebar } = useAppContext();

    const dispatch = useDispatch();
    const token = getToken();
    const [showConnectAccountModal, setShowConnectAccountModal] = useState(false)

    const facebookPageList = useSelector(state => state.facebook.getFacebookPageReducer.facebookPageList);
    const userData = useSelector(state => state.user.userInfoReducer.data);
    const getAllPostsByCriteriaData = useSelector(state => state.post.getAllDraftPostsByCustomerAndPeriodReducer);



    useEffect(() => {
        document.title = 'Dashboard';
        token && dispatch(getAllSocialMediaPostsByCriteria({
            token: token,
            query: {limit: 5, period:"MONTH",postStatus: ["SCHEDULED"]}
        }));
    }, [token]);


    return (
        <>
            {/*<SideBar/>*/}
            <div className={sidebar? 'cmn_container':"cmn_Padding"}>
                <div className="cmn_outer">
                <div className="cmn_wrapper_outer white_bg_color">
                    <Header userData={userData}
                            facebookPageList={facebookPageList} setShowConnectAccountModal={setShowConnectAccountModal}/>
                    <div className="dashboard_outer">
                        <div className="row">
                            <DashboardReports/>
                            <SocialAccounts />
                        </div>
                        <ScheduledComponent scheduledData={getAllPostsByCriteriaData}/>
                    </div>

                </div>

                </div>

            </div>
            {
                showConnectAccountModal && <ConnectSocialAccountModal showModal={showConnectAccountModal}
                                                                      setShowModal={setShowConnectAccountModal}/>
            }
        </>
    )
}
export default Dashboard