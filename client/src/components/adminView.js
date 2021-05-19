import { useEffect, useState } from "react";
import { Redirect, useLocation, Link} from "react-router-dom"; 
import axios from "axios"; 
import io from "socket.io-client";


import Question from "./viewComponents/question";
import User from "./viewComponents/users";
import Brainstorm from "./viewComponents/brainstormResponse";
import Carousel from "./viewComponents/carousel";
import Paragraphs from "./viewComponents/paragraphResponse";


import ColorLogo from "../assets/main-logo.png";
import {ReactComponent as Logo} from "../assets/logo-white.svg";
import {ReactComponent as Brace} from "../assets/right-brace.svg";
import {ReactComponent as Note} from "../assets/note-icon.svg";

import User1 from "../assets/users/Image1.webp";
import User2 from "../assets/users/Image2.webp";
import User3 from "../assets/users/Image3.webp";
import User4 from "../assets/users/Image4.webp";
import User5 from "../assets/users/Image5.webp";
import User6 from "../assets/users/Image6.webp";
import User7 from "../assets/users/Image7.webp";
import User8 from "../assets/users/Image8.webp";

let socket;

function AdminView() {
    const location = useLocation().search;
    const [bool, setBool] = useState(true);
    const [phase, setPhase] = useState(1);
    const [userList, setUserList] = useState([]); //[name, id]
    const [userID, setUserID] = useState(); 
    const [brainstormList, setBrainstormList] = useState([]); //[value, userID, id]
    const [paragraphList, setParagraphList] = useState([]); //[[paragraphx, paragraphx+1], id]

    useEffect(() => {
        console.log(location);

        socket = io("http://localhost:5000", {
            reconnectionDelayMax: 10000,
            withCredentials: true
        });
        socketIO(socket);

        axios.post('/api/auth/verifyAdmin', {location})
        .then((res) => {
            if(!res.data[0]) {
                setBool(false);
            }
            setPhase(res.data[1]);
        })
        .catch((err) => {
            alert(err);
        });

        return () => {
            socket.disconnect();
        }

    }, [location]);

    function socketIO(socket) {
        //on connection, set the user list of people already connected
        socket.on('connection', (data) => {
            let tempUserList = userList;
            for(let i in data) {
                tempUserList.push(data[i]);
            }
            setUserList([...tempUserList]);
        });
    
        //when a new user joins, add them to the user list
        socket.on('user-connected', (data) => {
            let tempUserList = userList;
            tempUserList.push(data);
            setUserList([...tempUserList]);
        });

        //when a user leaves, remove them from the user list
        socket.on('user-disconnected', (data) => {
            let slicedIndex = userList.findIndex((element) =>  JSON.stringify(element) === JSON.stringify(data));
            let tempUserList = userList;
            tempUserList.splice(slicedIndex,1);
            setUserList([...tempUserList]);
        });
    
        socket.on('phase_change', (data) =>  {
            setPhase(data);
        });
    }

    function incrementPhase() {
        var nextPhase = phase + 1;
        alert("moving to phase " + (nextPhase));
        socket.emit('phase-change', nextPhase);
        //setPhase(nextPhase);
        
        
    }


    //var phase = 1; // phase select for testing purposes (TODO: implement phase change)
    switch(phase) {
        case 1: // meeting has not started yet, allow admin to start meeting
            return(
                <div>
                    {
                        bool ?
                            <div className="userView">
                                <div className="phase1 center">
                                    <p className="title">The session has not started yet.<br />Press the button below to begin the session.</p>                              
                                </div>

                                <div className="center-button">
                                    <div className="buttons">
                                        <button className="primary-button" onClick={() => incrementPhase()}>START SESSION</button>
                                    </div>
                                </div>

                                
                            </div>
                        :
                        <Redirect to="/" />
                    }
                </div>
            );
        case 2: // meeting has started
            return (
                <div>
                    {
                        bool ?
                            <div>
                                <div className="userView">
                                    <nav>
                                        <span className="nav-start">
                                            <Logo />
                                        </span>
                                        <span className="nav-roomphase">
                                            
                                        </span>
                                        <span className="nav-center">
                                            {/* <Note className="note-icon"/> */}
                                        </span>
                                        <span className="nav-end">
                                            <Link to="/" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                                <button onClick={() => incrementPhase()}>
                                                    <p>Next Phase </p>
                                                    <Brace />
                                                </button>
                                            </Link>
                                        </span>
                                    </nav>
                                    
                                    <div className="body">
                                        <div className="canvas">
                                        <p>Admin VIEW</p>
                                            <Question />
                                            <div className="canvas-row">
        
                                            </div>
                                        </div>
                                        {/* <div className="userList">
                                            <div className="userList-header">
                                                <p>Users</p>
                                            </div>
                                            <div className="userList-body">
                                                {
                                                    userList.map((data, index) => (
                                                        <User key={"User"+data[1]} name={data[0]} picture={data[1]} />
                                                    ))
                                                }
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
        
                        :
                            <Redirect to="/" />
                    }
                 </div>
            );
        case 3: // meeting has ended, allow admin to exit meeting
            return(
                <div>
                    {
                        bool ?
                            <div className="userView">
                                <div className="phase1 center">
                                    <p className="title">The meeting has ended.<br />A log of the meeting has been sent to your email. </p>         

                                </div>    

                                <div className="center-button">
                                    <div className="buttons">
                                        <Link to="/" className="primary-button">Exit</Link>
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
    
export default AdminView;

//components are question component, editor list component, pt 1 response, pt 2 response, adminNav
//Three different stages : Brainstorming, pargraph writing, finish