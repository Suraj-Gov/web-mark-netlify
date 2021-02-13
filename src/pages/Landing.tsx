import React, { useContext, useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Login from "../components/Login";
import WebMarks from "../components/WebMarks";
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";
import axios from "axios";

const Landing: React.FC = () => {
  const { userContext } = useContext(UserContext);

  // @ts-ignore
  useEffect(async () => {
    await axios.get("https://web-mark.herokuapp.com/");
  }, []);

  return (
    <>
      <Header>
        <>
          <Login />
          {/* TODO ADDMARK BUTTON */}
          {userContext.uid !== "" && (
            <Link to="/add-mark">
              <Button buttonText="Add Mark" />
            </Link>
          )}
        </>
      </Header>
      <WebMarks />

      {/* <Logout /> */}
    </>
  );
};

export default Landing;
