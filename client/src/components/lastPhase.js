function lastPhase() {
    const [ url, setURL ] = useState("/");
  
    return (
      <div>
        {
            <div className="lastPhase center">
              <img src={Logo} alt="LingoThyme logo" height="250px"/>
              <div className="lastPhase">
                <p>The host has ended the meeting, thanks for joining.</p>
                <div className="buttons">
                  <Link className="exit-button" to="/">Exit</Link>
                </div>
              </div>
            </div>
        }
      </div>
  
      );
    }
    
    export default lastPhase;