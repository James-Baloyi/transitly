import React from "react";
import "./ComponentCSS.css";

export default class HeaderText extends React.Component{
    render(){
        return(
            <h1 className="heroText">{this.props.text}</h1>
        );
    }
}
