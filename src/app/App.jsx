import './App.css'
import Login from '../features/login/views/Login'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Signup from '../features/signup/views/Signup.jsx'
import SelectPlan from '../features/selectplan/views/SelectPlan.jsx'
import BillingForm from '../features/billingInfo/views/BillingForm.jsx'
import SideBar from '../features/sidebar/views/Layout'
import Dashboard from '../features/dashboard/views/Dashboard.jsx'
import Planner from '../features/planner/views/Planner.jsx'
import CreatePost from '../features/planner/views/CreatePost.jsx'
import Review from '../features/review/views/Review.jsx'
import Gallery from '../features/gallary/views/Gallery.jsx'
import AI_ImageModal from '../features/modals/views/ai_image_modal/AI_ImageModal.jsx'
import CommentPage from '../features/commentPage/views/CommentPage.jsx'
import AddressForm from '../features/signup/views/AddressForm.jsx'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/" element={<Signup/>}/>
                    <Route path="/plan" element={<SelectPlan/>}/>
                    <Route path="/payment" element={<BillingForm/>}/>
                    <Route path="/sidebar" element={<SideBar/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/planner" element={<Planner/>}/>
                    <Route path="/post" element={<CreatePost/>}/>
                    <Route path="/review" element={<Review/>}/>
                    <Route path="/gallery" element={<Gallery/>}/>
                    <Route path="/image" element={<AI_ImageModal/>}/>
                    <Route path="/comment" element={<CommentPage/>}/>
                    <Route path="/address" element={<AddressForm/>}/>
                </Routes>
            </BrowserRouter>
            <ToastContainer/>
        </>
    )
}

export default App
