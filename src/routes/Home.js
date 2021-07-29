import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";

const Home = () => {
  const [yweet, setYweet] = useState("");
  const [yweets, setYweets] = useState([]);

  const getYweets = async () => {
    const dbYweets = await dbService.collection("yweets").get();
    // dbYweets 는 yweets 컬렉션의 모든 필드를 가져오는 메소드이다.
    // 가져온 필드들을 forEach 로 인자들의 데이터를 가져오는 함수를 작성하면 필드의 데이터를 정상적으로 불러올 수 있다.
    dbYweets.forEach((doc) => {
      const yweetObject = {
        ...doc.data(),
        id: doc.id,
      };
      // 반복문을 돌면서 yweets state 값에 새로운 트윗을 계속 추가시킨다.
      setYweets((prev) => [yweetObject, ...prev]);
    });
  };
  // 초기 마운트시 실행되는 함수
  useEffect(() => {
    getYweets();
  }, []);
  // onSubmit 함수가 실행되면 yweets 컬랙션에 yweet, createdAt 필드를 생성하고
  // 그 값을 할당한다. 그리고 yweet 의 값을 빈 값으로 다시 만든다.
  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("yweets").add({
      yweet,
      createdAt: Date.now(),
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
        {yweets.map((yweet) => (
          <div key={yweet.id}>
            <h4>{yweet.yweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
