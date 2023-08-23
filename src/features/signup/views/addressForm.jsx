import { useState } from "react"
import men_img from "../../../images/men.png"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { counter } from "../../../app/slices/authSlice"
const AddressForm=()=>{
const [addressData,setAddressData]=useState({country:"",state:"",city:"",houseNo:"",pinCode:"",})
const [error,setError]=useState({country:"",state:"",city:"",houseNo:"",pinCode:"",})
const formInput=(e)=>{
    setAddressData(prev=>({...prev,[e.target.name]:e.target.value}))
}

// validation 
const validateForm=()=>{
    const errors={...error}
    if(addressData.country===""){
    errors.country="Country field cannot be empty"
    }else{
        errors.country=""
        if(addressData.state===""){
        errors.state="state field cannot be empty"
        }else{
            errors.country=""
            if(addressData.city===""){
                errors.city="City field cannot be empty"
            }else{
                errors.city=""
                if(addressData.houseNo===""){
                    errors.houseNo="House No field cannot be empty"
                }else{
                    errors.houseNo=""
                    if(addressData.pinCode===""){
                        errors.pinCode="PinCode field cannot be empty"
                    }else{
                        errors.pinCode=""
                        
                        addressData.country=""
                        addressData.state=""
                        addressData.city=""
                        addressData.houseNo=""
                        addressData.pinCode=""
                        
                    }
                }
            }
        }
    }
    setError(errors)   
}
const addressForm = (e)=>{
e.preventDefault()
validateForm()
}
console.log(addressData,"======sdssff")
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
                                <h2 className='cmn_fontFamily'>Just One Step Away.</h2>
                                <p className="pt-2">Enter Your Address</p>
                            </div>
                             <div className='login_form'>
                                <form onSubmit={addressForm}>
                                    <div className='form-group'>
                                        <label>Country</label>
                                        <input onChange={formInput} name="country" className="form-control mt-1"type='text' placeholder='Country'/>
                                        {error?<p style={{color:"red"}}>{error.country}</p>:""}
                                    </div>
                                    <div className='form-group'>
                                        <label>State</label>
                                        <input onChange={formInput} name="state" className="form-control mt-1"type='text' placeholder='State'/>
                                        {error?<p style={{color:"red"}}>{error.state}</p>:""}

                                    </div>
                                    <div className='rememberPass_outer mt-2'>
                                    <div className='form-group'>
                                        <label>City</label>
                                        <input onChange={formInput} name="city" className="form-control mt-1"type='text' placeholder='City'/>
                                        {error?<p style={{color:"red"}}>{error.city}</p>:""}

                                    </div>
                                    <div className='form-group'>
                                        <label>House No</label>
                                        <input onChange={formInput} name="houseNo" className="form-control mt-1"type='number' placeholder='House/Flate No'/>
                                        {error?<p style={{color:"red"}}>{error.houseNo}</p>:""}

                                    </div>
                                    <div className='form-group'>
                                        <label>Pin Code</label>
                                        <input onChange={formInput} name="pinCode" className="form-control mt-1"type='number' placeholder='Pin Code'/>
                                        {error?<p style={{color:"red"}}>{error.pinCode}</p>:""}

                                    </div>
                                     <button className=' login_btn'>Sign Up</button>
                                    </div>
                                </form>
                                <h3 className='cmn_heading'>Already have an account? <Link to="/login"><span className='sign_up'>Login</span></Link></h3>
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
export default  AddressForm