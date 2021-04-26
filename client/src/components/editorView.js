import { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom"; 
import axios from "axios";
import Question from "./viewComponents/question";
import User from "./viewComponents/users";

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

function EditorView() {
    const location = useLocation().search;
    const [bool, setBool] = useState(true);

    useEffect(() => {
        console.log(location);
        axios.post('/api/auth/verifyUser', {location})
        .then((res) => {
            if(!res.data) {
                setBool(false);
            }
        })
        .catch((err) => {
            alert(err);
        });
    }, [location]);

    return (
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
                                <Note className="note-icon" />
                            </span>
                            <span className="nav-end">
                                <button>
                                    <p>Leave </p>
                                    <Brace />
                                </button>
                            </span>
                        </nav>
                        <div className="body">
                            <div className="canvas">
                                <div className="testing">
                                    <Question />
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
                        {/**Have 4 different components. Meeting has not started, brainstorming, collaborative writing, meeting has finished */}
                    </div>
                :
                    <Redirect to="/" />
            }
         </div>
    );
}
    
export default EditorView;

//components are question component, editor list component, pt 1 response, pt 2 response
//Three different stages : Brainstorming, pargraph writing, finish