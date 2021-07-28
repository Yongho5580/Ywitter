import React from "react";
import { authService } from "../fbase";
import { useHistory } from "react-router-dom";
const Profile = () => {
  const history = useHistory();
  const onLogoutClick = () => {
    history.push("/"); // 로그아웃 버튼을 누르면 "/" URL 로 라우팅 하는 메소드
    authService.signOut();
  };
  return (
    <>
      <button onClick={onLogoutClick}>로그아웃</button>
    </>
  );
};

export default Profile;
