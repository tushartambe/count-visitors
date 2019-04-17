import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { totalVisits: 0, userVisit: 0 };
    this.updateCount = this.updateCount.bind(this);
  }

  updateCount(event) {
    event.preventDefault();

    let data = new FormData(event.target);
    let userName = data.get("userName");
    fetch("/update-user-count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName })
    })
      .then(res => res.json())
      .then(body => {
        this.setState({
          totalVisits: body.totalCount,
          userVisit: body.userCount
        });
      });

    document.getElementById("user-name-form").reset();
  }

  render() {
    return (
      <div className="from-div">
        <div>
          <form id="user-name-form" onSubmit={this.updateCount}>
            <input
              className="user-name"
              type="text"
              name="userName"
              placeholder={`username`}
              required
            />
            <br />
            <input className="submit-button" type="submit" />
          </form>
        </div>
        <span className="count" id="displayCount">
          <span>Total Visitor Count :{this.state.totalVisits}</span>
          <br />
          <span>Your visits :{this.state.userVisit}</span>
        </span>
      </div>
    );
  }
}
export default App;
