import React from 'react';
import { BsTelephone } from "react-icons/bs";
import { BsHouseLock } from "react-icons/bs";
import { BsExclamationSquare } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";

import { AiOutlineDashboard } from "react-icons/ai";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import {RiDraftLine} from "react-icons/ri";
import { CgProfile } from "react-icons/cg";





export const SidebarMenuItems = [
    {
        "name": "Dashboard",
        "path": "/dashboard",
        "icon":<AiOutlineDashboard />
        
    },
    {
        "name": "Planner",
        "path": "/planner",
        "icon": <BiCalendar />
    },
    {
        "name": "Comment/Reviews",
        "path": "/review",
        "icon": <FaRegCommentDots />
    },
    {
        "name": "Drafts",
        "path": "/draft",
        "icon": <RiDraftLine />
    },
    {
        "name": "Insights",
        "path": "/insights",
        "icon":<BsExclamationSquare />
    },
    {
        "name": "FAQ's",
        "path": "/faq",
        "icon": <AiOutlineQuestionCircle />
    },
    {
        "name": "Privacy Policy",
        "path": "/privacy",
        "icon": <BsHouseLock />
    },
    {
        "name": "Contact Us",
        "path": "/contact",
        "icon": <BsTelephone />
    },
    {
        "name": "Profile",
        "path": "/profile",
        "icon": <CgProfile />
    },

    
      
   
    
];

