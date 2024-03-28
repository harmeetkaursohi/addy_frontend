import {useFormik} from 'formik';
import React, {useEffect} from 'react'
import {validationSchemas} from "../../utils/commonUtils"
import jsondata from "../../locales/data/initialdata.json"
import {useDispatch, useSelector} from "react-redux"
import {forgotPassword} from '../../app/actions/userActions/userActions';
import {Link, useNavigate} from 'react-router-dom';
import addyads_img from "../../images/addylogo.png";
import Frame from "../../images/forgot_pass_bg.svg";
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
                        <div className='addy_container bg_light_orange'>
                            <div className='login_outer'>


                                <div className='reach_user_outer text-center'>
                                    <img src={Frame} className=' w-100 mt-4'/>
                                    <h2 className='mt-5'>{jsondata.connect_audience_title}</h2>
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
                                    <p>Enter register email address</p>

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
                                                {formik.touched.email && formik.errors.email ? (
                                                    <p className="error_message">{formik.errors.email}</p>
                                                ) : null}                                                
                                                <button type="submit"
                                                        disabled={forgotPasswordData?.loading}
                                                        className={' login_btn '+(forgotPasswordData?.loading?"opacity-50":"")}>{jsondata.forgotpassword}
                                                    {
                                                        forgotPasswordData?.loading && <span className={"loader-forgot-pswd z-index-1 mx-2"}><RotatingLines width={30} strokeColor={"white"}></RotatingLines></span>
                                                    }
                                                </button>
                                            </div>

                                        </div>
                                    </form>
                                    <h3 >
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