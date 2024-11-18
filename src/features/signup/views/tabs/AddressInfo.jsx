import addyads_img from "../../../../images/addylogo.png";
import {Link, useNavigate} from "react-router-dom"
import jsondata from "../../../../locales/data/initialdata.json"
import {useFormik} from "formik"
import {isNullOrEmpty, validationSchemas} from "../../../../utils/commonUtils"
import Button from "../../../common/components/Button"
import React, {useEffect, useState} from "react";
import {Country, State, City} from 'country-state-city';
import Swal from "sweetalert2";
import Frame from "../../../../images/signupFrame.svg?react";
import success_img from "../../../../images/right_img.svg";

import {GrPrevious} from "react-icons/gr";
import {useSignUpMutation} from "../../../../app/apis/authApi";
import {handleRTKQuery} from "../../../../utils/RTKQueryUtils";
import { showSuccessToast } from "../../../common/components/Toast";
const AddressInfo = ({formData, setFormData, setShowTab}) => {
    const navigate = useNavigate()

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [signUp, signUpApi] = useSignUpMutation()


    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);


    const formik = useFormik({
        initialValues: {
            addressLine1: "",
            addressLine2: "",
            country: "",
            state: "",
            county: "",
            city: "",
            pinCode: "",
            isAgreedToTermsAndConditions: false,
        },
        validationSchema: validationSchemas.address,
        onSubmit: async (values) => {
            let signUpData = {
                ...formData,
                fullName: formData.firstName + " " + formData.lastName,
                address: {
                    addressLine1: values.addressLine1,
                    addressLine2: values.addressLine2,
                    country: values.country,
                    state: values.state,
                    county: values.county,
                    city: values.city,
                    pinCode: values.pinCode,
                },
            };
    
            await handleRTKQuery(
                async () => {
                    return await signUp(signUpData).unwrap();
                },
                () => {
                    showSuccessToast(
                        "Your registration is complete, and we've sent a confirmation email to your email address"
                    );
                    navigate("/login");
                    formik.resetForm(); 
                    setFormData(resetUserInfo); 
                },
               
                null 
            );
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

    useEffect(() => {
        if (formData && countries?.length > 0) {
            formik.setFieldValue("addressLine1", formData?.address?.addressLine1);
            formik.setFieldValue("addressLine2", formData?.address?.addressLine2);
            formik.setFieldValue("country", formData?.address?.country);
            formik.setFieldValue("state", formData?.address?.state);
            formik.setFieldValue("pinCode", formData?.address?.pinCode);
            if (!isNullOrEmpty(formData?.address?.country)) {
                handleCountryChange({target: {value: formData?.address?.country}})
            }
            if (!isNullOrEmpty(formData?.address?.state)) {
                handleStateChange({target: {value: formData?.address?.state}})
            }
            formik.setFieldValue("city", formData?.address?.city);
            formik.setFieldValue('county', formData?.address?.county);
            formik.setFieldValue('isAgreedToTermsAndConditions', formData?.address?.isAgreedToTermsAndConditions);
        }
    }, [formData, countries]);

    // handle previous tab
    const handlePreviousTab = (e) => {
        e.preventDefault();
        setFormData({...formData, address: formik.values})
        setShowTab((prev) => prev - 1);
    }

    // Custom onChange handler for the country select element
    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        formik.setFieldValue('country', selectedCountry);
        formik.setFieldValue('city', "");
        const country = Country.getAllCountries().find(state => state.name === selectedCountry);
        setCities([]);
        setStates(State.getStatesOfCountry(country.isoCode));
        formik.setFieldValue('county', "");
    };

    // Custom onChange handler for the state select element
    const handleStateChange = (event) => {
        const selectedState = event.target.value;
        formik.setFieldValue('state', selectedState);
        formik.setFieldValue('city', "");
        const state = State.getAllStates().find(state => state.name === selectedState);
        const cities = City.getCitiesOfState(state.countryCode, state.isoCode);
        setCities(cities);
        formik.setFieldValue('county', "");
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
                                        <Frame className=' w-100 mt-4'/>
                                        <h2 className='mt-3'>{jsondata.connect_audience_title}</h2>
                                        <p>{jsondata.connect_audience_desc}</p>
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">


                            <div className="addy_outer form_mainwrapper">
                            <div className="form_wrapper">
                            <div className="gr_previous_outer cursor-pointer"
                                 onClick={(e) =>
                                     !signUpApi?.isLoading && handlePreviousTab(e)}><GrPrevious/>
                            </div>
                                <div className="addy_img">
                                    <div className='logo_outer'><img src={addyads_img} height="90px" width="238px"/>
                                    </div>
                                    <h2 className="text-center mt-0">{jsondata.oneStepAway}</h2>
                                    <p>{jsondata.address}</p>
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
                                            <label htmlFor="country">{jsondata.country}<span>*</span> </label>
                                            <select
                                                id="country"
                                                name="country"
                                                onChange={handleCountryChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.country}
                                                className="form-select mt-1 cmn_select_box"
                                            >
                                                <option value="">{jsondata.select_country}</option>
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
                                                    <label htmlFor="state">{jsondata.state}<span>*</span> </label>
                                                    <select
                                                        id="state"
                                                        name="state"
                                                        onChange={handleStateChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.state}
                                                        className="form-select mt-1 cmn_select_box"
                                                    >
                                                        <option value="">{jsondata.select_state}</option>
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
                                                    <label>{jsondata.city} </label>
                                                    <input onChange={formik.handleChange}
                                                           onBlur={formik.handleBlur}
                                                           value={formik.values.city} name="city" id="city"
                                                           className="form-control mt-1" type='text'
                                                           placeholder={"City"}/>
                                                    {formik.touched.city && formik.errors.city ? (
                                                        <p className="error_message">{formik.errors.city}</p>
                                                    ) : null}

                                                </div>
                                            </div>
                                            {/** End City Fields */}


                                            <div className='col-lg-6'>
                                                <div className='form-group'>
                                                    <label htmlFor="city">{jsondata.county}<span>*</span></label>
                                                    <select
                                                        id="county"
                                                        name="county"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.county}
                                                        className="form-select mt-1 cmn_select_box"
                                                    >
                                                        <option value="">{jsondata.select_county}</option>
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
                                                           onWheel={(e) => {
                                                               e.target.blur()
                                                           }}
                                                           value={formik.values.pinCode} name="pinCode"
                                                           className="form-control mt-1" type='number'
                                                           placeholder={jsondata.pinCode}/>
                                                </div>
                                            </div>


                                            <div className={"agree-terms-conditions-login mt-2 ms-1"}>
                                                <input type={"checkbox"} className={"privacy-policy-checkbox me-2"}
                                                       onChange={formik.handleChange}
                                                       name={"isAgreedToTermsAndConditions"}
                                                       onBlur={formik.handleBlur}
                                                       value={formik.values.isAgreedToTermsAndConditions}/>
                                                <span className={"agree-privacy-policy-txt"}>I agree to the <Link
                                                    to={`${import.meta.env.VITE_APP_ADDY_WEB_PRIVACY_POLICY_URL}`}
                                                    target={"_blank"}>Privacy Policy</Link> and <Link
                                                    to={`${import.meta.env.VITE_APP_ADDY_WEB_TERMS_AND_CONDITIONS_URL}`}
                                                    target={"_blank"}>Terms and conditions</Link>
                                                </span>
                                            </div>
                                            {
                                                formik.touched.isAgreedToTermsAndConditions && formik.errors.isAgreedToTermsAndConditions ?
                                                    <p className="error_message">{formik.errors.isAgreedToTermsAndConditions}</p> : null
                                            }


                                            <div className="mt-2">
                                                <Button type={"Submit"} text={jsondata.signUp}
                                                        loading={signUpApi?.isLoading}/>

                                            </div>


                                        </div>
                                    </form>
                                    <h3 className='cmn_heading'>{jsondata.alreadyAccount}
                                        <Link to={signUpApi?.isLoading ? "/sign-up" : "/"} className="ms-2">
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