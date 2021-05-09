import Flag from "../../assets/brainstorm_post_flag.svg";
function Brainstorm(props) {
    let color = "color-"+props.userID;
    return (
        <div>
            <div className={"brainstorming " + color} >
                <textarea></textarea>
            </div>
        </div>
    );
}
    
export default Brainstorm;