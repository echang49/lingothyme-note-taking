import Clock from "../../assets/time-icon.svg";
import People from "../../assets/people-icon.svg";
import {ReactComponent as Brace} from "../../assets/note-icon.svg";
function ongoingCard(props) {
    return (
        <div className="card">
            <div className="card-header"> 
             <h1>Idea Brainstorming</h1>
            </div>

            <hr></hr>

            <p>test text</p>

            <div className="card-bottom">
                <div className="card-bottom-left-ongoing">
                    <img src={Clock} alt="clock icon" height="30px"/>
                    <p><div className="time"> 20_min_01s</div></p>
                </div>

                <div className="card-bottom-right-ongoing">
                    <img src={People} alt="add people icon" height="30px"/>
                    <p>6/8</p>
                    <button className="join-button-ongoing">Join</button>
                </div>
                
            </div>
        </div>
    );
}
    
export default ongoingCard;