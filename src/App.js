import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import superagent from 'superagent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {weather: [{description: null, main: null}], wind: {deg: null, speed: null}, showWind: false, units: null }
  }
  componentWillMount() {
    window.__showWind = true;
    // window.showWind = false;
    // window.__units = 'metric';
    window.__units = 'imperial';

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {

        const api = "http://api.openweathermap.org/data/2.5/weather";
        const APPID = "607b30ed81b1a987b170c14c6bc01d80";
        var pos = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        // const option = {units: 'metric'}
        // const option = {units: 'imperial'}
        const option = {units: window.__units}
        const KEY = {APPID}
        superagent
          .get(api)
          .query(pos)
          .query(option)
          .query(KEY)
          .set('Accept', 'application/json')
          .end((err, res) => {
            const data = JSON.parse(res.text);
            this.setState({
              weather:[{description:data.weather[0].description, main: data.weather[0].main}],
              wind: {deg: data.wind.deg, speed: data.wind.speed},
              showWind: window.__showWind,
              units: option.units
            });
            console.log(data);
        });

      });
    } else {
      // Browser doesn't support Geolocation
      const err = "Browser doesn't support Geolocation";
      console.log(err);
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to weather widget</h2>
        </div>
        <div className="App-intro">
          {this.state.weather.map(function(item, index){
            return (
              <div key={index}>
                <h3>Weather</h3>
                <div>main: {item.main}</div>
                <div>description: {item.description}</div>
              </div>
              );
          })}
        </div>
        <div>
          { this.state.showWind ? <div><h3>Wind (unit: {this.state.units})</h3>deg: {this.state.wind.deg} speed: {this.state.wind.speed} </div> : null }
        </div>
      </div>
    );
  }
}

export default App;
