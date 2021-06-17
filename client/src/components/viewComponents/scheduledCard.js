import Calendar from "../../assets/calendar-icon.svg";
import People from "../../assets/people-icon.svg";
function scheduledCard(props) { // same as ongoingCard, with added number of current users in room
    return (
        <div className="card">
            <div className="card-header"> 
             <h1>Idea Brainstorming</h1>
            </div>

            <hr></hr>

            <p>test text</p>

            <div className="card-bottom">
                <div className="card-bottom-left-scheduled">
                    <img src={Calendar} alt="calendar icon" height="30px"/>
                    <p><div className="time"> 06_July_2021_10:00</div></p>
                </div>
                <div className="card-bottom-right-scheduled">
                    <img src={People} alt="add people icon" height="30px"/>
                    <p>6/8</p>
                    <button className="join-button-scheduled">Join</button>
                </div>       
            </div>
        </div>
        
        
    );
}
    
export default scheduledCard;