import React from "react";
import "./ComponentCSS.css";
import Logo from "../Images/fyt.png";

export default class Header extends React.Component{
    constructor(){
        super();
        this.state = {
            heaederClass: "header big",
            logoClass: "top"

        }
    }

    componentDidMount(){
        if(this.props.small){
            this.setState({headerClass: "header small"});
            this.setState({logoClass: "top"});
        }else{
            this.setState({headerClass: "header big"});
            this.setState({logoClass: "centre"});
        }
    }

    render(){
        return(
        <div className={this.state.headerClass}>
            <div className="overlay"><br/>
            <img src={Logo} className={this.state.logoClass} alt="Logo Image" draggable="false" onContextMenu={(event)=>{event.preventDefault()}}/>
            </div>
        </div>
        );
    }
}
