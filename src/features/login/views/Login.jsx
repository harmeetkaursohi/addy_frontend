import addyads_img from '../../../images/addylogo.png'
import google_img from '../../../images/Google_img.svg'
import {Link} from "react-router-dom"
import jsondata from '../../../locales/data/initialdata.json'
import './Login.css'
import {useFormik} from 'formik';
import {validationSchemas} from "../../../utils/commonUtils.js";
import React, {useEffect, useState} from "react";
import {showErrorToast} from "../../common/components/Toast";
import Frame from "../../../images/signupFrame.svg";
import {RotatingLines} from "react-loader-spinner";
import {SomethingWentWrong} from "../../../utils/contantData";
import {useLoginUserMutation} from "../../../app/apis/authApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";

const Login = () => {

    const [loginUser, loginUserApi] = useLoginUserMutation();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.title = 'Login';
        localStorage.getItem("errorInOAuth") === "true" && showErrorToast(SomethingWentWrong)
        localStorage.removeItem("errorInOAuth")

    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        validationSchema: validationSchemas.login,
        onSubmit: async (values) => {
            await handleRTKQuery(async () => {
                    return await loginUser(values).unwrap()
                },
                (res) => {
                    localStorage.setItem('token', res.token);
                    window.location.href = "/dashboard"
                })
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }


    return (
        <>
            <section>
                <div className="login_wrapper">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12 ">
                            <div className='addy_container bg_light_orange min-vh-100'>
                                <div className='login_outer'>

                                    <div className='reach_user_outer text-center'>
                                        <img src={Frame} className=' w-100 mt-4'/>
                                        <h2 className='mt-3'>{jsondata.connect_audience_title}</h2>
                                        <p>{jsondata.connect_audience_desc}</p>
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className='addy_container form_mainwrapper'>
                                <div className="addy_outer d-flex align-items-center">
                                <div className="form_wrapper">
                                    <div className="addy_img">
                                        <div className='logo_outer'>
                                            <img src={addyads_img} height="90px" width="238px"/>
                                        </div>
                                        <h2>{jsondata.login}</h2>
                                    </div>
                                    <div className='login_form'>
                                        <form onSubmit={formik.handleSubmit}>

                                            <div className='form-group'>
                                                <label
                                                    className={formik.values.username && "filled"}>{jsondata.email} or {jsondata.username}</label>
                                                <input
                                                    className="form-control mt-1"
                                                    type='text'
                                                    placeholder='Email'
                                                    name="username"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.username}
                                                />

                                                {
                                                    formik.touched.username && formik.errors.username &&
                                                    <p className="error_message">{formik.errors.username}</p>
                                                }

                                            </div>


                                            <div className='form-group '>
                                                <label
                                                    className={formik.values.username && "filled"}>{jsondata.password}</label>
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

                                            <div className='rememberPass_outer'>
                                                <div className='text-end'>
                                                    <Link to="/forgot-password">
                                                        <label
                                                            className='forgotPass_heading cursor_pointer'>{jsondata.forgotpassword}</label>
                                                    </Link>

                                                </div>
                                                <button type={"submit"} className='login_btn'
                                                        disabled={loginUserApi?.isLoading}>Log In
                                                    {
                                                        loginUserApi?.isLoading ?
                                                            <span
                                                                className={"loader-forgot-pswd z-index-1 mx-2"}><RotatingLines
                                                                width={30} strokeColor={"white"}></RotatingLines>
                                                            </span> : ""
                                                    }
                                                </button>
                                                <h2 className='or_text'>OR</h2>


                                                <div className='social_login_outer'>


                                                    {/*======= login with  facebook =======*/}
                                                    {/*<a className=''*/}
                                                    {/*   href={`${import.meta.env.VITE_APP_OAUTH2_BASE_URL}/facebook?timeZone=${Intl.DateTimeFormat().resolvedOptions().timeZone}&redirect_uri=${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/auth-redirect`}>*/}
                                                    {/*    <div className="google_img_outer">*/}
                                                    {/*        <img src={fbImg}/>*/}
                                                    {/*    </div>*/}
                                                    {/*</a>*/}

                                                    {/*======= login with  google =======*/}
                                                    <a className=''
                                                       href={`${import.meta.env.VITE_APP_OAUTH2_BASE_URL}/google?timeZone=${Intl.DateTimeFormat().resolvedOptions().timeZone}&redirect_uri=${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/auth-redirect`}>
                                                        <div className="google_img_outer">
                                                            <img src={google_img}/>
                                                        </div>
                                                        Sign in with Google
                                                    </a>
                                                </div>

                                            </div>
                                        </form>

                                        <h3>{jsondata.account}
                                            <Link className="ms-2" to="/sign-up">
                                                <span className='sign_up'>{jsondata.signup}</span>
                                            </Link>
                                        </h3>
                                    </div>
                                </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Login
