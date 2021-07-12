import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import ColorLogo from "../assets/main-logo.png";
import OngoingCard from "./viewComponents/ongoingCard"; 
import ScheduledCard from "./viewComponents/scheduledCard";
import Navbar from "./viewComponents/navbar"; 
import Logo from "../assets/main-logo.png";

import firebase from "../firebase.js";
import axios from "axios";


function MainHall() {
    const [bool, setBool] = useState(true);
    const [user, setUser] = useState({ loggedIn: false });
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const [phase, setPhase] = useState(1);
    const auth = firebase.auth();
    const [ url, setURL ] = useState("/");

    const numberInput = useRef(null);
    const numberValue = useRef(null);
    const questionInput = useRef(null);
    const dateInput = useRef(null);
    const textInput = useRef(null);

    const roomList = useRef([]);
    const ongoingRoomList = useRef([]);
    const scheduledRoomlist = useRef([]);
    

    async function handleLogin() { 
        let email = emailInput.current.value;
        let pass = passInput.current.value;
        auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            setUser(auth.currentUser); 
            <Redirect to="/mainHall" />
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert('Error: ' + errorMessage);
            }
            console.log(error);
        });     
    }

    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                callback({loggedIn: true});
                const res = await axios.post('/api/auth/mainhall_getRoomList');
                console.log("type of res.data mainHall get room list: " +  res.data);
                roomList.current = res.data; // list of all rooms from mainhallrooms collection 
                console.log("roomList: " + JSON.stringify(roomList.current) );

                roomList.current.forEach(element => {
                    let elementdate = new Date(element.date);
                    let now = new Date();
                    if (elementdate >= now) { // room has date in future
                        scheduledRoomlist.current.push(element);
                   } else{ // room is currently ongoing
                        ongoingRoomList.current.push(element);
                   }
                });
            } else {
                callback({loggedIn: false});
            }
        });
      }

    useEffect(() => {
        const unsubscribe = onAuthStateChange(setUser);
        return () => {
          unsubscribe();
        };
      }, []);

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
                    setPhase(1); // send user back to mainhall  
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

    function joinRoom() { // join room
        let code = textInput.current.value;
        axios.post("/api/auth/mainhall_joinRoom", {code})
        .then((res) => {
            if(res.data[0]) {
                if(res.data[1]) {
                    setURL("/room?id=".concat(code));
                }
                else {
                    
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
        setPhase(1);
    }



    //firebase WIP 

    if(user.loggedIn === null) { // TODO: add loading screen before render here
        return(
            <div>
                <p>delay render</p>
            </div>
        );
    }
    if(!user.loggedIn) { // user not logged in, prompt them to login or signup
        return(
            <div className="enterRoom center">
                <img src={ColorLogo} alt="LingoThyme Logo" height="250px"/>
                <div className="input">
                    <label>Email:</label>
                    <input type="text" ref={emailInput} />

                    <label>Password:</label>
                    <input type="password" ref={passInput} />
                    
                    <Link to="/signup" style={{ textDecoration: 'none' }}>Sign up</Link>
                    <Link to="/passwordReset" style={{ textDecoration: 'none' }}>Forgot password?</Link>
                    <div className="buttons">
                        <button className="primary-button" onClick={() => handleLogin()} >LOGIN</button> 
                        <Link className="secondary-button" to="/">RETURN</Link>
                    </div>

                </div>
            </div>
        );
    }

    switch(phase) {
        case 1: // main hall
            return(
                <div>
                    {
                        bool ?
                            <div className="MainHall">
                                <Navbar />
                                <div className="mainhall-body">
                                    <div className="canvas">
                                        <h1>Ongoing</h1> <div className="break"></div> 
                                        <OngoingCard />
                                        <h2>Scheduled</h2> <div className="break"></div>
                                        {roomList.current.map(element => {
                                            // const monthNames = ["January", "February", "March", "April", "May", "June",
                                            // "July", "August", "September", "October", "November", "December"];
                                            // const day = String(element.date.getDate()).padStart(2, '0');
                                            // const month = monthNames[element.date.getMonth()];
                                            // const year = element.date.getFullYear();
                                            return <ScheduledCard title="Idea Brainstorming" card_content={element.question} time={element.date.toString().substring(0, 10)} capacity={element.capacity} />
                                            })
                                        }
                                        {/* card_content, time, capacity */}
                                        
                                        <button onClick={() => setPhase(2)}>
                                            <p>Create Room</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        :
                            <Redirect to="/" />
                    }
                </div>
            );
        case 2: // room creation
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
                                        <button className="secondary-button" onClick={() => setPhase(1)}>CANCEL</button>
                                    </div>
                                </div>
                            </div>
                        :
                        <Redirect to="/" />
                    }
                </div>
            
            );
    }
}
    
export default MainHall;
