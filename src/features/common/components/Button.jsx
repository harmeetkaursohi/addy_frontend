import React from 'react'
import Loader from '../../loader/Loader'

const Button = ({text, loading, type = "", handleOnClickFunction = null}) => {

    return (
        <>
            {
                (type && type === "Submit") ?

                    <button className='login_btn d-flex align-items-center justify-content-center'
                            disabled={loading}>{loading ?
                        <><Loader/> <span className="ms-2">{text}</span></> : text}
                    </button>

                    :

                    <button
                        className='login_btn d-flex align-items-center justify-content-center'
                        onClick={handleOnClickFunction}
                    >
                        {text}
                    </button>

            }

        </>

    )
}

export default Button


