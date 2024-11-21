import atm_img from "../../../images/atm_img.png"
import './BillingForm.css'
import paypal_img from "../../../images/paypal.png"
import vector_img from "../../../images/vector.svg"
import jsondata from "../../../locales/data/initialdata.json"
import { Image } from "react-bootstrap"
const BillingForm = () => {
    return (
        <>
            <section>
                <div className="login_wrapper">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-sm-12 p-0 ">
                            <div className='addy_container bg_color'>
                                <div className='login_outer'>
                                    <div className='reach_user_outer'>
                                        <Image src={atm_img} className='w-100'/>
                                        <h2 className='mt-5'>Reach your users with new tools.</h2>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12 p-0">
                            <div className='addy_container form_mainwrapper'>
                                <div className="addy_outer">
                                <div className="form_wrapper">
                                    <div className="addy_img">
                                        <h2
                                            style={{fontSize: "32px"}}>{jsondata.billingAddress}</h2>
                                        <p className="pt-2">Lorem Ipsum is simply dummy text of the printing and type
                                            setting industry.</p>
                                    </div>
                                    <div className='login_form'>
                                        <form>
                                            <div className='form-group'>
                                                <label style={{fontSize: "18px"}}>{jsondata.paymentMethod}</label>
                                                <div className="payment_outer mt-2">
                                                    <div>
                                                        <Image src={paypal_img} className="paypal_img"/>
                                                        <label htmlFor="" className="ps-3"
                                                               style={{color: "#9DA1A6"}}>{jsondata.paypal}</label>
                                                    </div>
                                                    <input className=" mt-1" type='radio' name="radio"
                                                           placeholder='Username'/>

                                                </div>
                                            </div>
                                            <div className='form-group'>
                                                <div className="payment_outer">
                                                    <div>
                                                        <Image src={vector_img} className="paypal_img"/>
                                                        <label htmlFor="" className="ps-3">{jsondata.credit}</label>
                                                    </div>
                                                    <input className=" mt-1" type='radio' name="radio"
                                                           placeholder='Username'/>

                                                </div>
                                            </div>
                                            <div className=' mt-2'>
                                                <div className='form-group'>
                                                    <label>{jsondata.carduserName}</label>
                                                    <input className="form-control mt-1" type='text'
                                                           placeholder='John Doe'/>
                                                </div>
                                                <div className='form-group'>
                                                    <label>{jsondata.cardnumber}</label>
                                                    <input className="form-control mt-1" type='number'
                                                           placeholder='4567 7867 3421 9832'/>
                                                </div>
                                                <div className='form-group form_group'>
                                                    <div className="w-100">
                                                        <label>{jsondata.expireDate}</label>
                                                        <input className="form-control mt-1" type='date'
                                                               placeholder='12/2/2023'/>
                                                    </div>
                                                    <div className="w-100">
                                                        <label>{jsondata.cvv}</label>
                                                        <input className="form-control mt-1" type='number'
                                                               placeholder='007'/>
                                                    </div>
                                                </div>

                                                <button className=' login_btn'>{jsondata.payNow}</button>
                                            </div>
                                        </form>

                                    </div>
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
export default BillingForm