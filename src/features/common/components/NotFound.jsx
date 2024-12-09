import React from 'react'
import "./NotFound.css"
import notfound from "../../../images/404Err.svg"
import { useAppContext } from './AppProvider'

const NotFound = () => {
const {sidebar}=useAppContext()
    return (
        <div className={`not_found_wrapper ${sidebar ? "":"notFound_container"}`}>
            <div className='not_found_outer'>
                <img src={notfound}/>
                <h3 className='cmn_heading_class pt-4'>We can’t find the page you are looking for.</h3>
            </div>
        </div>
    )
}

export default NotFound