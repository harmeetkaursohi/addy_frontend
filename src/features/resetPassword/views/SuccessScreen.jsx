import React from 'react'
import SuccessScreenImage from "../../../images/successScreen.svg?react"
import { useLocation } from 'react-router-dom';
const SuccessScreen = () => {
    const location = useLocation();
      const message = location.state?.message;
  return (
    <section className='successScreen min-vh-100 d-flex align-items-center justify-content-center'>
        <div className='successScreen_inner'>
               <SuccessScreenImage/>
                <h4>Your password has been successfully {message ? "updated" : "created"}.</h4>
                <p>Continue to log in to your account.</p>
                <button>Continue</button>
        </div>
    </section>
  )
}

export default SuccessScreen