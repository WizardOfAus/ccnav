import React, { Component } from 'react';
import './MapView.css';
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

import DirectionsWalk from 'material-ui/svg-icons/maps/directions-walk';
import DirectionsBus from 'material-ui/svg-icons/maps/directions-bus';
import DirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import DirectionsCycle from 'material-ui/svg-icons/maps/directions-bike';

import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
const walkIcon = <DirectionsWalk />;
const busIcon = <DirectionsBus />;
const carIcon = <DirectionsCar />;
const cycleIcon = <DirectionsCycle/>;

const MapElement = withScriptjs(withGoogleMap(props =>
    <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
    >
        {props.children}
    </GoogleMap>
));

const NAVIGATION_WALK = 0;
const NAVIGATION_PUBLIC = 1;
const NAVIGATION_DRIVE = 2;
const NAVIGATION_CYCLE = 3;

const API_KEY = '';

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export default class MapView extends Component {
    constructor() {
        super();
        this.state = {
            navigationType: NAVIGATION_WALK,
            src: '',
            dst: '',
            directions: null
        }
    }

    refreshDirections = debounce(() => {
        this.DirectionsService = new window.google.maps.DirectionsService();

        const TMLOOKUP = {
            [NAVIGATION_WALK]: window.google.maps.TravelMode.WALKING,
            [NAVIGATION_PUBLIC]: window.google.maps.TravelMode.TRANSIT,
            [NAVIGATION_DRIVE]: window.google.maps.TravelMode.DRIVING,
            [NAVIGATION_CYCLE]: window.google.maps.TravelMode.BICYCLING,
        };

        this.DirectionsService.route({
            origin: this.state.src,
            destination: this.state.dst,
            travelMode: TMLOOKUP[this.state.navigationType]
        }, (result, status) => {
            console.log(result, status);
            if(status === window.google.maps.DirectionsStatus.OK) {
                this.setState({
                    directions: result
                });
            } else {
                console.error('nav request failed');
            }
        });
    }, 1000);

    select = (tab) => {
        this.setState({navigationType: tab});
        this.refreshDirections();
    };

    setSrc = (e) => {
        this.setState({src: e.target.value});
        this.refreshDirections();
    };

    setDst = (e) => {
        this.setState({dst: e.target.value});
        this.refreshDirections();
    };

    render() {
        return (
            <div className="MapView">
                <Paper zDepth={2} style={{padding: '0 16px'}}>
                    <TextField value={this.state.src} hintText={this.state.src.length > 0 ? "" : "Source"} underlineShow={false} fullWidth={true} onChange={this.setSrc} />
                    <Divider />
                    <TextField value={this.state.dst} hintText={this.state.dst.length > 0 ? "" : "Destination"} underlineShow={false} fullWidth={true} onChange={this.setDst} />
                </Paper>
                <MapElement
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: `400px` }} />}
                    containerElement={<div style={{ height: `400px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                >
                    {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
                </MapElement>
                <Paper zDepth={3}>
                    <BottomNavigation selectedIndex={this.state.navigationType}>
                        <BottomNavigationItem
                            label="Walk"
                            icon={walkIcon}
                            onClick={() => this.select(NAVIGATION_WALK)}
                        />
                        <BottomNavigationItem
                            label="Public Transport"
                            icon={busIcon}
                            onClick={() => this.select(NAVIGATION_PUBLIC)}
                        />
                        <BottomNavigationItem
                            label="Drive"
                            icon={carIcon}
                            onClick={() => this.select(NAVIGATION_DRIVE)}
                        />
                        <BottomNavigationItem
                            label="Cycle"
                            icon={cycleIcon}
                            onClick={() => this.select(NAVIGATION_CYCLE)}
                        />
                    </BottomNavigation>
                    <Divider />
                    <div className="StatusBar" style={{display: 'flex', flexDirection: 'row'}}>
                        <div style={{flex: 1}}>
                            <h1>22</h1>
                            <h2>SPEED</h2>
                        </div>
                        <div style={{flex: 1}}>
                            <h1>22</h1>
                            <h2>TIME</h2>
                        </div>
                        <div style={{flex: 1}}>
                            <h1>22</h1>
                            <h2>CARBON</h2>
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
};