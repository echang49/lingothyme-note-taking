import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link } from "react-router-dom"; 
import io from "socket.io-client";
import axios from "axios";
import Question from "./viewComponents/question";
import User from "./viewComponents/users";

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
import Brainstorm from "./viewComponents/brainstormResponse";
import Carousel from "./viewComponents/carousel";
import Paragraphs from "./viewComponents/paragraphs";

function EditorView() {
    const nameInput = useRef(null);
    const location = useLocation().search;
    const [bool, setBool] = useState(true);
    const [nameState, setNameState] = useState(true);
    const [phase, setPhase] = useState(1);
    const [userList, setUserList] = useState([]);

    const socket = io("http://127.0.0.1:5000", {
        withCredentials: true
    });

    socket.on('connection', () => {
        console.log("connection")
    });

    socket.on('user-connected', (data) => {
        //data is user name and id
        console.log(data);
    })

    socket.on('phase_change', (data) =>  {
        setPhase(data);
    });

    useEffect(() => {
        axios.post('/api/auth/verifyUser', {location})
        .then((res) => {
            if(!res.data[0]) {
                setBool(false);
            }
            setPhase(res.data[1]);
            setUserList(res.data[2]);
            const localStorageName = JSON.parse(localStorage.getItem('name'));
            const currentTime = Date.now();
            //see if name exists or is expired
            if(localStorageName !== null) {
                if(new Date(localStorageName[1]).getTime() > currentTime) {
                    setNameState(false);
                    socket.emit('new-user', location, localStorageName[0]);
                }
            }
        })
        .catch((err) => {
            alert(err);
        });
    }, [location]);

    function setName(name) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        localStorage.setItem('name', JSON.stringify([name, tomorrow]));
        setNameState(false);
        socket.emit('new-user', location, name);
    }

    function handleNoteClick () {
        //useRef. create a Brainstorming component under the testing area  
    }

    if(nameState === true) {
        return(
            <div>
                {
                    bool ?
                        <div className="userView">
                            <div className="nameState center">
                                <img src={ColorLogo} alt="LingoThyme logo" height="250px"/>
                                <div className="input">
                                    <label>Please Enter Your Name:</label>
                                    <input type="text" ref={nameInput} />
                                    <div className="buttons">
                                        <button className="primary-button" onClick={() => setName(nameInput.current.value)}>Continue</button>
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
    else {
        switch(phase) {
            case 1:
                return(
                    <div>
                        {
                            bool ?
                                <div className="userView">
                                    <div className="phase1 center">
                                        <p className="title">The admin has not started the session yet.<br />Please hold tight while they prepare the session.</p>
                                    </div>
                                </div>
                            :
                            <Redirect to="/" />
                        }
                    </div>
                );
            case 2:
                return(
                    <div>
                        {
                            bool ?
                                <div className="userView">
                                    <nav>
                                        <span className="nav-start">
                                            <Logo />
                                        </span>
                                        <span className="nav-roomphase">
                                            <p>Brainstorming Room</p>
                                        </span>
                                        <span className="nav-center">
                                            <Note className="note-icon" onClick={() => handleNoteClick()} />
                                        </span>
                                        <span className="nav-end">
                                            <Link to="/" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                                <button>
                                                    <p>Leave </p>
                                                    <Brace />
                                                </button>
                                            </Link>
                                        </span>
                                    </nav>
                                    <div className="body">
                                        <div className="canvas">
                                            <div className="testing">
                                                <Paragraphs />
                                                <Carousel />
                                                <Question />
                                                <Brainstorm />
                                                <div className="buttons">
                                                    <Link className="exit-button" to="/lastPhase">lastPhaseTest</Link>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div className="userList">
                                            <div className="userList-header">
                                                <p>Users</p>
                                            </div>
                                            <div className="userList-body">
                                                <User picture={User1} name="Edward" />
                                                <User picture={User2} name="Nanjiong" />
                                                <User picture={User3} name="Iris" />
                                                <User picture={User4} name="Janet" />
                                                <User picture={User5} name="Vimal" />
                                                <User picture={User6} name="Adrian" />
                                                <User picture={User7} name="Shubham" />
                                                <User picture={User8} name="Veronique" />
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
}
    
export default EditorView;

//components are question component, editor list component, pt 1 response, pt 2 response
//Three different stages : Brainstorming, pargraph writing, finish