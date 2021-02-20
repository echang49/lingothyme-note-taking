import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import CreateRoom from "./components/CreateRoom";
import EnterRoom from "./components/EnterRoom";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/admin/newRoom">
            <CreateRoom />
          </Route>
          <Route path="/">
            <EnterRoom />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
