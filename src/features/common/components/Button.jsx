import React from 'react'
import Loader from '../../loader/Loader'
const Button = ({ text, loading }) => {

    return (
        <>
            <button className='login_btn d-flex align-items-center justify-content-center' disabled={loading}>{loading ?
                <><Loader /> <span className="ms-2">{text}</span></>  : text}
            </button>

        </>

    )
}

export default Button


