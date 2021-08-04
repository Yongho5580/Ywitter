import React, { useEffect, useState } from "react";
import Yweet from "../components/Yweet";
import YweetFactory from "../components/YweetFactory";
import { dbService } from "../fbase";
import "../css/App.css";

const Home = ({ userObj }) => {
  const [yweets, setYweets] = useState([]);
  // 초기 마운트시 실행되는 함수
  useEffect(() => {
    // onSnapShot 메소드는 데이터베이스의 변화를 실시간으로 알려주는 이벤트 리스너 (CRUD 모두)
    // 인자의 snapshot 에는 docs 프로퍼티가 있는데 그곳에 접근해서 다음과 같이 유저의 데이터를 받아올 수 있다.
    // 아래에서는 map 메소드를 사용했는데 forEach 같은 경우는 리렌더링이 많이 발생하게 된다. 하지만 map 은 덜 발생함.
    // 메소드의 문제가 아니라 이전에는 forEach 로 데이터를 계속해서 업데이트 했는데 이번 방식은 map 으로 한번에 배열을 정렬하고
    // 그 다음에 이 배열을 한번에 state 값으로 저장하기 때문임.
    const getData = dbService.collection("yweets").onSnapshot((snapshot) => {
      const yweetsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setYweets(yweetsArr);
    });
    return () => getData();
  }, []);

  return (
    <div className="container">
      <YweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {/* 우리가 임의로 부여한 yweet의 creatorId와 userObj의 uid의 값이 일치하면 동일 유저임으로 트윗 추가, 삭제 버튼을 부여할 수 있게 해주는 프로퍼티*/}
        {yweets.map((yweet) => (
          <Yweet
            key={yweet.id}
            yweetObj={yweet}
            isOwner={yweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
