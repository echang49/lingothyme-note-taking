import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import CreateRoom from "./components/CreateRoom";
import EnterRoom from "./components/EnterRoom";
import EditorView from "./components/editorView";
import AdminView from "./components/adminView";
import PDFView from "./components/pdfView";
import MainHall from "./components/mainHall";
import Signup from "./components/signup";
import Schedule from "./components/schedule";
import Academy from "./components/academy";
import Profile from "./components/profile";
import CreateMainHallRoom from "./components/createMainHallRoom";
import EditAboutMe from "./components/editAboutMe";
import EditProfile from "./components/editProfile";
import MainhallAdminView from "./components/mainHallAdminView";
import MainhallUserView from "./components/mainHallUserView";

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

          <Route exact path="/mainHall">
            <MainHall />
          </Route>

          <Route exact path="/mainHallRoomCreation"> 
            <CreateMainHallRoom />
          </Route>

          <Route exact path="/mainHall/admin/room">
            <MainhallAdminView />
          </Route>

          <Route path="/mainHall/room">
            <MainhallUserView />
          </Route>

          <Route exact path="/schedule">
            <Schedule />
          </Route>

          <Route exact path="/academy">
            <Academy />
          </Route>

          <Route exact path="/profile">
            <Profile />
          </Route>

          <Route exact path="/profile/editAboutMe"> 
            <EditAboutMe />
          </Route>

          <Route exact path="/profile/editProfile"> 
            <EditProfile />
          </Route>

          <Route exact path="/signup">
            <Signup />
          </Route>

          <Route path="/room">
            <EditorView />
          </Route>
          
          <Route path="/pdf">
            <PDFView />
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
