import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useMap } from 'react-leaflet';

import './main.css';
import '../../App.css';

function LeafletRoutingMachine({ handleClickX }) {
  const map = useMap();

  const [values, setValues] = useState({ dep: '', des: '' });
  let DefaultIcon = L.icon({
    iconUrl: 'https://png.pngtree.com/element_pic/00/16/07/1057826efdb4355.jpg',
    iconSize: [90, 90],
  });

  useEffect(() => {
    L.Routing.control({
      waypoints: [],
      lineOptions: {
        styles: [
          {
            color: 'blue',
            weight: 4,
            opacity: 0.7,
          },
        ],
      },
      routeWhileDragging: false,
      geocoder: L.Control.Geocoder.nominatim(),
      addWaypoints: true,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: true,
    })
      .on('routesfound', function (e) {
        setValues({ dep: e.waypoints[0].name, des: e.waypoints[1].name });
        handleClickX({ dep: e.waypoints[0].name, des: e.waypoints[1].name });
      })
      .addTo(map);
  }, [map, DefaultIcon]);

  return <div></div>;
}

export default LeafletRoutingMachine;
