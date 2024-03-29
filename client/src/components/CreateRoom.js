import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";
import "../styles/style.css";
import Logo from "../assets/main-logo.png";

function CreateRoom(props) {
  const userInput = useRef(null);
  const passInput = useRef(null);

  const emailInput = useRef(null);
  const numberInput = useRef(null);
  const numberValue = useRef(null);
  const questionInput = useRef(null);
  const dateInput = useRef(null);

  function handleClick() {
    let emailBool = emailIsValid(emailInput.current.value);
    if(emailBool) {
      if(questionInput.current.value !== "") {
        if(questionInput.current.value.length <= 240) {
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
              alert("Your public key is: " + publicKey + ". Your private key is: " + publicKey + "-" + privateKey + ". The public key is for participants of the room and the private key is for you. " +
                "The room expires " + (date.getMonth() + 1) + "-" + (date.getDate() + 1) + "-" + date.getFullYear() + " at midnight EST/EDT.");
              props.history.push('/');
            })
            .catch((err) => {
              alert(err);
          })
        }
        else {
          alert("The maximum length allowed for questions is 240 characters.");
        }
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
                <span className="range-value" ref={numberValue}>8</span>
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
    );
  }
  
  export default withRouter(CreateRoom);