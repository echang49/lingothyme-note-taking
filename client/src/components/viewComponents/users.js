function User(props) {
    return (
        <div className="users">
            <img src={props.picture} height="48px" width="48px" alt="Profile picture of user" />
            <p className="name">{props.name}</p>
        </div>
    );
}
    
export default User;