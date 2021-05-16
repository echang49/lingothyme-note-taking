import Brainstorm from "./brainstormResponse";
function Carousel() { // carousel for collaborative writing
    return (
        <div className="carousel">
            <h1>Carousel</h1>
            <div class="carousel-row">
                <Brainstorm userID="1" value="hello" id="1" />
                <Brainstorm userID="1" value="hello" id="2"/>
                <Brainstorm userID="1" value="hello" id="3"/>
                <Brainstorm userID="1" value="hello" id="4"/>
            </div>
        </div>

    );
}
    
export default Carousel;

