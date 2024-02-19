import React, { useEffect, useState } from "react";
import  jsondata  from "../../locales/data/initialdata.json";
import { useFormik } from "formik";
import { validationSchemas } from "../../utils/commonUtils";
import {Country, State, City} from 'country-state-city';

const EditAddress = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    formik.setFieldValue('state', selectedState);
    const state = State.getAllStates().find(state => state.name === selectedState);
    const cities = City.getCitiesOfState(state.countryCode, state.isoCode);
    setCities(cities);
}


const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    formik.setFieldValue('country', selectedCountry);
    const country = Country.getAllCountries().find(state => state.name === selectedCountry);
    setStates(State.getStatesOfCountry(country.isoCode));
};

  const formik = useFormik({
    initialValues: {
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
      county: "",
      city: "",
      pinCode: "",
    },
    validationSchema: validationSchemas.address,
    onSubmit: (values) => {
      let addressObj = {
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        country: values.country,
        state: values.state,
        county: values.country,
        city: values.city,
        pinCode: values.pinCode,
      };
    },
  });
  return (
    <div className="change_address_outer editprofile_outer">
      <div className="login_form">
        <form>
          <div className="form-group">
            <label>
              {jsondata.addressLine1} <span className="astrick">*</span>
            </label>
            <input onChange={formik.handleChange} placeholder=  {jsondata.addressLine1}  onBlur={formik.handleBlur} type="text" className="form-control" name="addressLine1" />
            {formik.touched.addressLine1 && formik.errors.addressLine1 ? (
                                                    <p className="error_message">{formik.errors.addressLine1}</p>
              ) : null}
          </div>

          <div className="form-group">
            <label>{jsondata.addressLine2}</label>
            <input onChange={formik.handleChange} onBlur={formik.handleBlur}
              name="addressLine2"
              className="form-control mt-1"
              type="text"
              placeholder={jsondata.addressLine2}
            />
            
          </div>

          <div className="form-group">
            <label htmlFor="country">
              Country<span  className="astrick">*</span>{" "}
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

                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
                                                        <label htmlFor="state">State<span className="astrick">*</span> </label>
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
                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
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


                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
                                                        <label htmlFor="city">County<span className="astrick">*</span></label>
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
                                                            <p className="error_message">{formik.errors.county}</p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className='col-lg-6'>
                                                    <div className='form-group'>
                                                        <label>{jsondata.pinCode}</label>
                                                        <input onChange={formik.handleChange}
                                                               onBlur={formik.handleBlur}
                                                               value={formik.values.pinCode} name="pinCode"
                                                               className="form-control mt-1" type='number'
                                                               placeholder={jsondata.pinCode}/>
                                                    </div>
                                                </div>

                                            </div>

          <button className="cmn_btn_color btn_style">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditAddress;
