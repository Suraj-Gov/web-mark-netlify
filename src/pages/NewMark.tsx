import React, { useContext, useState } from "react";
import Tags from "../components/Tags";
import UserContext from "../contexts/UserContext";
import styled from "styled-components";
import Header from "../components/Header";
import Button from "../components/Button";
import TagsContext from "../contexts/TagsContext";
import firebase from "../constants/firebase";
import "firebase/firestore";
import axios from "axios";
import history from "../history";
import { __prod__ } from "../constants/constants";

const db = firebase.firestore();

const Input = styled.input`
  font-size: 1.5rem;
  padding: 0.8rem;
  width: 40vw;
  border-radius: 5px;
  background: #d7d7d7;
  border: none;
  outline: none;
  @media only screen and (max-width: 800px) {
    width: 90vw;
  }
`;

const InputContainer = styled.div`
  padding: 2rem;
  @media only screen and (max-width: 800px) {
    padding: 0;
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export default function NewMark() {
  const { userContext } = useContext(UserContext);
  const { tagsContext } = useContext(TagsContext);
  const [url, setUrl] = useState("");

  const addMark = async (
    e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    let properUrl = url;
    if (url.slice(0, 7) !== "http://" && url.slice(0, 8) !== "https://") {
      properUrl = "http://" + url;
      setUrl(properUrl);
    }
    // @ts-ignore
    e.target.disabled = true;
    // @ts-ignore
    e.target.innerText = "Adding";
    // checking for existing webmark
    const existingMark = await db
      .collection("webmarks")
      .where("url", "==", properUrl)
      .get();
    if (existingMark.empty) {
      axios.post(
        __prod__
          ? "https://web-mark.herokuapp.com/generate-screenshot"
          : "http://localhost:3001/generate-screenshot",
        {
          pageUrl: properUrl,
          userId: userContext.uid,
        }
      );
      const newMark = {
        userId: userContext.uid,
        url: properUrl,
        tags: tagsContext.filter((t) => t.length > 0),
        pageTitle: "-",
        imageUrl: "-",
        color: "-",
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      };
      try {
        const addedMark = await db.collection("webmarks").add(newMark);
        history.push("/");
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("Mark already exists");
    }
    // @ts-ignore
    e.target.innerText = "Add";
    // @ts-ignore
    e.target.disabled = false;
  };

  return (
    <>
      {userContext.uid === "" ? (
        <h1>You need to be logged in</h1>
      ) : (
        <>
          <Header>
            <Button buttonText="Add" onClickHandler={(e) => addMark(e)} />
          </Header>
          <InputContainer>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder="Enter website URL"
            />
            <div>
              <Tags />
            </div>
          </InputContainer>
        </>
      )}
    </>
  );
}
