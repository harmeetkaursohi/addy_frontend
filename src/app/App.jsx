import './App.css'
import Login from '../features/login/views/Login'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import SelectPlan from '../features/selectplan/views/SelectPlan.jsx'
import BillingForm from '../features/billingInfo/views/BillingForm.jsx'
import SideBar from '../features/sidebar/views/Layout'
import Dashboard from '../features/dashboard/views/Dashboard.jsx'
import Planner from '../features/planner/views/Planner.jsx'
import Review from '../features/review/views/Review.jsx'
import Gallery from '../features/gallary/views/Gallery.jsx'
import AI_ImageModal from '../features/modals/views/ai_image_modal/AI_ImageModal.jsx'
import CommentPage from '../features/commentPage/views/CommentPage.jsx'
import AddressForm from '../features/signup/views/tabs/AddressInfo.jsx'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePassword from '../features/resetPassword/views/CreatePassword'
import ForgetPassword from '../features/forgetPassword/ForgetPassword'
import Signup from '../features/signup/views/Signup'
import NotFound from '../features/common/components/NotFound'
import React from 'react'
import {Outlet, Navigate} from 'react-router-dom';
import {getToken} from "../app/auth/auth.js";
import ConnectPagesModal from '../features/modals/views/ConnectPagesModal/ConnectPagesModal'
import Oauth2RedirectComponent from '../features/authentication/Oauth2RedirectComponent'
import CreatePost from "../features/planner/views/CreatePost";
import UpdatePost from "../features/planner/views/UpdatePost";
import DraftComponent from "../features/unPublishedPages/views/DraftComponent";
import InsightsComponent from "../features/insights/InsightsComponent";
import FaqComponent from "../features/faq/FaqComponent";
import PrivacyComponent from "../features/privacy/PrivacyComponent";
import ContactUs from "../features/contactUs/ContactUs";
import {ParentDraftComponent} from "../features/unPublishedPages/views/ParentDraftComponent";
import Draft from "../features/unPublishedPages/Draft";
// import Insight from "../features/insights/insight/views/Insight";
import Insight from "../features/insights/insight/views/Insight";

const App = () => {
    const PrivateRoute = () => {

        const token = getToken();
        return token ? <Outlet/> : <Navigate to="/login"/>;
    }

    return (
        <>
            <BrowserRouter>
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
                        <Route path="/gallery" element={<Gallery/>}/>
                        <Route path="/image" element={<AI_ImageModal/>}/>
                        <Route path="/comment" element={<CommentPage/>}/>
                        <Route path="/address" element={<AddressForm/>}/>
                        <Route path="/draft" element={<Draft/>}/>
                        {/*<Route path="/draft" element={<DraftComponent/>}/>*/}
                        <Route path="/insights" element={<Insight/>}/>
                        <Route path="/faq" element={<FaqComponent/>}/>
                        <Route path="/privacy" element={<PrivacyComponent/>}/>
                        <Route path="/contact" element={<ContactUs/>}/>
                    </Route>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/" element={<Signup/>}/>
                    <Route path="/reset-password" element={<CreatePassword/>}/>
                    <Route path="/forget-password" element={<ForgetPassword/>}/>
                    <Route path="/fb" element={<ConnectPagesModal/>}/>
                    <Route path="/auth-redirect" element={<Oauth2RedirectComponent/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </>
    )
}

export default App
