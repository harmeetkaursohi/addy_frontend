import { BsTelephone } from "react-icons/bs";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { BiErrorCircle } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import { TbSmartHome } from "react-icons/tb";

export const sidebarMenuItems = [
    {
        "name": "Home",
        "path": "/dashboard",
        "icon": <TbSmartHome />,
        
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
        "name": "Gallery",
        "path": "/gallery",
        "icon": <BiErrorCircle />
    },
    {
        "name": "Insights",
        "path": "/insights",
        "icon":<MdOutlinePrivacyTip />
    },
    {
        "name": "FAQ's",
        "path": "/faq",
        "icon": <BiErrorCircle />
    },
    {
        "name": "Privacy Policy",
        "path": "/privacy",
        "icon": <MdOutlinePrivacyTip />
    },
    {
        "name": "Contact Us",
        "path": "/contact",
        "icon": <BsTelephone />
    }
];