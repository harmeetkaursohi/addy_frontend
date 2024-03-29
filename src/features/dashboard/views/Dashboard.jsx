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

const Dashboard = () => {

    const dispatch = useDispatch();
    const token = getToken();
    const [showConnectAccountModal, setShowConnectAccountModal] = useState(false)

    const facebookPageList = useSelector(state => state.facebook.getFacebookPageReducer.facebookPageList);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const userData = useSelector(state => state.user.userInfoReducer.data);
    const getAllPostsByCriteriaData = useSelector(state => state.post.getAllDraftPostsByCustomerAndPeriodReducer);



    useEffect(() => {
        document.title = 'Dashboard';
        token && dispatch(getAllSocialMediaPostsByCriteria({
            token: token,
            query: {limit: 5, postStatus: ["SCHEDULED"]}
        }));
    }, [token]);


    return (
        <>
            <SideBar/>
            <div className="cmn_container">
                <div className="cmn_wrapper_outer">
                    <Header userData={userData} getAllConnectedSocialAccountData={getAllConnectedSocialAccountData}
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
            {
                showConnectAccountModal && <ConnectSocialAccountModal showModal={showConnectAccountModal}
                                                                      setShowModal={setShowConnectAccountModal}></ConnectSocialAccountModal>
            }
        </>
    )
}
export default Dashboard