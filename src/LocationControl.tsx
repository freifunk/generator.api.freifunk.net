import { withJsonFormsControlProps } from "@jsonforms/react";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Location }  from './Location';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// MapCenter component to update the map view when center changes
function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [map, center]);
  return null;
}

interface LocationControlProps {
	data: any;
	handleChange(path: string, value: any): void;
	path: string;
}

let center = {
  lat: 51.1657,
  lng: 10.4515
}

const LocationControl: React.FC<LocationControlProps> = ({ data, handleChange, path }) => {
  const [mapCenter, setMapcenter] = useState(center);

  // Update map center when data changes
  useEffect(() => {
    if (data && typeof data.lat === 'number' && typeof data.lon === 'number') {
      setMapcenter({
        lat: data.lat,
        lng: data.lon
      });
    }
  }, [data]);

  return(
  	<MapContainer center={mapCenter} zoom={7} scrollWheelZoom={false} style={{ height: '20rem', width: '100wh' }}>
      <MapUpdater center={mapCenter} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Location 
      	value = {data}
      	updateCords={(newValue: Object) => handleChange(path, newValue)}
      />
  	</MapContainer>
  )
};

export default withJsonFormsControlProps(LocationControl);