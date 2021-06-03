function Question(props) {
    return (
        <div className="questions">
            <h1>Topic</h1>
            <p>{props.question}</p>
        </div>
    );
}
    
export default Question;

