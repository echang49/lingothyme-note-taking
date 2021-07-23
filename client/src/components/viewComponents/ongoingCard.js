import { useState, useEffect, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 
import axios from 'axios';
import firebase from "firebase";

import Clock from "../../assets/time-icon.svg";
import People from "../../assets/people-icon.svg";
import {ReactComponent as Brace} from "../../assets/note-icon.svg";
function OngoingCard({publicKey, privateKey, title, card_content, time, capacity, createdBy}) {
    const textInput = useRef(null);
    let url = "/";
    const [bool, setBool] = useState(true);
    const [phase, setPhase] = useState(1);

    const [email, setEmail] = useState("");
    const userEmail = useRef("");
    const auth = firebase.auth();

    // get user email 
    function onAuthStateChange() {
        return firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                userEmail.current = user.email;
                setEmail(userEmail.current);
            } else {
                console.log("user not found");
            }
        });
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChange();
        return () => {
          unsubscribe();
        };
    }, []);

    function joinRoom() { // join room 
        // let publicKey = publicKey;
        // let privateKey = privateKey;
        let data = {
            publicKey: publicKey,
            privateKey: privateKey, 
            createdBy: createdBy,
            currentUserEmail: email
        }
        axios.post("/api/auth/mainhall_joinRoom", data)
        .then((res) => {
            if(res.data[0]) {
                let normalCode = publicKey;
                let adminCode = normalCode.concat('-').concat(privateKey);
                if(res.data[1]) { // user view
                    console.log("sending to user view url: " + url);
                    // TODO: change this to not use window.location.href, insecure
                    window.location.href = "/mainHall/room?id=".concat(normalCode);
                }
                else { // admin view
                    console.log("sending to admin view url: " + url);
                    // TODO: change this to not use window.location.href, insecure
                    window.location.href = "/mainHall/admin/room?id=".concat(adminCode);   
                }
                setBool(false);
            }
            else { // room not found, with given code
                alert("Incorrect code. Ensure you have the proper room code.");
            }
        })
        .catch((err) => {
            alert(err.response);
        });  
    }

    return (
        <div className="card">
            <div className="card-header">
                {/* add icon here  */}
                <h1>{title}</h1>
            </div>
            <hr></hr>

            <div className="card-content">
                <p>{card_content}</p>
            </div>

            <div className="icon1">
                <img src={Clock} alt="clock icon" height="30px"/>
            </div>

            <div className="date-text">
                <p><div className="time"> {time}</div></p>
            </div>

            <div className="icon2-ongoing">
                <img src={People} alt="add people icon" height="30px"/>
            </div>

            <div className="room-size-text-ongoing">
                <p>6/8</p>
            </div>

            <button className="join-button-ongoing" onClick={() => joinRoom()}>Join</button>
        </div>
    );
}
    
export default OngoingCard;