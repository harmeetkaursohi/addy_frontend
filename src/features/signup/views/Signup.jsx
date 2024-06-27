import React, {useEffect, useState} from 'react'
import AddressInfo from './tabs/AddressInfo';
import UserInfo from './tabs/UserInfo';
import "./Signup.css"
import {SignupSource} from "../../../utils/contantData";

const Signup = () => {

    const [showTab, setShowTab] = useState(1);

    useEffect(() => {
        document.title = 'Sign up';
    }, []);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        contactNo: "",
        industry: "",
        isAccountNonLocked: false,
        isEnabled: false,
        signupSource: SignupSource.ADDY,
        address: {
            addressLine1: "",
            addressLine2: "",
            country: "",
            state: "",
            county: "",
            city: "",
            pinCode: "",
            isAgreedToTermsAndConditions: false
        }
    });

    return (
        <>
            {showTab === 1 &&
                <UserInfo formData={formData} setFormData={setFormData} setShowTab={setShowTab}/>
            }
            {showTab === 2 &&
                <AddressInfo formData={formData} setFormData={setFormData} setShowTab={setShowTab}/>
            }

        </>
    )
}

export default Signup;
