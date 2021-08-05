import React, { useEffect } from "react";
import AuthForm from "../components/AuthForm";
import { authService, firebaseInstance } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import "../css/Auth.css";
import "../css/App.css";
import Aos from "aos";
import "aos/dist/aos.css";

/*
input 들의 value 에 state 값을 부여하고 onChange 이벤트를 통해 만약 해당 이벤트가 발생된 곳의 name이
email 이면 setEmail 을 통해 값을 변경하는 것. 이 행위가 곧 input 값을 변경시키는 것이다.
*/

const Auth = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  });
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div className="authContainer">
      <div data-aos="zoom-in">
        <FontAwesomeIcon
          icon={faTwitter}
          color={"#04AAFF"}
          size="3x"
          style={{ marginBottom: 30, marginLeft: 20 }}
        />
      </div>
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
