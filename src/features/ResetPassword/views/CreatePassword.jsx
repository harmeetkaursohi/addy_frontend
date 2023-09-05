import React, { useState } from 'react'
import "./CreatePassword.css"
import jsondata from "../../../locales/data/initialdata.json"
import { useFormik } from 'formik';
import { validationSchemas } from '../../../utils/commonUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createPassword } from '../../../app/actions/userActions/userActions';

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
            <form onSubmit={formik.handleSubmit}>
                <div className='resetOuter'>
                    <div className='reset_password_content'>
                        <h2>{jsondata.createPassword.createPassword}</h2>
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
                    </div>

                </div>
            </form>
        </section>
    )
}

export default CreatePassword