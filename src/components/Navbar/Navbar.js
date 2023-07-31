import React from "react";
import { getTokenCookie } from "../../Context/Cookies";
const Navbar = () => {
  const user = getTokenCookie();
  let name = "";
  let email = "";
  if (user) {
    const tokenPayload = JSON.parse(atob(user.split(".")[1]));
    name = tokenPayload.fullName;
    email = tokenPayload.emailId;
  }
  return (
    <nav className="navbar">
      <div className="logo">
        <div className="Details">
          <select id="sort">
            <option style={{ fontWeight: "bolder" }} value="name">
              Kratin healthcare
            </option>
            {user && <option value="type">{name}</option>}
            {user && <option value="type">{email}</option>}
          </select>
        </div>
      </div>
      <ul className="nav-links">
        <li>
          <a href="/">
            <span title="Home" className="icon-size">
              <i className="fa fa-home"></i>
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
