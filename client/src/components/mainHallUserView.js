import { useEffect, useState, useRef } from "react";
import { Redirect, useLocation, Link } from "react-router-dom"; 
import io from "socket.io-client";
import axios from "axios";

import Question from "./viewComponents/question";
import User from "./viewComponents/users";
import Brainstorm from "./viewComponents/brainstormResponse";
import Carousel from "./viewComponents/carousel";
import Paragraphs from "./viewComponents/paragraphResponse";

import {ReactComponent as Logo} from "../assets/logo-white.svg";
import {ReactComponent as Brace} from "../assets/right-brace.svg";
import {ReactComponent as Note} from "../assets/note-icon.svg";

let socket;

function MainhallUserView() {
    const nameInput = useRef(null);
    const location = useLocation().search;
    const [bool, setBool] = useState(true);
    const [nameState, setNameState] = useState(true);

    const [question, setQuestion] = useState("");
    const [phase, setPhase] = useState(1);
    const [userList, setUserList] = useState([]); //[name, id]
    const [userID, setUserID] = useState(); 
    const [brainstormList, setBrainstormList] = useState([]); //[value, userID, id]
    const [paragraphList, setParagraphList] = useState([]); //[[paragraphx, paragraphx+1], id]

    useEffect(() => {
        socket = io(window.location.origin, {
            reconnectionDelayMax: 10000,
            withCredentials: true
        });

        socketIO(socket);

        axios.post('/api/auth/mainhall_verifyUser', {location})
        .then((res) => {
            if(!res.data[0]) {
                setBool(false);
            }
            setPhase(res.data[1]);
            setQuestion(res.data[2]);
            const localStorageName = JSON.parse(localStorage.getItem('name'));
            const currentTime = Date.now();
            //see if name exists or is expired
            if(localStorageName !== null) {
                if(new Date(localStorageName[1]).getTime() > currentTime) {
                    setNameState(false);
                    socket.emit("new-user", location.split("?id=")[1], localStorageName[0], (res) => {
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

        //when another user requests for the info on the doc
        socket.on('request-info', (data) => {
            // console.log(brainstormList, paragraphList);
            // socket.emit('resolve-info', data, brainstormList, paragraphList);
            setBrainstormList(x => {
                setParagraphList(y => {
                    socket.emit('resolve-info', data, x, y);
                    return [...y];
                });
                return [...x];
            });
        });

        //when another user provides info on the doc
        socket.on('resolve-info', (data) => {
            setBrainstormList([...data[0]]);
            setParagraphList([...data[1]]);
        });
    
        socket.on('phase-change', (data) =>  {
            setPhase(data);
        });
    }

    function setName(name) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        localStorage.setItem('name', JSON.stringify([name, tomorrow]));
        setNameState(false);
        socket.emit('new-user', location.split("?id=")[1], name, (res) => {
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

    switch(phase) {
        case 1: // wait for admin to start session
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
                        <Redirect to="/mainHall" />
                    }
                </div>
            );
        case 2: // session started, brainstorm phase
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
                                        <Link to="/mainHall" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
                                            <button>
                                                <p>Leave </p>
                                                <Brace />
                                            </button>
                                        </Link>
                                    </span>
                                </nav>
                                <div className="body">
                                    <div className="canvas">
                                        <Question question={question}/>
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
                            <Redirect to="/mainHall" />
                    }
                </div>
            );
        case 3: // session started, paragraph phase
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
                                        <Link to="/mainHall" style={{ textDecoration: 'none' }}>  {/* remove link styling */}
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
                                            <span><Question question={question}/></span>
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
                            <Redirect to="/mainHall" />
                    }
                </div>
            );
        case 4: // meeting has ended screen
            return(
                <div>
                    {
                        bool ?
                            <div className="userView">
                                <div className="phase1 center">
                                    <p className="title">The host has ended the meeting, thanks for joining.</p>
                                </div>    
                                <div className="center-button">
                                    <div className="buttons">
                                        <Link to="/mainHall" className="primary-button">Exit</Link>
                                    </div>
                                </div>
                            </div>
                        :
                            <Redirect to="/mainHall" />
                    }
                </div>
            );
        }
}
    
export default MainhallUserView;