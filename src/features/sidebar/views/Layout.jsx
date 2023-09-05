import React, { useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom"
import profile_img from '../../../images/profile_img.png'
import addy_logo from '../../../images/addylogo.png'
import './Layout.css'
import { sidebarMenuItems } from '../sidebarMenu'
const Layout = () => {
    const [sidebar, setSidebar] = useState(true)
    const show_sidebar = () => {
        setSidebar(!sidebar)
    }
    const navigate = useNavigate();
    const location = useLocation();
    const {pathname} = location;
    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");

    console.log(splitLocation);

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
                    

                            {
                                sidebarMenuItems?.map((item) => (
                                    <li className={item.path == '/' + splitLocation[1] ? "sidebar_container_items sidebar_item_outer bar text-center" : 'sidebar_item_outer'} onClick={() => {
                                        navigate(item.path)
                                    }}>
                                       


                                            <div key={item.name} className={item.path == '/' + splitLocation[1] ?'sidebar_inner_content':"sidebar_item_outers"}>
                                                {item.icon}
                                                <h6 className=''>{item.name}</h6>
                                            </div>

                                     
                                    </li>

                                ))
                            }
                    </ul>
                </div>



            </section>
        </>
    )
}

export default Layout;