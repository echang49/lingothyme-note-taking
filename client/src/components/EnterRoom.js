import { useRef } from "react";
import "../styles/style.css";
import Logo from "../assets/main-logo.png";

function EnterRoom() {
  const textInput = useRef(null);

  function handleClick() {
    let code = textInput.current.value;
    alert(code);
  }

  return (
    <div className="enterRoom center">
      <img src={Logo} alt="LingoThyme logo" height="250px"/>
      <div className="input">
        <label>Room Code:</label>
        <input type="text" ref={textInput} />
        <div className="buttons">
          <button className="primary-button" onClick={() => handleClick()} >ENTER</button>
          <a className="secondary-button" href="/admin/newRoom">CREATE ROOM</a>
        </div>
      </div>
    </div>
    );
  }
  
  export default EnterRoom;