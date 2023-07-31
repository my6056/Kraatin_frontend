// importing
import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/Form/Forms";
import axios from "axios";
import Cookies from "js-cookie";
import {
  showNotificationForError,
  showNotificationForSuccess,
} from "../components/Notifactions/Notify";
import Loading from "../components/Loader/Loading";

// function component
const Login = () => {
  const navigate = useNavigate();

  // handle login
  const handleLoginSubmit = async (formData) => {
    try {
      const result = await axios.post("/user/login", formData);
      if (result.data.status === true) {
        const token = result.data.token;
        Cookies.set("token", token, { expires: 7 });
        showNotificationForSuccess(result.data.message);
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 2000);
        return;
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
        formTitle="Login"
        buttonText="Login"
        onSubmit={handleLoginSubmit}
      />
    </div>
  );
};
export default Login;
