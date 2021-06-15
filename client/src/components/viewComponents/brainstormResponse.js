import { useRef } from "react";

let startIndex, stopIndex;

function Brainstorm(props) {
    const textInput = useRef(null);
    let color = "color-"+props.userID;

    function handleChange(el) { // update contents of brainstorm response
        let id = props.id;
        //props.setBrainstorm(textInput.current.value, id);
        props.setBrainstorm(startIndex, stopIndex, el.nativeEvent.inputType, el.nativeEvent.data, id);
        startIndex = el.target.selectionStart;
        stopIndex = el.target.selectionEnd;
    }
    
    function handleMouseUp(el) {
        startIndex = el.target.selectionStart;
        stopIndex = el.target.selectionEnd;
    }

    function handleKeyUp(el) {
        if(el.code === "ArrowUp" || el.code === "ArrowLeft" || el.code === "ArrowRight" || el.code === "ArrowDown") { //changing spot
            startIndex = el.target.selectionStart;
            stopIndex = el.target.selectionEnd;
        }
    }

    //on arrow key press

    if(typeof props.setBrainstorm === "function") {
        return (
            <div>
                <div className={"brainstorming " + color} >
                    <textarea ref={textInput} value={props.value} onChange={(el) => handleChange(el)} onMouseUp={(el) => handleMouseUp(el)} onKeyUp={(el) => handleKeyUp(el)}></textarea>
                </div>
            </div>
        );
    }
    else {
        return(
            <div>
                <div className={"brainstorming " + color} >
                    <textarea ref={textInput} value={props.value} readOnly></textarea>
                </div>
            </div>
        );
    }
}
    
export default Brainstorm;