import * as React from 'react';
import { withJsonFormsControlProps } from "@jsonforms/react";
import { MapContainer, TileLayer } from 'react-leaflet';
import Location  from './Location';

import 'leaflet/dist/leaflet.css';

interface LocationControlProps {
	data: any;
	handleChange(path: string, value: any): void;
	path: string;
}
const center = {
  lat: 51.505,
  lng: -0.09,
}

const LocationControl = ({ data, handleChange, path }: LocationControlProps) => (
	    
	    <Location />
);

export default withJsonFormsControlProps(LocationControl);