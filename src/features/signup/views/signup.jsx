import { useState } from "react"
import men_img from "../../../images/men.png"
import { Link } from "react-router-dom"
import jsondata from "../../../locales/data/initialdata.json"
const SignUp = () => {
    const [formData, setFormData] = useState({ username: "", email: "", industry: "", country: "", password: "", confirmPass: "" })
    const [error, setError] = useState({ username: "", validuser: "", email: "", industry: "", country: "", password: "", confirmPass: "", matchPassword: "" })
   
    const inputHandler = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
        console.log(formData, "Form")
    }

const userData = (e) => {
    e.preventDefault()
    const newErrors = { ...error };
    if (formData.username === "") {
        newErrors.username = "Name field cannot be empty"
    }
    else {
        newErrors.username = ""
        const validUsername = new RegExp(/^[A-Za-z][A-Za-z\d\s]{4,28}$/)
        if (!validUsername.test(formData.username)) {
            newErrors.validuser = "Enter the valid username"
        }
        else {
            newErrors.validuser = ""
            if (formData.email === "") {
                newErrors.email = "Email field cannot be empty"
               

            } else {
                newErrors.email = ""
                if (formData.industry === "") {
                    newErrors.industry = "Industry field cannot be empty"
                   
                }
                else {
                    newErrors.industry=""
                    if (formData.country === "") {
                        newErrors.country = "Country field cannot be empty"
                     

                    } else {
                        newErrors.country=""
                        if (formData.password === "") {
                            newErrors.password = "Password number field cannot be empty"
                            

                        } else {
                            newErrors.password=""
                            if (formData.confirmPass === "") {
                                newErrors.confirmPass = "Confirm Password  field cannot be empty"
                              

                            } else {
                                newErrors.confirmPass=""
                                if (formData.password !== formData.confirmPass) {
                                    newErrors.matchPassword = "Please must match the password"
                                } else {
                                    newErrors.matchPassword=""
                                    formData.username = ""
                                    formData.email = ""
                                    formData.industry = ""
                                    formData.country = ""
                                    formData.password = ""
                                    formData.confirmPass = ""
                                    newErrors.username=""
                                    newErrors.email=""
                                    newErrors.industry=""
                                    newErrors.country=""
                                    newErrors.password=""
                                    newErrors.confirmPass=""
                                    newErrors.matchPassword=""
                                }
                            }
                        }
                    }
                }

            }
        }
    }
   
    setError(newErrors)
    
}

    return (
        <>
            <section className='Container'>
                <div className="login_wrapper">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12 ">
                            <div className='addy_container bg_color'>
                                <div className='login_outer'>

                                    <div className='reach_user_outer'>
                                        <img src={men_img} className='girl_img_width' />
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
                                        <form onSubmit={userData}>
                                            <div className='form-group'>
                                                <label>{jsondata.username}</label>
                                                <input value={formData.username} onChange={inputHandler} name="username" className="form-control mt-1" type='text' placeholder='Username' />
                                                <p>{error ? <p style={{ color: "red" }}>{error.username}</p> : ""}</p> 
                                                 <p>{error ? <p style={{ color: "red" }}>{error.validuser}</p> : ""}</p> 


                                            </div>
                                            <div className='form-group'>
                                                <label>{jsondata.email}</label>
                                                <input value={formData.email} onChange={inputHandler} name="email" className="form-control mt-1" type='email' placeholder='Email' />
                                                 <p>{error ? <p style={{ color: "red" }}>{error.email}</p> : ""}</p> 
                                            </div>
                                            <div className='rememberPass_outer mt-2'>
                                                <div className='form-group'>
                                                    <label>{jsondata.industry}</label>
                                                    <input value={formData.industry} onChange={inputHandler} name="industry" className="form-control mt-1" type='text' placeholder='Industry' />
                                                     <p>{error ? <p style={{ color: "red" }}>{error.industry}</p> : ""}</p>
                                                </div>
                                                <div className='form-group'>
                                                    <label>{jsondata.country}</label>
                                                    <input value={formData.country} onChange={inputHandler} name="country" className="form-control mt-1" type='text' placeholder='Country' />
                                                     <p>{error ? <p style={{ color: "red" }}>{error.country}</p> : ""}</p> 
                                                </div>
                                                <div className='form-group'>
                                                    <label>{jsondata.password}</label>
                                                    <input value={formData.password} onChange={inputHandler} name="password" className="form-control mt-1" type='password' placeholder='Password' />
                                                     <p>{error ? <p style={{ color: "red" }}>{error.password}</p> : ""}</p> 

                                                </div>
                                                <div className='form-group'>
                                                    <label>{jsondata.confirmPass}</label>
                                                    <input value={formData.confirmPass} onChange={inputHandler} name="confirmPass" className="form-control mt-1" type='password' placeholder='Confirm Password' />
                                                    <p>{error ? <p style={{ color: "red" }}>{error.confirmPass}</p> : ""}</p>
                                                     <p>{error ? <p style={{ color: "red" }}>{error.matchPassword}</p> : ""}</p> 
                                                </div>
                                                <button className=' login_btn'>{jsondata.next}</button>
                                            </div>
                                        </form>
                                        <h3 className='cmn_heading'>{jsondata.alreadyAccount}  <Link to="/login"><span className='sign_up'>{jsondata.login}</span></Link></h3>
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