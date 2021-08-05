import React, { useEffect, useState } from "react";
import { authService } from "../fbase";
import { useHistory } from "react-router-dom";
import "../css/Profile.css";
import "../css/App.css";
import Aos from "aos";
import "aos/dist/aos.css";
const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const history = useHistory();
  const onLogoutClick = () => {
    const confirm = window.confirm("로그아웃 하시겠습니까?");
    if (confirm) {
      history.push("/"); // 로그아웃 버튼을 누르면 "/" URL 로 라우팅 하는 메소드
      authService.signOut();
    } else {
      return;
    }
  };
  useEffect(() => {
    /*
    const getMyYweets = async () => {
      // where 은 필터링 하는 메소드, yweets 컬렉션의 creatorId 필드와 userObj.uid 값이 == (같은) 것을 찾고 get 하는 것
      const yweets = await dbService
        .collection("yweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt")
        .get();
    };
    getMyYweets();
    */
    Aos.init();
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = window.confirm("프로필을 업데이트 하시겠습니까?");
    if (userObj.displayName !== newDisplayName && newDisplayName !== "") {
      if (ok) {
        await userObj.updateProfile({
          displayName: newDisplayName,
        });
        window.confirm("업데이트를 완료했습니다.");
      } else {
        return;
      }
      refreshUser();
    } else {
      window.confirm("닉네임이 공백이거나 이전 프로필과 동일합니다.");
    }
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  return (
    <div data-aos="fade-up" className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="닉네임을 입력하세요"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="프로필 업데이트"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogoutClick}>
        로그아웃
      </span>
    </div>
  );
};

export default Profile;
