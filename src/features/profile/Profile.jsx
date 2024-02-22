import React, {useEffect, useState} from "react";
import "./profile.css";
import jsondata from "../../locales/data/initialdata.json";
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import {decodeJwtToken, getToken} from "../../app/auth/auth";
import {useFormik} from "formik";
import {formatMessage, getValueOrDefault, validationSchemas} from "../../utils/commonUtils";
import {Country, State, City} from "country-state-city";
import {getUserInfo, updateCustomer, updateProfilePic} from "../../app/actions/userActions/userActions";
import default_user_icon from "../../images/default_user_icon.svg";
import {RotatingLines} from "react-loader-spinner";
import UpdatePasswordModal from "../common/components/UpdatePasswordModal";
import SideBar from "../sidebar/views/Layout";
import {Industries, SignupSource, UpdatedSuccessfully} from "../../utils/contantData";
import {showSuccessToast} from "../common/components/Toast";
import CommonLoader from "../common/components/CommonLoader";
import { FaCamera } from "react-icons/fa";
import { RiCloseFill, RiEditBoxFill } from "react-icons/ri";
import CropImageModal from "../common/components/CropImageModal";


const Profile = () => {
    const userInfo = useSelector(state => state.user.userInfoReducer);
    const [image, setImage] = useState(null);

    const updateProfilePicData = useSelector(state => state.user.updateProfilePicReducer);
    const updateCustomerData = useSelector(state => state.user.updateCustomerReducer);
    const [userData, setUserData] = useState(null);
    const [isAddressRequired, setAddressRequired] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
    const [showCropImageModal, setShowCropImageModal] = useState(false);
    const [blob, setBlob] = useState(null)
    const token = getToken();
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo?.data !== undefined) {
            formik.setFieldValue("firstName", userInfo?.data?.fullName.split(" ")[0]);
            formik.setFieldValue("lastName", userInfo?.data?.fullName.split(" ")?.length > 1 ? userInfo?.data?.fullName.split(" ").slice(1).join(" ") : "");
            formik.setFieldValue("username", userInfo?.data?.username);
            formik.setFieldValue("email", userInfo?.data?.email);
            formik.setFieldValue("contactNo", userInfo?.data?.contactNo);
            formik.setFieldValue("industry", userInfo?.data?.industry);
            formik.setFieldValue("isAddressRequired", userInfo?.data?.signupSource === SignupSource.ADDY);
            formik.setFieldValue("addressLine1", userInfo?.data?.address?.addressLine1);
            formik.setFieldValue("addressLine2", userInfo?.data?.address?.addressLine2);
            if (userInfo?.data?.address !== undefined && userInfo?.data?.address !== null) {
                handleCountryChange({target: {value: userInfo?.data?.address?.country}})
                handleStateChange({target: {value: userInfo?.data?.address?.state}})
                formik.setFieldValue("county", userInfo?.data?.address?.county);
            }
            formik.setFieldValue("city", userInfo?.data?.address?.city);
            formik.setFieldValue("pinCode", userInfo?.data?.address?.pinCode);
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo?.data !== undefined) {
            setUserData({...userInfo?.data})
            setAddressRequired(userInfo?.data?.signupSource === SignupSource.ADDY)
        }
    }, [userInfo])

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            username: "",
            isAddressRequired: "",
            email: "",
            contactNo: "",
            industry: "",
            addressLine1: "",
            addressLine2: "",
            country: "",
            state: "",
            county: "",
            city: "",
            pinCode: "",
        },
        validationSchema: isAddressRequired ? validationSchemas.editProfileInfoWithAddressRequired : validationSchemas.editProfileInfo,
        onSubmit: (values) => {
            dispatch(updateCustomer({
                token: token,
                data: {
                    ...userInfo?.data,
                    contactNo: values.contactNo,
                    fullName: values.firstName + " " + values.lastName,
                    industry: values.industry,
                    address: {
                        addressLine1: getValueOrDefault(values.addressLine1, null),
                        addressLine2: getValueOrDefault(values.addressLine2, null),
                        country: getValueOrDefault(values.country, null),
                        city: getValueOrDefault(values.city, null),
                        county: getValueOrDefault(values.county, null),
                        state: getValueOrDefault(values.state, null),
                        pinCode: getValueOrDefault(values.pinCode, null),
                    }
                }
            })).then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    getUserAccountInfo();
                    setEditMode(false)
                    showSuccessToast(formatMessage(UpdatedSuccessfully, "Account"))
                }
            })
        },
    });

    const getBlob = (blob) => {        
        setBlob(blob)
    }
    const changeProfileHandler = (e) => {
        if (e.target.files[0]) {            
            // convert image file to base64 string
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.addEventListener('load', () => {                
                setShowCropImageModal(true)            
                setImage(reader.result);
            }, false)
            if (file) {
                reader.readAsDataURL(file)
            }
        }
    }

    const UploadCroppedImage = ()=>{        
        setShowCropImageModal(false)                          
        dispatch(updateProfilePic({token:token,formData:{mediaType:'IMAGE',file:blob}})).then(res => {
            if (res.meta.requestStatus === "fulfilled") {
                getUserAccountInfo();
            }
        })
    }

    const getUserAccountInfo = () => {
        const decodeJwt = decodeJwtToken(token);
        const requestBody = {
            customerId: decodeJwt.customerId,
            token: token
        }
        dispatch(getUserInfo(requestBody));
    }

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    const handleStateChange = (event) => {
        const selectedState = event.target.value;
        formik.setFieldValue("state", selectedState);
        formik.setFieldValue('city', "");
        formik.setFieldValue('county', "");
        const state = State.getAllStates().find(
            (state) => state.name === selectedState
        );
        const cities = City.getCitiesOfState(state?.countryCode, state?.isoCode);
        setCities(cities);
    };

    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        formik.setFieldValue("country", selectedCountry);
        formik.setFieldValue("state", "");
        formik.setFieldValue('city', "");
        formik.setFieldValue('county', "");
        const country = Country.getAllCountries().find(
            (state) => state.name === selectedCountry
        );
        setCities([]);
        setStates(State.getStatesOfCountry(country?.isoCode));
    };
  


    return (
        <>
            <SideBar/>
            <section className=" cmn_container " style={{background: "white"}}>

                <div className="addy_img">
                    <h3 className="edit_profile_heading cmn_text_heading">Profile</h3>
                </div>
                {
                    userData === null ? <CommonLoader></CommonLoader> :
                        <>
                            {
                                userInfo?.data?.signupSource === SignupSource.ADDY && <div
                                    className="change_password_btn text-center d-flex">
                                    <button onClick={() => {
                                        setShowUpdatePasswordModal(true)
                                    }} className={"mt-3 me-3 createPost_btn crate_btn cmn_btn_color cursor-pointer"}>Change
                                        Password
                                    </button>
                                </div>
                            }
                            <div className="editprofile_outer">

                                <div className="editProfile_wrapper mt-3">
                                    <div className="change_profile_outer">
                                        <div>
                                        <div className="user_pic_container">
                                            {
                                                (userInfo?.loading || updateProfilePicData?.loading) &&
                                                <div className={"update-pic-loading"}>
                                                    <RotatingLines
                                                        strokeColor="#F07C33"
                                                        strokeWidth="5"
                                                        animationDuration="0.75"
                                                        width="40"
                                                        visible={true}
                                                    />
                                                </div>
                                            }

                                            <img
                                                style={{opacity: (userInfo?.loading || updateProfilePicData?.loading) ? ".4" : "1"}}
                                                src={userData?.profilePic ? "data:image/jpeg; base64," + userData?.profilePic : default_user_icon}
                                                className='user_pic '/>
                                        </div>

                                        <div className="edit_label_container">
                                            {updateCustomerData?.loading || !editMode ? "" :
                                            <label className="changeProfile_label" htmlFor="changeProfile">
                                            <FaCamera />
                                            </label>
                                            }
                                            <input
                                                type="file"
                                                accept={"image/*"}
                                                id="changeProfile"
                                                className="change_profile"
                                                onChange={changeProfileHandler}
                                            />
                                        </div>
                                        

                                        </div>
                                        <div className="form-group">
                                            <label onClick={() => {
                                                setEditMode(!editMode)
                                            }} className="edit_label updateAccount_label" htmlFor="">
                                               {!editMode ? <RiEditBoxFill/> : <RiCloseFill />}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="edit_content">
                                        <form onSubmit={formik.handleSubmit}>
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-12 col-md-12">

                                            <div className="row">
                                                <div className="col-lg-6 col-sm-12 col-md-6">
                                                    <div className="form-group">
                                                        <label>
                                                            Firstname <span className="astrick">*</span>
                                                        </label>
                                                        <input
                                                            value={formik.values.firstName}
                                                            type="text"
                                                            onChange={editMode ? formik.handleChange : undefined}
                                                            onBlur={formik.handleBlur}
                                                            name="firstName"
                                                            className="form-control mt-2"
                                                            disabled={!editMode}
                                                            placeholder="First name"
                                                        />
                                                        {formik.touched.firstName && formik.errors.firstName ? (
                                                            <p className="error_message">
                                                                {formik.errors.firstName}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 col-sm-12 col-md-6">
                                                    <div className="form-group">
                                                        <label>
                                                            Lastname <span className="astrick">*</span>
                                                        </label>
                                                        <input
                                                            value={formik.values.lastName}
                                                            type="text"
                                                            onChange={editMode ? formik.handleChange : undefined}
                                                            onBlur={formik.handleBlur}
                                                            name="lastName"
                                                            className="form-control mt-2"
                                                            disabled={!editMode}
                                                            placeholder="Lastname"
                                                        />
                                                        {formik.touched.lastName && formik.errors.lastName ? (
                                                            <p className="error_message">
                                                                {formik.errors.lastName}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="form-group">
                                                        <label>
                                                            Username <span className="astrick">*</span>
                                                        </label>
                                                        <OverlayTrigger
                                                            placement="right"
                                                            overlay={<Tooltip id="button-tooltip">
                                                                Please refrain from changing username.
                                                                Your username are integral to several functionalities.
                                                                Altering them might disrupt some services. For more
                                                                information, please contact us at
                                                                addy.ads.ultivic@gmail.com
                                                            </Tooltip>}
                                                        >
                                                            <input
                                                                value={formik.values.username}
                                                                type="text"
                                                                onBlur={formik.handleBlur}
                                                                name="username"
                                                                className="form-control mt-2"
                                                                disabled={true}
                                                                placeholder="Username"
                                                            />
                                                        </OverlayTrigger>
                                                        {formik.touched.username && formik.errors.username ? (
                                                            <p className="error_message">
                                                                {formik.errors.username}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="form-group">
                                                        <label>
                                                            {" "}
                                                            Email <span className="astrick">*</span>
                                                        </label>

                                                        <OverlayTrigger
                                                            placement="right"
                                                            overlay={<Tooltip id="button-tooltip">
                                                                Please refrain from changing email.
                                                                Your email are integral to several functionalities.
                                                                Altering them might disrupt some services. For more
                                                                information, please contact us at
                                                                addy.ads.ultivic@gmail.com
                                                            </Tooltip>}
                                                        >
                                                            <input
                                                                readOnly={true}
                                                                placeholder="Email"
                                                                value={formik.values.email}
                                                                type="text"
                                                                onBlur={formik.handleBlur}
                                                                name="email"
                                                                disabled={true}
                                                                className="form-control mt-2 email_field"
                                                            />
                                                        </OverlayTrigger>


                                                        {formik.touched.email && formik.errors.email ? (
                                                            <p className="error_message">{formik.errors.email}</p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor="country">{jsondata.industry}</label>
                                                <select
                                                    name="industry"
                                                    className="form-control cmn_select_box mt-1"
                                                    onChange={editMode ? formik.handleChange : undefined}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.industry}
                                                    disabled={!editMode}
                                                >
                                                    <option value="">Select Industry</option>
                                                    {Object.keys(Industries)?.map((key, index) => (
                                                        <option key={index} value={Industries[key]}>
                                                            {Industries[key]}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label> Contact No</label>
                                                <input
                                                    placeholder="Contact No"
                                                    value={formik.values.contactNo}
                                                    type="text"
                                                    onChange={editMode ? formik.handleChange : undefined}
                                                    onBlur={formik.handleBlur}
                                                    name="contactNo"
                                                    className="form-control mt-2"
                                                    disabled={!editMode}
                                                />
                                            </div>
                                                </div>

                                                <div className="col-lg-6 col-sm-12 col-md-12">
                                                {/* address */}
                                            <div className="login_form">
                                                <div className="form-group">
                                                    <label>
                                                        {jsondata.addressLine1} {isAddressRequired &&
                                                        <span className="astrick">*</span>}
                                                    </label>
                                                    <input
                                                        onChange={editMode ? formik.handleChange : undefined}
                                                        placeholder={jsondata.addressLine1}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.addressLine1}
                                                        type="text"
                                                        className="form-control"
                                                        name="addressLine1"
                                                        disabled={!editMode}
                                                    />
                                                    {formik.touched.addressLine1 &&
                                                    formik.errors.addressLine1 ? (
                                                        <p className="error_message">
                                                            {formik.errors.addressLine1}
                                                        </p>
                                                    ) : null}
                                                </div>

                                                <div className="form-group">
                                                    <label>{jsondata.addressLine2}</label>
                                                    <input
                                                        onChange={editMode ? formik.handleChange : undefined}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.addressLine2}
                                                        disabled={!editMode}
                                                        name="addressLine2"
                                                        className="form-control mt-1"
                                                        type="text"
                                                        placeholder={jsondata.addressLine2}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="country">
                                                        Country{isAddressRequired && <span className="astrick">*</span>}
                                                    </label>
                                                    <select
                                                    
                                                        id="country"
                                                        name="country"
                                                        onChange={editMode ? handleCountryChange : undefined}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.country}
                                                        disabled={!editMode}
                                                        className="form-control mt-1 cmn_select_box"
                                                    >
                                                        <option value="">Select Country</option>
                                                        {countries?.map((country) => (
                                                            <option key={country.name} value={country.name}>
                                                                {country.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {formik.touched.country && formik.errors.country ? (
                                                        <p className="error_message">{formik.errors.country}</p>
                                                    ) : null}
                                                </div>

                                                <div className="row">
                                                    {/** Start States Fields */}

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label htmlFor="state">
                                                                State{isAddressRequired &&
                                                                <span className="astrick">*</span>}
                                                            </label>
                                                            <select
                                                                id="state"
                                                                name="state"
                                                                onChange={editMode ? handleStateChange : undefined}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.state}
                                                                disabled={!editMode}
                                                                className="form-control mt-1 cmn_select_box"
                                                            >
                                                                <option value="">Select State</option>
                                                                {states?.map((state) => (
                                                                    <option key={state.name} value={state.name}>
                                                                        {state.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formik.touched.state && formik.errors.state ? (
                                                                <p className="error_message">{formik.errors.state}</p>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    {/** End States Fields */}

                                                    {/** Start City Fields */}

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>City</label>
                                                            <input
                                                                onChange={editMode ? formik.handleChange : undefined}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.city}
                                                                name="city"
                                                                className="form-control mt-1"
                                                                type="text"
                                                                disabled={!editMode}
                                                                placeholder={"City"}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/** End City Fields */}

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label htmlFor="city">
                                                                County{isAddressRequired &&
                                                                <span className="astrick">*</span>}
                                                            </label>
                                                            <select
                                                                id="county"
                                                                name="county"
                                                                onChange={editMode ? formik.handleChange : undefined}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.county}
                                                                className="form-control mt-1 cmn_select_box"
                                                                disabled={!editMode}
                                                            >
                                                                <option value="">Select County</option>
                                                                {cities?.map((city, index) => (
                                                                    <option key={index} value={city.isoCode}>
                                                                        {city.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formik.touched.county && formik.errors.county ? (
                                                                <p className="error_message">
                                                                    {formik.errors.county}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="form-group">
                                                            <label>{jsondata.pinCode}</label>
                                                            <input
                                                                onChange={editMode ? formik.handleChange : undefined}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.pinCode}
                                                                name="pinCode"
                                                                className="form-control mt-1"
                                                                type="number"
                                                                disabled={!editMode}
                                                                placeholder={jsondata.pinCode}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    {updateCustomerData?.loading || !editMode ? "" :
                                                    <button 
                                                            className={"cmn_btn_color btn_style " + (!editMode ? "opacity-50" : "")}>
                                                        Update
                                                        {
                                                            updateCustomerData?.loading &&
                                                            <span className={"spinner-border spinner-border-sm ms-2 "}
                                                                  role="status"
                                                                  aria-hidden="true"></span>
                                                        }
                                                    </button>
                                                    }
                                                </div>
                                            </div>
                                            </div>
                                            </div>

                                            

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </>
                }
            </section>
            {showCropImageModal &&  <CropImageModal imageUrl={image} showModal={showCropImageModal} setShowModal={setShowCropImageModal} UploadCroppedImage={UploadCroppedImage} getBlob={getBlob}/>}
            {
                showUpdatePasswordModal && <UpdatePasswordModal showModal={showUpdatePasswordModal}
                                                                setShowModal={setShowUpdatePasswordModal}></UpdatePasswordModal>
            }
        </>
    );
};

export default Profile;
