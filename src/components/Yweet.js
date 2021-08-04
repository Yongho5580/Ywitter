import React, { useState } from "react";
import { dbService, storageService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "../css/Yweet.css";
import "../css/App.css";

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
      await storageService.refFromURL(yweetObj.attachmentUrl).delete();
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

  return (
    <div className="Yweet">
      {/* editing 버튼을 누르면 다음의 form 이 나오게 되고 아니라면 일반적인 트윗이 나오게 하는데
          해당 트윗의 작성자가 아닐경우 다음의 form 을 보여주지 않는다.*/}
      {editing ? (
        <>
          {isOwner && (
            <>
              <form className="container yweetEdit" onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="수정할 트윗을 작성해주세요."
                  onChange={onChange}
                  value={newYweet}
                  required
                  className="formInput"
                />
                <input
                  className="formBtn"
                  type="submit"
                  value="수정하기"
                ></input>
              </form>
              <span className="formBtn cancelBtn" onClick={toggleEditing}>
                취소
              </span>
            </>
          )}
        </>
      ) : (
        <>
          {/* 그리고 애초에 수정 혹은 삭제 버튼을 작성자가 아니면 볼 수 없게 해놓는다.*/}
          <h4>{yweetObj.text}</h4>
          {yweetObj.attachmentUrl && (
            <img
              alt="preview"
              src={yweetObj.attachmentUrl}
              width="50px"
              height="50px"
            />
          )}
          {isOwner && (
            <div className="Yweet-Actions">
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Yweet;
