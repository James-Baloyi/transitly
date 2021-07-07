import Header from "./Components/Header";
import HeaderText from "./Components/HeaderText";
import Input from "./Components/Input";
import MainButton from "./Components/MainButton";
import StyletFix from "./HeightFix";
import ListItem from "./Components/ListItem";


import './App.css';
import React from "react";

export default class App extends React.Component{
  constructor(){
    super();

    this.state = {
      headerSmall: false,
      headerText: "Where to?",
      pickup: "Midrand",
      destination: "Centurion",
      pickupCoords: {Latitude: -26.1714402, Longitude: 28.005005},
      destinationCoords: {Latitude: -26.2058116, Longitude: 28.0419003},
    }
  }
  componentDidMount(){
    new StyletFix();
  }

  calculateFare(){
    if(!localStorage.getItem("token")){
      this.getToken();
    }else{
      window.token = localStorage.getItem("token");
      this.geocodePickup(this.state.pickup);
    }
  }

  getToken(){
    var CLIENT_ID = "f3fd79b2-9e20-4e8f-b6f7-7a421dd2315b";
    var CLIENT_SECRET = "Z0SAyjePHlCQgwGHZcB1FD+W8EJ3sX7tMt+04TFJcuA=";
    var payload = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'transportapi:all'
    };
  var request = new XMLHttpRequest();
  request.open('POST', 'https://identity.whereismytransport.com/connect/token', true);
  request.onload = () => {
    var response = JSON.parse(request.responseText);
    var token = response.access_token;
    window.token = token;
    localStorage.setItem("token", token);
    this.calculateFare();
  };
  request.setRequestHeader('Accept', 'application/json');
  var formData = new FormData();

  for (var key in payload) {
    formData.append(key, payload[key]);
  }
  request.send(formData);
  }


  requestRoute(token){
    var legs = new Array();
    var body = {
      geometry: {
        type: 'Multipoint',
        coordinates: [[this.state.pickupCoords.Latitude, this.state.pickupCoords.Longitude], [this.state.destinationCoords.Latitude, this.state.destinationCoords.Longitude]]
      }
    };
    var request = new XMLHttpRequest();
    request.onload = () => {
      var response = JSON.parse(request.responseText);

      var theseLegs = response.itineraries;
      if(theseLegs.length < 1){
        alert("No results found...")
      }
      
      for(var i = 0; i < theseLegs.length; i++){
      var data = response.itineraries[i];
      var thisTrip = {
        distance: data.distance.value/1000,
        duration: (data.duration/3600).toFixed(2),
        arrival: data.arrivalTime.split("T")[1],
        departure: data.departureTime.split("T")[1]
      }
      legs.push(thisTrip);
      this.setState({legs});
      document.getElementsByClassName("resultsPanel")[0].style.display = "block";
      
    }

    };
    request.open('POST', 'https://platform.whereismytransport.com/api/journeys', true);
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send(JSON.stringify(body));
  }


  geocodePickup(){
    var text = this.state.pickup;
    var request = new XMLHttpRequest();
    var url = "https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=puSGOfUIqGB4nf2mJen_lfqfBAtLzj-eqAVpmKXyXEY&searchtext="+text;
    request.onload = () => {
      var response = JSON.parse(request.responseText);
      console.log("HERE PICKUP", response)
      try{
      var pickupCoords = response.Response.View[0].Result[0].Location.DisplayPosition;
      this.setState({pickupCoords});
      this.geocodeDestination();
      }catch(e){
        alert("Error", e);
      }
    }
    request.open("GET", url, true);
    request.send();
  }


  geocodeDestination(){
    var text = this.state.destination;
    var request = new XMLHttpRequest();
    var url = "https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=puSGOfUIqGB4nf2mJen_lfqfBAtLzj-eqAVpmKXyXEY&searchtext="+text;
    request.onload = () => {
      var response = JSON.parse(request.responseText);
      console.log("HERE DESTINATION", response)
      var destinationCoords = response.Response.View[0].Result[0].Location.DisplayPosition;
      this.setState({destinationCoords});
      this.requestRoute(window.token);
    }
    request.open("GET", url, true);
    request.send();
  }


  render(){
    if(this.state.legs){
      var legs = this.state.legs;
      var legList = legs.map((leg)=>{
        return(
          <ListItem title={this.state.pickup + "  to  " + this.state.destination} arrival={leg.arrival} departure={leg.departure} distance={leg.distance} duration={leg.duration}/>
        );
      })
    }

  return (
    <div className="App">
      <Header small={this.state.headerSmall}/>
      <br/>
      <HeaderText text={this.state.headerText}/>
      <br/>
      <div className="inputParent">
      <Input placeholder="Pickup Point" value={this.state.pickup} onInput={(event)=>{this.setState({pickup: event.target.value})}}/><br/>
      <Input placeholder="Destination" value={this.state.value} onInput={(event)=>{this.setState({destination: event.target.value})}}/><br/>
      </div><br/>
      <MainButton title="Get Fare" onClick={()=>{this.calculateFare()}}/>


      <div className="resultsPanel">
      <HeaderText text="Results"/>
      {legList}
      <br/>
      <MainButton title="Search Again" onClick={()=>{window.location.reload()}}/>
      </div>
      <br/>
      
    </div>
  );
}
}

