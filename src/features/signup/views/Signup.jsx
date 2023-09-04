import men_img from "../../../images/men.png"
import {Link} from "react-router-dom"
import jsondata from "../../../locales/data/initialdata.json";
import {validationSchemas} from "../../../utils/commonUtils.js";
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import {signUpUser} from "../../../app/actions/userActions/userActions.js";

const Signup = () => {

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            industry: "",
            country: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: validationSchemas.register,
        onSubmit: (values) => {
            dispatch(signUpUser(values));
        },
    });


    return (
        <>
            <section className='Container'>
                <div className="login_wrapper">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12 ">
                            <div className='addy_container bg_color'>
                                <div className='login_outer'>

                                    <div className='reach_user_outer'>
                                        <img src={men_img} className='girl_img_width'/>
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
                                        <h2 className='cmn_fontFamily'>Create New Account</h2>
                                        <p className="pt-2">Lorem Ipsum is simply dummy text of the printing and type
                                            setting industry.</p>
                                    </div>
                                    <div className='login_form'>

                                        <form onSubmit={formik.handleSubmit}>

                                            <div className='form-group'>
                                                <label>{jsondata.username}</label>

                                                <input
                                                    name="username"
                                                    className="form-control mt-1"
                                                    type='text'
                                                    placeholder='Username'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.username}
                                                />

                                                {formik.touched.username && formik.errors.username ? (
                                                    <p style={{color: "red"}}>{formik.errors.username}</p>
                                                ) : null}

                                            </div>

                                            <div className='form-group'>
                                                <label>{jsondata.email}</label>
                                                <input
                                                    name="email"
                                                    className="form-control mt-1"
                                                    type='email'
                                                    placeholder='Email'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.email}
                                                />

                                                {formik.touched.email && formik.errors.email ? (
                                                    <p style={{color: "red"}}>{formik.errors.email}</p>
                                                ) : null}

                                            </div>

                                            <div className='rememberPass_outer mt-2'>

                                                <div className='form-group'>
                                                    <label>{jsondata.industry}</label>
                                                    <input
                                                        name="industry"
                                                        className="form-control mt-1"
                                                        type='text'
                                                        placeholder='Industry'
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.industry}
                                                    />

                                                    {formik.touched.industry && formik.errors.industry ? (
                                                        <p style={{color: "red"}}>{formik.errors.industry}</p>
                                                    ) : null}

                                                </div>

                                                <div className='form-group'>
                                                    <label>{jsondata.country}</label>
                                                    <input
                                                        name="country"
                                                        className="form-control mt-1"
                                                        type='text'
                                                        placeholder='Country'
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.country}
                                                    />

                                                    {formik.touched.country && formik.errors.country ? (
                                                        <p style={{color: "red"}}>{formik.errors.country}</p>
                                                    ) : null}

                                                </div>

                                                <div className='form-group'>
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
                                                        <p style={{color: "red"}}>{formik.errors.password}</p>
                                                    ) : null}
                                                </div>

                                                <div className='form-group'>
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
                                                        <p style={{color: "red"}}>{formik.errors.confirmPassword}</p>
                                                    ) : null}
                                                </div>

                                                <button className=' login_btn'>{jsondata.next}</button>
                                            </div>
                                        </form>
                                        <h3 className='cmn_heading'>{jsondata.alreadyAccount} <Link to="/login"><span
                                            className='sign_up'>{jsondata.login}</span></Link></h3>
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
export default Signup