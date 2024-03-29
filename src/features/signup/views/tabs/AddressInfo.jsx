import men_img from "../../../../images/men.png"
import addyads_img from "../../../../images/addylogo.png";
import {Link, useNavigate} from "react-router-dom"
import jsondata from "../../../../locales/data/initialdata.json"
import {useFormik} from "formik"
import {validationSchemas} from "../../../../utils/commonUtils"
import {useDispatch, useSelector} from "react-redux"
import Button from "../../../common/components/Button"
import React, {useEffect, useState} from "react";
import {Country, State, City} from 'country-state-city';
import {signUpUser} from "../../../../app/actions/userActions/userActions";
import {showErrorToast} from "../../../common/components/Toast";
import Swal from "sweetalert2";
import Frame from "../../../../images/Frame.svg";

const AddressInfo = ({formData, setFormData, setShowTab}) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const signUpReducer = useSelector(state => state?.user?.signUpReducer);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);


    const formik = useFormik({
        initialValues: {
            addressLine1: formData?.address?.addressLine1,
            addressLine2: formData?.address?.addressLine2,
            country: formData?.address?.country,
            state: formData?.address?.state,
            county: formData?.address?.county,
            city: formData?.address?.city,
            pinCode: formData?.address?.pinCode

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

            dispatch(signUpUser({...formData,fullName:formData.firstName+" "+formData.lastName, address: addressObj, navigate})).then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registration Successful',
                        html: `
                             <p>Your registration is complete, and we've sent a confirmation email to your email address</p>
                         `,
                        showConfirmButton: true,
                        confirmButtonColor: "#F07C33",
                        showCancelButton: false,
                    }).then(result=>{
                        if(result.isConfirmed){
                            navigate("/login");
                        }
                    })
                    formik.resetForm();
                    setFormData(resetUserInfo);
                }
            }).catch((error) => {
                showErrorToast(error.response.data.message);
                formik.resetForm();
                setFormData(resetUserInfo)
            })
        },
    });

    const resetUserInfo = {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contactNo: "",
        industry: "",
        isAccountNonLocked: false,
        isEnabled: false
    }

    // handle previous tab
    const handlePreviousTab = (e) => {
        e.preventDefault();
        // setFormData((prevState) => {
        //     return {...prevState, formData}
        // });
        setFormData({...formData,address:formik.values})
        setShowTab((prev) => prev - 1);
    }
    // Custom onChange handler for the country select element
    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        formik.setFieldValue('country', selectedCountry);
        const country = Country.getAllCountries().find(state => state.name === selectedCountry);
        setStates(State.getStatesOfCountry(country.isoCode));
    };

    // Custom onChange handler for the state select element
    const handleStateChange = (event) => {
        const selectedState = event.target.value;
        formik.setFieldValue('state', selectedState);
        const state = State.getAllStates().find(state => state.name === selectedState);
        const cities = City.getCitiesOfState(state.countryCode, state.isoCode);
        setCities(cities);
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
                                        <h2 className='mt-5 text-dark'>Reach your users with new tools.</h2>
                                        <p className={"text-dark mb-4"}>Efficiently unleash cross-media information without cross-media value.
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
                                        <div className='logo_outer'><img src={addyads_img} height="90px" width="238px"/>
                                        </div>
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
                                                    <p className="error_message">{formik.errors.addressLine1}</p>
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

                                            {/**Start Country Fields */}
                                            <div className='form-group'>
                                                <label htmlFor="country">Country<span>*</span> </label>
                                                <select
                                                    id="country"
                                                    name="country"
                                                    onChange={handleCountryChange} // Use the custom onChange handler
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.country}
                                                    className="form-control mt-1"
                                                >
                                                    <option value="">Select Country</option>
                                                    {countries?.map((country) => (
                                                        <option key={country.name} value={country.name}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formik.touched.country && formik.errors.country ? (
                                                    <p className="error_message">{formik.errors.country}</p>
                                                ) : null}
                                            </div>

                                            {/** End Country Fields */}


                                            <div className="row">

                                                {/** Start States Fields */}

                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
                                                        <label htmlFor="state">State<span>*</span> </label>
                                                        <select
                                                            id="state"
                                                            name="state"
                                                            onChange={handleStateChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.state}
                                                            className="form-control mt-1"
                                                        >
                                                            <option value="">Select State</option>
                                                            {states?.map((state) => (
                                                                <option key={state.name} value={state.name}>
                                                                    {state.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {formik.touched.state && formik.errors.state ? (
                                                            <p className="error_message">{formik.errors.state}</p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {/** End States Fields */}

                                                {/** Start City Fields */}
                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
                                                        <label htmlFor="city">City</label>
                                                        <select
                                                            id="city"
                                                            name="city"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.city}
                                                            className="form-control mt-1"
                                                        >
                                                            <option value="">Select City</option>
                                                            {cities?.map((city, index) => (
                                                                <option key={index} value={city.isoCode}>
                                                                    {city.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                {/** End City Fields */}


                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
                                                        <label htmlFor="city">County<span>*</span></label>
                                                        <select
                                                            id="county"
                                                            name="county"
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.county}
                                                            className="form-control mt-1"
                                                        >
                                                            <option value="">Select County</option>
                                                            {cities?.map((city, index) => (
                                                                <option key={index} value={city.isoCode}>
                                                                    {city.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {formik.touched.county && formik.errors.county ? (
                                                            <p className="error_message">{formik.errors.county}</p>
                                                        ) : null}
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


                                                <div className='col-lg-6'>
                                                    <Button text={"Previous"} loading={false} type=""
                                                            handleOnClickFunction={(e) =>
                                                                !signUpReducer?.loading && handlePreviousTab(e)}/>
                                                </div>
                                                <div className='col-lg-6'>
                                                    <Button type={"Submit"} text={jsondata.signUp}
                                                            loading={signUpReducer?.loading}/>
                                                </div>

                                            </div>
                                        </form>
                                        <h3 className='cmn_heading'>{jsondata.alreadyAccount}
                                            <Link to={signUpReducer?.loading ? "/signup" : "/"} className="ms-2">
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
        </>
    )
}
export default AddressInfo;