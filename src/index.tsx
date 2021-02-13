import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserContext, { defaultUser } from "./contexts/UserContext";
import TagsContext from "./contexts/TagsContext";
import checkLoggedInUser from "./helperFunctions/checkLoggedInUsers";

const Index = () => {
  const [userContext, setUserContext] = useState(defaultUser);
  const [tagsContext, setTagsContext] = useState([""]);

  useEffect(() => {
    checkLoggedInUser(setUserContext);
  }, []);
  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      <TagsContext.Provider value={{ tagsContext, setTagsContext }}>
        <App />
      </TagsContext.Provider>
    </UserContext.Provider>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
