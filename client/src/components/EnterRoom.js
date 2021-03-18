import { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";
import Logo from "../assets/main-logo.png";

function EnterRoom() {
  const textInput = useRef(null);
  const [ bool, setBool ] = useState(true);
  const [ url, setURL ] = useState("/");


  function handleClick() {
    let code = textInput.current.value;
    axios.post("/api/auth/enterRoom", {code})
    .then((res) => {
      if(res.data[0]) {
        if(res.data[1]) {
          setURL("/admin/room?id=".concat(code));
        }
        else {
          setURL("/room?id=".concat(code));
        }
        setBool(false);
      }
      else {
        alert("Incorrect code. Ensure you have the proper room code.");
      }
    })
    .catch((err) => {
      alert(err);
    });
  }

  return (
    <div>
      {
        bool ?
          <div className="enterRoom center">
            <img src={Logo} alt="LingoThyme logo" height="250px"/>
            <div className="input">
              <label>Room Code:</label>
              <input type="text" ref={textInput} />
              <div className="buttons">
                <button className="primary-button" onClick={() => handleClick()} >ENTER</button>
                <Link className="secondary-button" to="/admin/newRoom">CREATE ROOM</Link>
              </div>
            </div>
          </div>
        :
          <Redirect push to={url} />
      }
    </div>

    );
  }
  
  export default EnterRoom;