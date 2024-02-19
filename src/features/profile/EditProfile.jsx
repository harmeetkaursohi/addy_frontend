import React, { useEffect, useState } from "react";

import "./profile.css";
import Layout from "../sidebar/views/Layout";
import user_img from "../../images/girl.png";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import jsondata from "../../locales/data/initialdata.json";

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import EditAddress from "./editAddress";
import ChangePassword from "./ChangePassword";
import { useDispatch } from "react-redux";
import { changeProfile } from "../../app/actions/profileActions/profileActions";
import { getToken } from "../../app/auth/auth";
import { useFormik } from "formik";
import { validationSchemas } from "../../utils/commonUtils";
import { ImSpinner5 } from "react-icons/im";
import { Country, State, City } from "country-state-city";

const EditProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState();
  const [fileType, setFileType] = useState();

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      contactNo: "",
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      county: "",
      city: "",
      pinCode: "",
    },
    validationSchema: validationSchemas.editProfileInfo,
    onSubmit: (values) => {},
  });
  const changeProfileHandler = (e) => {
    setFileType("IMAGE");
    setFile(e.target.files[0]);
    const data = {
      authtoken: {
        token: getToken(),
      },
      formdata: {
        mediaType: fileType,
        file: e.target.files[0],
      },
    };
    if (e.target.files[0]) {
      dispatch(changeProfile(data));
    }
  };
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    formik.setFieldValue("state", selectedState);
    const state = State.getAllStates().find(
      (state) => state.name === selectedState
    );
    const cities = City.getCitiesOfState(state.countryCode, state.isoCode);
    setCities(cities);
  };

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    formik.setFieldValue("country", selectedCountry);
    const country = Country.getAllCountries().find(
      (state) => state.name === selectedCountry
    );
    setStates(State.getStatesOfCountry(country.isoCode));
  };
  
  
  return (
    <>
      <Layout />

      <section className=" cmn_container " style={{ background: "white" }}>
        <div className="addy_img">
          <h3 className="edit_profile_heading">Edit Profile</h3>
        </div>

        <div className="editprofile_outer">
          <div className="editProfile_wrapper mt-3">
            <div className="change_profile_outer">
              <div className="user_pic_container">
                <img src={user_img} alt="User Profile" className="user_pic" />
              </div>

              <div className="form-group">
                <label className="changeProfile_label" htmlFor="changeProfile">
                  <ImSpinner5 className="ImSpinner_icon" /> Profile
                </label>
                <input
                  type="file"
                  id="changeProfile"
                  className="change_profile"
                  onChange={changeProfileHandler}
                />
              </div>
            </div>

            <div className="edit_content">
              <form onSubmit={formik.handleSubmit}>
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-md-6">
                    <div className="form-group">
                      <label>
                        {" "}
                        Firstname <span className="astrick">*</span>
                      </label>
                      <input
                        value={formik.values.firstName}
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="firstName"
                        className="form-control mt-2"
                        readOnly={!editMode}
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
                        {" "}
                        Lastname <span className="astrick">*</span>
                      </label>
                      <input
                        value={formik.values.lastName}
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="lastName"
                        className="form-control mt-2"
                        readOnly={!editMode}
                        placeholder="username"
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
                        {" "}
                        Username <span className="astrick">*</span>
                      </label>
                      <input
                        value={formik.values.username}
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="username"
                        className="form-control mt-2"
                        readOnly={!editMode}
                        placeholder="Last name"
                      />
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
      overlay={<Tooltip id="button-tooltip" style={{color:"red"}}>
      Currently email field is not editable.
    </Tooltip>}
    >
      <input
                      readOnly={true}
                        placeholder="Email"
                        value={formik.values.email}
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="email"
                        
                        className="form-control mt-2 email_field"
                      />
    </OverlayTrigger>


                      {formik.touched.email && formik.errors.email ? (
                        <p className="error_message">{formik.errors.email}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label> Contact No</label>
                  <input
                    placeholder="Contact No"
                    value={formik.values.contactNo}
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="contactNo"
                    className="form-control mt-2"
                    readOnly={!editMode}
                  />
                </div>

                {/* address */}
                <div className="login_form">
                  <div className="form-group">
                    <label>
                      {jsondata.addressLine1} <span className="astrick">*</span>
                    </label>
                    <input
                      onChange={formik.handleChange}
                      placeholder={jsondata.addressLine1}
                      onBlur={formik.handleBlur}
                      type="text"
                      className="form-control"
                      name="addressLine1"
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      name="addressLine2"
                      className="form-control mt-1"
                      type="text"
                      placeholder={jsondata.addressLine2}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">
                      Country<span className="astrick">*</span>{" "}
                    </label>
                    <select
                      id="country"
                      name="country"
                      onChange={handleCountryChange} // Use the custom onChange handler
                      onBlur={formik.handleBlur}
                      value={formik.values.country}
                      className="form-control mt-1"
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
                          State<span className="astrick">*</span>{" "}
                        </label>
                        <select
                          id="state"
                          name="state"
                          onChange={handleStateChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.state}
                          className="form-control mt-1"
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
                        <label htmlFor="city">City</label>
                        <select
                          id="city"
                          name="city"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.city}
                          className="form-control mt-1"
                        >
                          <option value="">Select City</option>
                          {cities?.map((city, index) => (
                            <option key={index} value={city.isoCode}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/** End City Fields */}

                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="city">
                          County<span className="astrick">*</span>
                        </label>
                        <select
                          id="county"
                          name="county"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.county}
                          className="form-control mt-1"
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
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.pinCode}
                          name="pinCode"
                          className="form-control mt-1"
                          type="number"
                          placeholder={jsondata.pinCode}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <button className="cmn_btn_color btn_style">Update</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* chanage password */}

        <ChangePassword />
      </section>
    </>
  );
};

export default EditProfile;
