import React, {useEffect, useState} from 'react'
import "./CreatePassword.css"
import jsondata from "../../../locales/data/initialdata.json"
import {useFormik} from 'formik';
import {validationSchemas} from '../../../utils/commonUtils';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import girl_img from "../../../images/girl.png";
import addyads_img from "../../../images/addylogo.png";
import {createPassword} from "../../../app/actions/userActions/userActions.js";

const CreatePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const location = useLocation();
    const queryParamVale = new URLSearchParams(location.search);
    const navigate = useNavigate()

    const userId = queryParamVale.get("id")
    const token = queryParamVale.get("token")
    const dispatch = useDispatch()

    useEffect(() => {
        document.title = "Create Password"
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }


    const formik = useFormik({
        initialValues: {
            password: "", customerId: userId, customerToken: token
        }, validationSchema: validationSchemas.createPassword, onSubmit: (values) => {
            const obj = {
                newPassword: values.password, customerId: values.customerId, customerToken: values.customerToken,
            }
            dispatch(createPassword({values: obj, navigate: navigate}))


        },
    });

    return (<section className='Container'>
            <div className="login_wrapper">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 ">
                        <div className='addy_container bg_color'>
                            <div className='login_outer'>

                                <div className='reach_user_outer'>
                                    <img src={girl_img} className='girl_img_width'/>
                                    <h2 className='mt-5'>Reach your users with new tools. Reach your users with new
                                        tools. Reach your users with new tools.</h2>
                                    <p>Efficiently unleash cross-media information without cross-media value.
                                        Quickly maximize.Efficiently unleash cross-media information without
                                        cross-media value. Quickly maximize.Efficiently unleash cross-media.</p>
                                </div>
                            </div>

                        </div>


                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className='addy_container'>
                            <div className="addy_outer">
                                <div className="addy_img">
                                    <div className='logo_outer'><img src={addyads_img} height="90px" width="238px"/>
                                    </div>
                                    <h2 className='cmn_fontFamily'>{jsondata.createPassword.createPassword}</h2>

                                </div>
                                <div className='login_form'>
                                    <form onSubmit={formik.handleSubmit}>


                                        <div className='form-group '>
                                            <label>{jsondata.password}</label>
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
                                                <p className="error_message">{formik.errors.password}</p>) : null}

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
                                            {showConfirmPassword ? (
                                                <h2 className="openEye">
                                                    <i className="fa-solid fa-eye "></i>
                                                </h2>) : (
                                                <h2 className="openEye">
                                                    <i className="fa fa-eye-slash" aria-hidden="true"/>
                                                </h2>
                                            )}
                                            </span>

                                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                                <p className="error_message">{formik.errors.confirmPassword}</p>) : null}

                                        </div>

                                        <button className=' login_btn'>{jsondata.createPassword.createPassword}</button>

                                    </form>
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