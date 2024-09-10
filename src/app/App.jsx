import {BrowserRouter, Routes, Route} from "react-router-dom"
import {AppProvider} from '../features/common/components/AppProvider.jsx'
import React from 'react'
import {Outlet, Navigate} from 'react-router-dom';
import {getToken} from "../app/auth/auth.js";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Suspense, lazy} from 'react';
import './App.css'
import {unProtectedUrls} from "../utils/contantData";
const Needhelp = lazy(() => import('../features/NeedHelp/Needhelp.jsx'));


const Dashboard = lazy(() => import('../features/dashboard/views/Dashboard.jsx'));
const Planner = lazy(() => import('../features/planner/views/Planner.jsx'));
const SideBar = lazy(() => import('../features/sidebar/views/Layout'));
const CommonLoader = lazy(() => import('../features/common/components/CommonLoader'));
const CreatePost = lazy(() => import('../features/planner/views/CreatePost'));
const UpdatePost = lazy(() => import('../features/planner/views/UpdatePost'));
const Review = lazy(() => import('../features/review/views/Review.jsx'));
const AI_ImageModal = lazy(() => import('../features/modals/views/ai_image_modal/AI_ImageModal.jsx'));
const AddressForm = lazy(() => import('../features/signup/views/tabs/AddressInfo.jsx'));
const Draft = lazy(() => import('../features/unPublishedPages/Draft'));
const Insight = lazy(() => import('../features/insights/insight/views/Insight'));
// const FaqComponent = lazy(() => import('../features/faq/FaqComponent'));
const PrivacyComponent = lazy(() => import('../features/privacy/PrivacyComponent'));
const ContactUs = lazy(() => import('../features/contactUs/ContactUs'));
const Profile = lazy(() => import('../features/profile/Profile.jsx'));
const Notification = lazy(() => import('../features/notification/Notification'));
const Login = lazy(() => import('../features/login/views/Login'));
const Signup = lazy(() => import('../features/signup/views/Signup'));
const CreatePassword = lazy(() => import('../features/resetPassword/views/CreatePassword'));
const ForgotPassword = lazy(() => import('../features/forgotPassword/ForgotPassword'));
const ConnectPagesModal = lazy(() => import('../features/modals/views/facebookModal/ConnectPagesModal'));
const Oauth2RedirectComponent = lazy(() => import('../features/authentication/Oauth2RedirectComponent'));
const NotFound = lazy(() => import('../features/common/components/NotFound'));
const BillingForm = lazy(() => import('../features/billingInfo/views/BillingForm.jsx'));
const SelectPlan = lazy(() => import('../features/selectplan/views/SelectPlan.jsx'));


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
                        getToken() && !unProtectedUrls.includes(window.location.pathname) ?<SideBar/> :<></>
                    }
                    <Suspense fallback={<CommonLoader classname={!unProtectedUrls.includes(window.location.pathname)?"fallback_loader_outer":"auth_loader_outer"}/>}>
                        <Routes>
                            <Route element={<PrivateRoute/>}>
                                <Route path="/plan" element={<SelectPlan/>}/>
                                <Route path="/payment" element={<BillingForm/>}/>
                                <Route path="/sidebar" element={<SideBar/>}/>
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/planner" element={<Planner/>}/>
                                <Route path="/planner/post" element={<CreatePost/>}/>
                                <Route path="/post/:id" element={<UpdatePost/>}/>
                                <Route path="/review" element={<Review/>}/>
                                <Route path="/image" element={<AI_ImageModal/>}/>
                                <Route path="/address" element={<AddressForm/>}/>
                                <Route path="/draft" element={<Draft/>}/>
                                <Route path="/insights" element={<Insight/>}/>
                                {/*<Route path="/faq" element={<FaqComponent/>}/>*/}
                                {/*<Route path="/privacy" element={<PrivacyComponent/>}/>*/}
                                <Route path="/contact" element={<ContactUs/>}/>
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="/notification" element={<Notification/>}/>
                                <Route path="/needhelp" element={<Needhelp/>}/>

                             
                                
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
                    </Suspense>

                </BrowserRouter>
            </AppProvider>
            <ToastContainer/>
        </>
    )
}

export default App
