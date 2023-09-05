import React from 'react'
import Loader from '../../loader/Loader'
const Button = ({ text, loading }) => {

    return (
        <>
            <button className='login_btn' disabled={loading}>{loading ?
                <><Loader /> <span>{text}</span></>  : text}
            </button>

        </>

    )
}

export default Button