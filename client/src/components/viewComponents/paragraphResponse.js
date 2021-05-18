import { useRef, createRef } from "react";

import User from "./users";
import User1 from "../../assets/users/Image1.webp";
import User2 from "../../assets/users/Image2.webp";
import User3 from "../../assets/users/Image3.webp";
import User4 from "../../assets/users/Image4.webp";
import User5 from "../../assets/users/Image5.webp";
import User6 from "../../assets/users/Image6.webp";
import User7 from "../../assets/users/Image7.webp";
import User8 from "../../assets/users/Image8.webp";

function Paragraphs(props) { // carousel for collaborative writing
    const elementsRef = useRef([]);

    function handleChange(ref, index) {
        let value = props.value;
        value[index] = ref.value;
        props.setParagraph(value, props.id);
    }

    return (
        <div>
            <div className="paragraph">
                <div className="inner-box">
                    {
                        props.value.map((data, index) => (
                            <textarea key={"ParagraphText"+index} ref={(el) => (elementsRef.current[index] = el)} value={data} onChange={() => handleChange(elementsRef.current[index], index)} />
                        ))
                    }
                </div>
            </div>
        </div>

    );
}
    
export default Paragraphs;