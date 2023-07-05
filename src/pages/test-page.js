import { useState, useEffect,useCallback, useRef } from "react";
import styles from "./random-marker-in-map-bounds.module.css";
import { MapContainer, TileLayer } from 'react-leaflet';
import tileLayer from '../util/tileLayer';
import L from "leaflet";
const center = [37.5665, 126.9780];
const RandomMarkerInMapBounds = ({ map }) => {
const ws = useRef(null);
const [socketData, setSocketData] = useState();
  const webSocketLogin = useCallback(() => {
    ws.current = new WebSocket("ws://localhost:8080/websocket");
    console.log("test")
    ws.current.onopen = () => {
      console.log('WebSocket 연결이 열렸습니다.');
      // 원하는 로직을 추가합니다.
    };
    ws.current.onmessage = (message) => {
      console.log(message)
      console.log("onmessage")
        const dataSet = JSON.parse(message.data);
        setSocketData(dataSet);
    }
    ws.current.onclose = (message) => {
      console.log(message)
      console.log("onmessage")
      const dataSet = JSON.parse(message.data);
      setSocketData(dataSet);
    }
});
  useEffect(() => {

    if (!map) return;
    webSocketLogin()  // socket 연결용 함수

    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "description");
      L.DomEvent.disableClickPropagation(div);
      const text = "Dynamic generation of 30 markers in the map view";
      div.insertAdjacentHTML("beforeend", text);
      return div;
    };

    legend.addTo(map);

    // add "random" button
    const buttonTemplate =
      '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M24 22h-3.172l-5-5 5-5h3.172v5l7-7-7-7v5h-4c-0.53 0-1.039 0.211-1.414 0.586l-5.586 5.586-5.586-5.586c-0.375-0.375-0.884-0.586-1.414-0.586h-6v4h5.172l5 5-5 5h-5.172v4h6c0.53 0 1.039-0.211 1.414-0.586l5.586-5.586 5.586 5.586c0.375 0.375 0.884 0.586 1.414 0.586h4v5l7-7-7-7v5z" /></svg>';

    // create custom button
    const customControl = L.Control.extend({
      // button position
      options: {
        position: "topleft",
        title: "random marker",
        className: styles.leafletRandomMarker,
      },

      // method
      onAdd: function (map) {
        this._map = map;
        return this._initialLayout();
      },

      _initialLayout: function () {
        // create button
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar " + this.options.className
        );
        this._container = container;

        L.DomEvent.disableClickPropagation(container);

        container.title = this.options.title;
        container.innerHTML = buttonTemplate;

        // action when clik on button
        // clear and add radnom marker
        L.DomEvent.on(
          container,
          "mousedown dblclic",
          L.DomEvent.stopPropagation
        )
          .on(container, "click", L.DomEvent.stop)
          .on(container, "click", removeMarkers)
          .on(container, "click", randomMarker);

        return this._container;
      },
    });

    // adding new button to map controll
    map.addControl(new customControl());

    // random color
    // ------------------------------
    const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

    // create legend
    // ------------------------------

    // add feature group to map
    const fg = L.featureGroup().addTo(map);

    // create random marker
    function randomMarker() {
      // get bounds of map
      const bounds = map.getBounds();

      let southWest = bounds.getSouthWest();
      let northEast = bounds.getNorthEast();
      let lngSpan = northEast.lng - southWest.lng;
      let latSpan = northEast.lat - southWest.lat;

      let allPoints = [];

      // generate random points and add to array 'allPoints'
      for (let i = 0; i < 15; i++) {
        let points = [
          southWest.lat + latSpan * Math.random()*10,
          southWest.lng + lngSpan * Math.random()*10,
        ];
        console.log(Math.random());
        console.log(southWest.lat + latSpan * Math.random());
        console.log(southWest.lng + lngSpan * Math.random());
        allPoints.push(points);
      }

      // add markers to feature group
      for (let i = 0; i < allPoints.length; i++) {
        L.marker(allPoints[i], {
          icon: L.divIcon({
            className: "custom-icon-marker",
            iconSize: L.point(40, 40),
            html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker"><path fill-opacity="0.25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/><path stroke="#fff" fill="#${randomColor()}" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/></svg>`,
            iconAnchor: [12, 24],
            popupAnchor: [9, -26],
          }),
        })
          .bindPopup(`<b>Marker coordinates</b>:<br>${allPoints[i].toString()}`)
          .addTo(fg);
      }

      // zoom to feature group and add padding
      map.fitBounds(fg.getBounds(), { padding: [20, 20] });
    }

    //  remove markers from feature group
    function removeMarkers() {
      fg.clearLayers();
    }

    // initialize random marker
    randomMarker();
  }, [map]);

  return null;
};
const MapWrapper = () => {
  const [map, setMap] = useState(null);
  return (
    <MapContainer
      whenCreated={setMap}
      center={center}
      zoom={15}
      scrollWheelZoom={true}
    >
      <TileLayer {...tileLayer} />

      <RandomMarkerInMapBounds map={map} />
    </MapContainer>
  )
}

export default MapWrapper;