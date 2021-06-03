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
import {ReactComponent as Plus} from "../assets/plus-icon.svg"; // taken from https://iconmonstr.com/plus-6-svg/, replace with custom icon later


import User1 from "../assets/users/Image1.webp";
import User2 from "../assets/users/Image2.webp";
import User3 from "../assets/users/Image3.webp";
import User4 from "../assets/users/Image4.webp";
import User5 from "../assets/users/Image5.webp";
import User6 from "../assets/users/Image6.webp";
import User7 from "../assets/users/Image7.webp";
import User8 from "../assets/users/Image8.webp";


function AdminView() {
    const location = useLocation().search;
    const [bool, setBool] = useState(true);

    useEffect(() => {
<<<<<<< Updated upstream
        console.log(location);
=======
        socket = io(window.location.origin, {
            reconnectionDelayMax: 10000, 
            withCredentials: true
        });

        socketIO(socket);

>>>>>>> Stashed changes
        axios.post('/api/auth/verifyAdmin', {location})
        .then((res) => {
<<<<<<< Updated upstream
            if(!res.data) {
=======
            console.log('res.data =', res.data);
            if(!res.data[0]) {
>>>>>>> Stashed changes
                setBool(false);
            }
<<<<<<< Updated upstream
=======
            setPhase(res.data[1]);
            setQuestion(res.data[2]);
            const localStorageName = JSON.parse(localStorage.getItem('name'));
            const currentTime = Date.now();
            //see if name exists or is expired
            if(localStorageName !== null) {
                if(new Date(localStorageName[1]).getTime() > currentTime) {
                    setNameState(false);
                    socket.emit("new-user", location.split("?id=")[1].split("-")[0], localStorageName[0], (res) => { // create new user in room
                        setUserID(res.id);
                    });
                }
            }
>>>>>>> Stashed changes
        })
        .catch((err) => {
            alert(err);
        });
    }, [location]);

<<<<<<< Updated upstream
    var phase = 1; // phase select for testing purposes (TODO: implement phase change)
=======
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
            //console.log('phase before change: ', phase);
            setPhase(data);
            //console.log('phase after change: ', phase);
        });

<<<<<<< Updated upstream
=======
    // sets name, creates new user
    function setName(name) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        localStorage.setItem('name', JSON.stringify([name, tomorrow]));
        setNameState(false);
        socket.emit('new-user', location.split("?id=")[1].split("-")[0], name, (res) => {
            setUserID(res.id);
        });
>>>>>>> Stashed changes
    }

    

<<<<<<< Updated upstream
    function incrementPhase() {
        var nextPhase = phase + 1;
        console.log("moving to phase " + (nextPhase));
        console.log('phase before change: ', phase);
        socket.emit('phase-change', nextPhase);
        console.log('phase after change: ', phase);
        
    }


>>>>>>> Stashed changes
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
=======
    function setBrainstorm(value, id) {
        let tempBrainstormList = brainstormList;
        tempBrainstormList[id][0] = value;
        setBrainstormList([...tempBrainstormList]); // update brainstorm list
        socket.emit('edit-brainstorm', location.split("?id=")[1].split("-")[0], [value, id]);
    }

    function setParagraph(value, id) {
        let tempParagraphList = paragraphList;
        tempParagraphList[id][0] = value;
        setParagraphList([...tempParagraphList]); // update paragraph list
        socket.emit('edit-paragraph', location.split("?id=")[1].split("-")[0], [value, id]);
    }
    
    // change room phase to given phase number
    function incrementPhase(data) {
        setPhase(data);
        socket.emit('phase-change', location.split("?id=")[1].split("-")[0], data, brainstormList, paragraphList);
    }

    if(nameState === true) { // if name has not been set yet, allow user to set name
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
>>>>>>> Stashed changes
                                    <div className="buttons">
                                        <button className="primary-button">START SESSION</button>
                                    </div>
                                </div>

                                
                            </div>
                        :
                        <Redirect to="/" />
<<<<<<< Updated upstream
                    }
                </div>
            );
        case 2: // meeting has started
            return (
                <div>
                    {
                        bool ?
                            <div>
=======
                }
            </div>
        );
    }
    else {
        switch(phase) {
            case 1: // allow admin to start session
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
                                            <button className="primary-button" onClick={() => incrementPhase(2)}>START SESSION</button>
                                        </div>
                                    </div>
                                </div>
                            :
                            <Redirect to="/" />
                        }
                    </div>
                );
            case 2: // session has started, in brainstorm phase
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
                                            <button onClick={() => incrementPhase(3)}>
                                                <p>Next Phase </p>
                                                <Brace />
                                            </button>
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
                                <Redirect to="/" />
                        }
                    </div>
                );
            case 3: // continue session, paragraph phase
                return(
                    <div>
                        {
                            bool ?
>>>>>>> Stashed changes
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
                                                <button>
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