import React from "react";
import { Link } from "react-router-dom";
import "../css/Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../css/App.css";

const Navigation = ({ userObj }) => {
  return (
    <nav>
      <ul className="Navigation-Ul ">
        <li>
          <Link className="Link-toHome" to="/">
            <div className="twitter-logo">
              <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
            </div>

            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className="Link-toProfile">
            <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
