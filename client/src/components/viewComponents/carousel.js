import Brainstorm from "./brainstormResponse";
function Carousel(props) { // carousel for collaborative writing
    return (
        <div className="carousel">
            <h1>Carousel</h1>
            <div className="carousel-row">
               {
                    props.brainstormList.map((data) => ( // spawn brainstorm response bubbles in carousel 
                        <Brainstorm key={"Brainstorming"+data[2]} userID={data[1]} value={data[0]} id={data[2]} />
                    ))
                }
            </div>
        </div>

    );
}
    
export default Carousel;

