// components/MedicineForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  showNotificationForError,
  showNotificationForSuccess,
} from "../components/Notifactions/Notify";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loader/Loading";

const MedicineForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    medicinName: "",
    medicinType: "",
    medicinDose: "",
    medicinReminderHours: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  //   for input empty check
  useEffect(() => {
    // Check if all the required fields are filled and update isFormValid state
    setIsFormValid(
      !!formData.medicinDose &&
        !!formData.medicinName &&
        !!formData.medicinReminderHours &&
        !!formData.medicinType
    );
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numbersOnly =
      name === "medicinDose" || name === "medicinReminderHours"
        ? value.replace(/[^0-9]/g, "")
        : value;
    setFormData((prevData) => ({ ...prevData, [name]: numbersOnly }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!isFormValid) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    setErrorMessage("");
    try {
      const result = await axios.post("/medicin/add-new", formData);
      if (result.data.status === true) {
        setIsLoading(false);
        showNotificationForSuccess(result.data.message);
        setTimeout(() => {
          navigate("/medicin-lists");
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
    <div className="Medicin_Page">
      <div className="medicine-form-container">
        <h2>Add Medicine</h2>
        <form className="medicine-form" onSubmit={handleSubmit}>
          <div className="error-message">
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>
          <label htmlFor="name">Medicine Name:</label>
          <input
            type="text"
            id="name"
            name="medicinName"
            value={formData.medicinName}
            onChange={handleChange}
            required
            placeholder="Enter Medicin Name ."
          />

          <label htmlFor="type">Medicine Type:</label>
          <select
            id="type"
            name="medicinType"
            value={formData.medicinType}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="pills">Pills</option>
            <option value="tablet">Tablet</option>
            <option value="syringe">Syringe</option>
            <option value="syrup">Syrup</option>
          </select>

          <label htmlFor="dose">Dose (in mg):</label>
          <input
            type="text"
            id="dose"
            name="medicinDose"
            value={formData.medicinDose}
            onChange={handleChange}
            required
            placeholder="Enter Medicin Dose ."
          />

          <label htmlFor="reminderHours">Reminder After (in hours):</label>
          <input
            type="text"
            id="reminderHours"
            name="medicinReminderHours"
            value={formData.medicinReminderHours}
            onChange={handleChange}
            required
            placeholder="Enter Reminder Hours ."
          />
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
              Add Medicine
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MedicineForm;
