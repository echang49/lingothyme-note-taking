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


function AdminView() {
    const location = useLocation().search;
    const [bool, setBool] = useState(true);

    useEffect(() => {
        console.log(location);
        axios.post('/api/auth/verifyAdmin', {location})
        .then((res) => {
            if(!res.data) {
                setBool(false);
            }
        })
        .catch((err) => {
            alert(err);
        });
    }, [location]);

    var phase = 1; // phase select for testing purposes (TODO: implement phase change)
    switch(phase) {
        case 1: // meeting has not started yet, allow admin to start meeting
            return(
                <div>
                    {
                        bool ?
                            <div className="userView">
                                <div className="phase1 center">
                                    <p className="title">The admin has not started the session yet.<br />Please hold tight while they prepare the session.</p>                              
                                </div>

                                <div className="center-button">
                                    <div className="buttons">
                                        <button className="primary-button">START SESSION</button>
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