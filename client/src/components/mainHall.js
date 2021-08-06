import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 

import OngoingCard from "./viewComponents/ongoingCard"; 
import ScheduledCard from "./viewComponents/scheduledCard";
import Navbar from "./viewComponents/navbar"; 
import Logo from "../assets/main-logo.png";
import CreateMainHallRoom from "./createMainHallRoom";
import Login from "./login.js";

import firebase from "../firebase.js";
import axios from "axios";


function MainHall() {
    const [bool, setBool] = useState(true);
    const [user, setUser] = useState({ loggedIn: false });
    const emailInput = useRef(null);
    const passInput = useRef(null);
    const auth = firebase.auth();
    const [ url, setURL ] = useState("/");

    const [update, setUpdate] = useState(1);

    const roomList = useRef([]);
    const ongoingRoomList = useRef([]);
    const scheduledRoomList = useRef([]);

    function onAuthStateChange(callback) {
        return auth.onAuthStateChanged(async user => {
            if (user) {
                callback({loggedIn: true});
                const res = await axios.post('/api/auth/mainhall_getRoomList');
                roomList.current = res.data; // list of all rooms from mainhallrooms collection 
                setUpdate(update + 1); // forces update after getting roomList
                //console.log(JSON.stringify(roomList));
                roomList.current.forEach(element => {
                    let roomDate = new Date(element.date);
                    let currentDate = new Date();
                    if (roomDate.getDate() == currentDate.getDate()) { // room is ongoing
                        ongoingRoomList.current.push(element);
                    } else{ // room is scheduled
                        scheduledRoomList.current.push(element);
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

    useEffect(() => {
        setUpdate('2');
    }, [ongoingRoomList.current, scheduledRoomList.current, roomList.current]);



    //firebase WIP 

    if(user.loggedIn === null) { // TODO: add loading screen before render here
        return(
            <div>
                <p>delay render</p>
            </div>
        );
    }
    if(!user.loggedIn) { // user not logged in, prompt them to login or signup
        return <Login />
    }
    return(
        <div>
            {
                bool ?
                    <div className="MainHall">
                        <Navbar />
                        <div className="mainhall-body">
                            <div className="canvas">
                                <h1>Ongoing</h1> <div className="break"></div> 
                                {ongoingRoomList.current.map(element => {
                                    return <OngoingCard title="Idea Brainstorming" publicKey={element.publicKey} privateKey={element.privateKey} card_content={element.question} time={element.date.toString().substring(0, 10)} capacity={element.capacity} createdBy={element.createdBy}/>
                                    })
                                }
                                <h2>Scheduled</h2> <div className="break"></div>
                                {scheduledRoomList.current.map(element => {
                                    return <ScheduledCard title="Idea Brainstorming" publicKey={element.publicKey} privateKey={element.privateKey} card_content={element.question} time={element.date.toString().substring(0, 10)} capacity={element.capacity} createdBy={element.createdBy}/>
                                    })
                                }
                                <div className="buttons">
                                    <Link to="/mainhallRoomCreation" className="primary-button">Create Room</Link>
                                </div> 
                            </div>
                        </div>
                    </div>
                :
                    <Redirect push to={url} />
            }
        </div>
    ); 
}
    
export default MainHall;
