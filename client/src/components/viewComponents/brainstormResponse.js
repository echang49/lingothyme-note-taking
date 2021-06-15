import { useRef } from "react";
function Brainstorm(props) {
    const textInput = useRef(null);
    let color = "color-"+props.userID;

    function handleChange() { // update contents of brainstorm response
        let id = props.id;
        props.setBrainstorm(textInput.current.value, id);
    }

    if(typeof props.setBrainstorm === "function") {
        return (
            <div>
                <div className={"brainstorming " + color} >
                    <textarea ref={textInput} value={props.value} onChange={() => handleChange()}></textarea>
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