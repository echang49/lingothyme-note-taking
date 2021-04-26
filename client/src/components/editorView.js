import { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom"; 
import axios from "axios";
import Question from "./viewComponents/question";

import {ReactComponent as Logo} from "../assets/logo-white.svg";
import {ReactComponent as Brace} from "../assets/right-brace.svg";
import {ReactComponent as Note} from "../assets/note-icon.svg";


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
                        {/* <div className="testing">
                            <Question />
                        </div> */}
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