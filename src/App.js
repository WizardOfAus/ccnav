import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import MapView from './components/MapView';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
          <div className="App">
              <AppBar
                  title="Title"
                  iconClassNameRight="muidocs-icon-navigation-expand-more"
              />
            <MapView />
          </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
