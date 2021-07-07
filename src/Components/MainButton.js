import React from "react";
import "./ComponentCSS.css";

export default class MainButton extends React.Component{
    render(){
        return(
            <button className="mainButton" onClick={this.props.onClick}>{this.props.title}</button>
        );
    }
}
