import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 

import Question from "./viewComponents/question";
import Brainstorm from "./viewComponents/brainstormResponse";
import Paragraphs from "./viewComponents/paragraphResponse";

import Logo from "../assets/main-logo.png";
import axios from "axios";

function PDFView() {
    const location = useLocation().search.split("?id=")[1];
    const [question, setQuestion] = useState("");
    const [brainstormList, setBrainstormList] = useState([]); //[value, userID, id]
    const [paragraphList, setParagraphList] = useState([]); //[[paragraphx, paragraphx+1], id]
    const [title, setTitle] = useState("");
    
    useEffect(() => {
        axios.post('/api/meet/pdf', {location})
        .then((res) => {
            if(res.data[0] === true) {
                setQuestion([...res.data[1]]);
                setBrainstormList([...res.data[2]]);
                setParagraphList([...res.data[3]]);

                let date = new Date();
                setTitle(date.toISOString().split('T')[0] + " " + location);
            }
        })
        .catch((err) => {
            alert(err);
        });
    }, [location]);

    return(
        <div className ="pdfView">
            
            <span>
                <img src={Logo} alt="LingoThyme logo" height="100px"/>
            </span>
            <span><h1>Room {title}</h1></span>
            <Question question={question}/>
            <h1>Ideas</h1>
            <span>
                {
                    brainstormList.map((data, index) => (
                        <Brainstorm key={"Brainstorming"+data[2]} userID={data[1]} value={data[0]} id={data[2]} />
                    ))
                }
            </span>
            <h1>Paragraph</h1>
            <span>
                {
                    paragraphList.map((data) => (
                        <Paragraphs key={"Paragraph"+data[1]} value={data[0]} id={data[1]} />
                    ))
                }
            </span>
        </div>
    );
}
    
export default PDFView;