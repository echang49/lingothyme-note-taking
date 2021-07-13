import { Link, Redirect, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from 'axios'
import Logo from "../assets/main-logo.png";

function CreateMainHallRoom(props) {
    const numberInput = useRef(null);
    const numberValue = useRef(null);
    const questionInput = useRef(null);
    const dateInput = useRef(null);
    const textInput = useRef(null);
    const [phase, setPhase] = useState(1);
    const [bool, setBool] = useState(true);

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

    function createRoom(){
        if(questionInput.current.value !== "") {
            if(questionInput.current.value.length <= 240) {
              let date = new Date(dateInput.current.value);
              date.setDate(date.getDate() + 1); //add 1 day to the date of discussion for leeway
              let data = {
                number: numberInput.current.value,
                question: questionInput.current.value,
                date: date
              }
              let expirationMonth = date.getMonth() + 1;
              let expirationDate = date.getDate() + 1;
              let expirationYear = date.getFullYear();
              axios.post('/api/auth/mainhall_createRoom', data)
                .then((res) => {
                    let { roomKey } = res.data;
                    alert(`Your room key is: ${roomKey}. NOTE: YOUR ROOM EXPIRES ${expirationMonth} - ${expirationDate} - ${expirationYear} AT MIDNIGHT EST/EDT.` );  
                    
                    // TODO: change this to not use window.location.href, insecure
                    window.location.href = "/mainHall" // send user back to main hall
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

    return ( 
        <div>
            {
                bool ?
                    <div className="createRoom">
                        <img src={Logo} alt="LingoThyme Logo" height="100px"/>
                        <div className="flex-column">
                            <div className="input">
                                <label>Participant Number:</label>
                                <div className="range">
                                    <input type="range" min="2" max="8" step="1" ref={numberInput} onChange={() => changeNumber()}/>
                                    <span class="range-value" ref={numberValue}>8</span>
                                </div>
                            </div>

                            <div className="input">
                                <label>Question Field:</label>
                                <textarea rows="5" type="text" ref={questionInput} />
                            </div>

                            <div className="input">
                                <label>Flow of Events:</label>
                                <p className="flow">Changing flow of events is currently not supported. The current flow is 'brainstorming', 'paragraph writing', and then 'end'.</p>
                            </div>

                            <div className="input">
                                <label>Date of discussion</label>
                                <input type="date" ref={dateInput} onChange={() => changeDate()}/>
                            </div>

                            <div className="buttons">
                                <button className="primary-button" onClick={() => createRoom()}>CREATE</button>
                                <Link to="/mainHall" className="secondary-button">CANCEL</Link>
                            </div>
                        </div>
                    </div>
                :
                <Redirect to="/" />
            }
        </div>
    
    );


}

export default CreateMainHallRoom;
