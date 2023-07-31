import React from "react";
import AuthForm from "../components/Form/Forms";
import axios from "axios";
import {
  showNotificationForError,
  showNotificationForSuccess,
} from "../components/Notifactions/Notify";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();
  const handleSignupSubmit = async (formData) => {
    try {
      const result = await axios.post("/user/create_new", formData);
      if (result.data.status === true) {
        showNotificationForSuccess(result.data.message);
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 2000);
      } else {
        showNotificationForError(result.data.message);
        return;
      }
    } catch (error) {
      showNotificationForError("Internal Server Error !");
      return;
    }
  };

  return (
    <div>
      <AuthForm
        formTitle="Sign Up"
        buttonText="Sign Up"
        onSubmit={handleSignupSubmit}
      />
    </div>
  );
};

export default SignUp;
