import addyads_img from '../../../images/addylogo.png'
import girl_img from '../../../images/girl.png'
import google_img from '../../../images/Google_img.svg'

import './Login.css'
const Login=()=>{
    return(
        <>
         <section className='Container'>
            <div className="login_wrapper">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 ">
                        <div className='addy_container bg_color'>
                      <div className='login_outer'>
                       
                        <div className='reach_user_outer'>
                        <img src={girl_img}  className='girl_img_width'/>
                            <h2 className='mt-5'>Reach your users with new tools. Reach your users with new tools. Reach your users with new tools.</h2>
                            <p>Efficiently unleash cross-media information without cross-media value. Quickly maximize.Efficiently unleash cross-media information without cross-media value. Quickly maximize.Efficiently unleash cross-media.</p>
                        </div>
                      </div>

                        </div>

                        
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className='addy_container'>
                        <div className="addy_outer">
                            <div className="addy_img">
                                <div className='logo_outer'><img src={addyads_img} height="90px" width="238px"/>
                                </div>
                                <h2 className='cmn_fontFamily'>Welcome Back</h2>
                                <p>Lorem Ipsum is simply dummy text of the printing and type setting industry.</p>
                            </div>
                             <div className='login_form'>
                                <form>
                                    <div className='form-group'>
                                        <label>E-mail or Username</label>
                                        <input className="form-control mt-1"type='email' placeholder='Email'/>
                                    </div>
                                    <div className='form-group'>
                                        <label>Password</label>
                                        <input className="form-control mt-1"type='password' placeholder='Password'/>
                                    </div>
                                    <div className='rememberPass_outer mt-2'>
                                     <div className='check_box_outer'>
                                        <div>
                                        <input type='checkbox'/>
                                        <label className='ms-2'>Remember Password</label>
                                        </div>
                                     <label className='forgetPass_heading'>Forgot Password?</label>
                                     </div>
                                     <button className=' login_btn'>Login</button>
                                     <h2 className='cmn_heading'>OR</h2>
                                     <button className='login_btn login_google_btn'>
                                        <div className="google_img_outer"> 
                                            <img src={google_img}/>
                                            <h2 className="ps-2">Login with Google </h2></div>
                                     </button>
                                    </div>
                                </form>
                                <h3 className='cmn_heading'>Don’t have an account? <span className='sign_up'>Signup</span></h3>
                             </div>
                        </div>

                        </div>
                    </div>
                </div>
            </div>
         </section>
        </>
    )
}
export default Login