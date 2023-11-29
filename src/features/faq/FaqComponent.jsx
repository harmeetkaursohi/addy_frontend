import SideBar from "../sidebar/views/Layout";
import React from "react";
import Accordion from 'react-bootstrap/Accordion';
import './faq.css'
import GenericButtonWithLoader from "../common/components/GenericButtonWithLoader";
const FaqComponent = () => {

    return (
        <>
            <SideBar/>
            <div className="cmn_container faq_section pt-5">
                <div className="cmn_wrapper_outer">
                    <div className="dashboard_outer">
                        <div className="faq_wrapper">
                            <h2>
                                Frequently Asked Questions
                                Hello, how can we help you ?
                            </h2>
                            <p>
                                Want to receive a monthly email in your inbox with awesome free Webflow cloneables, resources and more? Please submit your email below.
                            </p>
                            <div className="faq_searchbar">
                                <input type="text" placeholder="Enter Your email"/>
                                <GenericButtonWithLoader className={"cmn_btn_color"} label={"Subscribe"}/>
                            </div>
                            <div className="accordian_wrapper">
                                <Accordion eventKey="0">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>How do I use Addy?</Accordion.Header>
                                        <Accordion.Body>
                                            To get started, create an account with Addy and select a plan that works for you.
                                            While signing up, choose your industry, business type, and other preferences.
                                            You'll also be prompted to connect your social media profiles to your dashboard.
                                            You can access your published posts, content calendar, ads, analytics, and everything else in one place.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>What can Addy do for my business?</Accordion.Header>
                                        <Accordion.Body>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat. Duis aute irure dolor in
                                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit anim id est laborum.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>How do I connect/disconnect my social networks on Addy?</Accordion.Header>
                                        <Accordion.Body>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat. Duis aute irure dolor in
                                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit anim id est laborum.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header>Can I get an invoice?</Accordion.Header>
                                        <Accordion.Body>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                            aliquip ex ea commodo consequat. Duis aute irure dolor in
                                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                            culpa qui officia deserunt mollit anim id est laborum.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default FaqComponent;