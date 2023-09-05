import * as yup from "yup";
const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;

export const validationSchemas = {
    login: yup.object().shape({
        username: yup.string().required('Username is required').email('Invalid email format'),
        password: yup.string()
            .min(5, 'Password must be at least 5 characters')
            .required('Password is required')
    }),

    register: yup.object().shape({
        username: yup.string().required('Username is required'),
        email: yup.string().required('Email is required').email('Invalid email format'),
        contactNo: yup.number().required('Contact No is required')
        // .max(10, "Contact No is not valid")
    }),

    createPassword: yup.object().shape({
        password: yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        // .matches(passwordPattern, 'Password must meet the specified criteria'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),

    }),

    address:yup.object().shape({
        country: yup.string().required('Country is required'),
        addressLine1: yup.string().required('AddressLine is required'),
        county: yup.string().required('County is required'),
        state: yup.string().required('State is required'),
    }),

    forgetPassword:yup.object().shape({
        email: yup.string().required('Email is required').email('Invalid email format'),
    }),
};
