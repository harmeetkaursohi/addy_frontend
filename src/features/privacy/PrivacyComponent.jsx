import SideBar from "../sidebar/views/Layout";
import React from "react";
import './privacy.css'

const PrivacyComponent = () => {
   return (
       <>
           <SideBar/>
           <div className="cmn_container faq_section pt-5">
               <div className="cmn_wrapper_outer">
                   <div className="dashboard_outer">
                       <h2 className="cmn_title">
                            Privacy Policy
                       </h2>
                       <div className="privacy_wrapper">
                           <p>Addy LLC Privacy Policy <br/>
                               Effective Date: Jan 4, 2022 <br/>
                               Our terms of service and privacy were updated on Jan 4, 2022, and are applicable to all our existing customers.
                           </p>
                           <h4>Introduction
                           </h4>
                           <p>
                               Please read this policy and if you have any questions contact us.
                               This privacy notice explains how Addy collects, uses, processes, discloses, retains, and protects personal information i) when we provide services to you; and ii) when we process personal information at your instruction that may be included as part of the Content which you view, upload, download or otherwise appears on our mobile applications(Android and iOS).
                               When this privacy notice refers to “Addy”, “us”, “we” or “our”, it refers to Addy Inc.

                           </p>
                           <h4>
                               Our Services

                           </h4>
                           <p>
                               Addy offers a suite of social media management tools. Our mobile applications enable you to bring together your social media accounts for easy access and management. Addy helps its users manage posts; engaging audiences; scheduling and analyzing their results. When you link your existing social media accounts to your Addy account, you can choose to instantly collect, process, share and access Social Network content via your Addy account.
                               Personal Information We Collect
                               Personal information is information relating to an identified or identifiable natural person. An identifiable natural person is an individual that can be identified, directly or indirectly, be referenced to an identifier such as: a name, an identification number, specific location data, an online identifier, or other attributes specific to that natural person.
                               Personal information does not include information that has been anonymized or aggregated in such a way that it can no longer be used to identify a specific natural person, whether on its own or in combination with other information.

                           </p>
                       </div>
                   </div>
               </div>
           </div>
       </>
   )
}

export default PrivacyComponent;