import { useFormik } from 'formik';
import React from 'react'
import {validationSchemas} from "../../utils/commonUtils"
import jsondata from "../../locales/data/initialdata.json"
import { useDispatch, useSelector } from "react-redux"
import { forgetPassword } from '../../app/actions/userActions/userActions';
import { useNavigate } from 'react-router-dom';
function ForgetPassword() {
const dispatch=useDispatch()
const navigate=useNavigate()
    const formik = useFormik({
        initialValues: {
            email: "",   
        },
        validationSchema: validationSchemas.forgetPassword,
        onSubmit: (values) => {
            console.log(values, "values");
            dispatch(forgetPassword({values,navigate}))
        },
    });

  return (
    <section className='Container'>
            <form onSubmit={formik.handleSubmit}>
                <div className='resetOuter'>
                    <div className='reset_password_content'>
                        <h2>{jsondata.forgetPassword.forgetPassword}</h2>
                        <div className='form-group '>
                            <label>{jsondata.email}</label>
                            <input
                                className="form-control mt-1"
                                type='email'
                                placeholder='Email'
                                name="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <p style={{ color: "red" }}>{formik.errors.email}</p>
                            ) : null}

                        </div>
                        <button  type="submit" className=' login_btn'>{jsondata.forgetPassword.forgetPassword}</button>
                    </div>

                </div>
            </form>
        </section>
  )
}

export default ForgetPassword