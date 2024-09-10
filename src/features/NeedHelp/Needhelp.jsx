import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import logo from "/Addy_icon.svg"
import { IoSendSharp } from "react-icons/io5";
import { PiLinkSimpleBold } from "react-icons/pi";
import { MdOutlineMail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import "./needhelp.css"
import {useAppContext} from "../common/components/AppProvider";
import attach_file from "../../images/attach-file.png"
const Needhelp = () => {
    const [activeKey, setActiveKey] = useState(null);

    const handleToggle = (key) => {
        setActiveKey(activeKey === key ? null : key); // Toggle open/close state
    };

    const { sidebar } = useAppContext();
    return (
        <div className={sidebar? 'cmn_container':"cmn_Padding"}>
            <div className="cmn_outer">
                <div className='need_help_outer'>
                    <h3 className='needhelp_heading'>Need Help?</h3>
                    <div className='row'>
                        <div className='col-lg-6 col-sm-12 col-md-12'>
                            <div className='needhelp_wrapper'>
                                <h3 className='Frequently_asked_outer text-center cmn_small_style_font'>Frequently Asked
                                    Questions</h3>
                                <div className='accordian_wrapper'>

                                    <Accordion defaultActiveKey="0" activeKey={activeKey} onSelect={handleToggle}>
                                        <Accordion.Item eventKey="0"
                                                        className={activeKey === '0' ? "active_border" : ""}
                                        >
                                            <Accordion.Header>How do I use Addy?</Accordion.Header>
                                            <Accordion.Body>
                                                To get started, create an account with Addy and select a plan that works
                                                for you.
                                                While signing up, choose your industry, business type, and
                                                other preferences. You'll also be prompted to connect your
                                                social media profiles to your dashboard. You can access your
                                                published posts, content calendar, ads, analytics, and everything else
                                                in one place.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey="1"
                                                        className={activeKey === '1' ? "active_border" : ""}>
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
                                    </Accordion>
                                </div>

                            </div>
                        </div>
                        <div className='col-lg-6 col-sm-12 col-md-12'>
                            <div className='needhelp_wrapper'>
                                <div className='chataddy_outer d-flex justify-content-center gap-3 align-items-center'>
                                    <img src={logo} height={"50px"} width={"50px"}/>
                                    <h3 className='cmn_small_style_font '>Chat with Addy</h3>
                                </div>
                                <div className='chat_container'>

                                    <div className='d-flex gap-3 chat_inner_content '>
                                        <div className='user_profile_image_container'>
                                            <img src={logo} className='userchat_image'/>

                                        </div>
                                        <div className='bot_chat_outer'>
                                            <div className='chat_inner_text'>
                                                <h3>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the 1500s,</h3>
                                            </div>
                                            <h6 className='chat_time'>8:00 PM</h6>

                                        </div>

                                    </div>
                                    <div className='user_chat_outer d-flex gap-3 justify-content-end'>
                                        <div>
                                            <div className='chat_inner_text user_chat_inner_text'>
                                                <h3>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the 1500s,</h3>
                                            </div>
                                            <h6 className='chat_time text-end'>8:00 PM</h6>
                                        </div>
                                        <div className='user_profile_image_container'>
                                            <img src={logo} className='userchat_image'/>

                                        </div>


                                    </div>
                                    <div className='chart_wrapper'>
                                        <div className='attachlink_wrapepr'>
                                            <img src={attach_file}/>
                                            {/*<PiLinkSimpleBold className='attachlink_outer'/>*/}
                                        </div>
                                        <div className='input_wrapper'>
                                            <input type='text' className='form-control' placeholder='write message'/>

                                        </div>
                                        <div className='send_outer'>
                                            <IoSendSharp/>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='Get_in_touch_outer'>
                        <h2 className='Get_in_touch_heading'>Get in Touch!</h2>
                        <div className='Get_in_touch_content_wrapper'>
                            <div className='row '>
                                <div className='col-lg-6 col-sm-12 col-md-6'>
                                    <div className='d-flex getintouch_inner_content align-items-center gap-2'>
                                        <div className='email_wrapper'>
                                            <MdOutlineMail/>
                                        </div>
                                        <h3>kiritgoti007@gmail.com</h3>
                                    </div>
                                </div>
                                <div className='col-lg-6 col-sm-12 col-md-6'>
                                    <div className='d-flex getintouch_inner_content align-items-center gap-2'>
                                        <div className='email_wrapper'>
                                            <IoLocationOutline/>
                                        </div>
                                        <h3>India — 723 17th Street, Office 478 Mumbai, IM 81566</h3>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Needhelp
