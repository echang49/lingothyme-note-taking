import { useRef, createRef } from "react";

import User from "./users";
import User1 from "../../assets/users/Image1.webp";
import User2 from "../../assets/users/Image2.webp";
import User3 from "../../assets/users/Image3.webp";
import User4 from "../../assets/users/Image4.webp";
import User5 from "../../assets/users/Image5.webp";
import User6 from "../../assets/users/Image6.webp";
import User7 from "../../assets/users/Image7.webp";
import User8 from "../../assets/users/Image8.webp";

import {ReactComponent as Plus} from "../../assets/plus-icon.svg"; // taken from https://iconmonstr.com/plus-6-svg/, replace with custom icon later

function Paragraphs(props) { // carousel for collaborative writing
    const elementsRef = useRef([]);

    function handleChange(ref, index) { // update paragraph response
        let value = props.value;
        value[index] = ref.value;
        props.setParagraph(value, props.id);
        console.log("props.value type: ", typeof props.value);
        console.log("props type:", typeof props);
        console.log("props[0] type: ", typeof props[0]);
        console.log("props.value[0] type", typeof props.value[0]);
    }

    function handlePlusClick () { // add text area to paragraph component
        //props.value[0].push;
        
        console.log("add paragraph box");


    }

    return (
        <div>
            <div className="paragraph">
                <div className="inner-box">
                    <Plus className="plus-icon" onClick={() => handlePlusClick()} />
                    {   
                        props.value.map((data, index) => ( // spawn paragraph response 
                            <textarea key={"ParagraphText"+index} ref={(el) => (elementsRef.current[index] = el)} value={data} onChange={() => handleChange(elementsRef.current[index], index)} />
                        ))
                    }
                    
                </div>
            </div>
        </div>

    );
}
    
export default Paragraphs;