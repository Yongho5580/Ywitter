import React, { useState } from "react";
import { dbService } from "../fbase";

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
    <div>
      {/* editing 버튼을 누르면 다음의 form 이 나오게 되고 아니라면 일반적인 트윗이 나오게 함.*/}
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="수정할 트윗을 작성해주세요."
              onChange={onChange}
              value={newYweet}
              required
            />
            <input type="submit" value="수정하기"></input>
          </form>
          <button onClick={toggleEditing}>작성 취소</button>
        </>
      ) : (
        <>
          <h4>{yweetObj.text}</h4>
          <button onClick={toggleEditing}>수정</button>
          <button onClick={onDeleteClick}>삭제</button>
        </>
      )}
    </div>
  );
};

export default Yweet;
