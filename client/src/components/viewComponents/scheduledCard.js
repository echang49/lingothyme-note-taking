import { useState, useEffect, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 
import axios from 'axios';

import Calendar from "../../assets/calendar-icon.svg";
import People from "../../assets/people-icon.svg";


function ScheduledCard({roomKey, title, card_content, time, capacity }) { // same as ongoingCard, with added number of current users in room
    const textInput = useRef(null);
    const [ url, setURL ] = useState("/");
    const [bool, setBool] = useState(true);
    const [phase, setPhase] = useState(1);

    // useEffect(() => {
        
    //   }, []);

    function joinRoom() { // join room
        let code = roomKey;
        console.log("joining room with code: " + code);
        axios.post("/api/auth/mainhall_joinRoom", {code})
        .then((res) => {
            if(res.data[0]) {
                if(res.data[1]) {
                    setURL("/room?id=".concat(code));
                    console.log("sending to room...");
                    <Redirect push to={url} />
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
                <img src={Calendar} alt="calendar icon" height="30px"/>
            </div>

            <div className="date-text">
                <p><div className="time"> {time}</div></p>
            </div>

            <div className="icon2-scheduled">
                <img src={People} alt="add people icon" height="30px"/>
            </div>


            <div className="room-size-text-scheduled">
                <p>{capacity}</p>
            </div>

            <button className="join-button-scheduled" onClick={() => joinRoom()}>Join</button>
        </div>
        
        
    );
}
    
export default ScheduledCard;