function Brainstorm(props) {
    let color = "color-"+props.userID;
    return (
        <div>
            <div className={"brainstorming-" + color} >
                <textarea>test text</textarea>
            </div>
        </div>
    );
}
    
export default Brainstorm;