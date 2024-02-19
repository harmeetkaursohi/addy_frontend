import React, {  useState } from "react";

import "./profile.css";
import Layout from "../sidebar/views/Layout";
import user_img from "../../images/girl.png";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import jsondata from "../../locales/data/initialdata.json";

import EditAddress from "./editAddress";
import ChangePassword from "./ChangePassword";
import { useDispatch } from "react-redux";
import { changeProfile } from "../../app/actions/profileActions/profileActions";
import { getToken } from "../../app/auth/auth";
import { useFormik } from "formik";
import {validationSchemas} from "../../utils/commonUtils"
import { ImSpinner5 } from "react-icons/im";
const EditProfile = () => {
const[editMode,setEditMode]=useState(false)
const[file,setFile]=useState()
const[fileType,setFileType]=useState()

const dispatch=useDispatch()

const formik=useFormik({
    initialValues:{
    firstName:"",
    lastName:"",
    username: "",
    email: "",
    contactNo: "",
   
    },
    validationSchema:validationSchemas.register,
    onSubmit: (values) => {
      
    },
})
const changeProfileHandler=(e)=>{
    setFileType("IMAGE")
    setFile(e.target.files[0])
    const data={
        authtoken:{
            token:getToken(),
        },
        formdata:{
        mediaType:fileType,
        file:e.target.files[0]
        }
    }
    if(e.target.files[0]){

    dispatch(changeProfile(data))
    }
 
}


  return (
    <>
      <Layout />

      <section className=" cmn_container " style={{background:"white"}}>
      <div className="addy_img">

       <h3 className="edit_profile_heading">Edit Profile</h3>
        </div>

        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3 edit_tabs"
        >
          <Tab eventKey="profile" title="Personal Information">
           
              
          <div className="editprofile_outer">
              <div className="editProfile_wrapper mt-3">
                <div className="change_profile_outer">
                <div className="user_pic_container">
                <img src={user_img} alt="User Profile" className="user_pic" />
                </div>

                <div className="form-group">
                <label className="changeProfile_label" htmlFor="changeProfile" ><ImSpinner5 className="ImSpinner_icon"/> Profile</label>
                    <input type="file" id="changeProfile" className="change_profile" onChange={changeProfileHandler}/>
                </div>
  
                </div>

                <div className="edit_content">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="row">
                    <div className="col-lg-6 col-sm-12 col-md-6">
                   <div className="form-group">
                      <label> Firstname <span className="astrick">*</span></label>
                      <input value={formik.values.firstName} type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} name="firstName" className="form-control mt-2" readOnly={!editMode} placeholder="First name"/>
                      {formik.touched.firstName && formik.errors.firstName ? (
                     <p className="error_message">{formik.errors.firstName}</p>   ) : null}
                    </div>
                    </div>
                      
                      <div className="col-lg-6 col-sm-12 col-md-6">
                    <div className="form-group">
                      <label> Lastname <span className="astrick">*</span></label>
                      <input value={formik.values.lastName} type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} name="lastName" className="form-control mt-2" readOnly={!editMode} placeholder="username"/>
                      {formik.touched.lastName && formik.errors.lastName ? (
              <p className="error_message">{formik.errors.lastName}</p>  ) : null}
                    </div>

                      </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                      <label> Username <span className="astrick">*</span></label>
                      <input value={formik.values.username} type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} name="username" className="form-control mt-2" readOnly={!editMode} placeholder="Last name"/>
                      {formik.touched.username && formik.errors.username ? (  
                         <p className="error_message">{formik.errors.username}</p> ) : null}
                    </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="form-group">
                      <label> Email <span className="astrick">*</span></label>
                      <input placeholder="Email" value={formik.values.email} type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} name="email" className="form-control mt-2 " />
                      {formik.touched.email && formik.errors.email ? (
                      <p className="error_message">{formik.errors.email}</p>  ) : null}
                    </div>
                        </div>
                    </div>

                    <div className="form-group">
                      <label> Contact No</label>
                      <input placeholder="Contact No" value={formik.values.contactNo} type="text" onChange={formik.handleChange} onBlur={formik.handleBlur} name="contactNo" className="form-control mt-2" readOnly={!editMode}/>
            
                    </div>
                    <button className="update_btn btn_style cmn_btn_color">
                      Update
                    </button>
                  </form>
                </div>
              </div>
              </div>
          </Tab>

          {/* adddress tab */}
          <Tab eventKey="    Address" title="Address">
           <EditAddress/>
          </Tab>

          {/* chanage password */}
          <Tab eventKey=" Change Password" title=" Change Password">
            <ChangePassword/>
          </Tab>
        </Tabs>
       
      </section>
    </>
  );
};

export default EditProfile;
