function Brainstorm(props) {
    let color = "color-"+props.userID;
    return (
        <div>
            <textarea className={"brainstorming " + color} ></textarea>
        </div>
    );
}
    
export default Brainstorm;