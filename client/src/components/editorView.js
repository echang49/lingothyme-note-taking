import { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom"; 
import axios from "axios";
import Question from "./viewComponents/question";


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
                    <div className="testing">
                        <p>EDITOR VIEW</p>
                        <Question />
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