import axios from "axios";
import React, { useEffect, useState } from "react";
import { getTokenCookie } from "../Context/Cookies";
import {
  showNotificationForError,
  showNotificationForSuccess,
} from "../components/Notifactions/Notify";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loader/Loading";
const UserProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const user = getTokenCookie();
  let userId = "";
  if (user) {
    const tokenPayload = JSON.parse(atob(user.split(".")[1]));
    userId = tokenPayload.userId; // Assign the value to userId
  }
  const [formData, setFormData] = useState({
    weight: "",
    age: "",
    address: "",
    type: "regular",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  //   for input empty check
  useEffect(() => {
    // Check if all the required fields are filled and update isFormValid state
    setIsFormValid(
      !!formData.weight &&
        !!formData.address &&
        !!formData.type &&
        !!formData.age
    );
  }, [formData]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    const numbersOnly =
      name === "age" || name === "weight"
        ? value.replace(/[^0-9]/g, "")
        : value;

    setFormData((prevData) => ({ ...prevData, [name]: numbersOnly }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Check if any of the required fields are empty
    if (!isFormValid) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    setErrorMessage("");

    // form submission
    try {
      const result = await axios.put(`/health/add-details/${userId}`, formData);
      if (result.data.status === true) {
        setIsLoading(false);
        showNotificationForSuccess(result.data.message);
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 2000);
        return;
      } else {
        setIsLoading(false);
        showNotificationForError(result.data.message);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      showNotificationForError("Internal Server Error !");
      return;
    }
  };

  return (
    <div className="User-Profile">
      <form className="user-profile-form" onSubmit={handleSubmit}>
        <div className="error-message">
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
        <div className="profile-form">
          <div className="user-profile-group">
            <label>Weight:</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              maxLength={3}
              placeholder="Enter Your Weight ."
            />
          </div>

          <div className="user-profile-group">
            <label>Age: </label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              maxLength={3}
              placeholder="Enter Your Age ."
            />
          </div>

          <div className="user-profile-group">
            <label>Address: </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Your Address ."
            />
          </div>

          <div className="user-profile-group">
            <label>Type: </label>
            <select
              name="type"
              value="regular"
              onChange={handleChange}
              disabled
            >
              <option value="regular">Regular</option>
            </select>
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <button
              className={
                isFormValid ? "Submit-btn" : "disabledButton  Submit-btn"
              }
              disabled={!isFormValid}
              type="submit"
            >
              Save
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
