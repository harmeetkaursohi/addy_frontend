import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import "./Contact.css";
import {CiLocationOn} from "react-icons/ci";
import { PiPhoneCall } from "react-icons/pi";
import {FaRegEnvelope} from "react-icons/fa";
import {validationSchemas} from "../../utils/commonUtils";
import {contactUsFormActions} from "../../app/actions/webActions/webActions";
import {useDispatch, useSelector} from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import {showErrorToast, showSuccessToast} from "../common/components/Toast";
import {useNavigate} from 'react-router'
import Loader from "../loader/Loader";
import {useAppContext} from "../common/components/AppProvider";
import jsondata from "../../locales/data/initialdata.json"
const ContactUs = () => {
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {sidebar} = useAppContext()

    const contactUsFormReducer = useSelector((state) => state.web.contactUsFormReducer);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email_address: "",
        phone_number: "",
        message: "",
        recaptcha: "",
    });
    const handleOnChange = (e) => {
        setFormData((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value,
            };
        });
    };
    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email_address: "",
            phone_number: "",
            message: "",
            "g-recaptcha-response": "",
        },
        validationSchema: validationSchemas.contactForm,
        handleChange: handleOnChange,
        onSubmit: (values, {resetForm}) => {
            dispatch(contactUsFormActions(values)).then((res) => {
                res = res?.payload
                if (res?.status) {
                    resetForm()
                    showSuccessToast(res?.message);
                    setTimeout(() => {
                        navigate(0)
                    }, 3000);
                } else if (res?.status === false) {
                    if (res?.errors && Object.keys(res?.errors).length) {
                        const key = Object.keys(res?.errors)[0]
                        showErrorToast(res?.errors[key]);
                    } else {
                        resetForm()
                        showErrorToast(res?.message);
                        setTimeout(() => {
                            navigate(0)
                        }, 3000);
                    }
                }
            });

        },
    });


    useEffect(() => {
        function handleResize() {
            setIsSmallScreen(window.innerWidth <= 767);
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className={`cmn_container faq_section  ${sidebar ? "" : "cmn_Padding"}`}>
                <div className="cmn_outer">
                    <div className="cmn_wrapper_outer  white_bg_color cmn_height_outer">
                        <h2 className="dm-sans-font pt-5 pb-5 contact_us_heading">{jsondata.sidebarContent.contact}</h2>
                        <div className="row">
                            <div className="col-md-12 col-lg-6 Contact_us_Outer">
                                <div className="contact_content ">
                                    <h3>{jsondata.lets_talk_text}</h3>
                                    <p>
                                      {jsondata.contact_us_heading}
                                    </p>
                                    <ul>
                                        <li>
                                            <CiLocationOn size={22}/>
                                            <span>
                        {jsondata.contact_address} <br/>
                       {jsondata.contact_us_address}
                      </span>
                                        </li>
                                        <li>
                                        <PiPhoneCall className="PiPhoneCall"/>
                                            <a href="tel:+1 234 678 9108 99">{jsondata.contact_number}</a>
                                        </li>
                                        <li>
                                            <FaRegEnvelope/>
                                            <a href="mailto:Contact@addy.com">{jsondata.contact_email}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-md-12 col-lg-6 Contact_us_form_Outer">
                                <form onSubmit={formik.handleSubmit} id="contactForm">
                                    <div className=" contact_content">
                                        <div className="user-name-outer d-flex gap-3">
                                            <div className="flex-grow-1">
                                                <input
                                                    className="form-control"
                                                    name="first_name"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.first_name}
                                                    placeholder="First Name"
                                                />
                                                {formik.touched.first_name && formik.errors.first_name ? (
                                                    <p className="error_message">
                                                        {formik.errors.first_name}
                                                    </p>
                                                ) : null}

                                            </div>
                                            <div className="flex-grow-1">
                                                <input
                                                    className="form-control"
                                                    name="last_name"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.last_name}
                                                    placeholder="Last Name"
                                                />
                                                {formik.touched.last_name && formik.errors.last_name ? (
                                                    <p className="error_message">
                                                        {formik.errors.last_name}
                                                    </p>
                                                ) : null}
                                            </div>

                                        </div>


                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email_address"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email_address}
                                            placeholder="Email Address"
                                        />
                                        {formik.touched.email_address &&
                                        formik.errors.email_address ? (
                                            <p className="error_message">
                                                {formik.errors.email_address}
                                            </p>
                                        ) : null}


                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone_number"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.phone_number}
                                            placeholder="Phone Number"
                                        />
                                        {formik.touched.phone_number &&
                                        formik.errors.phone_number ? (
                                            <p className="error_message">
                                                {formik.errors.phone_number}
                                            </p>
                                        ) : null}


                                        <textarea
                                            rows="5"
                                            name="message"
                                            placeholder="Your message...."
                                            className="form-control"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.message}
                                        ></textarea>
                                        {formik.touched.message && formik.errors.message ? (
                                            <p className="error_message">{formik.errors.message}</p>
                                        ) : null}


                                        <ReCAPTCHA
                                            sitekey={
                                                import.meta.env.VITE_APP_ASTR_RECAPTCHA_SITE_KEY
                                            }
                                            onChange={(value) => {
                                                formik.setFieldValue("g-recaptcha-response", value);
                                            }}

                                            style={{
                                                transform: isSmallScreen ? 'scale(0.6)' : "scale(0.9)",
                                                transformOrigin: isSmallScreen ? '0 0' : "0",
                                                width: isSmallScreen ? "200px" : "250px",
                                                marginTop: "13px",
                                            }}
                                        />
                                        {formik.touched["g-recaptcha-response"] &&
                                        formik.errors["g-recaptcha-response"] ? (
                                            <p className="error_message">
                                                {formik.errors["g-recaptcha-response"]}
                                            </p>
                                        ) : null}
                                        <div className=" mt-2">
                                            <button type="submit" className={"cmn_btn_color sendMessageBtn"}
                                                    disabled={contactUsFormReducer.loading}>
                                                {contactUsFormReducer.loading ? <Loader/> : "Send Message"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;
