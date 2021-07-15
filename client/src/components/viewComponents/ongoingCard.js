import Clock from "../../assets/time-icon.svg";
import People from "../../assets/people-icon.svg";
import {ReactComponent as Brace} from "../../assets/note-icon.svg";
function ongoingCard({title, card_content, time, capacity }) {
    return (
        <div className="card">
            <div className="card-header">
                {/* add icon here  */}
                <h1>Idea Brainstorming</h1>
                <h1>{title}</h1>
            </div>
            <hr></hr>

            <div className="card-content">
                <p>{card_content}</p>
            </div>

            <div className="icon1">
                <img src={Clock} alt="clock icon" height="30px"/>
            </div>

            <div className="date-text">
                <p><div className="time"> {time}</div></p>
            </div>

            <div className="icon2-ongoing">
                <img src={People} alt="add people icon" height="30px"/>
            </div>

            <div className="room-size-text-ongoing">
                <p>6/8</p>
            </div>

            <button className="join-button-ongoing">Join</button>




        </div>
    );
}
    
export default ongoingCard;