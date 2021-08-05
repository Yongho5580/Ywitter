import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "../css/App.css";
import Aos from "aos";
import "aos/dist/aos.css";

const Navigation = ({ userObj }) => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  });
  return (
    <nav>
      <ul className="Navigation-Ul ">
        <li data-aos="fade-right">
          <Link className="Link-toHome" to="/">
            <div className="twitter-logo">
              <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
            </div>

            <span>Home</span>
          </Link>
        </li>
        <li data-aos="fade-left">
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
