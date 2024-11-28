import Modal from "react-bootstrap/Modal";
import React, {useState} from "react";
import './common.css'
import {useFormik} from "formik";
import {formatMessage,  validationSchemas} from "../../../utils/commonUtils";
import {showSuccessToast} from "./Toast";
import { UpdatedSuccessfully} from "../../../utils/contantData";
import "./common.css"
import Lock_img from "../../../images/addylogoo.svg?react"
import { RxCross2 } from "react-icons/rx";
import {useUpdatePasswordMutation} from "../../../app/apis/authApi";
import {handleRTKQuery} from "../../../utils/RTKQueryUtils";

const UpdatePasswordModal = ({showModal, setShowModal}) => {

    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    })
    const [updatePassword,updatePasswordApi]=useUpdatePasswordMutation()

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema: validationSchemas.updatePassword,
        onSubmit: async (values) => {
            const data={
                oldPassword: values.oldPassword, newPassword: values.newPassword
            }
            await handleRTKQuery(
                async () => {
                    return await updatePassword(data).unwrap()
                },
                () => {
                    showSuccessToast(formatMessage(UpdatedSuccessfully, ["Password"]))
                    handleClose();
                })
        }
    });

    const handleClose = () => {
        setShowModal(false)
    };

    const togglePasswordVisibility = (toggleVisibilityFor) => {
        setShowPassword({...showPassword, [toggleVisibilityFor]: !showPassword[toggleVisibilityFor]})
    }


    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal centered size="md" show={showModal} onHide={handleClose} className="update_pass_model_wrapper">
                
                    <Modal.Body className="pt-0 update_password_wrapper">
                    <div className='pop_up_cross_icon_outer text-end cursor-pointer' onClick={(e) => {
                                            handleClose()
                                        }}><RxCross2 className="pop_up_cross_icon"/></div>

                        <div className='px-2 update_pass_model_content'>
                   <div className="text-center pt-3">
                   <Lock_img/>
                   </div>
                            <h3 className='cmn_heading_class text-center mt-2'>
                            Create New Password
                            </h3>
                            <p className="text-center">Create a new password. Ensure it differs from
                            previous ones for security   </p>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="form-group">
                                    <label className="">
                                        Old Password
                                    </label>
                                    <input
                                        name="oldPassword"
                                        type={showPassword.oldPassword ? "text" : "password"}
                                        id="changeProfile"
                                        className="form-control mt-2"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.oldPassword}
                                        placeholder="Old Password"
                                    />
                                    <span className="password-toggle" onClick={() => {
                                        togglePasswordVisibility("oldPassword")
                                    }}>
                                        {showPassword?.oldPassword ?
                                            <h2 className="openEye toggle-pswd-visibility-show">
                                                <i className="fa-solid fa-eye"></i>
                                            </h2>
                                            :
                                            <h2 className="closeEyeIcon toggle-pswd-visibility-hide">
                                                <i className="fa fa-eye-slash" aria-hidden="true"/>
                                            </h2>
                                        }
                                    </span>
                                    {
                                        formik.touched.oldPassword && formik.errors.oldPassword &&
                                        <span className="error_message">{formik.errors.oldPassword}</span>
                                    }
                                </div>
                                <div className="form-group">
                                    <label className="">
                                        New Password
                                    </label>
                                    <input
                                        name="newPassword"
                                        type={showPassword.newPassword ? "text" : "password"}
                                        id="changeProfile"
                                        className="form-control mt-2"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.newPassword}
                                        placeholder="New Password"
                                    />
                                    <span className="password-toggle" onClick={() => {
                                        togglePasswordVisibility("newPassword")
                                    }}>
                                        {showPassword?.newPassword ?
                                            <h2 className="openEye toggle-pswd-visibility-show">
                                                <i className="fa-solid fa-eye"></i>
                                            </h2>
                                            :
                                            <h2 className="closeEyeIcon toggle-pswd-visibility-hide">
                                                <i className="fa fa-eye-slash" aria-hidden="true"/>
                                            </h2>
                                        }
                                    </span>
                                    {
                                        formik.touched.newPassword && formik.errors.newPassword &&
                                        <span className="error_message">{formik.errors.newPassword}</span>
                                    }
                                </div>
                                <div className="form-group">
                                    <label className="">
                                        Confirm Password
                                    </label>
                                    <input
                                        name="confirmPassword"
                                        type={showPassword.confirmPassword ? "text" : "password"}
                                        id="changeProfile"
                                        className="form-control mt-2"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirmPassword}
                                        placeholder="Confirm Password"
                                    />
                                    <span className="password-toggle" onClick={() => {
                                        togglePasswordVisibility("confirmPassword")
                                    }}>
                                        {showPassword?.confirmPassword ?
                                            <h2 className="openEye toggle-pswd-visibility-show">
                                                <i className="fa-solid fa-eye"></i>
                                            </h2>
                                            :
                                            <h2 className="closeEyeIcon toggle-pswd-visibility-hide">
                                                <i className="fa fa-eye-slash" aria-hidden="true"/>
                                            </h2>
                                        }
                                    </span>
                                    {
                                        formik.touched.confirmPassword && formik.errors.confirmPassword &&
                                        <span className="error_message">{formik.errors.confirmPassword}</span>
                                    }
                                </div>
                                <div className='update-password-btn-outer text-center  mt-4'>
                                {/* <button onClick={handleClose}
                                            disabled={updatePasswordApi?.isLoading}
                                            className={"close-update-password-btn me-4 cmn_modal_cancelbtn "}>Cancel
                                    </button> */}
                                    <button type={"submit"}
                                            disabled={updatePasswordApi?.isLoading}

                                            className={"update-password-btn connection-error-close-btn w-100"}>
                                        Update
                                        {
                                            updatePasswordApi?.isLoading &&
                                            <span className={"spinner-border spinner-border-sm "} role="status"
                                                  aria-hidden="true"></span>
                                        }

                                    </button>
                                    
                                </div>
                            </form>

                        </div>
                    </Modal.Body>

                </Modal>

            </section>
        </>
    );
}
export default UpdatePasswordModal