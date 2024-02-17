import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import './maps.css';
import L from 'leaflet';
import LeafletRoutingMachine from '../maps/LeafletRoutingMachine';


const Maps = () => {
  return (
    <MapContainer >
      <LeafletRoutingMachine></LeafletRoutingMachine>{' '}
    </MapContainer>
  );
};
let DefaultIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1673/1673221.png',
  iconSize: [30, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;
export default Maps;
