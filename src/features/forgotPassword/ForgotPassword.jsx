import {useFormik} from 'formik';
import React, {useEffect} from 'react'
import {validationSchemas} from "../../utils/commonUtils"
import jsondata from "../../locales/data/initialdata.json"
import {Link, useNavigate} from 'react-router-dom';
import addyads_img from "../../images/addylogo.png";
import Frame from "../../images/forgotPassFrame.svg";
import {RotatingLines} from "react-loader-spinner";
import {useForgotPasswordMutation} from "../../app/apis/authApi";
import {handleRTKQuery} from "../../utils/RTKQueryUtils";
import {showSuccessToast} from "../common/components/Toast";


function ForgotPassword() {

    const navigate = useNavigate()
    const [forgotPassword, forgotPasswordApi] = useForgotPasswordMutation()

    useEffect(() => {
        document.title = "Forgot Password"
    }, []);


    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: validationSchemas.forgotPassword,
        onSubmit: async (values) => {
            await handleRTKQuery(async () => {
                    return await forgotPassword(values.email).unwrap()
                },
                () => {
                    showSuccessToast(`Email has been sent to ${values.email}`);
                    navigate("/login")
                })

        },
    });

    return (
        <section>
            <div className="login_wrapper">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 ">
                        <div className='addy_container bg_light_orange'>
                            <div className='login_outer'>


                                <div className='reach_user_outer text-center'>
                                    <img src={Frame} className=' w-100 mt-4'/>
                                    <h2 className='mt-3'>{jsondata.connect_audience_title}</h2>
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
                                    <h2>{jsondata.forgotPassword.forgotPassword}</h2>
                                    <p>{jsondata.register_email_heading}</p>

                                </div>
                                <div className='login_form'>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='resetOuter_wrapper'>

                                            <div className='form-group '>
                                                <label>{jsondata.email}</label>
                                                <input
                                                    className="form-control mt-1"
                                                    type='email'
                                                    placeholder='Enter your email'
                                                    name="email"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.email}
                                                />
                                                {
                                                    formik.touched.email && formik.errors.email &&
                                                    <p className="error_message">{formik.errors.email}</p>
                                                }
                                                <button
                                                    type="submit"
                                                    disabled={forgotPasswordApi?.isLoading}
                                                    className={' login_btn ' + (forgotPasswordApi?.isLoading ? "opacity-50" : "")}>{jsondata.forgotpassword}
                                                    {
                                                        forgotPasswordApi?.isLoading && <span
                                                            className={"loader-forgot-pswd z-index-1 mx-2"}><RotatingLines
                                                            width={30} strokeColor={"white"}></RotatingLines></span>
                                                    }
                                                </button>
                                            </div>

                                        </div>
                                    </form>
                                    <h3>
                                        Back to
                                        <span className='gap'>&nbsp;</span>
                                        <Link to="/login">
                                            <span className='sign_up'>{jsondata.login}</span>
                                        </Link>
                                    </h3>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>


    )
}

export default ForgotPassword