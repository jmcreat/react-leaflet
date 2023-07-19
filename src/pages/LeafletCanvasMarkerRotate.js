import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet-canvas-marker";
import L from "leaflet";
//tooltip + canvas
export default function LeafletCanvasMarkerRotate() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    var ciLayer = L.canvasIconLayer({}).addTo(map);

    ciLayer.addOnClickListener(function (e, data) {
      console.log(data);
    });
    ciLayer.addOnHoverListener(function (e, data) {
      console.log(data[0].data._leaflet_id);
    });

    var icon = L.icon({
      iconUrl: "http://localhost:8080/asset/img/vessel_pink.png",
      iconSize: [20, 10],
      iconAnchor: [10, 9],
    });

    var markers = [];
    for (var i = 0; i < 500; i++) {
      var marker = L.marker(
        [37.005 + Math.random() * 1.8, 126.3317 + Math.random() * 3.6],

        { icon: icon }
      )
      .bindPopup("I Am popup " + i);
      var tooltip = L.tooltip({
        permanent: true,
        direction: "center",
        className: "text",
        offset: [0, 0],
        opacity: 0.8,
        interactive: true,
      }).setContent("I Am " + i);
      marker.bindTooltip(tooltip);
      markers.push(marker);
    }
    
    ciLayer.addLayers(markers);
    console.log("ciLayer")
    console.log(ciLayer)
  }, [map]);

  return null;
}