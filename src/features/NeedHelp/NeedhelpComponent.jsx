import React, {useEffect, useState} from 'react';
import Accordion from 'react-bootstrap/Accordion';
import logo from '/Addy_icon.svg';
import {IoSendSharp} from 'react-icons/io5';
import {MdOutlineMail} from 'react-icons/md';
import {IoLocationOutline} from 'react-icons/io5';
import './needhelp.css';
import {getToken} from "../../app/auth/auth";
import {useDispatch, useSelector} from 'react-redux';
import {sendMessage, clearMessages, fetchAllMessages} from '../../app/slices/ChatSlice/chatSlice';
import {useAppContext} from "../common/components/AppProvider";
import {decodeJwtToken} from "../../app/auth/auth";
import Loader from "../loader/Loader";
import default_user_icon from "../../images/default_user_icon.svg";

const NeedHelpComponent = () => {
    const [messageText, setMessageText] = useState('');
    const [activeKey, setActiveKey] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const userData = useSelector((state) => state.user.userInfoReducer.data);
    const dispatch = useDispatch();
    const {messages = [], error} = useSelector((state) => state.chat);
    const authToken = getToken();
    const helpLine = "Hi. I'm your Addy Service Assistant. How can i help you?";
    const decodeJwt = decodeJwtToken(authToken);
    const senderId = decodeJwt?.customerId;
    console.log('SenderId.........', senderId)
    useEffect(() => {
        dispatch(fetchAllMessages({authToken}));
        return () => {
            dispatch(clearMessages());
        };
    }, [dispatch, authToken]);

    const timeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    const handleSend = async () => {
        setIsLoading(true)
        if (!messageText.trim()) {
            return;
        }
        try {
            await dispatch(sendMessage({authToken, senderId, messageText})).unwrap();
            setMessageText('');
            setIsLoading(false)

        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };
    console.log('messages..', messages)
    const handleToggle = (key) => {
        setActiveKey(key);
    };
    const {sidebar} = useAppContext();
    return (
        <div className={sidebar ? 'cmn_container' : 'cmn_Padding'}>
            <div className='cmn_outer'>
                <div className='need_help_outer'>
                    <h3 className='needhelp_heading'>Need Help?</h3>
                    <div className='row'>
                        <div className='col-lg-6 col-sm-12 col-md-12'>
                            <div className='needhelp_wrapper'>
                                <h3 className='Frequently_asked_outer text-center cmn_small_style_font'>
                                    Frequently Asked Questions
                                </h3>
                                <div className='accordian_wrapper'>
                                    <Accordion defaultActiveKey='0' activeKey={activeKey} onSelect={handleToggle}>
                                        <Accordion.Item eventKey='0'
                                                        className={activeKey === '0' ? 'active_border' : ''}>
                                            <Accordion.Header>How do I use Addy?</Accordion.Header>
                                            <Accordion.Body>
                                                To get started, create an account with Addy and select a plan that works
                                                for you. While signing up, choose your industry, business type, and
                                                other preferences. You'll also be prompted to connect your
                                                social media profiles to your dashboard. You can access your
                                                published posts, content calendar, ads, analytics, and everything else
                                                in one place.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                        <Accordion.Item eventKey='1'
                                                        className={activeKey === '1' ? 'active_border' : ''}>
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
                                    <img src={logo} height={'50px'} width={'50px'} alt='Addy Logo'/>
                                    <h3 className='cmn_small_style_font'>Chat with Addy</h3>
                                </div>
                                <div className='chat_container'>
                                    <div className="chat_scroll">
                                        <div className='d-flex gap-3 chat_inner_content'>
                                            <div className='user_profile_image_container'>
                                                <img src={logo} className='userchat_image'
                                                     alt='User Profile'/>
                                            </div>
                                            <div className='bot_chat_outer mb-3'>
                                                <div className='chat_inner_text'>
                                                    <h3>{helpLine}</h3>
                                                </div>

                                            </div>
                                        </div>
                                        {messages.length === 0 ? (""
                                            // <div className='d-flex gap-3 chat_inner_content'>
                                            //     <div className='user_profile_image_container'>
                                            //         <img src={logo} className='userchat_image'
                                            //              alt='User Profile'/>
                                            //     </div>
                                            //     <div className='bot_chat_outer'>
                                            //         <div className='chat_inner_text'>
                                            //             <h3>{'Hi how may i help you.'}</h3>
                                            //         </div>
                                            //         <h6 className='chat_time'>
                                            //             {/*{new Date().toLocaleTimeString()}*/}
                                            //             {new Date().toLocaleTimeString(undefined, timeFormatOptions)}
                                            //         </h6>
                                            //     </div>
                                            // </div>
                                        ) : (
                                            messages.map((message) => (
                                                <div key={message.id}>
                                                    {message.senderId === senderId ? (
                                                        <div className='d-flex gap-3 justify-content-end'>
                                                            <div>
                                                                <div className='chat_inner_text user_chat_inner_text'>
                                                                    <h3>{message.text}</h3>
                                                                </div>
                                                                <h6 className='chat_time text-end'>
                                                                    {/*{new Date(message.createdAt).toLocaleTimeString()}*/}
                                                                    {new Date(message.createdAt).toLocaleTimeString(undefined, timeFormatOptions)}
                                                                </h6>
                                                            </div>
                                                            <div className='user_profile_image_container'>
                                                                {/*<img src={logo} className='userchat_image'*/}
                                                                {/*     alt='User Profile'/>*/}
                                                                <img
                                                                    src={userData?.profilePic ? "data:image/jpeg; base64," + userData?.profilePic : default_user_icon}
                                                                    className='userchat_image' alt='User Profile'/>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='d-flex gap-3 chat_inner_content'>
                                                            <div className='user_profile_image_container'>
                                                                <img src={logo} className='userchat_image'
                                                                     alt='User Profile'/>
                                                            </div>
                                                            <div className='bot_chat_outer'>
                                                                <div className='chat_inner_text'>
                                                                    <h3>{message.text}</h3>
                                                                </div>
                                                                <h6 className='chat_time'>
                                                                    {/*{new Date(message.createdAt).toLocaleTimeString()}*/}
                                                                    {new Date(message.createdAt).toLocaleTimeString(undefined, timeFormatOptions)}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )))
                                        }
                                    </div>

                                    <div className='chart_wrapper'>
                                        {/* <div className='attachlink_wrapepr'>
                                            <img src={attach_file} alt='Attach File'/>
                                            {/* <PiLinkSimpleBold className='attachlink_outer'/> */}
                                        {/* </div> */}
                                        <div className='input_wrapper'>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Write message'
                                                value={messageText}
                                                onChange={(e) => setMessageText(e.target.value)}
                                            />
                                        </div>
                                        <div className='send_outer' onClick={handleSend}>
                                            {isLoading ? <Loader/> :
                                                <IoSendSharp style={{cursor: 'pointer'}}/>}
                                        </div>
                                        {error && <p className='error'>{error}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='Get_in_touch_outer'>
                        <h2 className='Get_in_touch_heading'>Get in Touch!</h2>
                        <div className='Get_in_touch_content_wrapper'>
                            <div className='row'>
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
    );
};

export default NeedHelpComponent;
