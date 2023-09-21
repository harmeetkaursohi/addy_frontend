import React from 'react'
import "./CreatePassword.css"
import jsondata from "../../../locales/data/initialdata.json"
import { useFormik } from 'formik';
import { validationSchemas } from '../../../utils/commonUtils';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import girl_img from "../../../images/girl.png";
import addyads_img from "../../../images/addylogo.png";
import {createPassword} from "../../../app/actions/userActions/userActions.js";

const CreatePassword = () => {
    const location = useLocation();
    const queryParamVale = new URLSearchParams(location.search);
    const navigate=useNavigate()
    const userId = queryParamVale.get("id")
    const token = queryParamVale.get("token")
    const dispatch = useDispatch()
    const formik = useFormik({
        initialValues: {
            password: "",
            customerId: userId,
            customerToken: token
        },
        validationSchema: validationSchemas.createPassword,
        onSubmit: (values) => {
           const obj = {
                newPassword: values.password, 
                customerId: values.customerId,
                customerToken: values.customerToken,
            }
            dispatch(createPassword({values:obj,navigate: navigate}))
           
           
        },
    });

    return (
        <section className='Container'>
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
                                                                type='password'
                                                                placeholder='Password'
                                                                name="password"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.password}
                                                            />
                                                            {formik.touched.password && formik.errors.password ? (
                                                                <p style={{ color: "red" }}>{formik.errors.password}</p>
                                                            ) : null}

                                                        </div>
                                                        <div className='form-group '>

                                                            <label>{jsondata.confirmPass}</label>
                                                            <input
                                                                className="form-control mt-1"
                                                                type='password'
                                                                placeholder='Confirm Password'
                                                                name="confirmPassword"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.confirmPassword}
                                                            />
                                                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                                                <p style={{ color: "red" }}>{formik.errors.confirmPassword}</p>
                                                            ) : null}

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
        // <section className='Container'>
        //     <form onSubmit={formik.handleSubmit}>
        //         <div className='resetOuter'>
        //             <div className='reset_password_content'>
        //                 <h2>{jsondata.createPassword.createPassword}</h2>
        //                 <div className='form-group '>
        //                     <label>{jsondata.password}</label>
        //                     <input
        //                         className="form-control mt-1"
        //                         type='password'
        //                         placeholder='Password'
        //                         name="password"
        //                         onChange={formik.handleChange}
        //                         onBlur={formik.handleBlur}
        //                         value={formik.values.password}
        //                     />
        //                     {formik.touched.password && formik.errors.password ? (
        //                         <p style={{ color: "red" }}>{formik.errors.password}</p>
        //                     ) : null}
        //
        //                 </div>
        //                 <div className='form-group '>
        //
        //                     <label>{jsondata.confirmPass}</label>
        //                     <input
        //                         className="form-control mt-1"
        //                         type='password'
        //                         placeholder='Confirm Password'
        //                         name="confirmPassword"
        //                         onChange={formik.handleChange}
        //                         onBlur={formik.handleBlur}
        //                         value={formik.values.confirmPassword}
        //                     />
        //                     {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
        //                         <p style={{ color: "red" }}>{formik.errors.confirmPassword}</p>
        //                     ) : null}
        //
        //                 </div>
        //
        //                 <button className=' login_btn'>{jsondata.createPassword.createPassword}</button>
        //             </div>
        //
        //         </div>
        //     </form>
        // </section>
    )
}

export default CreatePassword