import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTokenCookie } from "./Context/Cookies";
import Login from "./Pages/LoginPage";
import SignUp from "./Pages/SignupPage";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Pages/HomePage";
import axios from "axios";
import {
  showNotificationForOffline,
  showNotificationForOnline,
} from "./components/Notifactions/Notify";
import { useEffect } from "react";
import UserProfileForm from "./Pages/UserUpdation";
import MedicineForm from "./Pages/MedicinsForm";
import Footer from "./components/Navbar/Footer";
import MedicinsList from "./Pages/MedicinsList";
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
function App() {
  const user = getTokenCookie();
  // Internet checking
  useEffect(() => {
    const notifyNoInternet = () => {
      showNotificationForOffline();
    };
    const notifyConnectInternet = () => {
      showNotificationForOnline();
    };
    window.addEventListener("offline", notifyNoInternet);
    window.addEventListener("online", notifyConnectInternet);
    return () => {
      window.removeEventListener("offline", notifyNoInternet);
      window.removeEventListener("online", notifyConnectInternet);
    };
  }, []);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="App">
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="/signup" element={user ? <Home /> : <SignUp />} />
            <Route path="/login" element={user ? <Home /> : <Login />} />
            <Route
              path="/profile-update"
              element={user ? <UserProfileForm /> : <Login />}
            />
            <Route
              path="/add-medicin"
              element={user ? <MedicineForm /> : <Login />}
            />
            <Route
              path="/medicin-lists"
              element={user ? <MedicinsList /> : <Login />}
            />
          </Routes>
        </BrowserRouter>
        <Footer />
      </div>
    </>
  );
}

export default App;
