/* eslint-disable react/prop-types */
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"
const Map = ({ position, popUp }) => {
  const icon = L.icon({ iconUrl: "/marker-icon.png" });
  return (
    <MapContainer
      // className="mx-auto z-10"
      center={position}
      zoom={12}
      scrollWheelZoom={true}
      style={{
        width: "100%",
        height: "200px",
        zIndex: 1,
        margin: "auto",
        border: "1px solid black",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={icon} position={position}>
        <Popup>{popUp}.</Popup>
      </Marker>
    </MapContainer>
  );
};


export default Map;
