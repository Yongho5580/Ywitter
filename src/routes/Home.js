import React, { useEffect, useState } from "react";
import Yweet from "../components/Yweet";
import { dbService } from "../fbase";

const Home = ({ userObj }) => {
  const [yweet, setYweet] = useState("");
  const [yweets, setYweets] = useState([]);

  // 초기 마운트시 실행되는 함수
  useEffect(() => {
    // onSnapShot 메소드는 데이터베이스의 변화를 실시간으로 알려주는 이벤트 리스너 (CRUD 모두)
    // 인자의 snapshot 에는 docs 프로퍼티가 있는데 그곳에 접근해서 다음과 같이 유저의 데이터를 받아올 수 있다.
    // 아래에서는 map 메소드를 사용했는데 forEach 같은 경우는 리렌더링이 많이 발생하게 된다. 하지만 map 은 덜 발생함.
    // 메소드의 문제가 아니라 이전에는 forEach 로 데이터를 계속해서 업데이트 했는데 이번 방식은 map 으로 한번에 배열을 정렬하고
    // 그 다음에 이 배열을 한번에 state 값으로 저장하기 때문임.
    dbService.collection("yweets").onSnapshot((snapshot) => {
      const yweetsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setYweets(yweetsArr);
    });
  }, []);
  // onSubmit 함수가 실행되면 yweets 컬랙션에 yweet, createdAt 필드를 생성하고
  // 그 값을 할당한다. 그리고 yweet 의 값을 빈 값으로 다시 만든다.
  const onSubmit = async (e) => {
    e.preventDefault();
    // yweets 컬렉션의 필드는 text (글자), createdAt(언제 업로드 했는지), creatorId (누가 업로드 했는지)
    await dbService.collection("yweets").add({
      text: yweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setYweet("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setYweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={yweet}
          onChange={onChange}
          type="text"
          placeholder="트윗을 작성해주세요"
          maxLength={120}
        />
        <input type="submit" value="Yweet" />
      </form>
      <div>
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
