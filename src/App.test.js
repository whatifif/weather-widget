import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from 'enzyme';

describe('App', function() {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('contains App class', function() {
    expect(shallow(<App />).is('.App')).toBe(true);
  });

  it('contains App-header', function() {
    expect(shallow(<App />).find('.App-header').length).toBe(1);
  });

  it('contains App-intro', function() {
    expect(mount(<App />).find('.App-intro').length).toBe(1);
  });

  it('contains App-loading', function() {
    expect(mount(<App />).find('.App-loading').length).toBe(1);
  });

});


