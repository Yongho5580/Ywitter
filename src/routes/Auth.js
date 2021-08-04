import React from "react";
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

/*
input 들의 value 에 state 값을 부여하고 onChange 이벤트를 통해 만약 해당 이벤트가 발생된 곳의 name이
email 이면 setEmail 을 통해 값을 변경하는 것. 이 행위가 곧 input 값을 변경시키는 것이다.
*/

const Auth = () => {
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
    <div className="Auth-Container">
      <div className="Auth-Container-Ywitter">Ywitter</div>
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className="Auth-Btns-Container">
        <button className="Auth-Btns" onClick={onSocialClick} name="google">
          <FontAwesomeIcon icon={faGoogle} />
          oogle로 로그인
        </button>
        <button className="Auth-Btns" onClick={onSocialClick} name="github">
          <FontAwesomeIcon icon={faGithub} /> Github으로 로그인
        </button>
      </div>
    </div>
  );
};

export default Auth;
