import React, { useState, useEffect } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";

function App() {
  // init 이 false 이면 AppRouter 를 hidden 시키기 위해서 추가한 state 값이다. 즉, useEffect 를 통해
  // 모든 마운팅이 끝나야 홈페이지를 보여주기 위함이다.
  const [init, setInit] = useState(false);
  //
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 사용자의 로그인 유무를 알려주는 이벤트 리스너 (계정 만들기, 로그인 등의 버튼을 누를 때도 트리거 됨)
    authService.onAuthStateChanged((user) => {
      if (user) {
        // when user is signed in
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Ywitter</footer>
    </>
  );
}

export default App;
