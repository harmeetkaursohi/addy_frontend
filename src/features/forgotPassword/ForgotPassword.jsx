import {useFormik} from 'formik';
import React, {useEffect} from 'react'
import {validationSchemas} from "../../utils/commonUtils"
import jsondata from "../../locales/data/initialdata.json"
import {useDispatch, useSelector} from "react-redux"
import {forgotPassword} from '../../app/actions/userActions/userActions';
import {Link, useNavigate} from 'react-router-dom';
import addyads_img from "../../images/addylogo.png";
import Frame from "../../images/Frame.svg";
import {RotatingLines} from "react-loader-spinner";


function ForgotPassword() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const forgotPasswordData=useSelector(state => state.user.forgotPasswordReducer)

    useEffect(() => {
        document.title = "Forgot Password"
    }, []);


    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: validationSchemas.forgotPassword,
        onSubmit: (values) => {
            dispatch(forgotPassword({values, navigate}))
        },
    });

    return (
        <section className='Container'>
            <div className="login_wrapper">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 ">
                        <div className='addy_container bg_pastel_blue'>
                            <div className='login_outer bg_white_cream'>


                                <div className='reach_user_outer text-center'>
                                    <img src={Frame} className=' w-100 mt-4'/>
                                    <h2 className='mt-5 text-dark'>Connect with your audience using cutting-edge tools.</h2>
                                    <p className={"text-dark mb-4"}>Engage your audience with innovative tools. Effectively deliver information across different media channels to create maximum impact. We specialize in optimizing cross-media content delivery, ensuring your message reaches your audience efficiently and effectively.</p>
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
                                    <h2 className='cmn_fontFamily'>{jsondata.forgotPassword.forgotPassword}</h2>

                                </div>
                                <div className='login_form'>
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className='resetOuter_wrapper'>

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
                                                    <p className="error_message">{formik.errors.email}</p>
                                                ) : null}                                                
                                                <button type="submit"
                                                        disabled={forgotPasswordData?.loading}
                                                        className={' login_btn '+(forgotPasswordData?.loading?"opacity-50":"")}>{jsondata.forgotPassword.forgotPassword}
                                                    {
                                                        forgotPasswordData?.loading && <span className={"loader-forgot-pswd z-index-1 mx-2"}><RotatingLines width={30} strokeColor={"white"}></RotatingLines></span>
                                                    }
                                                </button>
                                            </div>

                                        </div>
                                    </form>
                                    <h3 className='cmn_heading'>
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