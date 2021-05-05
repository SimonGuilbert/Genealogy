import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: { lat: 46.227600, lng: 2.213700 },
      zoom: 3,
    }
  }

  state = {
    persons: []
  }

  componentDidMount() {
    axios.get(`http://localhost:3001/api/v1/`)
      .then(res => {
        const persons = res.data;
        this.setState({ persons });
      })
  }

  render() {
    const { currentLocation, zoom } = this.state;

    return (
      <MapContainer center={currentLocation} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />

        { this.state.persons.map(person => <Marker position={[person.events.place.latitude, person.events.place.longitude]}></Marker>)}
        
      </MapContainer>
    );
  }
}

export default MapView;