import React, { useState } from "react";
import { authService } from "../fbase";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (e) => {
    // 이벤트의 타겟에서 name 과 value 를 추출한다.
    const {
      target: { name, value },
    } = e;
    // 만약 발생된 이벤트의 name 이 email 이면 setEmail 의 state 값을 변경시킨다.
    if (name === "email") {
      setEmail(value);
      // 패스워드의 경우
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e) => {
    // submit 할 때 기본적으로 발생되는 새로 고침 현상을 막아주는 것
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        // 계정 만들기 + 로그인 기능
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        // 바로 로그인
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "계정 만들기" : "로그인"} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "로그인" : "계정 만들기"}
      </span>
    </>
  );
};

export default AuthForm;
