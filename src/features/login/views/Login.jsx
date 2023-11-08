import addyads_img from '../../../images/addylogo.png'
import girl_img from '../../../images/girl.png'
import google_img from '../../../images/Google_img.svg'
import {Link} from "react-router-dom"
import jsondata from '../../../locales/data/initialdata.json'
import './Login.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import counter from "../../../app/slices/authSlice"
const Login=()=>{
const[name,setName]=useState("")
const[validName,setValidName]=useState(false)
const[validPassword,setValidPassword]=useState(false)
const[password,setPassword]=useState("")
const[check,setCheck]=useState("")

const loginForm=(e)=>{
e.preventDefault() 
if(name===""){
    setValidName(true)
}else{
    if(password===""){
        setValidPassword(true)
    }else{
        setName("")
        setPassword("")
        setValidPassword(false)
        setValidName(false)
    }
}
}
console.log(validName,"ch")

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
                                <h2 className='cmn_fontFamily'>{jsondata.welcomeBack}</h2>
                                <p>Lorem Ipsum is simply dummy text of the printing and type setting industry.</p>
                            </div>
                             <div className='login_form'>
                                <form onSubmit={loginForm}>
                                    <div className='form-group'>
                                        <label>{jsondata.email} or {jsondata.username}</label>
                                        <input className="form-control mt-1"type='email' placeholder='Email' value={name} onChange={(e)=>setName(e.target.value)} onFocus={()=>{setValidName(false)}}/>
                                        {validName?<p style={{color:"red"}}>Please enter your email</p>:""}
                                    </div>
                                    <div className='form-group'>
                                        <label>{jsondata.password}</label>
                                        <input className="form-control mt-1"type='password' placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} onFocus={()=>{setValidPassword(false)}}/>
                                        {validPassword?<p style={{color:"red"}}>Please enter password</p>:""}

                                    </div>
                                    <div className='rememberPass_outer mt-2'>
                                     <div className='check_box_outer'>
                                        <div>
                                        <input type='checkbox' onChange={(e)=>{setCheck(e.target.checked)}}/>
                                        <label className='ms-2'>{jsondata.rememberPassword}</label>
                                        </div>
                                     <label className='forgetPass_heading'>{jsondata.forgotpassword}?</label>
                                     </div>
                                     <button className=' login_btn'>{jsondata.login}</button>
                                     <h2 className='cmn_heading'>OR</h2>
                                     <button className='login_btn login_google_btn' >
                                        <div className="google_img_outer"> 
                                            <img src={google_img}/>
                                            <h2 className="ps-2">Login with Google </h2></div>
                                     </button>
                                    </div>
                                </form>
                                <h3 className='cmn_heading'>{jsondata.account}<Link to="/"><span className='sign_up'>{jsondata.signup}</span></Link></h3>
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