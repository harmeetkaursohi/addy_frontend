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
        //     .test('is-unique', 'Username is already exists', async (value) => {
        //
        // }),
        email: yup.string().required('Email is required').email('Invalid email format'),
        industry: yup.string().required('Industry is required'),
        country: yup.string().required('Country is required'),
        password: yup.string()
            .min(5, 'Password must be at least 5 characters')
            .required('Password is required'),
            // .matches(passwordPattern, 'Password must meet the specified criteria'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    }),
};