import './selectplan.css'
import addyads_img from '../../../images/addylogo.png'
import previousArrow_img from '../../../images/arrow.svg'
import euro_img from '../../../images/euro.png'
import check_img from '../../../images/check.png'
import arrow_img from '../../../images/Arrow_1.svg'
import white_check_img from '../../../images/white_check.png'

const SelectPlan = () => {
    return (
        <>
            <section className="Container">
                <div className="selectplan_container">
                    <div className='back_outer'>
                    <img src={previousArrow_img}/>
                    <h2 className='back_heading ps-2'>Back</h2>
                    </div>
                    <div className="addy_img">
                        <div className='logo_outer'><img src={addyads_img} height="90px" width="238px" />
                        </div>
                        <div className='selectplan_heading mt-5'>
                        <h2 className='cmn_fontFamily'>Select your Plan</h2>
                        <p className='pt-2'>Lorem Ipsum is simply dummy text of the printing and type setting industry.</p>
                        </div>
                    </div>
                    <div className='row mt-5'>
                        <div className='col-lg-4  col-md-6 col-sm-12' >
                            <div className='personal_plan'>
                                <div className='Personal_wrapper'>
                                    <h3>Personal</h3>
                                    <div className='euro_img_outer'>
                                    <img src={euro_img} className='euro_img'/>
                                    <h5> <span >12,99</span> / user</h5>
                                    </div>
                                </div>
                                <ul className='plan_list_items'>
                                    <li>
                                        <div className='list_items'>
                                            <img src={check_img}/>
                                            <h2>Create personal dashboard.</h2>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='list_items'>
                                            <img src={check_img}/>
                                            <h2>Organize your notes and<span>workflows.</span></h2>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='list_items'>
                                            <img src={check_img}/>
                                            <h2>5GB of <span>space.</span></h2>
                                        </div>
                                    </li>
                                </ul>
                                <div className='plan_button_outer'>
                                    <button className='cmn_plan_btn cmn_btn_color'>Choose this plan
                                     <img src={arrow_img}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4  col-md-6 col-sm-12' >
                        <div className='pro_plan'>
                                <div className='Personal_wrapper'>
                                    <h3 style={{color:"#ffffff"}}>Personal</h3>
                                    <div className='euro_img_outer'>
                                    <img src={euro_img} className='euro_img'/>
                                    <h5 > <span style={{color:"#ffffff"}}>25,90</span>/ user</h5>
                                    </div>
                                </div>
                                <ul className='plan_list_items'>
                                    <li>
                                        <div className='list_items'>
                                            <img src={white_check_img}/>
                                            <h2>All features in , <span style={{color:"#ffffff"}} >Personal</span>.</h2>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='list_items'>
                                            <img src={white_check_img}/>
                                            <h2>Unlock <span style={{color:"#ffffff"}} >Teams </span>to create work group.</h2>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='list_items'>
                                            <img src={white_check_img}/>
                                            <h2> <span  style={{color:"#ffffff"}}>20GB of </span>shared space.</h2>
                                        </div>
                                    </li>
                                </ul>
                                <div className='plan_button_outer'>
                                    <button className='cmn_plan_btn  cmn_btn_color'>Choose this plan
                                     <img src={arrow_img}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4  col-md-6 col-sm-12' >
                        <div className='personal_plan'>
                                <div className='Personal_wrapper'>
                                    <h3>Enterprise</h3>
                                    <div className='euro_img_outer'>
                                    <img src={euro_img} className='euro_img'/>
                                    <h5> <span>54,90</span>/ user</h5>
                                    </div>
                                </div>
                                <ul className='plan_list_items'>
                                    <li>
                                        <div className='list_items'>
                                            <img src={check_img}/>
                                            <h2>All feature in <span>pro plan</span> .</h2>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='list_items'>
                                            <img src={check_img}/>
                                            <h2>Unlock <span>Database</span> to manage your data</h2>
                                        </div>
                                    </li>
                                    <li>
                                        <div className='list_items'>
                                            <img src={check_img}/>
                                            <h2><span>500GB</span>/5 shared spaces</h2>
                                        </div>
                                    </li>
                                </ul>
                                <div className='plan_button_outer'>
                                    <button className='cmn_plan_btn  cmn_btn_color'>Choose this plan
                                     <img src={arrow_img}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className='trial_btn'>
                        <button className='cmn_btn_color free_trial_btn'>Free Trial for 10 days</button>
                    </div>
                    
                </div>
            </section>
        </>
    )
}
export default SelectPlan