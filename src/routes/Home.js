import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Yweet from "../components/Yweet";
import { dbService, storageService } from "../fbase";

const Home = ({ userObj }) => {
  const [yweet, setYweet] = useState("");
  const [yweets, setYweets] = useState([]);
  const [attachment, setAttachment] = useState("");
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
    let attachmentUrl = "";
    // 해당 트윗이 사진을 포함하고 있다면 다음의 과정을 통해 사진을 불러온다.
    if (attachment !== "") {
      // 1. 먼저 이미지 파일에 대한 출처 (reference) 를 만드는 과정
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      // 2. 해당 출처를 storageService 의 메소드인 putString을 통해 업로드한다.
      const response = await attachmentRef.putString(attachment, "data_url");
      // 3. 그리고 외부에서 사용할 수 있는 URL 값을 얻기 위해 다음의 메소드를 사용한다.
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const yweetObj = {
      text: yweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    // yweets 컬렉션의 필드는 text (글자), createdAt(언제 업로드 했는지), creatorId (누가 업로드 했는지)
    await dbService.collection("yweets").add(yweetObj);
    setYweet("");
    setAttachment("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setYweet(value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    // 파일을 읽는 메소드
    reader.readAsDataURL(theFile);
    // 파일을 모두 읽으면 finishedEvent 라는 인수를 받는다 그리고 currentTarget.result 값을 불러온다.
    // 이 result
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
  };
  const onClearAttachment = () => setAttachment("");

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
        {/* 사진을 추가하는 버튼은 type 을 file 로 하면된다. */}
        <input onChange={onFileChange} type="file" accept="image/*" />
        <input type="submit" value="Yweet" />
        {attachment && (
          <div>
            <img src={attachment} alt="preview" width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
