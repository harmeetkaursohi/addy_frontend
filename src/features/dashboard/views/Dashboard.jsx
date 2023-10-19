import Header from "../../head/views/Header"
import SideBar from "../../sidebar/views/Layout"
import './Dashboard.css'
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {decodeJwtToken, getToken} from "../../../app/auth/auth.js";
import {getUserInfo} from "../../../app/actions/userActions/userActions";
import ScheduledComponent from "../../unPublishedPages/views/ScheduledComponent";
import {DashboardReports} from "./reports/DashboardReports";
import SocialAccounts from "./SocialAccounts";
import {getAllSocialMediaPostsByCriteria} from "../../../app/actions/postActions/postActions";

const Dashboard = () => {

    const dispatch = useDispatch();
    const token = getToken();
    const facebookPageList = useSelector(state => state.facebook.getFacebookPageReducer.facebookPageList);
    const getAllConnectedSocialAccountData = useSelector(state => state.socialAccount.getAllConnectedSocialAccountReducer);
    const userData = useSelector(state => state.user.userInfoReducer.data);
    const getAllPostsByCriteriaData = useSelector(state => state.post.getAllDraftPostsByCustomerAndPeriodReducer);

    useEffect(() => {
        document.title = 'Dashboard';
        token && dispatch(getAllSocialMediaPostsByCriteria({token: token, query: {limit: 5, postStatus: ["SCHEDULED"]}}));
    }, [token]);

    useEffect(() => {
        if (token && !userData) {
            const decodeJwt = decodeJwtToken(token);
            const requestBody = {
                customerId: decodeJwt.customerId,
                token: token
            }
            dispatch(getUserInfo(requestBody))
        }
    }, [token, dispatch, userData]);


    return (
        <>
            <SideBar/>
            <div className="cmn_container">
                <div className="cmn_wrapper_outer">
                    <Header userData={userData} getAllConnectedSocialAccountData={getAllConnectedSocialAccountData}
                            facebookPageList={facebookPageList}/>
                    <div className="dashboard_outer">
                        <div className="row">

                            <DashboardReports/>
                            <SocialAccounts/>
                        </div>
                        {/* upcoming post */}
                        <ScheduledComponent scheduledData={getAllPostsByCriteriaData}/>
                    </div>

                </div>

            </div>
        </>
    )
}
export default Dashboard