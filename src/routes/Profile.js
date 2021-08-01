import React, { useEffect, useState } from "react";
import { authService, dbService } from "../fbase";
import { useHistory } from "react-router-dom";
const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const history = useHistory();
  const onLogoutClick = () => {
    history.push("/"); // 로그아웃 버튼을 누르면 "/" URL 로 라우팅 하는 메소드
    authService.signOut();
  };
  useEffect(() => {
    const getMyYweets = async () => {
      // where 은 필터링 하는 메소드, yweets 컬렉션의 creatorId 필드와 userObj.uid 값이 == (같은) 것을 찾고 get 하는 것
      const yweets = await dbService
        .collection("yweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt")
        .get();
      console.log(yweets.docs.map((doc) => doc.data()));
    };
    getMyYweets();
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  return (
    <div className="Profile-Container">
      <form className="Profile-Form" onSubmit={onSubmit}>
        <input
          autoFocus
          onChange={onChange}
          value={newDisplayName}
          type="text"
          placeholder="Display name"
        />
        <input
          className="Profile-UpdateProfile-Btn"
          type="submit"
          value="Update Profile"
        />
      </form>
      <button onClick={onLogoutClick}>로그아웃</button>
    </div>
  );
};

export default Profile;
