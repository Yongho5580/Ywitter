import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../css/App.css";
import "../css/YweetFactory.css";

const YweetFactory = ({ userObj }) => {
  const [yweet, setYweet] = useState("");
  const [attachment, setAttachment] = useState("");
  // onSubmit 함수가 실행되면 yweets 컬랙션에 yweet, createdAt 필드를 생성하고
  // 그 값을 할당한다. 그리고 yweet 의 값을 빈 값으로 다시 만든다.
  const onSubmit = async (e) => {
    if (yweet === "") {
      const ok = window.confirm("트윗을 작성해주세요");
      if (ok) {
        return;
      } else {
        return;
      }
    }
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
      displayName: userObj.displayName,
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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={yweet}
          onChange={onChange}
          type="text"
          placeholder="오늘의 이슈는 무엇인가요?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>사진 추가하기</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default YweetFactory;
