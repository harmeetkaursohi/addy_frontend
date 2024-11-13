import Frame from "../../../../images/signupFrame.svg?react";
import addyads_img from "../../../../images/addylogo.png";
import { Link } from "react-router-dom";
import jsondata from "../../../../locales/data/initialdata.json";
import { validationSchemas } from "../../../../utils/commonUtils.js";
import { useFormik } from "formik";
import Button from "../../../common/components/Button";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Industries } from "../../../../utils/contantData";
import { useSignUpMutation } from "../../../../app/apis/authApi";

const UserInfo = ({ formData, setFormData, setShowTab }) => {
  const [_, signUpApi] = useSignUpMutation();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      industry: "",
      contactNo: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: validationSchemas.register,
    onSubmit: (values) => {
      setFormData({
        ...formData,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        industry: values.industry,
        contactNo: values.contactNo,
      });
      setShowTab(2);
    },
  });

  useEffect(() => {
    if (formData) {
      formik.setFieldValue("username", formData.username);
      formik.setFieldValue("email", formData.email);
      formik.setFieldValue("industry", formData.industry);
      formik.setFieldValue("contactNo", formData.contactNo);
      formik.setFieldValue("firstName", formData.firstName);
      formik.setFieldValue("lastName", formData.lastName);
    }
  }, [formData]);

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  return (
    <>
      <section>
        <div className="login_wrapper">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 ">
              <div className="addy_container bg_light_orange min-vh-100">
                <div className="login_outer">
                  <div className="reach_user_outer text-center">
                    <Frame  className=" w-100 mt-4" />
                    <h2 className="mt-3">{jsondata.connect_audience_title}</h2>
                    <p>{jsondata.connect_audience_desc}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="addy_container form_mainwrapper">
                <div className="addy_outer">
                  <div className="form_wrapper">
                    <div className="addy_img">
                      <div className="logo_outer">
                        <img src={addyads_img} height="90px" width="238px" />
                      </div>
                      <h2 className="text-center mt-0">
                        {jsondata.create_account}
                      </h2>
                      <p>{jsondata.enter_details_heading}</p>
                    </div>
                    <div className="login_form">
                      <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                          <label>
                            {jsondata.firstname} <span>*</span>{" "}
                          </label>

                          <input
                            name="firstName"
                            className="form-control mt-1"
                            type="text"
                            placeholder="First Name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.firstName}
                          />

                          {formik.touched.firstName &&
                          formik.errors.firstName ? (
                            <p className="error_message">
                              {formik.errors.firstName}
                            </p>
                          ) : null}
                        </div>
                        <div className="form-group">
                          <label>
                            {jsondata.lastname} <span>*</span>{" "}
                          </label>

                          <input
                            name="lastName"
                            className="form-control mt-1"
                            type="text"
                            placeholder="Last Name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.lastName}
                          />

                          {formik.touched.lastName && formik.errors.lastName ? (
                            <p className="error_message">
                              {formik.errors.lastName}
                            </p>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>
                            {jsondata.username} <span>*</span>
                          </label>

                          <input
                            name="username"
                            className="form-control mt-1"
                            type="text"
                            placeholder="Username"
                            onChange={(e) => {
                              formik.handleChange({
                                target: {
                                  name: e.target.name,
                                  value: e.target.value.replace(/\s/g, ""),
                                },
                              });
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                          />

                          {formik.touched.username && formik.errors.username ? (
                            <p className="error_message">
                              {formik.errors.username}
                            </p>
                          ) : null}
                        </div>

                        <div className="form-group">
                          <label>
                            {jsondata.email} <span>*</span>
                          </label>
                          <input
                            name="email"
                            className="form-control mt-1"
                            type="email"
                            placeholder="Email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                          />

                          {formik.touched.email && formik.errors.email ? (
                            <p className="error_message">
                              {formik.errors.email}
                            </p>
                          ) : null}
                        </div>

                        <div className="rememberPass_outer mt-2">
                          <div className="form-group">
                            <label htmlFor="country">{jsondata.industry}</label>
                            <select
                              name="industry"
                              className="form-select mt-1 cmn_select_box"
                              onChange={formik.handleChange} // Use the custom onChange handler
                              onBlur={formik.handleBlur}
                              value={formik.values.industry}
                            >
                              <option value="">
                                {jsondata.select_industry}
                              </option>
                              {Object.keys(Industries)?.map((key, index) => (
                                <option key={index} value={Industries[key]}>
                                  {Industries[key]}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>{jsondata.contactNo}</label>
                            <input
                              name="contactNo"
                              className="form-control mt-1"
                              type="number"
                              onWheel={(e) => {
                                e.target.blur();
                              }}
                              placeholder="Contact Number"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              onKeyDown={blockInvalidChar}
                              value={formik.values.contactNo}
                            />
                          </div>

                          <Button type={"Submit"} text={jsondata.next} />
                        </div>
                      </form>
                      <h3>
                        {jsondata.alreadyAccount}{" "}
                        <Link to={signUpApi?.isLoading ? "/sign-up" : "/"}>
                          <span className="sign_up">{jsondata.login}</span>
                        </Link>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default UserInfo;
