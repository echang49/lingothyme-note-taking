import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link } from "react-router-dom"; 
import io from "socket.io-client";
import axios from "axios";

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

function EditorView() {
    const nameInput = useRef(null);
    const location = useLocation().search;
    const [bool, setBool] = useState(true);
    const [nameState, setNameState] = useState(true);

    const [phase, setPhase] = useState(1);
    const [userList, setUserList] = useState([]); //[name, id]
    const [userID, setUserID] = useState(); 
    const [brainstormList, setBrainstormList] = useState([]); //[value, userID, id]
    const [paragraphList, setParagraphList] = useState([]); //[[paragraphx, paragraphx+1], id]

    useEffect(() => {
        socket = io("http://localhost:5000", {
            reconnectionDelayMax: 10000,
            withCredentials: true
        });

        socketIO(socket);

        axios.post('/api/auth/verifyUser', {location})
        .then((res) => {
            if(!res.data[0]) {
                setBool(false);
            }
            setPhase(res.data[1]);
            const localStorageName = JSON.parse(localStorage.getItem('name'));
            const currentTime = Date.now();
            //see if name exists or is expired
            if(localStorageName !== null) {
                if(new Date(localStorageName[1]).getTime() > currentTime) {
                    setNameState(false);
                    socket.emit("new-user", location, localStorageName[0], (res) => {
                        setUserID(res.id);
                    });
                }
            }
        })
        .catch((err) => {
            alert(err);
        });

        // Anything in here is fired on component unmount.
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

        //when a user creates a new brainstorming component
        socket.on('new-brainstorm', (data) => {
            setBrainstormList(list => [...list, ["", data[0], data[1]]])
        });

        //when a user edits a brainstorming component
        socket.on('edit-brainstorm', (data) => {
            setBrainstormList(list => {
                list[data[1]][0] = data[0];
                return [...list];
            });
        });

        //when a user creates a new paragraph component
        socket.on('new-paragraph', (data) => {
            setParagraphList(list => [...list, [["", "", ""], data]]);
        });

        //when a user edits a paragraph component
        socket.on('edit-paragraph', (data) => {
            setParagraphList(list => {
                list[data[1]][0] = data[0];
                return [...list];
            });
        });
    
        socket.on('phase_change', (data) =>  {
            setPhase(data);
        });
    }

    function renderProfilePicture(image){
        switch(image){
            case 1:
                return User1;
            case 2:
                return User2;
            case 3:
                return User3;
            case 4:
                return User4;
            case 5:
                return User5;
            case 6:
                return User6;
            case 7:
                return User7;
            case 8:
                return User8;
        }
    }

    function setName(name) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        localStorage.setItem('name', JSON.stringify([name, tomorrow]));
        setNameState(false);
        socket.emit('new-user', location, name, (res) => {
            setUserID(res.id);
        });
    }

    function handleNoteClick () {
        if(phase === 2) {
            //useRef. create a Brainstorming component under the testing area
            let tempBrainstormList = brainstormList;
            setBrainstormList([...tempBrainstormList, ["", userID, tempBrainstormList.length]]);
            socket.emit('new-brainstorm', location.split("?id=")[1], userID, tempBrainstormList.length);
        }
        else { //phase === 3
            let tempParagraphList = paragraphList;
            setParagraphList([...tempParagraphList, [["", "", ""], tempParagraphList.length]]);
            socket.emit('new-paragraph', location.split("?id=")[1], tempParagraphList.length);
        }
    }

    function setBrainstorm(value, id) {
        let tempBrainstormList = brainstormList;
        tempBrainstormList[id][0] = value;
        setBrainstormList([...tempBrainstormList]);
        socket.emit('edit-brainstorm', location.split("?id=")[1], [value, id]);
    }

    function setParagraph(value, id) {
        let tempParagraphList = paragraphList;
        tempParagraphList[id][0] = value;
        setParagraphList([...tempParagraphList]);
        socket.emit('edit-paragraph', location.split("?id=")[1], [value, id]);
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
                                            <Question />
                                            <div className="canvas-row">
                                                {
                                                    brainstormList.map((data, index) => (
                                                        <Brainstorm key={"Brainstorming"+data[2]} userID={data[1]} value={data[0]} id={data[2]} setBrainstorm={setBrainstorm} />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className="userList">
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
                                        </div>
                                    </div>
                                </div>
                            :
                                <Redirect to="/" />
                        }
                    </div>
                );
            case 3:
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
                                            <div className="info-row">
                                                <span><Question /></span>
                                                <Carousel brainstormList={brainstormList} />
                                            </div>
                                            <div className="canvas-row">
                                                {
                                                    paragraphList.map((data) => (
                                                        <Paragraphs key={"Paragraph"+data[1]} value={data[0]} id={data[1]} setParagraph={setParagraph} />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className="userList">
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
                                        </div>
                                    </div>
                                </div>
                            :
                                <Redirect to="/" />
                        }
                    </div>
                );
            case 4: 
                return(
                    <div>
                        {
                            bool ?
                                <div className="userView">
                                    <div className="lastPhase center">
                                        <img src={Logo} alt="LingoThyme logo" height="250px"/>
                                        <div className="lastPhase">
                                            <p>The host has ended the meeting, thanks for joining.</p>
                                            <div className="buttons">
                                                <Link className="exit-button" to="/">Exit</Link>
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