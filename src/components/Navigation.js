import React from "react";
import { Link } from "react-router-dom";
import "../css/Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => {
  console.log(userObj);
  return (
    <nav>
      <ul className="Navigation-Ul">
        <li>
          <Link className="Link-toHome" to="/">
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
          </Link>
        </li>
        <li>
          <Link className="Link-toProfile" to="/profile">
            <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
            <span>
              {userObj.displayName
                ? `${userObj.displayName}의 Profile`
                : "Profile"}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
