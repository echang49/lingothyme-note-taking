import Calendar from "../../assets/calendar-icon.svg";
import People from "../../assets/people-icon.svg";
function scheduledCard(props) { // same as ongoingCard, with added number of current users in room
    return (
        <div className="card">
            <div className="card-header"> 
                {/* add icon here  */}
                <h1>Idea Brainstorming</h1>
            </div>
            <hr></hr>
            <div className="card-content">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada massa odio, sed 
                    sagittis justo vehicula eget. In pharetra auctor purus, et pretium urna dictum quis.</p>
            </div>

            <div className="icon1">
                <img src={Calendar} alt="calendar icon" height="30px"/>
            </div>

            <div className="date-text">
                <p><div className="time"> 06 July 2021 10:00</div></p>
            </div>

            <div className="icon2-scheduled">
                <img src={People} alt="add people icon" height="30px"/>
            </div>

            <div className="room-size-text-scheduled">
                <p>6/8</p>
            </div>

            <button className="join-button-scheduled">Join</button>
        </div>
        
        
    );
}
    
export default scheduledCard;