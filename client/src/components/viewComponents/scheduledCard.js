import Calendar from "../../assets/calendar-icon.svg";
import People from "../../assets/people-icon.svg";
function scheduledCard({title, card_content, time, capacity }) { // same as ongoingCard, with added number of current users in room
    return (
        <div className="card">
            <div className="card-header"> 
                {/* add icon here  */}
                <h1>{title}</h1>
            </div>
            <hr></hr>
            <div className="card-content">
                <p>{card_content}</p>
            </div>

            <div className="icon1">
                <img src={Calendar} alt="calendar icon" height="30px"/>
            </div>

            <div className="date-text">
                <p><div className="time"> {time}</div></p>
            </div>

            <div className="icon2-scheduled">
                <img src={People} alt="add people icon" height="30px"/>
            </div>


            <div className="room-size-text-scheduled">
                <p>{capacity}</p>
            </div>

            <button className="join-button-scheduled">Join</button>
        </div>
        
        
    );
}
    
export default scheduledCard;