// components/MedicinsList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  showNotificationForError,
  showNotificationForSuccess,
} from "../components/Notifactions/Notify";

const MedicinsList = () => {
  const [medicinsList, setMedicinsList] = useState([]);
  const [alarmSet, setAlarmSet] = useState(null);
  const [sortOption, setSortOption] = useState("recent");
  useEffect(() => {
    fetchMedicins();
  }, []);
  // Clear the alarm when the component unmounts or the alarmSet state changes
  useEffect(() => {
    return () => clearTimeout(alarmSet);
  }, [alarmSet]);

  const fetchMedicins = async () => {
    try {
      const response = await axios.get("/medicin/get-all");
      setMedicinsList(response.data.medicins);
    } catch (error) {
      showNotificationForError("Internal Server Error !");
      return;
    }
  };

  const setAlarmNotification = (medicin) => {
    showNotificationForSuccess(
      `Alarm set for ${medicin.medicinName} (${medicin.medicinType})!`
    );
    const alarm = setTimeout(() => {
      const notificationPermission = Notification.permission;

      if (notificationPermission === "granted") {
        const notification = new Notification(
          `Time to take ${medicin.medicinName} (${medicin.medicinType})!`,
          {
            body: `Dose: ${medicin.medicinDose} mg`,
          }
        );

        notification.onclick = () => {
          console.log("Notification clicked!");
        };
      } else if (notificationPermission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            setAlarmNotification(medicin);
          }
        });
      }
    }, medicin.medicinReminderHours * 60 * 60 * 1000);

    setAlarmSet(alarm);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/medicin/delete/${id}`);
      if (response.data.status === true) {
        setMedicinsList((prevList) =>
          prevList.filter((medicin) => medicin.id !== id)
        );
        showNotificationForSuccess(response.data.message);
        window.location.reload();
        return;
      } else {
        showNotificationForSuccess(response.data.message);
        return;
      }
    } catch (error) {
      showNotificationForSuccess(error.message);
      return;
    }
  };
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  const sortMedicins = () => {
    let sortedMedicins = [...medicinsList];

    switch (sortOption) {
      case "name":
        sortedMedicins.sort((a, b) =>
          a.medicinName.localeCompare(b.medicinName)
        );
        break;
      case "type":
        sortedMedicins.sort((a, b) =>
          a.medicinType.localeCompare(b.medicinType)
        );
        break;
      case "dose":
        sortedMedicins.sort((a, b) => a.medicinDose - b.medicinDose);
        break;
      case "reminder":
        sortedMedicins.sort(
          (a, b) => a.medicinReminderHours - b.medicinReminderHours
        );
        break;
      case "recent":
        sortedMedicins.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp (recently added first)
        break;
      default:
        break;
    }

    setMedicinsList(sortedMedicins);
  };
  useEffect(() => {
    sortMedicins();
  }, [sortOption]);

  return (
    <div className="MedicinsList_Page">
      <h2>Medicins List</h2>
      <div className="sort-container">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="name">Name</option>
          <option value="type">Type</option>
          <option value="dose">Dose</option>
          <option value="reminder">Reminder Hours</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>
      <div className="medicins-list-container">
        {/* <ul>
          {medicinsList.map((medicin) => (
            <li key={medicin._id}>
              <div>
                <h3>{medicin.medicinName}</h3>
                <p>Type: {medicin.medicinType}</p>
                <p>Dose: {medicin.medicinDose} mg</p>
                <p>Reminder After: {medicin.medicinReminderHours} hours</p>
                <div className="buuttons">
                  <button
                    className="setAlarm"
                    onClick={() => setAlarmNotification(medicin)}
                  >
                    Set Alarm
                  </button>
                  <button
                    className="delete-medicin"
                    onClick={() => handleDelete(medicin._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul> */}
        <div>
          {medicinsList.length === 0 ? (
            <p>No medicine available</p>
          ) : (
            <ul>
              {medicinsList.map((medicin) => (
                <li key={medicin._id}>
                  <div>
                    <h3>{medicin.medicinName}</h3>
                    <p>Type: {medicin.medicinType}</p>
                    <p>Dose: {medicin.medicinDose} mg</p>
                    <p>Reminder After: {medicin.medicinReminderHours} hours</p>
                    <div className="buuttons">
                      <button
                        className="setAlarm"
                        onClick={() => setAlarmNotification(medicin)}
                      >
                        Set Alarm
                      </button>
                      <button
                        className="delete-medicin"
                        onClick={() => handleDelete(medicin._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicinsList;
