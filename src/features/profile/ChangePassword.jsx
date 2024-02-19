import React, { useState } from 'react'
import jsondata from "../../locales/data/initialdata.json"
import { useFormik } from 'formik'
import { validationSchemas } from '../../utils/commonUtils'

const ChangePassword = () => {

const [showPassword,setShowPassword]=useState(false)
const [showConfirmPassword,setShowConfirmPassword]=useState(false)

    const formik=useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
          },
          validationSchema: validationSchemas.createPassword,
          onSubmit: (values) => {
      
          },
    })

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  }

  return (
    <div className="change_pass_outer editprofile_outer">
    <div className="addy_img">
     
      <h3 className="pt-2">{jsondata.currentpassword}</h3>
    </div>
    <form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <label>{jsondata.createPassword.newpass}<span className='astrick'>*</span></label>
        <input type={showPassword?"text":"password" }name='password' className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}/>
        <span className="password-toggle" onClick={togglePasswordVisibility}>
                                            {showPassword ? (
                                                <h2 className="openEye">
                                                    <i className="fa-solid fa-eye"></i>
                                                </h2>
                                            ) : (
                                                <h2 className="closeEyeIcon">
                                                    <i className="fa fa-eye-slash" aria-hidden="true"/>
                                                </h2>
                                            )}
                                            </span>
        {formik.touched.password && formik.errors.password ? (
              <p className="error_message">{formik.errors.password}</p>
            ) : null}
      </div>
      <div className="form-group">
        <label>{jsondata.createPassword.confirmnewpass}<span className='astrick'>*</span></label>
        <input type={showConfirmPassword?"text":"password"} name='confirmPassword' className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}/>

        <span className="password-toggle" onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}}>
                                            {showConfirmPassword ? (
                                                <h2 className="openEye">
                                                    <i className="fa-solid fa-eye"></i>
                                                </h2>
                                            ) : (
                                                <h2 className="closeEyeIcon">
                                                    <i className="fa fa-eye-slash" aria-hidden="true"/>
                                                </h2>
                                            )}
                                            </span>
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="error_message">{formik.errors.confirmPassword}</p>
            ) : null}
      </div>
      <button className="cmn_btn_color btn_style  ">
      {jsondata.changepassword}
      </button>
    </form>
  </div>
  )
}

export default ChangePassword