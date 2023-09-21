import men_img from "../../../../images/men.png"
import {Link, useNavigate} from "react-router-dom"
import jsondata from "../../../../locales/data/initialdata.json"
import {useFormik} from "formik"
import {validationSchemas} from "../../../../utils/commonUtils"
import {useDispatch, useSelector} from "react-redux"
import {signUpUser} from "../../../../app/actions/userActions/userActions"
import Button from "../../../common/components/Button"

const AddressInfo = ({formData, setFormData, setShowTab}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const signUpReducer = useSelector(state => state?.user?.signUpReducer);

    const formik = useFormik({
        initialValues: {
            addressLine1: "",
            addressLine2: "",
            country: "",
            state: "",
            county: "",
            city: "",
            pinCode: ""

        },
        validationSchema: validationSchemas.address,
        onSubmit: (values) => {
            let addressObj = {
                addressLine1: values.addressLine1,
                addressLine2: values.addressLine2,
                country: values.country,
                state: values.state,
                county: values.country,
                city: values.city,
                pinCode: values.pinCode
            }

            dispatch(signUpUser({...formData, address: addressObj, navigate}))

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
                                        <h2 className='cmn_fontFamily'>{jsondata.oneStepAway}</h2>
                                        <p className="pt-2">{jsondata.address}</p>
                                    </div>
                                    <div className='login_form'>
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className='form-group'>
                                                <label>{jsondata.addressLine1} <span>*</span> </label>
                                                <input onChange={formik.handleChange}
                                                       onBlur={formik.handleBlur}
                                                       value={formik.values.addressLine1} name="addressLine1"
                                                       className="form-control mt-1" type='text'
                                                       placeholder={jsondata.addressLine1}/>
                                                {formik.touched.addressLine1 && formik.errors.addressLine1 ? (
                                                    <p style={{color: "red"}}>{formik.errors.addressLine1}</p>
                                                ) : null}

                                            </div>
                                            <div className='form-group'>
                                                <label>{jsondata.addressLine2}</label>
                                                <input onChange={formik.handleChange}
                                                       onBlur={formik.handleBlur}
                                                       value={formik.values.addressLine2} name="addressLine2"
                                                       className="form-control mt-1" type='text'
                                                       placeholder={jsondata.addressLine2}/>


                                            </div>
                                            <div className='form-group'>
                                                <label>{jsondata.country}<span>*</span> </label>
                                                <input onChange={formik.handleChange}
                                                       onBlur={formik.handleBlur}
                                                       value={formik.values.country} name="country"
                                                       className="form-control mt-1" type='text'
                                                       placeholder={jsondata.country}/>
                                                {formik.touched.country && formik.errors.country ? (
                                                    <p style={{color: "red"}}>{formik.errors.country}</p>
                                                ) : null}

                                            </div>
                                            <div className="row">
                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
                                                        <label>{jsondata.state}<span>*</span> </label>
                                                        <input onChange={formik.handleChange}
                                                               onBlur={formik.handleBlur}
                                                               value={formik.values.state} name="state"
                                                               className="form-control mt-1" type='text'
                                                               placeholder={jsondata.state}/>
                                                        {formik.touched.state && formik.errors.state ? (
                                                            <p style={{color: "red"}}>{formik.errors.state}</p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
                                                        <label>{jsondata.city}</label>
                                                        <input onChange={formik.handleChange}
                                                               onBlur={formik.handleBlur}
                                                               value={formik.values.city} name="city"
                                                               className="form-control mt-1" type='text'
                                                               placeholder={jsondata.city}/>


                                                    </div>
                                                </div>


                                                <div className='col-lg-6'>
                                                    <div className='rememberPass_outer mt-2'>
                                                        <div className='form-group'>
                                                            <label>{jsondata.county}<span>*</span> </label>
                                                            <input onChange={formik.handleChange}
                                                                   onBlur={formik.handleBlur}
                                                                   value={formik.values.county} name="county"
                                                                   className="form-control mt-1" type='text'
                                                                   placeholder={jsondata.county}/>
                                                            {formik.touched.county && formik.errors.county ? (
                                                                <p style={{color: "red"}}>{formik.errors.county}</p>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
                                                        <label>{jsondata.pinCode}</label>
                                                        <input onChange={formik.handleChange}
                                                               onBlur={formik.handleBlur}
                                                               value={formik.values.pinCode} name="pinCode"
                                                               className="form-control mt-1" type='number'
                                                               placeholder={jsondata.pinCode}/>


                                                    </div>
                                                </div>


                                               <div>
                                                   <Button text={jsondata.signUp} loading={signUpReducer?.loading}/>
                                               </div>

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
export default AddressInfo;