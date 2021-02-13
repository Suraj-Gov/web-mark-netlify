import { useContext } from "react";
import UserContext, { defaultUser } from "../contexts/UserContext";
import firebase from "../constants/firebase"

export default function Logout() {
  const { setUserContext } = useContext(UserContext);
  const signOut = async () => {
    setUserContext(defaultUser);
    await firebase.auth().signOut();
  };

  return <button onClick={signOut}>Log out</button>;
}