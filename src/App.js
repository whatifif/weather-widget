import React, { Component } from 'react';
// import logo from './logo.svg';
import loadingImg from './ajax-loader.gif';
import './App.css';
import superagent from 'superagent';
import config from './config';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      weather: [{description: null, main: null}],
      wind: {deg: null, speed: null},
      showWind: false,
      units: 'metric',
      loading: true,
      loaded: false
    }
  }
  componentWillMount() {
    let params;
    if(location.href.split('?')[1]){
      params = location.href.split('?')[1].split('&');
    }else{
      params = ["title=Weather%20Widget", "showWind=true", "units=metric"];
    }

    let data = {};
    for (let x = 0; x < params.length; x++) {
      data[params[x].split('=')[0]] = params[x].split('=')[1];
    }

    const __title = decodeURI(data.title) || 'Weather Widget';
    const __showWind = data.showWind === 'true' ? true : false;
    const __units = data.units ? data.units : 'metric';

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {

        const api = config.api;
        const APPID = config.APPID;
        var pos = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        const option = {title: __title, showWind: __showWind, units: __units}
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
              title: option.title,
              weather:[{description:data.weather[0].description, main: data.weather[0].main}],
              wind: {deg: data.wind.deg, speed: data.wind.speed},
              showWind: option.showWind,
              units: option.units,
              loading: false,
              loaded: true
            });
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
          <h2>{this.state.title}</h2>
        </div>
        <div className="App-intro">
          {this.state.loading && <div className="App-loading"><img src={loadingImg} alt="loading" /></div>}
          {this.state.loaded && this.state.weather.map(function(item, index){
            return (
              <div key={index}>
                <h3 className="weather">Weather</h3>
                <div>{item.main} : {item.description}</div>
              </div>
              );
          })}
        </div>
        <p>&nbsp;</p>
        <div>
          { this.state.showWind ? <div><h3 className="wind">Wind</h3>deg: {this.state.wind.deg} speed: {this.state.wind.speed}  (<span className="App-units">{this.state.units}</span>)</div> : null }
        </div>
      </div>
    );
  }
}

export default App;
