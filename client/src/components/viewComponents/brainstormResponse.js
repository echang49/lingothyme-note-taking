// import {brainstorm_post_flag as Logo} from "../../assets/brainstorm_post_flag.svg";
import Draggable from 'react-draggable';

function Brainstorm(props) {
    let color = "color-"+props.userID;
    return (
        <div>
            <div className={"brainstorming " + color} >

                <textarea>test text</textarea>
            </div>
        </div>
    );
}
    
export default Brainstorm; 