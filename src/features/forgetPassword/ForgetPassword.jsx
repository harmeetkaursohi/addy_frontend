
import { useFormik } from 'formik';
import React from 'react'

function ForgetPassword() {
    const formik = useFormik({
        initialValues: {
            email: "",
           
        },
        validationSchema: validationSchemas.createPassword,
        onSubmit: (values) => {
            console.log(values, "values");
        },
    });

  return (
    <section className='Container'>
            <form onSubmit={formik.handleSubmit}>
                <div className='resetOuter'>
                    <div className='reset_password_content'>
                        <h2>{jsondata.resetPassword.resetPassword}</h2>
                        <div className='form-group '>
                            <label>{jsondata.password}</label>
                            <input
                                className="form-control mt-1"
                                type='email'
                                placeholder=''
                                name="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <p style={{ color: "red" }}>{formik.errors.email}</p>
                            ) : null}

                        </div>
                        <button className=' login_btn'>{jsondata.resetPassword.resetPassword}</button>
                    </div>

                </div>
            </form>
        </section>
  )
}

export default ForgetPassword