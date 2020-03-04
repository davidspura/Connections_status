import React from "react";
//import moment from "moment";

const Celkovystatus = props => {
  const api = props.sluzby.api.map(data => {
    return data.status;
  });
  const xmpp = props.sluzby.xmpp.map(data => {
    return data.status;
  });
  console.log(props.time);
  return (
    <div className="all">
      <h1>Barkio services status</h1>

      {api[api.length - 1] && xmpp[xmpp.length - 1] === true ? (
        <p>All server components operational</p>
      ) : (
        <p>
          We are recognizing issues on the server
          <br />
          since {props.time}
        </p>
      )}
    </div>
  );
};

export default Celkovystatus;
