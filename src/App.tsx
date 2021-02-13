import "./styles/globals.css";
import { Router, Route, Switch } from "react-router-dom";
import Landing from "./pages/Landing";
import NewMark from "./pages/NewMark";
import history from "./history";

export default function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/add-mark" exact component={NewMark} />
        <Route path="/" render={() => <h1>404: This path doesn't exist</h1>} />
      </Switch>
    </Router>
  );
}
