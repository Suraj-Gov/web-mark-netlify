import firebase from "../constants/firebase"
import "firebase/auth"
import "firebase/firestore"
import UserContext, {defaultUser} from "../contexts/UserContext";
import {useContext, useEffect, useState} from "react"
import Button from "./Button";

const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();

export default function Login() {
  const { userContext, setUserContext } = useContext(UserContext);

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then(res => res.user !== null && findOrCreateUser(res.user))
      .catch((error) => alert(error.message));
  }, []);

  // it's saying that the function should return a promise, but I don't require it...
  // @ts-ignore
  const findOrCreateUser = async (user: any):void => {
    const users = db.collection("users");
    const findUser = await users.where("uid", "==", user.uid).get();
    console.log("found user");
    if (findUser.docs.length === 0) {
      const newUser = await users.add({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      });
      console.log("created user");
    }
    setUserContext({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
    });
  };

  const signIn = () => {
    firebase.auth().signInWithRedirect(provider);
  };

  return (
    <>
      {!userContext.uid && (
        <Button buttonText={"Login"} onClickHandler={signIn} />
      )}
    </>
  );
}
