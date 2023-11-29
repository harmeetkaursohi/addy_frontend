import SideBar from "../sidebar/views/Layout";
import React from "react";
import './Contact.css'
import {CiLocationOn} from "react-icons/ci";
import {FaPhoneVolume} from "react-icons/fa6";
import {FaRegEnvelope} from "react-icons/fa";
import GenericButtonWithLoader from "../common/components/GenericButtonWithLoader";


const ContactUs = () => {
    return (
        <>
            <SideBar/>
            <div className="cmn_container faq_section pt-5">
                <div className="cmn_wrapper_outer">
                    <div className="dashboard_outer">
                        <h2 className="cmn_title">Contact Us</h2>
                        <div className="row m-0">
                            <div className="col-6">
                                <div className="contact_content">
                                    <h3>Let's talk with us</h3>
                                    <p>Questions, comments, or suggestions? Simply fill in the form and we’ll be in
                                        touch shortly.</p>
                                    <ul>
                                        <li>
                                            <CiLocationOn size={22}/><span>1055 Arthur ave Elk Groot, 67. <br/>
                                            New Palmas South Carolina. </span>
                                        </li>
                                        <li>
                                            <FaPhoneVolume/>
                                            <a href="tel:+1 234 678 9108 99">+1 234 678 9108 99</a>
                                        </li>
                                        <li>
                                            <FaRegEnvelope/>
                                            <a href="mailto:Contact@addy.com">Contact@addy.com</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="row m-0 contact_form">

                                    <div className="col-lg-6">
                                        <input className="form-control" placeholder="First Name"/>
                                    </div>

                                    <div className="col-lg-6">
                                        <input className="form-control" placeholder="Last Name"/>
                                    </div>

                                    <div className="col-lg-12">
                                        <input type="email" className="form-control" placeholder="Email"/>
                                    </div>

                                    <div className="col-lg-12">
                                        <input type="email" className="form-control" placeholder="Phone Number"/>
                                    </div>

                                    <div className="col-lg-12">
                                        <textarea rows="5" className="form-control"></textarea>
                                    </div>

                                    <div className="col-12 mt-3">
                                        <GenericButtonWithLoader className="w-100 cmn_bg_btn schedule_btn loading" label="Send Message"/>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ContactUs;