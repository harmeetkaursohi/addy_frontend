import { BsTelephone } from "react-icons/bs";
import { BsHouseLock } from "react-icons/bs";
import { BsExclamationSquare } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import { TbSmartHome } from "react-icons/tb";
import { AiOutlinePicture } from "react-icons/ai";
import { AiOutlineQuestionCircle } from "react-icons/ai";


export const SidebarMenuItems = [
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
        "icon": <AiOutlinePicture />
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
    
      
   
    
];

