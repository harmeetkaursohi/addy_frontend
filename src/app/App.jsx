import { useState } from 'react'
import reactLogo from './../images/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from '../features/login/views/Login'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import SignUp from '../features/signup/views/signup'
import SelectPlan from '../features/selectplan/views/selectplan'
import Billing_form from '../features/billingInfo/views/billing_form'
import SideBar from '../features/sidebar/views/Layout'
import Dashboard from '../features/dashboard/views/dashboard'
import Planner from '../features/planner/views/planner'
import CreatePost from '../features/planner/views/createPost'
import Review from '../features/review/views/review'
import Gallery from '../features/gallary/views/gallery'
import AiImageModal from '../features/modals/views/ai_image_modal/ai_image_modal'
import CommentPage from '../features/commentPage/views/commentPage'
import AddressForm from '../features/signup/views/addressForm'
// import 'cdbreact/dist/css/styles.css';
// import 'cdbreact/dist/css/coreui.min.css'
function App() {
  
  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/login"  element={<Login/>}/>
    <Route path="/"  element={<SignUp/>}/>
    <Route path="/plan"  element={<SelectPlan/>}/>
    <Route path="/payment"  element={<Billing_form/>}/>
    <Route path="/sidebar"  element={<SideBar/>}/>
    <Route path="/dashboard"  element={<Dashboard/>}/>
    <Route path="/planner"  element={<Planner/>}/>
    <Route path="/createpost"  element={<CreatePost/>}/>
    <Route path="/review"  element={<Review/>}/>
    <Route path="/gallery"  element={<Gallery/>}/>
    <Route path="/image"  element={<AiImageModal/>}/>
    <Route path="/commentpage"  element={<CommentPage/>}/>
    <Route path="/addressform"  element={<AddressForm/>}/>
    </Routes>
    </BrowserRouter>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
