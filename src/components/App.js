import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";

function App() {
  // init 이 false 이면 AppRouter 를 hidden 시키기 위해서 추가한 state 값이다. 즉, useEffect 를 통해
  // 모든 마운팅이 끝나야 홈페이지를 보여주기 위함이다.
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // 사용자의 로그인 유무를 알려주는 이벤트 리스너 (계정 만들기, 로그인 등의 버튼을 누를 때도 트리거 됨)
    authService.onAuthStateChanged((user) => {
      if (user) {
        // when user is signed in
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  // refreshUser 함수는 Profile 에서 닉네임을 변경했을 때 작동하기 위한 함수
  const refreshUser = () => {
    const user = authService.currentUser;
    console.log(user);
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {/*userObj 가 있어야 로그인되게 하는 기능 */}
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
