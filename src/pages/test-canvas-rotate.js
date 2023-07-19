import { useState, useEffect,useCallback, useRef } from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import tileLayer from '../util/tileLayer';
import L from "leaflet";
import "leaflet-canvas-markers";
import LeafletCanvasMarkerRotate from './LeafletCanvasMarkerRotate';


const center = [37.5665, 126.9780];

const MapWrapper = () => {
  const [map, setMap] = useState(null);
  return (
    <MapContainer
      whenCreated={setMap}
      center={center}
      zoom={3}
      scrollWheelZoom={true}
    >
      <TileLayer {...tileLayer} />

      <LeafletCanvasMarkerRotate map={map} />
    </MapContainer>
  )
}

export default MapWrapper;
