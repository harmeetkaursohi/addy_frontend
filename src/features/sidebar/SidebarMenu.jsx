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
import {IoMdNotificationsOutline} from "react-icons/io";





export const SidebarMenuItems = [
    {
        "name": "Dashboard",
        "path": "/dashboard",
        "icon":<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 3.5H3.5V10.5H10.5V3.5Z" stroke="#7E7C7F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21.5 3.5H14.5V10.5H21.5V3.5Z" stroke="#7E7C7F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21.5 14.5H14.5V21.5H21.5V14.5Z" stroke="#7E7C7F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.5 14.5H3.5V21.5H10.5V14.5Z" stroke="#7E7C7F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>


    },
    {
        "name": "Planner",
        "path": "/planner",
        "icon": <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2.5V6.5M16 2.5V6.5M3 10.5H21M8 14.5H8.01M12 14.5H12.01M16 14.5H16.01M8 18.5H8.01M12 18.5H12.01M16 18.5H16.01M5 4.5H19C20.1046 4.5 21 5.39543 21 6.5V20.5C21 21.6046 20.1046 22.5 19 22.5H5C3.89543 22.5 3 21.6046 3 20.5V6.5C3 5.39543 3.89543 4.5 5 4.5Z" stroke="#767177" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    },
    {
        "name": "Comment/Reviews",
        "path": "/review",
        "icon": <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15.5C21 16.0304 20.7893 16.5391 20.4142 16.9142C20.0391 17.2893 19.5304 17.5 19 17.5H7L3 21.5V5.5C3 4.96957 3.21071 4.46086 3.58579 4.08579C3.96086 3.71071 4.46957 3.5 5 3.5H19C19.5304 3.5 20.0391 3.71071 20.4142 4.08579C20.7893 4.46086 21 4.96957 21 5.5V15.5Z" stroke="#2A2D37" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    },
    {
        "name": "Insights",
        "path": "/insights",
        "icon":<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8.5V12.5M12 16.5H12.01M7.86 2.5H16.14L22 8.36V16.64L16.14 22.5H7.86L2 16.64V8.36L7.86 2.5Z" stroke="#767177" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    },
    {
        "name": "Drafts",
        "path": "/draft",
        "icon": <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.4 2.5H6C5.46957 2.5 4.96086 2.71071 4.58579 3.08579C4.21071 3.46086 4 3.96957 4 4.5V20.5C4 21.0304 4.21071 21.5391 4.58579 21.9142C4.96086 22.2893 5.46957 22.5 6 22.5H18C18.5304 22.5 19.0391 22.2893 19.4142 21.9142C19.7893 21.5391 20 21.0304 20 20.5V13.1M2 6.5H6M2 10.5H6M2 14.5H6M2 18.5H6M18.4 3.09999C18.8168 2.83093 19.3133 2.71284 19.8066 2.76538C20.3 2.81793 20.7604 3.03794 21.1112 3.38876C21.4621 3.73957 21.6821 4.20001 21.7346 4.69336C21.7872 5.1867 21.6691 5.68315 21.4 6.09999L16 11.5L12 12.5L13 8.49999L18.4 3.09999Z" stroke="#767177" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    },
    {
        "name": "Profile",
        "path": "/profile",
        "icon": <CgProfile />
    },
    {
        "name": "Notifications",
        "path": "/notification",
        "icon": <IoMdNotificationsOutline />
    },
    {
        "name": "Contact Us",
        "path": "/contact",
        "icon": <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.9999 16.4201V19.4201C21.0011 19.6986 20.944 19.9743 20.8324 20.2294C20.7209 20.4846 20.5572 20.7137 20.352 20.902C20.1468 21.0902 19.9045 21.2336 19.6407 21.3228C19.3769 21.412 19.0973 21.4452 18.8199 21.4201C15.7428 21.0857 12.7869 20.0342 10.1899 18.3501C7.77376 16.8148 5.72527 14.7663 4.18993 12.3501C2.49991 9.7413 1.44818 6.77109 1.11993 3.6801C1.09494 3.40356 1.12781 3.12486 1.21643 2.86172C1.30506 2.59859 1.4475 2.35679 1.6347 2.15172C1.82189 1.94665 2.04974 1.78281 2.30372 1.67062C2.55771 1.55843 2.83227 1.50036 3.10993 1.5001H6.10993C6.59524 1.49532 7.06572 1.66718 7.43369 1.98363C7.80166 2.30008 8.04201 2.73954 8.10993 3.2201C8.23656 4.18016 8.47138 5.12282 8.80993 6.0301C8.94448 6.38802 8.9736 6.77701 8.89384 7.15098C8.81408 7.52494 8.6288 7.86821 8.35993 8.1401L7.08993 9.4101C8.51349 11.9136 10.5864 13.9865 13.0899 15.4101L14.3599 14.1401C14.6318 13.8712 14.9751 13.6859 15.3491 13.6062C15.723 13.5264 16.112 13.5556 16.4699 13.6901C17.3772 14.0286 18.3199 14.2635 19.2799 14.3901C19.7657 14.4586 20.2093 14.7033 20.5265 15.0776C20.8436 15.4519 21.0121 15.9297 20.9999 16.4201Z" stroke="#767177" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    },

    {
        "name": "Privacy Policy",
        "path": "/privacy",
        "icon":  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12.5L11 14.5L15 10.5M20 13.5C20 18.5 16.5 21 12.34 22.45C12.1222 22.5238 11.8855 22.5202 11.67 22.44C7.5 21 4 18.5 4 13.5V6.49996C4 6.23474 4.10536 5.98039 4.29289 5.79285C4.48043 5.60532 4.73478 5.49996 5 5.49996C7 5.49996 9.5 4.29996 11.24 2.77996C11.4519 2.59896 11.7214 2.49951 12 2.49951C12.2786 2.49951 12.5481 2.59896 12.76 2.77996C14.51 4.30996 17 5.49996 19 5.49996C19.2652 5.49996 19.5196 5.60532 19.7071 5.79285C19.8946 5.98039 20 6.23474 20 6.49996V13.5Z" stroke="#767177" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    },
    {
        "name": "FAQ's",
        "path": "/faq",
        "icon": <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8.50448C8.2351 7.83614 8.69915 7.27258 9.30995 6.91361C9.92076 6.55463 10.6389 6.42341 11.3372 6.54319C12.0355 6.66296 12.6688 7.026 13.1251 7.568C13.5813 8.11001 13.8311 8.796 13.83 9.50448C13.83 11.5045 10.83 12.5045 10.83 12.5045M10.9099 16.5044H10.9199" stroke="#767177" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11 21.5C16.5228 21.5 21 17.0228 21 11.5C21 5.97715 16.5228 1.5 11 1.5C5.47715 1.5 1 5.97715 1 11.5C1 17.0228 5.47715 21.5 11 21.5Z" stroke="#767177" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    },
];

