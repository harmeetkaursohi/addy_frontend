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
                {/* <CDBSidebar>
        <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>Contrast</CDBSidebarHeader>
        <CDBSidebarContent>
          <CDBSidebarMenu>
            <CDBSidebarMenuItem icon="th-large" >
            
                <div>
               
                    <div className='sidebar_item_outer' style={{borderRadius:"15px",background:" #F4F4F4"}}>
                       
                        <img src={home_icon}/>
                        <h2 style={{color:"#6B1DAB"}}>Home</h2>
                        
                    </div>
                </div>
            </CDBSidebarMenuItem>
            <CDBSidebarMenuItem icon="sticky-note">Components</CDBSidebarMenuItem>
            <CDBSidebarMenuItem icon="credit-card" iconType="solid">
              Metrics
            </CDBSidebarMenuItem>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            className="sidebar-btn-wrapper"
            style={{padding: '20px 5px'}}
          >
            Sidebar Footer
          </div>
        </CDBSidebarFooter>
      </CDBSidebar> */}
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
                            <div className={pathname==="/dashboard"?"sidebar_container_items sidebar_item_outer":'sidebar_item_outer'}>

                                <NavLink activeClassName="active" to="/dashboard">
                                    <img src={home_icon} />
                                    Home</NavLink>
                            </div>
                        </li>
                        <li>
                            {pathname === "/planner" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname==="/planner"?"sidebar_container_items sidebar_item_outer":'sidebar_item_outer'}>

                                <NavLink activeClassName="active" to="/planner">
                                    <img src={calender_icon} />
                                    Planner</NavLink>
                            </div>
                        </li>
                        <li>
                        {pathname === "/review" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname==="/review"?"sidebar_container_items sidebar_item_outer":'sidebar_item_outer'}>
                                <img src={comment_img} />
                                <NavLink activeClassName="active" to="/review">Comments/Reviews</NavLink>

                            </div>
                        </li>
                        <li>
                        {pathname === "/gallery" ? <div className='bar'>
                            </div> : ""}
                            <div className={pathname==="/gallery"?"sidebar_container_items sidebar_item_outer":'sidebar_item_outer'}>
                                <img src={gallary_icon} />
                                <NavLink activeClassName="active" to="/gallery">Gallery</NavLink>

                            </div>
                        </li>
                        <li>
                            <div className='sidebar_item_outer'>
                                <img src={info_icon} />
                                <NavLink activeClassName="active" to="/">Insights</NavLink>

                            </div>
                        </li>
                        <li>
                            <div className='sidebar_item_outer'>
                                <img src={faq_icon} />
                                <NavLink activeClassName="active" to="/">FAQ’s</NavLink>

                            </div>
                        </li>
                        <li>
                            <div className='sidebar_item_outer'>
                                <img src={privacy_icon} />
                                <NavLink activeClassName="active" to="/">Privacy Policy</NavLink>

                            </div>
                        </li>
                        <li>
                            <div className='sidebar_item_outer'>
                                <img src={call_icon} />
                                <NavLink activeClassName="active" to="/">Contact Us</NavLink>

                            </div>
                        </li>
                    </ul>
                </div>
            </section>

        </>
    );
};

export default SideBar;