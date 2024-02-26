import Modal from "react-bootstrap/Modal";
import React, {useState} from "react";
import './common.css'
import {useFormik} from "formik";
import {formatMessage, getInitialLetterCap, validationSchemas} from "../../../utils/commonUtils";
import {useDispatch, useSelector} from "react-redux";
import {updatePassword} from "../../../app/actions/userActions/userActions";
import {getToken} from "../../../app/auth/auth";
import {showSuccessToast} from "./Toast";
import {NoBusinessAccountFound, UpdatedSuccessfully} from "../../../utils/contantData";
import "./common.css"

const UpdatePasswordModal = ({showModal, setShowModal}) => {

    const updatePasswordData = useSelector(state => state.user.updatePasswordReducer);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    })
    const handleClose = () => {
        setShowModal(false)
    };
    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        validationSchema: validationSchemas.updatePassword,
        onSubmit: (values) => {
            dispatch(updatePassword({
                token: getToken(),
                data: {
                    oldPassword: values.oldPassword, newPassword: values.newPassword
                }
            })).then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    showSuccessToast(formatMessage(UpdatedSuccessfully, "Password"))
                    handleClose();
                }
            })
        }
    });
    const togglePasswordVisibility = (toggleVisibilityFor) => {
        setShowPassword({...showPassword, [toggleVisibilityFor]: !showPassword[toggleVisibilityFor]})
    }


    return (
        <>
            <section className='facebook_modal_outer'>
                <Modal size="md" show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton className="mb-1">
                        <Modal.Title className="commonmodal_header">
                            <div className='facebook_title'>
                                Update Password
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-0">
                        <div className='px-2'>
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
                                        <p className="error_message">{formik.errors.oldPassword}</p>
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
                                        <p className="error_message">{formik.errors.newPassword}</p>
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
                                        <p className="error_message">{formik.errors.confirmPassword}</p>
                                    }
                                </div>
                                <div className='update-password-btn-outer text-center  mt-4'>
                                    <button type={"submit"}
                                            disabled={updatePasswordData?.loading}

                                            className={"update-password-btn connection-error-close-btn "}>
                                        Update
                                        {
                                            updatePasswordData?.loading &&
                                            <span className={"spinner-border spinner-border-sm  ms-2"} role="status"
                                                  aria-hidden="true"></span>
                                        }

                                    </button>
                                    <button onClick={handleClose}
                                            disabled={updatePasswordData?.loading}
                                            className={"close-update-password-btn cancel_button "}>Cancel
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