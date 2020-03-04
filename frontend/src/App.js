import React, { Component } from "react";
import "./App.css";
//import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import Celkovystatus from "./components/Celkovystatus";
import Apistatus from "./components/Apistatus";
import Xmppstatus from "./components/Xmppstatus";
const nodeSever = "http://localhost:3001/";
const errTime = "http://localhost:3001/time";
export class App extends Component {
  state = {
    time: [],
    sluzby: {
      api: [],
      xmpp: [
        {
          id: 1,
          time: 500,
          status: true
        },
        {
          id: 2,
          time: 650,
          status: true
        },
        {
          id: 3,
          time: 550,
          status: true
        }
      ]
    }
  };

  componentDidMount() {
    async function getNode() {
      let node = await fetch(nodeSever);
      let data = await node.json();
      return data;
    }
    getNode().then(data => {
      const sluzby = { ...this.state.sluzby };
      sluzby.api = data;
      this.setState({ sluzby });
    });

    async function geterrTime() {
      let getErrTime = await fetch(errTime);
      let data = await getErrTime.json();
      return data;
    }
    geterrTime().then(data => {
      this.setState({ time: data });
    });
  }

  render() {
    const { sluzby, time } = this.state;
    return (
      <div className="container">
        <div className="text-center">
          <Celkovystatus sluzby={sluzby} time={time} />
          <h4>API server status</h4>
          <Apistatus sluzby={sluzby.api} />
          <h4>XMPP server status</h4>
          <Xmppstatus sluzby={sluzby.xmpp} />
        </div>
      </div>
    );
  }
}

export default App;
