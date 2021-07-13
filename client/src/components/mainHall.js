import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import ColorLogo from "../assets/main-logo.png";
import OngoingCard from "./viewComponents/ongoingCard"; 
import ScheduledCard from "./viewComponents/scheduledCard";
import Navbar from "./viewComponents/navbar"; 
import Logo from "../assets/main-logo.png";
import CreateMainHallRoom from "./createMainHallRoom";

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
                                            return <ScheduledCard title="Idea Brainstorming" roomKey={element.roomKey} card_content={element.question} time={element.date.toString().substring(0, 10)} capacity={element.capacity} />
                                            })
                                        }
                                        <div className="buttons">
                                            <Link to="/mainhall/roomCreation" className="primary-button">Create Room</Link>
                                        </div> 
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
