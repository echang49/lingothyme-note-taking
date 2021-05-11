import User1 from "../../assets/users/Image1.webp";
import User2 from "../../assets/users/Image2.webp";
import User3 from "../../assets/users/Image3.webp";
import User4 from "../../assets/users/Image4.webp";
import User5 from "../../assets/users/Image5.webp";
import User6 from "../../assets/users/Image6.webp";
import User7 from "../../assets/users/Image7.webp";
import User8 from "../../assets/users/Image8.webp";

function User(props) {
    function renderProfilePicture(image){
        switch(image){
            case 1:
                return User1;
            case 2:
                return User2;
            case 3:
                return User3;
            case 4:
                return User4;
            case 5:
                return User5;
            case 6:
                return User6;
            case 7:
                return User7;
            case 8:
                return User8;
        }
    }

    return (
        <div className="users">
            <img src={renderProfilePicture(props.picture)} height="48px" width="48px" alt="Profile picture of user" />
            <p className="name">{props.name}</p>
        </div>
    );
}
    
export default User;