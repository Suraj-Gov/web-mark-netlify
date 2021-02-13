import { createContext } from "react";
import { Dispatch, SetStateAction } from "react";
import "firebase/auth";

export type UserContextType = {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type userContextState = {
  userContext: UserContextType;
  setUserContext: Dispatch<SetStateAction<UserContextType>>;
};

export const defaultUser: UserContextType = {
  displayName: "",
  email: "",
  photoURL: "",
  uid: "",
};

// @ts-ignore
const UserContext = createContext<userContextState>(null);

export default UserContext;
