import {BrowserRouter, Routes, Route} from "react-router-dom"
import {AppProvider} from '../features/common/components/AppProvider.jsx'
import React from 'react'
import {Outlet, Navigate} from 'react-router-dom';
import {getToken} from "./auth/auth";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Suspense, lazy} from 'react';
import './App.css'
import {unProtectedUrls} from "../utils/contantData";
import SideBar from "../features/sidebar/views/Layout"
import Draft from "../features/unPublishedPages/Draft";
import SelectPlan from "../features/selectplan/views/SelectPlan";
import BillingForm from "../features/billingInfo/views/BillingForm";
import Dashboard from "../features/dashboard/views/Dashboard";
import Planner from "../features/planner/views/Planner";
import CreatePost from "../features/planner/views/CreatePost";
import UpdatePost from "../features/planner/views/UpdatePost";
import Review from "../features/review/views/Review";
import AI_ImageModal from "../features/modals/views/ai_image_modal/AI_ImageModal";
import Insight from "../features/insights/insight/views/Insight";
import ContactUs from "../features/contactUs/ContactUs";
import Profile from "../features/profile/Profile";
import NeedHelpComponent from "../features/needHelp/NeedHelpComponent";
import Login from "../features/login/views/Login";
import Signup from "../features/signup/views/Signup";
import CreatePassword from "../features/resetPassword/views/CreatePassword";
import ForgotPassword from "../features/forgotPassword/ForgotPassword";
import ConnectPagesModal from "../features/modals/views/facebookModal/ConnectPagesModal";
import Oauth2RedirectComponent from "../features/authentication/Oauth2RedirectComponent";
import NotFound from "../features/common/components/NotFound";
import Notification from '../features/notification/Notification';
import AddressInfo  from "../features/signup/views/tabs/AddressInfo"

// const NeedHelpComponent = lazy(() => import('../features/needHelp/NeedHelpComponent'));
// const Dashboard = lazy(() => import('../features/dashboard/views/Dashboard.jsx'));
// const Planner = lazy(() => import('../features/planner/views/Planner.jsx'));
// const SideBar = lazy(() => import('../features/sidebar/views/Layout'));
// const CommonLoader = lazy(() => import('../features/common/components/CommonLoader'));
// const CreatePost = lazy(() => import('../features/planner/views/CreatePost'));
// const UpdatePost = lazy(() => import('../features/planner/views/UpdatePost'));
// const Review = lazy(() => import('../features/review/views/Review.jsx'));
// const AI_ImageModal = lazy(() => import('../features/modals/views/ai_image_modal/AI_ImageModal.jsx'));
// const AddressForm = lazy(() => import('../features/signup/views/tabs/AddressInfo.jsx'));
// const Draft = lazy(() => import('../features/unPublishedPages/Draft'));
// const Insight = lazy(() => import('../features/insights/insight/views/Insight'));
// // const FaqComponent = lazy(() => import('../features/faq/FaqComponent'));
// // const PrivacyComponent = lazy(() => import('../features/privacy/PrivacyComponent'));
// const ContactUs = lazy(() => import('../features/contactUs/ContactUs'));
// const Profile = lazy(() => import('../features/profile/Profile.jsx'));
// const Notification = lazy(() => import('../features/notification/Notification'));
// const Login = lazy(() => import('../features/login/views/Login'));
// const Signup = lazy(() => import('../features/signup/views/Signup'));
// const CreatePassword = lazy(() => import('../features/resetPassword/views/CreatePassword'));
// const ForgotPassword = lazy(() => import('../features/forgotPassword/ForgotPassword'));
// const ConnectPagesModal = lazy(() => import('../features/modals/views/facebookModal/ConnectPagesModal'));
// const Oauth2RedirectComponent = lazy(() => import('../features/authentication/Oauth2RedirectComponent'));
// const NotFound = lazy(() => import('../features/common/components/NotFound'));
// const BillingForm = lazy(() => import('../features/billingInfo/views/BillingForm.jsx'));
// const SelectPlan = lazy(() => import('../features/selectplan/views/SelectPlan.jsx'));


const App = () => {
    const PrivateRoute = () => {
        const token = getToken();
        return token ? <Outlet/> : <Navigate to="/login"/>;
    }

    return (
        <>
            <AppProvider>
                <BrowserRouter>
                    {
                        getToken() && !unProtectedUrls.includes(window.location.pathname) ? <SideBar/> :<></>
                    }
                    {/*<Suspense fallback={<CommonLoader classname={!unProtectedUrls.includes(window.location.pathname)?"fallback_loader_outer":"auth_loader_outer"}/>}>*/}
                        <Routes>
                            <Route element={<PrivateRoute/>}>
                                <Route path="/plan" element={<SelectPlan/>}/>
                                <Route path="/payment" element={<BillingForm/>}/>
                                <Route path="/sidebar" element={<SideBar/>}/>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/planner" element={<Planner/>}/>
                                <Route path="/planner/post" element={<CreatePost/>}/>
                                {/*<Route path="/post/:id" element={<UpdatePost/>}/>*/}
                                <Route path="/planner/post/:id" element={<UpdatePost/>}/>
                                <Route path="/published-post" element={<Review/>}/>
                                <Route path="/image" element={<AI_ImageModal/>}/>
                                <Route path="/address" element={<AddressInfo/>}/>
                                <Route path="/draft" element={<Draft/>}/>
                                <Route path="/insight" element={<Insight/>}/>
                                {/*<Route path="/faq" element={<FaqComponent/>}/>*/}
                                {/*<Route path="/privacy" element={<PrivacyComponent/>}/>*/}
                                <Route path="/contact" element={<ContactUs/>}/>
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="/notification" element={<Notification/>}/>
                                <Route path="/help" element={<NeedHelpComponent/>}/>


                            </Route>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/" element={<Login/>}/>
                            <Route path="/sign-up" element={<Signup/>}/>
                            <Route path="/reset-password" element={<CreatePassword/>}/>
                            <Route path="/forgot-password" element={<ForgotPassword/>}/>
                            <Route path="/fb" element={<ConnectPagesModal/>}/>
                            <Route path="/auth-redirect" element={<Oauth2RedirectComponent/>}/>
                            <Route path="*" element={<NotFound/>}/>


                        </Routes>
                    {/*</Suspense>*/}

                </BrowserRouter>
            </AppProvider>
            <ToastContainer/>
        </>
    )
}

export default App
