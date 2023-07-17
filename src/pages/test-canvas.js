import React,{ useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import LeafletCanvasMarker from './LeafletCanvasMarker';
const center = [37.005, 126.3317];

const MapWrapper = () => {
  const [map, setMap] = useState(null);
  return (
<MapContainer center={center} zoom={10} style={{ height: "100vh" }}>
   <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
   <LeafletCanvasMarker />
</MapContainer>
  )
}

export default MapWrapper;