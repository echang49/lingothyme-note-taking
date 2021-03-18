import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";
import Logo from "../assets/main-logo.png";

function CreateRoom() {
  const userInput = useRef(null);
  const passInput = useRef(null);

  const emailInput = useRef(null);
  const numberInput = useRef(null);
  const numberValue = useRef(null);
  const questionInput = useRef(null);
  const dateInput = useRef(null);
  const [bool, setBool] = useState(false);

  function handleFirstClick() {
    let user = userInput.current.value;
    let pass = passInput.current.value;
    if(user === "LingoThyme" && pass === "IrisNanEdward") {
      setBool(true);
    }
    else {
      alert("Wrong Credentials. If you're interested in using this service to create rooms, please email our lead developer at echang49@uwo.ca");
    }
  }

  function handleClick() {
    let emailBool = emailIsValid(emailInput.current.value);
    if(emailBool) {
      if(questionInput.current.value !== "") {
        let date = new Date(dateInput.current.value);
        date.setDate(date.getDate() + 1); //add 1 day to the date of discussion for leeway
        let data = {
          email: emailInput.current.value,
          number: numberInput.current.value,
          question: questionInput.current.value,
          date: date
        }
        axios.post('/api/auth/createRoom', data)
          .then((res) => {
            let { publicKey, privateKey } = res.data;
            alert("Your public key is: " + publicKey + ". \nYour private key is: " + privateKey + ". \n\nYour public key is for the participants of the room and the private key is for you." +
            " To use the private key on the home page, enter the code as \"" + publicKey + "-" + privateKey + "\". \n\n NOTE: YOUR ROOM EXPIRES " + (date.getMonth() + 1) + "-" + (date.getDate() + 1) + "-" + date.getFullYear() + " AT MIDNIGHT EST/EDT.");
          })
          .catch((err) => {
            alert(err);
        })
      }
      else {
        alert("Please enter a question.");
      }
    }
    else {
      alert("Please enter a valid email address.");
    }
  }

  //utility function to test validity of email
  function emailIsValid (email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  function changeNumber() {
    let number = numberInput.current.value;
    numberValue.current.innerHTML = number;
  }

  function changeDate() {
    let date = dateInput.current.valueAsDate;
    let d = new Date();
    d.setMonth(d.getMonth() + 1);
    if(date > d) {
      alert("We only support creating rooms to 1 month from now.");
      dateInput.current.valueAsDate = new Date();
    }
  }

  return (
    <div>
      {
        bool ?
        <div className="createRoom">
          <img src={Logo} alt="LingoThyme Logo" height="100px"/>
          <p className="title">New Room</p>
          <div className="flex-column">
            <div className="input">
              <label>Admin Email:</label>
              <input type="text" ref={emailInput} />
            </div>
            <div className="input">
              <label>Participant Number:</label>
              <div className="range">
                <input type="range" min="1" max="8" step="1" ref={numberInput} onChange={() => changeNumber()}/>
                <span class="range-value" ref={numberValue}>8</span>
              </div>
            </div>
            <div className="input">
              <label>Question Field:</label>
              <textarea rows="5" type="text" ref={questionInput} />
            </div>
            <div className="input">
              <label>Flow of Events:</label>
              <p className="flow">Changing flow of events is currently not supported. The current flow is 'brainstorming', 'pargraph writing', and then 'end'.</p>
            </div>
            <div className="input">
              <label>Date of discussion</label>
              <input type="date" ref={dateInput} onChange={() => changeDate()}/>
            </div>
            <div className="buttons">
              <button className="primary-button" onClick={() => handleClick()}>CREATE</button>
              <Link className="secondary-button" to="/">CANCEL</Link>
            </div>
          </div>
        </div>
        :
        <div className="enterRoom center">
          <img src={Logo} alt="LingoThyme Logo" height="250px"/>
          <p>NOTE: Creating rooms are currently reserved only for LingoThyme staff. <br />
          We are looking at publicizing this service for everyone to use soon.</p>
          <div className="input">
            <label>Username:</label>
            <input type="text" ref={userInput} />
            <label>Password:</label>
            <input type="password" ref={passInput} />
            <div className="buttons">
              <button className="primary-button" onClick={() => handleFirstClick()} >LOGIN</button>
              <Link className="secondary-button" to="/">RETURN</Link>
            </div>
          </div>
        </div>
      }
    </div>

    );
  }
  
  export default CreateRoom;