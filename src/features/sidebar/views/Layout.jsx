import React, { useState } from 'react';
import calender_icon from '../../../images/calender_icon.svg'
import home_icon from '../../../images/home.svg'
import gallary_icon from '../../../images/gallery_img.svg'
import info_icon from '../../../images/info-square.svg'
import faq_icon from '../../../images/faq_img.svg'
import call_icon from '../../../images/call_img.svg'
import privacy_icon from '../../../images/privacy_img.svg'
import profile_img from '../../../images/profile_img.png'
import addy_logo from '../../../images/addylogo.png'
import comment_img from '../../../images/comment_image.svg'
import { NavLink, useLocation } from "react-router-dom"
import "./Layout.css"


const SideBar = () => {
    const [sidebar, setSidebar] = useState(true)
    const show_sidebar = () => {
        setSidebar(!sidebar)
    }
    const { pathname } = useLocation()
    return (
        <>
            <section className='sidebar_container'>
                <div className={sidebar ? "sidebar_content sidebar_wrapper" : "sidebar_wrapper"}>
                    <i className="fa fa-bars bar_icon" aria-hidden="true" onClick={show_sidebar}></i>
                    <div className={sidebar ? "user_Profile_outer user_profile_outer" : "user_profile_outer"}>
                        <div className='logo_outer'>
                            <img src={addy_logo} className='addy_logo' />
                        </div>
                        <div className='user_profile_wrapper'>
                            <img src={profile_img} className='profile_img' />
                            <div>
                                <h3 className='mt-3'>Pritpal Singh</h3>
                                <h4 >pritpal@gmail.com</h4>
                            </div>
                        </div>
                    </div>
                    <ul className='sidebar_item'>
                        {/* <li >
                            {pathname === "/dashboard" ? <div className='bar'>
                            </div> : ""}
                            <div className={sidebar ? "sidebar_content" : "sidebar_item_outer" }>

                                <NavLink activeClassName="active" to="/dashboard">
                                    <img src={home_icon} />
                                    Home
                                </NavLink>

                            </div>
                        </li> */}
                        <li>
                            {pathname === "/dashboard" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname === "/dashboard" ? "sidebar_container_items sidebar_item_outer" : 'sidebar_item_outer'}>

                                <NavLink activeClassName="active" to="/dashboard">
                                    {/* <img src={home_icon} /> */}
                                    {pathname === "/dashboard" ? <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="home_svgrepo.com">
                                            <path className='svg_color' id="Vector" d="M17.4166 10.1611V11.3653C17.4166 14.4534 17.4166 15.9976 16.4891 16.9569C15.5616 17.9163 14.0688 17.9163 11.0833 17.9163H7.91658C4.93102 17.9163 3.43825 17.9163 2.51074 16.9569C1.58325 15.9976 1.58325 14.4534 1.58325 11.3653V10.1611C1.58325 8.34944 1.58325 7.4436 1.99429 6.69268C2.40532 5.94176 3.15625 5.4757 4.65811 4.54361L6.24144 3.56095C7.82902 2.57565 8.62283 2.08301 9.49992 2.08301C10.377 2.08301 11.1708 2.57565 12.7584 3.56095L14.3417 4.5436C15.8436 5.4757 16.5945 5.94176 17.0056 6.69268" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                            <path className='svg_color' id="Vector_2" d="M11.875 14.75H7.125" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                        </g>
                                    </svg> : <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="home_svgrepo.com">
                                            <path id="Vector" d="M17.4166 10.1611V11.3653C17.4166 14.4534 17.4166 15.9976 16.4891 16.9569C15.5616 17.9163 14.0688 17.9163 11.0833 17.9163H7.91658C4.93102 17.9163 3.43825 17.9163 2.51074 16.9569C1.58325 15.9976 1.58325 14.4534 1.58325 11.3653V10.1611C1.58325 8.34944 1.58325 7.4436 1.99429 6.69268C2.40532 5.94176 3.15625 5.4757 4.65811 4.54361L6.24144 3.56095C7.82902 2.57565 8.62283 2.08301 9.49992 2.08301C10.377 2.08301 11.1708 2.57565 12.7584 3.56095L14.3417 4.5436C15.8436 5.4757 16.5945 5.94176 17.0056 6.69268" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                            <path id="Vector_2" d="M11.875 14.75H7.125" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                        </g>
                                    </svg>}
                                    {/* <h4 className={pathname === "/dashboard" ? "active_icon" : "icon"}><i className="fa-solid fa-house"></i></h4> */}
                                    Home</NavLink>
                            </div>
                        </li>
                        <li>
                            {pathname === "/planner" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname === "/planner" ? "sidebar_container_items sidebar_item_outer" : 'sidebar_item_outer'}>

                                <NavLink activeClassName="active" to="/planner">
                                    {/* <img src={calender_icon} /> */}
                                    {pathname === "/planner" ?
                                        <svg className="svg_color" width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="calendar_svgrepo.com">
                                                <path className="svg_color" id="Vector" d="M11.0833 17.917H7.91658C4.93102 17.917 3.43825 17.917 2.51074 16.9895C1.58325 16.062 1.58325 14.5692 1.58325 11.5837V10.0003C1.58325 7.01476 1.58325 5.52199 2.51074 4.59448C3.43825 3.66699 4.93102 3.66699 7.91658 3.66699H11.0833C14.0688 3.66699 15.5616 3.66699 16.4891 4.59448C17.4166 5.52199 17.4166 7.01476 17.4166 10.0003V11.5837C17.4166 14.5692 17.4166 16.062 16.4891 16.9895C15.9719 17.5066 15.2792 17.7354 14.2499 17.8366" stroke="#97A1AD" stroke-width="1.9" stroke-linecap="round" />
                                                <path className="svg_color" id="Vector_2" d="M5.54175 3.66699V2.47949" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path className="svg_color" id="Vector_3" d="M13.4583 3.66699V2.47949" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path className="svg_color" id="Vector_4" d="M17.0208 7.625H13.1614H8.51034M1.58325 7.625H4.65096" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path id="Vector_5" d="M14.2501 13.9587C14.2501 14.3959 13.8957 14.7503 13.4584 14.7503C13.0212 14.7503 12.6667 14.3959 12.6667 13.9587C12.6667 13.5214 13.0212 13.167 13.4584 13.167C13.8957 13.167 14.2501 13.5214 14.2501 13.9587Z" fill="#97A1AD" />
                                                <path id="Vector_6" d="M14.2501 10.7917C14.2501 11.2289 13.8957 11.5833 13.4584 11.5833C13.0212 11.5833 12.6667 11.2289 12.6667 10.7917C12.6667 10.3544 13.0212 10 13.4584 10C13.8957 10 14.2501 10.3544 14.2501 10.7917Z" fill="#97A1AD" />
                                                <path id="Vector_7" d="M10.2916 13.9587C10.2916 14.3959 9.93716 14.7503 9.49992 14.7503C9.06268 14.7503 8.70825 14.3959 8.70825 13.9587C8.70825 13.5214 9.06268 13.167 9.49992 13.167C9.93716 13.167 10.2916 13.5214 10.2916 13.9587Z" fill="#97A1AD" />
                                                <path id="Vector_8" d="M10.2916 10.7917C10.2916 11.2289 9.93716 11.5833 9.49992 11.5833C9.06268 11.5833 8.70825 11.2289 8.70825 10.7917C8.70825 10.3544 9.06268 10 9.49992 10C9.93716 10 10.2916 10.3544 10.2916 10.7917Z" fill="#97A1AD" />
                                                <path id="Vector_9" d="M6.33333 13.9587C6.33333 14.3959 5.97889 14.7503 5.54167 14.7503C5.10444 14.7503 4.75 14.3959 4.75 13.9587C4.75 13.5214 5.10444 13.167 5.54167 13.167C5.97889 13.167 6.33333 13.5214 6.33333 13.9587Z" fill="#97A1AD" />
                                                <path id="Vector_10" d="M6.33333 10.7917C6.33333 11.2289 5.97889 11.5833 5.54167 11.5833C5.10444 11.5833 4.75 11.2289 4.75 10.7917C4.75 10.3544 5.10444 10 5.54167 10C5.97889 10 6.33333 10.3544 6.33333 10.7917Z" fill="#97A1AD" />
                                            </g>
                                        </svg> : <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="calendar_svgrepo.com">
                                                <path id="Vector" d="M11.0833 17.917H7.91658C4.93102 17.917 3.43825 17.917 2.51074 16.9895C1.58325 16.062 1.58325 14.5692 1.58325 11.5837V10.0003C1.58325 7.01476 1.58325 5.52199 2.51074 4.59448C3.43825 3.66699 4.93102 3.66699 7.91658 3.66699H11.0833C14.0688 3.66699 15.5616 3.66699 16.4891 4.59448C17.4166 5.52199 17.4166 7.01476 17.4166 10.0003V11.5837C17.4166 14.5692 17.4166 16.062 16.4891 16.9895C15.9719 17.5066 15.2792 17.7354 14.2499 17.8366" stroke="#97A1AD" stroke-width="1.9" stroke-linecap="round" />
                                                <path id="Vector_2" d="M5.54175 3.66699V2.47949" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path id="Vector_3" d="M13.4583 3.66699V2.47949" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path id="Vector_4" d="M17.0208 7.625H13.1614H8.51034M1.58325 7.625H4.65096" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path id="Vector_5" d="M14.2501 13.9587C14.2501 14.3959 13.8957 14.7503 13.4584 14.7503C13.0212 14.7503 12.6667 14.3959 12.6667 13.9587C12.6667 13.5214 13.0212 13.167 13.4584 13.167C13.8957 13.167 14.2501 13.5214 14.2501 13.9587Z" fill="#97A1AD" />
                                                <path id="Vector_6" d="M14.2501 10.7917C14.2501 11.2289 13.8957 11.5833 13.4584 11.5833C13.0212 11.5833 12.6667 11.2289 12.6667 10.7917C12.6667 10.3544 13.0212 10 13.4584 10C13.8957 10 14.2501 10.3544 14.2501 10.7917Z" fill="#97A1AD" />
                                                <path id="Vector_7" d="M10.2916 13.9587C10.2916 14.3959 9.93716 14.7503 9.49992 14.7503C9.06268 14.7503 8.70825 14.3959 8.70825 13.9587C8.70825 13.5214 9.06268 13.167 9.49992 13.167C9.93716 13.167 10.2916 13.5214 10.2916 13.9587Z" fill="#97A1AD" />
                                                <path id="Vector_8" d="M10.2916 10.7917C10.2916 11.2289 9.93716 11.5833 9.49992 11.5833C9.06268 11.5833 8.70825 11.2289 8.70825 10.7917C8.70825 10.3544 9.06268 10 9.49992 10C9.93716 10 10.2916 10.3544 10.2916 10.7917Z" fill="#97A1AD" />
                                                <path id="Vector_9" d="M6.33333 13.9587C6.33333 14.3959 5.97889 14.7503 5.54167 14.7503C5.10444 14.7503 4.75 14.3959 4.75 13.9587C4.75 13.5214 5.10444 13.167 5.54167 13.167C5.97889 13.167 6.33333 13.5214 6.33333 13.9587Z" fill="#97A1AD" />
                                                <path id="Vector_10" d="M6.33333 10.7917C6.33333 11.2289 5.97889 11.5833 5.54167 11.5833C5.10444 11.5833 4.75 11.2289 4.75 10.7917C4.75 10.3544 5.10444 10 5.54167 10C5.97889 10 6.33333 10.3544 6.33333 10.7917Z" fill="#97A1AD" />
                                            </g>
                                        </svg>}
                                    {/* <h4 className={pathname==="/planner"? "active_icon":"icon"}><i className="fa-solid fa-calendar-days"></i></h4> */}
                                    Planner</NavLink>
                            </div>
                        </li>
                        <li>
                            {pathname === "/review" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname === "/review" ? "sidebar_container_items sidebar_item_outer" : 'sidebar_item_outer'}>
                                {/* <img src={comment_img} /> */}
                                {pathname === "/review" ? <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="comments_svgrepo.com" clip-path="url(#clip0_380_4890)">
                                        <g id="Comments">
                                            <g id="Group 4">
                                                <path className='svg_color' id="shape-1" fill-rule="evenodd" clip-rule="evenodd" d="M7.58325 4.33301H11.4166C14.5922 4.33301 17.1666 6.90737 17.1666 10.083V13.9163C17.1666 17.092 14.5922 19.6663 11.4166 19.6663H1.83325V10.083C1.83325 6.90737 4.40761 4.33301 7.58325 4.33301Z" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path className='svg_color' id="shape-2" d="M6.625 13.916H9.5" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path className='svg_color' id="shape-3" d="M6.625 10.083H12.375" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                            </g>
                                        </g>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_380_4890">
                                            <rect width="23" height="23" fill="white" transform="translate(0 0.5)" />
                                        </clipPath>
                                    </defs>
                                </svg> : <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="comments_svgrepo.com" clip-path="url(#clip0_380_4890)">
                                        <g id="Comments">
                                            <g id="Group 4">
                                                <path id="shape-1" fill-rule="evenodd" clip-rule="evenodd" d="M7.58325 4.33301H11.4166C14.5922 4.33301 17.1666 6.90737 17.1666 10.083V13.9163C17.1666 17.092 14.5922 19.6663 11.4166 19.6663H1.83325V10.083C1.83325 6.90737 4.40761 4.33301 7.58325 4.33301Z" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path id="shape-2" d="M6.625 13.916H9.5" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                                <path id="shape-3" d="M6.625 10.083H12.375" stroke="#97A1AD" stroke-width="2" stroke-linecap="round" />
                                            </g>
                                        </g>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_380_4890">
                                            <rect width="23" height="23" fill="white" transform="translate(0 0.5)" />
                                        </clipPath>
                                    </defs>
                                </svg>}
                                <NavLink activeClassName="active" to="/review">
                                    {/* <h4 className={pathname === "/review" ? "active_icon" : "icon"}><i className="fa-regular fa-comment"></i></h4> */}
                                    Comments/Reviews</NavLink>

                            </div>
                        </li>
                        <li>
                            {pathname === "/gallery" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname === "/gallery" ? "sidebar_container_items sidebar_item_outer" : 'sidebar_item_outer'}>
                                {/* <img src={gallary_icon} /> */}
                                {pathname === "/gallery" ? <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='svg_color' d="M17.4166 11.138C17.4166 14.1236 17.4166 15.6164 16.4891 16.5438C15.5616 17.4714 14.0688 17.4714 11.0833 17.4714H7.91658C4.93102 17.4714 3.43825 17.4714 2.51074 16.5438C1.58325 15.6164 1.58325 14.1236 1.58325 11.138C1.58325 8.15246 1.58325 6.65968 2.51074 5.73218C3.43825 4.80469 4.93102 4.80469 7.91658 4.80469H11.0833C14.0688 4.80469 15.5616 4.80469 16.4891 5.73218C17.0145 6.25756 17.2423 6.96431 17.341 8.02102" stroke="#97A1AD" stroke-width="1.7" stroke-linecap="round" />
                                    <path className='svg_color' d="M3.15698 5.25C3.24599 4.51294 3.43181 4.00359 3.81976 3.617C4.56436 2.875 5.76278 2.875 8.15961 2.875H10.7018C13.0987 2.875 14.2971 2.875 15.0416 3.617C15.4296 4.00359 15.6154 4.51294 15.7044 5.25" stroke="#97A1AD" stroke-width="1.7" />
                                    <path className='svg_color' d="M13.8542 9.55469C14.5101 9.55469 15.0417 9.02303 15.0417 8.36719C15.0417 7.71135 14.5101 7.17969 13.8542 7.17969C13.1984 7.17969 12.6667 7.71135 12.6667 8.36719C12.6667 9.02303 13.1984 9.55469 13.8542 9.55469Z" stroke="#97A1AD" stroke-width="1.7" />
                                    <path className='svg_color' d="M1.58325 11.5339L2.96993 10.3206C3.69135 9.68941 4.77864 9.72559 5.45647 10.4034L8.85249 13.7994C9.39653 14.3435 10.253 14.4177 10.8825 13.9753L11.1186 13.8094C12.0244 13.1727 13.25 13.2465 14.073 13.9872L16.6249 16.2839" stroke="#97A1AD" stroke-width="1.7" stroke-linecap="round" />
                                </svg>
                                    : <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.4166 11.138C17.4166 14.1236 17.4166 15.6164 16.4891 16.5438C15.5616 17.4714 14.0688 17.4714 11.0833 17.4714H7.91658C4.93102 17.4714 3.43825 17.4714 2.51074 16.5438C1.58325 15.6164 1.58325 14.1236 1.58325 11.138C1.58325 8.15246 1.58325 6.65968 2.51074 5.73218C3.43825 4.80469 4.93102 4.80469 7.91658 4.80469H11.0833C14.0688 4.80469 15.5616 4.80469 16.4891 5.73218C17.0145 6.25756 17.2423 6.96431 17.341 8.02102" stroke="#97A1AD" stroke-width="1.7" stroke-linecap="round" />
                                        <path d="M3.15698 5.25C3.24599 4.51294 3.43181 4.00359 3.81976 3.617C4.56436 2.875 5.76278 2.875 8.15961 2.875H10.7018C13.0987 2.875 14.2971 2.875 15.0416 3.617C15.4296 4.00359 15.6154 4.51294 15.7044 5.25" stroke="#97A1AD" stroke-width="1.7" />
                                        <path d="M13.8542 9.55469C14.5101 9.55469 15.0417 9.02303 15.0417 8.36719C15.0417 7.71135 14.5101 7.17969 13.8542 7.17969C13.1984 7.17969 12.6667 7.71135 12.6667 8.36719C12.6667 9.02303 13.1984 9.55469 13.8542 9.55469Z" stroke="#97A1AD" stroke-width="1.7" />
                                        <path d="M1.58325 11.5339L2.96993 10.3206C3.69135 9.68941 4.77864 9.72559 5.45647 10.4034L8.85249 13.7994C9.39653 14.3435 10.253 14.4177 10.8825 13.9753L11.1186 13.8094C12.0244 13.1727 13.25 13.2465 14.073 13.9872L16.6249 16.2839" stroke="#97A1AD" stroke-width="1.7" stroke-linecap="round" />
                                    </svg>
                                }
                                <NavLink activeClassName="active" to="/gallery">
                                    {/* <h4 className={pathname === "/gallery" ? "active_icon" : "icon"}><i className="fa-regular fa-image"></i></h4> */}
                                    Gallery</NavLink>

                            </div>
                        </li>
                        <li>
                            {pathname === "/insights" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname === "/insights" ? "sidebar_container_items sidebar_item_outer" : 'sidebar_item_outer'}>
                                <img src={info_icon} />
                                <NavLink activeClassName="active" to="/">
                                    {/* <h4 className={pathname === "/insights" ? "active_icon" : "icon"}><i className="fa-solid fa-circle-info"></i></h4> */}
                                    Insights</NavLink>

                            </div>
                        </li>
                        <li>
                            {pathname === "/faq" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname === "/faq" ? "sidebar_container_items sidebar_item_outer" : 'sidebar_item_outer'}>
                                {/* <img src={faq_icon} /> */}
                                {pathname === "faq" ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="faq_svgrepo.com" clip-path="url(#clip0_309_4607)">
                                        <path id="Vector" d="M9.99992 0.833008C8.18693 0.833008 6.41465 1.37062 4.9072 2.37787C3.39975 3.38512 2.22483 4.81675 1.53103 6.49174C0.837224 8.16673 0.655693 10.0098 1.00939 11.788C1.36309 13.5662 2.23613 15.1995 3.51811 16.4815C4.80009 17.7635 6.43344 18.6365 8.2116 18.9902C9.98975 19.3439 11.8329 19.1624 13.5079 18.4686C15.1828 17.7748 16.6145 16.5999 17.6217 15.0924C18.629 13.585 19.1666 11.8127 19.1666 9.99967C19.1637 7.5694 18.197 5.23949 16.4786 3.52103C14.7601 1.80257 12.4302 0.835875 9.99992 0.833008ZM9.99992 17.4997C8.51656 17.4997 7.06652 17.0598 5.83315 16.2357C4.59978 15.4116 3.63848 14.2402 3.07083 12.8698C2.50317 11.4994 2.35464 9.99135 2.64403 8.5365C2.93342 7.08164 3.64773 5.74527 4.69662 4.69637C5.74552 3.64748 7.08189 2.93317 8.53675 2.64378C9.9916 2.3544 11.4996 2.50292 12.87 3.07058C14.2405 3.63824 15.4118 4.59953 16.2359 5.8329C17.0601 7.06627 17.4999 8.51631 17.4999 9.99967C17.4975 11.9881 16.7065 13.8943 15.3005 15.3003C13.8945 16.7063 11.9883 17.4972 9.99992 17.4997ZM10.8333 13.7497V15.4163H9.16659V13.7497H10.8333ZM13.3333 7.91634C13.3342 8.41612 13.2222 8.90965 13.0058 9.36012C12.7893 9.8106 12.474 10.2064 12.0833 10.518C11.4521 11.0071 11.0253 11.7134 10.8858 12.4997H9.19242C9.26611 11.8572 9.46769 11.236 9.78528 10.6727C10.1029 10.1093 10.53 9.61529 11.0416 9.21967C11.2469 9.05537 11.4104 8.84482 11.5187 8.60524C11.6271 8.36566 11.6772 8.10384 11.665 7.84117C11.6528 7.57851 11.5787 7.32246 11.4486 7.09394C11.3185 6.86542 11.1362 6.67092 10.9166 6.52634C10.6718 6.36634 10.3902 6.27163 10.0984 6.25121C9.80671 6.23079 9.51461 6.28534 9.24992 6.40967C8.96759 6.545 8.73065 6.75944 8.56791 7.02692C8.40517 7.2944 8.32365 7.60339 8.33326 7.91634C8.33326 8.13735 8.24546 8.34932 8.08918 8.5056C7.9329 8.66188 7.72094 8.74967 7.49992 8.74967C7.27891 8.74967 7.06695 8.66188 6.91067 8.5056C6.75439 8.34932 6.66659 8.13735 6.66659 7.91634C6.65419 7.27587 6.83091 6.64596 7.17463 6.1054C7.51836 5.56484 8.01383 5.13762 8.59909 4.87717C9.11788 4.64532 9.68671 4.54784 10.2531 4.59371C10.8195 4.63959 11.3652 4.82735 11.8399 5.13967C12.2986 5.44334 12.6751 5.85581 12.9356 6.34029C13.1962 6.82478 13.3328 7.36623 13.3333 7.91634Z" fill="#97A1AD" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_309_4607">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg> : <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="faq_svgrepo.com" clip-path="url(#clip0_309_4607)">
                                        <path id="Vector" d="M9.99992 0.833008C8.18693 0.833008 6.41465 1.37062 4.9072 2.37787C3.39975 3.38512 2.22483 4.81675 1.53103 6.49174C0.837224 8.16673 0.655693 10.0098 1.00939 11.788C1.36309 13.5662 2.23613 15.1995 3.51811 16.4815C4.80009 17.7635 6.43344 18.6365 8.2116 18.9902C9.98975 19.3439 11.8329 19.1624 13.5079 18.4686C15.1828 17.7748 16.6145 16.5999 17.6217 15.0924C18.629 13.585 19.1666 11.8127 19.1666 9.99967C19.1637 7.5694 18.197 5.23949 16.4786 3.52103C14.7601 1.80257 12.4302 0.835875 9.99992 0.833008ZM9.99992 17.4997C8.51656 17.4997 7.06652 17.0598 5.83315 16.2357C4.59978 15.4116 3.63848 14.2402 3.07083 12.8698C2.50317 11.4994 2.35464 9.99135 2.64403 8.5365C2.93342 7.08164 3.64773 5.74527 4.69662 4.69637C5.74552 3.64748 7.08189 2.93317 8.53675 2.64378C9.9916 2.3544 11.4996 2.50292 12.87 3.07058C14.2405 3.63824 15.4118 4.59953 16.2359 5.8329C17.0601 7.06627 17.4999 8.51631 17.4999 9.99967C17.4975 11.9881 16.7065 13.8943 15.3005 15.3003C13.8945 16.7063 11.9883 17.4972 9.99992 17.4997ZM10.8333 13.7497V15.4163H9.16659V13.7497H10.8333ZM13.3333 7.91634C13.3342 8.41612 13.2222 8.90965 13.0058 9.36012C12.7893 9.8106 12.474 10.2064 12.0833 10.518C11.4521 11.0071 11.0253 11.7134 10.8858 12.4997H9.19242C9.26611 11.8572 9.46769 11.236 9.78528 10.6727C10.1029 10.1093 10.53 9.61529 11.0416 9.21967C11.2469 9.05537 11.4104 8.84482 11.5187 8.60524C11.6271 8.36566 11.6772 8.10384 11.665 7.84117C11.6528 7.57851 11.5787 7.32246 11.4486 7.09394C11.3185 6.86542 11.1362 6.67092 10.9166 6.52634C10.6718 6.36634 10.3902 6.27163 10.0984 6.25121C9.80671 6.23079 9.51461 6.28534 9.24992 6.40967C8.96759 6.545 8.73065 6.75944 8.56791 7.02692C8.40517 7.2944 8.32365 7.60339 8.33326 7.91634C8.33326 8.13735 8.24546 8.34932 8.08918 8.5056C7.9329 8.66188 7.72094 8.74967 7.49992 8.74967C7.27891 8.74967 7.06695 8.66188 6.91067 8.5056C6.75439 8.34932 6.66659 8.13735 6.66659 7.91634C6.65419 7.27587 6.83091 6.64596 7.17463 6.1054C7.51836 5.56484 8.01383 5.13762 8.59909 4.87717C9.11788 4.64532 9.68671 4.54784 10.2531 4.59371C10.8195 4.63959 11.3652 4.82735 11.8399 5.13967C12.2986 5.44334 12.6751 5.85581 12.9356 6.34029C13.1962 6.82478 13.3328 7.36623 13.3333 7.91634Z" fill="#97A1AD" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_309_4607">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>}
                                <NavLink activeClassName="active" to="/">
                                    {/* <h4 className={pathname === "/faq" ? "active_icon" : "icon"}><i className="fa-regular fa-circle-question"></i></h4> */}
                                    FAQ’s</NavLink>

                            </div>
                        </li>
                        <li>
                            {pathname === "/privacy" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname === "/privacy" ? "sidebar_container_items sidebar_item_outer" : 'sidebar_item_outer'}>
                                {/* <img src={privacy_icon} /> */}
                                <NavLink activeClassName="active" to="/">
                                    <h4 className={pathname === "/privacy" ? "active_icon" : "icon"}><i className="fa-solid fa-house"></i></h4>
                                    Privacy Policy</NavLink>

                            </div>
                        </li>
                        <li>
                            {pathname === "/contact" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname === "/contact" ? "sidebar_container_items sidebar_item_outer" : 'sidebar_item_outer'}>
                                {/* <img src={call_icon} /> */}
                                <NavLink activeClassName="active" to="/">
                                    <h4 className={pathname === "/contact" ? "active_icon" : "icon"}><i className="fa-solid fa-phone"></i></h4>
                                    Contact Us</NavLink>

                            </div>
                        </li>
                    </ul>
                </div>
            </section>

        </>
    );
};

export default SideBar;