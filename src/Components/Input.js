import React from "react";
import "./ComponentCSS.css";

export default class Input extends React.Component{
    render(){
        return(
            <input type="text" className="defaultInput" placeholder={this.props.placeholder} onInput={this.props.onInput}/>
        );
    }
}
