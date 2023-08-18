import men_img from "../../../images/men.png"
import google_img from '../../../images/Google_img.svg'
import { Link } from "react-router-dom"
const SignUp=()=>{
    return(
        <>
         <section className='Container'>
            <div className="login_wrapper">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 ">
                        <div className='addy_container bg_color'>
                      <div className='login_outer'>
                       
                        <div className='reach_user_outer'>
                        <img src={men_img}  className='girl_img_width'/>
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
                                <h2 className='cmn_fontFamily'>Create New Account</h2>
                                <p className="pt-2">Lorem Ipsum is simply dummy text of the printing and type setting industry.</p>
                            </div>
                             <div className='login_form'>
                                <form>
                                    <div className='form-group'>
                                        <label> User Name</label>
                                        <input className="form-control mt-1"type='text' placeholder='Username'/>
                                    </div>
                                    <div className='form-group'>
                                        <label>Email</label>
                                        <input className="form-control mt-1"type='email' placeholder='Email'/>
                                    </div>
                                    <div className='rememberPass_outer mt-2'>
                                    <div className='form-group'>
                                        <label>Industry</label>
                                        <input className="form-control mt-1"type='text' placeholder='Industry'/>
                                    </div>
                                    <div className='form-group'>
                                        <label>Country</label>
                                        <input className="form-control mt-1"type='text' placeholder='Country'/>
                                    </div>
                                    <div className='form-group'>
                                        <label>Password</label>
                                        <input className="form-control mt-1"type='password' placeholder='Password'/>
                                    </div>
                                    <div className='form-group'>
                                        <label>Confirm Password</label>
                                        <input className="form-control mt-1"type='password' placeholder='Confirm Password'/>
                                    </div>
                                     <button className=' login_btn'>Sign Up</button>
                                    </div>
                                </form>
                                <h3 className='cmn_heading'>Already have an account?  <Link to="/login"><span className='sign_up'>Login</span></Link></h3>
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
export default SignUp