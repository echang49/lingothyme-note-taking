import User from "./users";
import User1 from "../../assets/users/Image1.webp";
import User2 from "../../assets/users/Image2.webp";
import User3 from "../../assets/users/Image3.webp";
import User4 from "../../assets/users/Image4.webp";
import User5 from "../../assets/users/Image5.webp";
import User6 from "../../assets/users/Image6.webp";
import User7 from "../../assets/users/Image7.webp";
import User8 from "../../assets/users/Image8.webp";

function Paragraphs() { // carousel for collaborative writing
    return (
        <div>
            <div className="paragraph-outer">
                <div className="paragraph-inner"></div>
                    <div className="paragraph-user-box">
                        <User picture={User1}/>
                        <User picture={User2}/>
                        <User picture={User3}/>
                    </div>
                
                    <div className="break"></div>

                    <textarea readonly>In this day and age, we are dealing with</textarea>
                    <textarea readonly>In this day and age, we are dealing with</textarea>
                    <textarea readonly>In this day and age, we are dealing with</textarea>
            </div>

        </div>

    );
}
    
export default Paragraphs;