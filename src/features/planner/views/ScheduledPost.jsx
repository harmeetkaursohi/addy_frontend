import React from 'react'
import './schedule.css'
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";

const ScheduledPost = () => {
  return (
    <div className='scduler_outer'>
        <div className='schedule_header d-flex align-items-center justify-content-center'>
            <GoChevronLeft size={24}/><span>03 March, Friday</span><GoChevronRight size={24}/>
        </div>
    </div>
  )
}

export default ScheduledPost