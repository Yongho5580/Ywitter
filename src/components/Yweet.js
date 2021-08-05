import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "../css/Yweet.css";
import "../css/App.css";
import Aos from "aos";
import "aos/dist/aos.css";

const Yweet = ({ yweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newYweet, setNewYweet] = useState(yweetObj.text);
  const onDeleteClick = async () => {
    // window.confirm 메소드는 특정 버튼을 누를시 알림창으로 뜨게 하는 boolean 타입 메소드이다.
    // 확인을 누르면 true, 취소를 누르면 false
    const ok = window.confirm("트윗을 삭제하시겠습니까?");
    if (ok) {
      // 데이터를 삭제하려면 해당 데이터의 id 값이 필요하다. 그리고 삭제하는 방법은 밑의 방법과 같다.
      await dbService.doc(`yweets/${yweetObj.id}`).delete();
      // 해당 URL의 원본 주소를 알려주는 메소드. 그리고 찾은 주소를 통해 파일 삭제
      await storageService.ref(yweetObj.attachmentUrl).delete();
    }
  };
  // 수정 버튼을 누르면 state 값이 true 로 바꿔줌
  const toggleEditing = () => setEditing((prev) => !prev);
  // onSubmit 함수가 실행되면 update 메소드를 통해 text 를 newYweet 상태의 텍스트로 업데이트 시킨다음
  // setEditing 값을 false 로 바꿔줘서 원래 div가 나오도록 한다.
  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.doc(`yweets/${yweetObj.id}`).update({
      text: newYweet,
    });
    setEditing(false);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewYweet(value);
  };

  useEffect(() => {
    Aos.init({ duration: 1000 });
  });

  return (
    <div data-aos="fade-up" className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="수정하기"
              value={newYweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="트윗 수정하기" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            취소
          </span>
        </>
      ) : (
        <>
          <div>{yweetObj.displayName}</div>
          <h4>{yweetObj.text}</h4>
          {yweetObj.attachmentUrl && (
            <img alt="attachment" src={yweetObj.attachmentUrl} />
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Yweet;
