import React, {useEffect, useState} from 'react'
import "./CreatePassword.css"
import jsondata from "../../../locales/data/initialdata.json"
import {useFormik} from 'formik';
import {validationSchemas} from '../../../utils/commonUtils';
import {useLocation, useNavigate} from 'react-router-dom';
import Frame from "../../../images/signupFrame.svg?react";
import addyads_img from "../../../images/addylogo.png";
import {useCreatePasswordMutation} from "../../../app/apis/authApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";
import {showSuccessToast} from "../../common/components/Toast";

const CreatePassword = () => {

    const location = useLocation();
    const queryParamVale = new URLSearchParams(location.search);
    const userId = queryParamVale.get("id")
    const token = queryParamVale.get("token")

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const[createPassword,createPasswordApi]=useCreatePasswordMutation()

    useEffect(() => {
        document.title = "Create Password"
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const isResetPassword = location.pathname.includes("reset-password") 
    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword:"",
            customerId: userId,
            customerToken: token
        },
        validationSchema: validationSchemas.createPassword,
        onSubmit: async (values) => {
            await handleRTKQuery(async () => {
                    return await createPassword({
                        newPassword: values.password, customerId: values.customerId, customerToken: values.customerToken,
                    }).unwrap()
                },
                () => {
                    showSuccessToast('Password created successfully');
                    isResetPassword ? navigate("/password/success", { state: { message: "updated" } }) : navigate("/password/success")
                })

        },
    });
 
    return (<section>
            <div className="login_wrapper">
                <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12 p-0 ">
                            <div className='addy_container bg_light_orange min-vh-100'>
                                <div className='login_outer'>

                                    <div className='reach_user_outer text-center'>
                                        <Frame className=' w-100 mt-4'/>
                                        <h2 className='mt-3'>{jsondata.connect_audience_title}</h2>
                                        <p>{jsondata.connect_audience_desc}</p>
                                    </div>
                                </div>

                            </div>


                        </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 p-0">
                        <div className='addy_container form_mainwrapper'>
                            <div className="addy_outer d-flex align-items-center">
                            <div className="form_wrapper">
                                <div className="addy_img text-center">
                                    <div className='logo_outer'><img src={addyads_img} height="90px" width="238px"/>
                                    </div>
                                    <h2 className='text-center mb-2'>{isResetPassword ? "Reset Your Password" :jsondata.createPassword.createPassword}</h2>
                                    <p className='createPassText m-auto'>{isResetPassword ?"Create a new password. Ensure it differs from previous ones for security" : "Create a strong and unique password for your account."}  </p>

                                </div>
                                <div className='login_form mt-2'>
                                    <form onSubmit={formik.handleSubmit}>


                                        <div className='form-group '>
                                            <label>Create Password</label>
                                            <input
                                                className="form-control mt-1"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder='Password'
                                                name="password"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.password}
                                            />
                                            <span className="password-toggle" onClick={togglePasswordVisibility}>
                                            {
                                                showPassword ?
                                                <h2 className="openEye">
                                                    <i className="fa-solid fa-eye"></i>
                                                </h2>
                                             :
                                                <h2 className="closeEyeIcon">
                                                    <i className="fa fa-eye-slash" aria-hidden="true"/>
                                                </h2>
                                            }
                                            </span>

                                            {
                                                formik.touched.password && formik.errors.password &&
                                                <p className="error_message">{formik.errors.password}</p>
                                            }

                                        </div>
                                        <div className='form-group '>

                                            <label>{jsondata.confirmPass}</label>
                                            <input
                                                className="form-control mt-1"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder='Confirm Password'
                                                name="confirmPassword"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.confirmPassword}
                                            />

                                            <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                                            {
                                                showConfirmPassword ?
                                                <h2 className="openEye">
                                                    <i className="fa-solid fa-eye "></i>
                                                </h2> :
                                                <h2 className="openEye">
                                                    <i className="fa fa-eye-slash" aria-hidden="true"/>
                                                </h2>
                                            }
                                            </span>

                                            {
                                                formik.touched.confirmPassword && formik.errors.confirmPassword &&
                                                <p className="error_message">{formik.errors.confirmPassword}</p>
                                            }

                                        </div>

                                        <button disabled={createPasswordApi?.isLoading} className=' login_btn'>{jsondata.createPassword.createpasstext}</button>

                                    </form>
                                </div>
                            </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CreatePassword