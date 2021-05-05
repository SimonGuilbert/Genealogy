import React, {useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
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

export default function MapView() {

  const [people, addPeople] = useState([]);
  
  useEffect(() => {
    fetchPeople();
    console.log(people);
  }, []);

  const fetchPeople = () => {
    makeGetRequest('http://localhost:3001/api/v1/data/guilly')
    .then(( data ) => addPeople(data))
    .catch((err) => console.log(err))
  }
  

  return (
    <MapContainer center={{ lat: 46.227600, lng: 2.213700 }} zoom={3}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
    
    {people.map((value, index) => {
                    return <Marker position={[value.events[0]?value.events[0].place.latitude:"", value.events[0]?value.events[0].place.longitude:""]}>
                      <Tooltip>{value.events[0]?value.events[0].date:""}</Tooltip>
                    </Marker>
                    })}

    </MapContainer>
  );

}