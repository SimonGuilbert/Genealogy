import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import Button from '@material-ui/core/Button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";

//{ people.map(person => <Marker position={[person.events.place.latitude, person.events.place.longitude]}></Marker>)}


/*
{people.map((value, index) => {
                    return <Marker position={[value.events.place.latitude, value.events.place.longitude]}></Marker>
                    })}
*/

//value.events[0]?value.events[0].place.latitude:""

async function makeGetRequest(url) {

  let res = await axios.get(url);

  let data = res.data;

  return data;
}

const icon = L.icon({
  iconUrl: 'marker.png',

  iconSize:     [15, 20], // size of the icon
  iconAnchor:   [7, 10], // point of the icon which will correspond to marker's location
});

export default function MapView({actualName, setActualName}) {

  const [people, addPeople] = useState([]);
  
  useEffect(() => {
    console.log(actualName);
    fetchPeople();
  }, []);

  const fetchPeople = () => {
    makeGetRequest('http://localhost:3001/api/v1/data/' + actualName)
    .then(( data ) => addPeople(data))
    .catch((err) => console.log(err))
  }
  

  return (
    <div>
      <Button variant="contained" onClick={fetchPeople} id="refreshButton">Rafraichir</Button>
      <MapContainer center={{ lat: 46.227600, lng: 2.213700 }} zoom={5}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
      
      {people.map((value, index) => {
                      return <Marker position={[value.events[0]?value.events[0].place.latitude:"", value.events[0]?value.events[0].place.longitude:""]} icon={icon}>
                        <Tooltip>{value.events[0]?value.events[0].date:""}</Tooltip>
                      </Marker>
                      })}

      </MapContainer>
    </div>
  );

}