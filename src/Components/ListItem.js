import React from "react";
import "./ComponentCSS.css";

export default class ListItem extends React.Component{
    render(){
        return(
            <div className="listItem">
            <b>{this.props.title}</b><br/>
            <small>Arrival Time: {this.props.arrival.replace("Z","")} &nbsp; Departure Time: {this.props.departure.replace("Z","")}</small><br/>
            <small>Distance: {this.props.distance.toFixed(2)}km &nbsp; Duration: {this.props.duration*60} minutes</small><br/>
            </div>
        );
    }
}
