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
    const nameInput = useRef(null);
    const [bool, setBool] = useState(true);
    const [user, setUser] = useState({ loggedIn: false });
    const userInput = useRef(null);
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const [phase, setPhase] = useState(1);
    const auth = firebase.auth();

    const numberInput = useRef(null);
    const numberValue = useRef(null);
    const questionInput = useRef(null);
    const dateInput = useRef(null);

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

    async function handleLogout() { 
        setUser({ loggedIn: false });
        return auth.signOut();
    }

    function sleep(ms) {
        console.log("sleeping for " + ms/1000 + "sec");
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    function onAuthStateChange(callback) {
        return firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback({loggedIn: true});
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
              setPhase(1);
            }
            else {
              alert("The maximum length allowed for questions is 240 characters.");
            }
          }
          else {
            alert("Please enter a question.");
          }
    }

    function joinRoom() {
        setPhase(1);
      }

    //firebase WIP 3

    // const user = auth.currentUser;
    // if (user === null){
    //     sleep(500);
    // }
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
                                <div className="body">
                                    <div className="canvas">
                                        <div classname="canvas-inner">
                                            <h1>Ongoing</h1> <div className="break"></div> 
                                            <OngoingCard />
                                            <h2>Scheduled</h2> <div className="break"></div>
                                            <ScheduledCard />
                                            
                                            <button onClick={() => setPhase(2)}>
                                                <p>Create Room</p>
                                            </button>
                                            
                                            <button onClick={() => setPhase(3)}>
                                                <p>Join Room</p>
                                            </button>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        :
                            <Redirect to="/" />
                    }
                </div>
            );
        case 2: // room creation
            return ( // TODO: store user's created rooms in db for mainhall render
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
        case 3: // join room
            return( // TODO: store user's joined rooms in db for mainhall render
                <div>
                    <div className="enterRoom center">
                        <img src={Logo} alt="LingoThyme logo" height="250px"/>
                        <div className="input">
                            <label>Room Code:</label>
                            <input type="text" ref={nameInput} />
                            <div className="buttons">
                                <button className="primary-button" onClick={() => joinRoom()}>ENTER</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
    }
}
    
export default MainHall;
