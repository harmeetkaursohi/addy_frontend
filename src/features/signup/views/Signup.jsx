import React, {useEffect, useState} from 'react'
import AddressInfo from './tabs/AddressInfo';
import UserInfo from './tabs/UserInfo';

const Signup = () => {

    const [showTab, setShowTab] = useState(1);

    useEffect(() => {
        document.title = 'Signup';
    }, []);

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        contactNo: "",
        industry: "",
        isAccountNonLocked: false,
        isEnabled: false,
        address: {
            addressLine1: "",
            addressLine2: "",
            country: "",
            state: "",
            county: "",
            city: "",
            pinCode: ""
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