import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import CreateRoom from "./components/CreateRoom";
import EnterRoom from "./components/EnterRoom";
import EditorView from "./components/editorView";
import AdminView from "./components/adminView";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/admin/newRoom">
            <CreateRoom />
          </Route>
          <Route exact path="/admin/room">
            <AdminView />
          </Route>
          <Route path="/room">
            <EditorView />
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
