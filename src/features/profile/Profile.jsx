import React, {useEffect, useState} from "react";
import "./profile.css";
import jsondata from "../../locales/data/initialdata.json";
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useDispatch} from "react-redux";
import {useFormik} from "formik";
import {formatMessage, getValueOrDefault, isNullOrEmpty, validationSchemas} from "../../utils/commonUtils";
import {Country, State, City} from "country-state-city";
import default_user_icon from "../../images/default_user_icon.svg";
import {RotatingLines} from "react-loader-spinner";
import UpdatePasswordModal from "../common/components/UpdatePasswordModal";
import {Industries, SignupSource, UpdatedSuccessfully} from "../../utils/contantData";
import {showSuccessToast} from "../common/components/Toast";
import {FaCamera} from "react-icons/fa";
import CropImageModal from "../common/components/CropImageModal";
import {useAppContext} from "../common/components/AppProvider";
import {useGetUserInfoQuery, useUpdateProfilePicMutation, useUpdateUserMutation} from "../../app/apis/userApi";
import {addyApi} from "../../app/addyApi";
import {handleRTKQuery} from "../../utils/RTKQueryUtils";
import SkeletonEffect from "../loader/skeletonEffect/SkletonEffect";


const Profile = () => {

    const {sidebar} = useAppContext()
    const dispatch = useDispatch();

    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAddressRequired, setAddressRequired] = useState(true);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
    const [showCropImageModal, setShowCropImageModal] = useState(false);
    const [blob, setBlob] = useState(null)
    const [updateProfilePic, updateProfilePicApi] = useUpdateProfilePicMutation()
    const [updateUser, updateUserApi] = useUpdateUserMutation()
    const getUserInfoApi = useGetUserInfoQuery("")


    const formatYear = (dateString) => {
        const inputDate = new Date(dateString);
        const today = new Date();

        // Reset the time part for both dates to compare only dates
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // Format input date
        const formattedInputDate = new Date(inputDate);
        formattedInputDate.setHours(0, 0, 0, 0);

        if (formattedInputDate.getTime() === today.getTime()) {
            return "Today";
        } else if (formattedInputDate.getTime() === yesterday.getTime()) {
            return "Yesterday";
        } else {
            // Format the date as 'DD MMMM'
            return inputDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric", // Remove year if you don't need it
            });
        }
    }
    const formik = useFormik({
        initialValues: {
            fullName: "",
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
        onSubmit: async (values) => {
            const requestBody = {
                ...getUserInfoApi?.data,
                contactNo: values.contactNo,
                fullName: values.fullName,
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
            await handleRTKQuery(
                async () => {
                    return await updateUser(requestBody).unwrap()
                },
                () => {
                    getUserAccountInfo();
                    showSuccessToast(formatMessage(UpdatedSuccessfully, ["Account"]))
                })
        },
    });

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (!isNullOrEmpty(getUserInfoApi?.data) && !getUserInfoApi?.isLoading && !getUserInfoApi?.isFetching) {
            formik.setFieldValue("fullName", getUserInfoApi?.data?.fullName);
            formik.setFieldValue("username", getUserInfoApi?.data?.username);
            formik.setFieldValue("email", getUserInfoApi?.data?.email);
            formik.setFieldValue("contactNo", getUserInfoApi?.data?.contactNo);
            formik.setFieldValue("industry", getUserInfoApi?.data?.industry);
            formik.setFieldValue("isAddressRequired", getUserInfoApi?.data?.signupSource === SignupSource.ADDY);
            formik.setFieldValue("addressLine1", getUserInfoApi?.data?.address?.addressLine1);
            formik.setFieldValue("addressLine2", getUserInfoApi?.data?.address?.addressLine2);
            if (getUserInfoApi?.data?.address !== undefined && getUserInfoApi?.data?.address !== null) {
                handleCountryChange({target: {value: getUserInfoApi?.data?.address?.country}})
                handleStateChange({target: {value: getUserInfoApi?.data?.address?.state}})
                formik.setFieldValue("county", getUserInfoApi?.data?.address?.county);
            }
            formik.setFieldValue("city", getUserInfoApi?.data?.address?.city);
            formik.setFieldValue("pinCode", getUserInfoApi?.data?.address?.pinCode);
        }
    }, [getUserInfoApi]);

    useEffect(() => {
        if (!isNullOrEmpty(getUserInfoApi?.data)) {
            setUserData({...getUserInfoApi?.data})
            setAddressRequired(getUserInfoApi?.data?.signupSource === SignupSource.ADDY)
        }
    }, [getUserInfoApi])


    const handleStateChange = (event) => {
        const selectedState = event.target.value;
        formik.setFieldValue("state", selectedState);
        formik.setFieldValue('city', "");
        formik.setFieldValue('county', "");
        const state = State.getAllStates().find((state) => state.name === selectedState);
        const cities = City.getCitiesOfState(state?.countryCode, state?.isoCode);
        setCities(cities);
    };

    const handleCountryChange = (event) => {
        const selectedCountry = event.target.value;
        formik.setFieldValue("country", selectedCountry);
        formik.setFieldValue("state", "");
        formik.setFieldValue('city', "");
        formik.setFieldValue('county', "");
        const country = Country.getAllCountries().find((state) => state.name === selectedCountry);
        setCities([]);
        setStates(State.getStatesOfCountry(country?.isoCode));
    };

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

            e.target.value = "";
        }
    }

    const UploadCroppedImage = async () => {
        setShowCropImageModal(false)
        await handleRTKQuery(
            async () => {
                return await updateProfilePic({mediaType: 'IMAGE', file: blob}).unwrap()
            },
            () => {
                showSuccessToast(`Profile Image Updated Successfully.`);
                getUserAccountInfo();
            })
    }

    const getUserAccountInfo = () => {
        dispatch(addyApi.util.invalidateTags(["getUserInfoApi"]))
    }

    return (
        <>
            <section className={` cmn_container ${sidebar ? "" : "cmn_Padding"}`}>
                <form onSubmit={formik.handleSubmit}>
                    <div className=" editprofile_outer">
                        <div className="">
                            <div className="">
                                <div className="planner_header_outer mb-3 align-items-center gap-2">
                                    <div className="planner_header flex-grow-1">
                                        <h3 className="cmn_text_heading"> My Profile</h3>
                                    </div>
                                    {
                                        getUserInfoApi?.data?.signupSource === SignupSource.ADDY &&
                                        <div
                                            className="change_password_btn text-center d-flex">
                                            <button
                                                type={"button"}
                                                onClick={() => {
                                                    setShowUpdatePasswordModal(true)
                                                }}
                                                className={"cmn_btn_color create_post_btn cmn_white_text"}>Change
                                                Password
                                            </button>
                                        </div>
                                    }
                                </div>
                                <>

                                    <div className="editProfile_wrapper">
                                        <div className="edit_content mt-4">
                                            {/* personal information */}
                                            <div
                                                className={"profile-information"}>
                                                <div className="">
                                                    <div className={"edit_wrapper"}>
                                                        <div className="profile_Wrapper">
                                                            <h3 className="profile_heading">Personal
                                                                Information</h3>
                                                            <div className="profile_image_wrapper">
                                                                <img
                                                                    style={{opacity: (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || updateProfilePicApi?.isLoading) ? ".4" : "1"}}
                                                                    src={userData?.profilePic ? "data:image/jpeg; base64," + userData?.profilePic : default_user_icon}
                                                                    className='user_pic '/>
                                                                {
                                                                    (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || updateProfilePicApi?.isLoading) &&
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
                                                                <div
                                                                    className="edit_label_container text-center">
                                                                    <label
                                                                        className="changeProfile_label"
                                                                        htmlFor="changeProfile">
                                                                        <FaCamera/>
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        accept={"image/*"}
                                                                        id="changeProfile"
                                                                        className="change_profile"
                                                                        onChange={changeProfileHandler}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span
                                                            className="last-upadte">last update {formatYear(getUserInfoApi?.data?.modifiedAt)}</span>
                                                    </div>
                                                    <div className={"profile_inner_content_wrapper row "}>
                                                        <div className="col-12">
                                                            <span className="personal">Personal</span>
                                                        </div>
                                                        <div className="col-lg-6 col-sm-12 col-md-12">
                                                            <div className="form-group mt-0">
                                                                <label>
                                                                    Full name <span
                                                                    className="astrick">*</span>
                                                                </label>
                                                                {
                                                                    (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                        <SkeletonEffect count={1}
                                                                                        className={"h-40"}></SkeletonEffect> :
                                                                        <input
                                                                            defaultValue={formik.values.fullName}
                                                                            type="text"
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            name="fullName"
                                                                            className="form-control mt-1"

                                                                            placeholder="Full name"
                                                                        />
                                                                }
                                                                {
                                                                    formik.touched.fullName && formik.errors.fullName &&
                                                                    <p className="error_message">
                                                                        {formik.errors.fullName}
                                                                    </p>
                                                                }
                                                            </div>
                                                            {
                                                                !isNullOrEmpty(userData?.username) &&
                                                                <div className="form-group">
                                                                    <label>
                                                                        Username <span
                                                                        className="astrick">*</span>
                                                                    </label>
                                                                    <OverlayTrigger
                                                                        placement="bottom"
                                                                        overlay={
                                                                            <Tooltip
                                                                                className="custom-tooltip"
                                                                                id="button-tooltip custom-tooltip">
                                                                                Please refrain from changing
                                                                                username.
                                                                                Your username are integral to
                                                                                several
                                                                                functionalities.
                                                                                Altering them might disrupt some
                                                                                services.
                                                                                For more
                                                                                information, please contact us
                                                                                at
                                                                                addy.ads.ultivic@gmail.com
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        {
                                                                            (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                                <SkeletonEffect count={1}
                                                                                                className={"h-40"}></SkeletonEffect> :
                                                                                <input
                                                                                    defaultValue={formik.values.username}
                                                                                    type="text"
                                                                                    onBlur={formik.handleBlur}
                                                                                    name="username"
                                                                                    className="form-control mt-1"
                                                                                    disabled={true}
                                                                                    placeholder="Username"
                                                                                />
                                                                        }

                                                                    </OverlayTrigger>
                                                                    {formik.touched.username && formik.errors.username ? (
                                                                        <p className="error_message">
                                                                            {formik.errors.username}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            }
                                                            {
                                                                !isNullOrEmpty(userData?.email) &&
                                                                <div className="form-group ">
                                                                    <label>
                                                                        {" "}
                                                                        Email <span
                                                                        className="astrick">*</span>
                                                                    </label>
                                                                    <OverlayTrigger
                                                                        placement="bottom"
                                                                        overlay={
                                                                            <Tooltip
                                                                                className="custom-tooltip"
                                                                                id="button-tooltip">
                                                                                Please refrain from changing
                                                                                email.
                                                                                Your email are integral to
                                                                                several
                                                                                functionalities.
                                                                                Altering them might disrupt some
                                                                                services.
                                                                                For more
                                                                                information, please contact us
                                                                                at
                                                                                addy.ads.ultivic@gmail.com
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        {
                                                                            (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                                <SkeletonEffect count={1}
                                                                                                className={"h-40"}></SkeletonEffect> :
                                                                                <input
                                                                                    readOnly={true}
                                                                                    placeholder="Email"
                                                                                    defaultValue={formik.values.email}
                                                                                    type="text"
                                                                                    onBlur={formik.handleBlur}
                                                                                    name="email"
                                                                                    disabled={true}
                                                                                    className="form-control mt-1 email_field"
                                                                                />
                                                                        }

                                                                    </OverlayTrigger>
                                                                    {formik.touched.email && formik.errors.email ? (
                                                                        <p className="error_message">{formik.errors.email}</p>
                                                                    ) : null}
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="col-lg-6 col-sm-12 col-md-12">

                                                            {/* industry */}
                                                            <div className='form-group mt-0'>
                                                                <label
                                                                    htmlFor="country">{jsondata.industry}</label>
                                                                {
                                                                    (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                        <SkeletonEffect count={1}
                                                                                        className={"h-40"}></SkeletonEffect> :
                                                                        <select
                                                                            name="industry"
                                                                            className="form-select cmn_select_box mt-1"
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            defaultValue={formik.values.industry}

                                                                        >
                                                                            <option value="">Select Industry
                                                                            </option>
                                                                            {Object.keys(Industries)?.map((key, index) => (
                                                                                <option key={index}
                                                                                        value={Industries[key]}>
                                                                                    {Industries[key]}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                }

                                                            </div>
                                                            {/* contact number */}
                                                            <div className="form-group">
                                                                <label> Contact Number</label>
                                                                {
                                                                    (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                        <SkeletonEffect count={1}
                                                                                        className={"h-40"}></SkeletonEffect> :
                                                                        <input
                                                                            placeholder="Contact No"
                                                                            defaultValue={formik.values.contactNo}
                                                                            type="text"
                                                                            onChange={formik.handleChange}
                                                                            onBlur={formik.handleBlur}
                                                                            name="contactNo"
                                                                            className="form-control mt-1"

                                                                        />
                                                                }

                                                            </div>

                                                        </div>

                                                        {/* address section starts here  */}
                                                        <div className="col-12 pt-5">
                                                            <h3 className="profile_heading">Address</h3>
                                                        </div>
                                                        <div className="col-lg-6 col-sm-12 col-ms-12">
                                                            <div
                                                                className={``}>

                                                                {/* address 1 */}
                                                                <div className="form-group">
                                                                    <label>
                                                                        {jsondata.addressLine1} {isAddressRequired &&
                                                                        <span className="astrick">*</span>}
                                                                    </label>
                                                                    {
                                                                        (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                            <SkeletonEffect count={1}
                                                                                            className={"h-40"}></SkeletonEffect> :
                                                                            <input
                                                                                onChange={formik.handleChange}
                                                                                placeholder={jsondata.addressLine1}
                                                                                onBlur={formik.handleBlur}
                                                                                defaultValue={formik.values.addressLine1}
                                                                                type="text"
                                                                                className="form-control mt-1"
                                                                                name="addressLine1"

                                                                            />
                                                                    }

                                                                    {formik.touched.addressLine1 &&
                                                                    formik.errors.addressLine1 ? (
                                                                        <p className="error_message">
                                                                            {formik.errors.addressLine1}
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                                {/* address 2 */}
                                                                <div className="form-group">
                                                                    <label>{jsondata.addressLine2}</label>
                                                                    {
                                                                        (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                            <SkeletonEffect count={1}
                                                                                            className={"h-40"}></SkeletonEffect> :
                                                                            <input
                                                                                onChange={formik.handleChange}
                                                                                onBlur={formik.handleBlur}
                                                                                defaultValue={formik.values.addressLine2}

                                                                                name="addressLine2"
                                                                                className="form-control mt-1"
                                                                                type="text"
                                                                                placeholder={jsondata.addressLine2}
                                                                            />
                                                                    }

                                                                </div>
                                                                {/* country */}
                                                                <div className="form-group">
                                                                    <label htmlFor="country">
                                                                        Country{isAddressRequired &&
                                                                        <span className="astrick">*</span>}
                                                                    </label>
                                                                    {
                                                                        (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                            <SkeletonEffect count={1}
                                                                                            className={"h-40"}></SkeletonEffect> :
                                                                            <select
                                                                                id="country"
                                                                                name="country"
                                                                                onChange={handleCountryChange}
                                                                                onBlur={formik.handleBlur}
                                                                                defaultValue={formik.values.country}

                                                                                className="form-select mt-1 cmn_select_box"
                                                                            >
                                                                                <option value="">Select Country
                                                                                </option>
                                                                                {countries?.map((country) => (
                                                                                    <option key={country.name}
                                                                                            value={country.name}>
                                                                                        {country.name}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                    }

                                                                    {formik.touched.country && formik.errors.country ? (
                                                                        <p className="error_message">{formik.errors.country}</p>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6 col-sm-12 col-ms-12">

                                                            <div className="row">
                                                                <div className="col-lg-6">  {/* state */}
                                                                    <div className="form-group">
                                                                        <label htmlFor="state">
                                                                            State{isAddressRequired &&
                                                                            <span className="astrick">*</span>}
                                                                        </label>
                                                                        {
                                                                            (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                                <SkeletonEffect count={1}
                                                                                                className={"h-40"}></SkeletonEffect> :
                                                                                <select
                                                                                    id="state"
                                                                                    name="state"
                                                                                    onChange={handleStateChange}
                                                                                    onBlur={formik.handleBlur}
                                                                                    defaultValue={formik.values.state}

                                                                                    className="form-select mt-1 cmn_select_box"
                                                                                >
                                                                                    <option value="">Select State
                                                                                    </option>
                                                                                    {states?.map((state) => (
                                                                                        <option key={state.name}
                                                                                                value={state.name}>
                                                                                            {state.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                        }

                                                                        {formik.touched.state && formik.errors.state ? (
                                                                            <p className="error_message">{formik.errors.state}</p>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    {/* city */}
                                                                    <div className="form-group">
                                                                        <label>City</label>
                                                                        {
                                                                            (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                                <SkeletonEffect count={1}
                                                                                                className={"h-40"}></SkeletonEffect> :
                                                                                <input
                                                                                    onChange={formik.handleChange}
                                                                                    onBlur={formik.handleBlur}
                                                                                    defaultValue={formik.values.city}
                                                                                    name="city"
                                                                                    className="form-control mt-1"
                                                                                    type="text"

                                                                                    placeholder={"City"}
                                                                                />
                                                                        }

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-lg-6"> {/* county */}
                                                                    <div className="form-group">
                                                                        <label htmlFor="city">
                                                                        County{isAddressRequired &&
                                                                            <span className="astrick">*</span>}
                                                                        </label>
                                                                        {
                                                                            (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                                <SkeletonEffect count={1}
                                                                                                className={"h-40"}></SkeletonEffect> :
                                                                                <select
                                                                                    id="county"
                                                                                    name="county"
                                                                                    onChange={formik.handleChange}
                                                                                    onBlur={formik.handleBlur}
                                                                                    value={formik.values.county}
                                                                                    className="form-select mt-1 cmn_select_box"

                                                                                >
                                                                                    <option value="">Select County
                                                                                    </option>
                                                                                    {cities?.map((city, index) => (
                                                                                        <option key={index}
                                                                                                value={city.isoCode}>
                                                                                            {city.name}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                        }

                                                                        {formik.touched.county && formik.errors.county ? (
                                                                            <p className="error_message">
                                                                                {formik.errors.county}
                                                                            </p>
                                                                        ) : null}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    {/* pincode */}
                                                                    <div className="form-group">
                                                                        <label>{jsondata.pinCode}</label>
                                                                        {
                                                                            (getUserInfoApi?.isLoading || getUserInfoApi?.isFetching || userData === null) ?
                                                                                <SkeletonEffect count={1}
                                                                                                className={"h-40"}></SkeletonEffect> :
                                                                                <input
                                                                                    onChange={formik.handleChange}
                                                                                    onBlur={formik.handleBlur}
                                                                                    onWheel={(e) => {
                                                                                        e.target.blur()
                                                                                    }}
                                                                                    defaultValue={formik.values.pinCode}
                                                                                    name="pinCode"
                                                                                    className="form-control mt-1"
                                                                                    type="number"

                                                                                    placeholder={jsondata.pinCode}
                                                                                />
                                                                        }

                                                                    </div>
                                                                </div>
                                                                <div className="col-12 text-end mt-3">
                                                                    <label htmlFor="4545454"
                                                                           className="opacity-0 d-block">submit</label>

                                                                    <div>
                                                                        <button
                                                                            disabled={updateUserApi?.isLoading}
                                                                            className={"edit_profile_btn ms-3 "}>
                                                                            Update
                                                                            {
                                                                                updateUserApi?.isLoading &&
                                                                                <span
                                                                                    className={"spinner-border spinner-border-sm ms-2 "}
                                                                                    role="status"
                                                                                    aria-hidden="true"></span>
                                                                            }
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
            {
                showCropImageModal &&
                <CropImageModal
                    imageUrl={image}
                    showModal={showCropImageModal}
                    setShowModal={setShowCropImageModal}
                    UploadCroppedImage={UploadCroppedImage}
                    getBlob={getBlob}/>
            }
            {
                showUpdatePasswordModal &&
                <UpdatePasswordModal
                    showModal={showUpdatePasswordModal}
                    setShowModal={setShowUpdatePasswordModal}/>
            }
        </>
    );
};

export default Profile;
