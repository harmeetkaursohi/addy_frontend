import addyads_img from '../../../images/addylogo.png'
import google_img from '../../../images/Google_img.svg'
import fbImg from "../../../images/fb.svg"
import {Link, useNavigate} from "react-router-dom"
import jsondata from '../../../locales/data/initialdata.json'
import './Login.css'
import {useFormik} from 'formik';
import {useDispatch} from "react-redux";
import {loginUser} from "../../../app/actions/userActions/userActions.js";
import {validationSchemas} from "../../../utils/commonUtils.js";
import React, {useEffect, useState} from "react";
import {showErrorToast} from "../../common/components/Toast";
import Frame from "../../../images/Frame.svg";
import {RotatingLines} from "react-loader-spinner";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = 'Login';
    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        validationSchema: validationSchemas.login,
        onSubmit: (values) => {
            setIsLoading(true)
            dispatch(loginUser({values})).then((response) => {
                setIsLoading(false)
                if (response.meta.requestStatus === "fulfilled") {
                    navigate("/dashboard")
                }
            }).catch((error) => {
                setIsLoading(false)
                showErrorToast(error.response.data.message);
            });
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }


    return (
        <>
            <section className='Container'>
                <div className="login_wrapper">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12 ">
                            <div className='addy_container bg_pastel_blue'>
                                <div className='login_outer bg_white_cream'>

                                    <div className='reach_user_outer text-center'>
                                        <img src={Frame} className=' w-100 mt-4'/>
                                        <h2 className='mt-5 text-dark'>Connect with your audience using smart tools.</h2>
                                        <p className={"text-dark mb-4"}>Share information seamlessly across various channels to make a strong impact. We specialize in making sure your message reaches your audience smoothly and effectively through different media.</p>
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <div className='addy_container'>
                                <div className="addy_outer">
                                    <div className="addy_img">
                                        <div className='logo_outer'>
                                            <img src={addyads_img} height="90px" width="238px"/>
                                        </div>
                                        <h2 className='cmn_fontFamily'>{jsondata.welcomeBack}</h2>
                                    </div>
                                    <div className='login_form'>
                                        <form onSubmit={formik.handleSubmit}>

                                            <div className='form-group'>
                                                <label className={formik.values.username && "filled"}>{jsondata.email} or {jsondata.username}</label>
                                                <input
                                                    className="form-control mt-1"
                                                    type='text'
                                                    placeholder='Email'
                                                    name="username"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.username}
                                                />

                                                {formik.touched.username && formik.errors.username ? (
                                                    <p className="error_message">{formik.errors.username}</p>
                                                ) : null}

                                            </div>

                                            
                                            <div className='form-group '>
                                                <label className={formik.values.username && "filled"}>{jsondata.password}</label>
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



                                            <div className='rememberPass_outer mt-2'>

                                                <div className='check_box_outer'>
                                                    <div></div>
                                                    <Link to="/forgot-password">
                                                        <label
                                                            className='forgotPass_heading cursor_pointer'>{jsondata.forgotpassword}?</label>
                                                    </Link>

                                                </div>                                                
                                                <button type={"submit"} className='login_btn' disabled={isLoading}>{jsondata.login} {isLoading ? (<span className={"loader-forgot-pswd z-index-1 mx-2"}><RotatingLines width={30} strokeColor={"white"}></RotatingLines></span>): ""}</button>
                                                <h2 className='cmn_heading'>OR</h2>

                                                {/*======= login with  google =======*/}
                                                <a className=''
                                                   href={`${import.meta.env.VITE_APP_OAUTH2_BASE_URL}/google?redirect_uri=${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/auth-redirect`}>
                                                    <div className="google_img_outer login_btn login_google_btn">
                                                        <img src={google_img}/>
                                                        <h2 className="ps-2">{jsondata.loginwithgoogle} </h2></div>
                                                </a>

                                                {/*======= login with  facebook =======*/}

                                                <a className=''
                                                   href={`${import.meta.env.VITE_APP_OAUTH2_BASE_URL}/facebook?redirect_uri=${import.meta.env.VITE_APP_OAUTH2_REDIRECT_URL}/auth-redirect`}>
                                                    <div className="google_img_outer login_btn login_google_btn">
                                                        <img src={fbImg}/>
                                                        <h2 className="ps-2">{jsondata.loginwithfb} </h2></div>
                                                </a>

                                            </div>
                                        </form>

                                        <h3 className='cmn_heading'>{jsondata.account}
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
            </section>
        </>
    )
}
export default Login