import React from 'react'
import "./NotFound.css"
import notfound from "../../../images/notfound.png"

const NotFound = () => {
    return (
        <div className='not_found_wrapper'>
            <div className='not_found_outer'>
                <img src={notfound}/>
            </div>
        </div>
    )
}

export default NotFound