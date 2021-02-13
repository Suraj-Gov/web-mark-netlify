import React, { useContext } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import Login from "../components/Login";
import WebMarks from "../components/WebMarks";
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  const { userContext } = useContext(UserContext);
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
