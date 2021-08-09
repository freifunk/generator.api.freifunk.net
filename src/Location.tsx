// import LocationPicker from '@react-location-picker';

// interface LocationProps {
// 	id?: string;
// 	value: Object;
// 	updateValue: (newValue: Object) => void;
// }

// const defaultPosition = {
//   lat: 27.9878,
//   lng: 86.9250
// };

// export class Location extends Component {
//   constructor (props) {
//     super(props);
 
//     this.state = {
//       address: "Kala Pattar Ascent Trail, Khumjung 56000, Nepal",
//       position: {
//          lat: 0,
//          lng: 0
//       }
//     };
 
//     // Bind
//     this.handleLocationChange = this.handleLocationChange.bind(this);
//   }
 
//   handleLocationChange ({ position, address, places }) {
 
//     // Set new location
//     this.setState({ position, address });
//   }
 
//   render () {
//     return (
//       <div>
//         <h1>{this.state.address}</h1>
//         <div>
//           <LocationPicker
//             containerElement={ <div style={ {height: '100%'} } /> }
//             mapElement={ <div style={ {height: '400px'} } /> }
//             defaultPosition={defaultPosition}
//             onChange={this.handleLocationChange}
//           />
//         </div>
//       </div>
//     )
//   }
// }













// import * as React from 'react';
// import { Marker, Popup } from 'react-leaflet';
// import { useState, useRef, useMemo, useCallback } from 'react';

// import 'leaflet/dist/leaflet.css';
// import 'leaflet/dist/leaflet.js';
// import L from 'leaflet';

// // delete L.Icon.Default._getIconUrl;

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });


// const center = {
//   lat: 51.505,
//   lng: -0.09,
// }


// export function Location() {
//   const [draggable, setDraggable] = useState(false)
//   const [position, setPosition] = useState(center)
//   const markerRef = useRef(null)
//   const eventHandlers = useMemo(
//     () => ({
//       dragend() {
//         const marker: any = markerRef.current;
//         if (marker != null) {
//           setPosition(marker.getLatLng())
//         }
//       },
//     }),
//     [],
//   )
//   const toggleDraggable = useCallback(() => {
//     setDraggable((d) => !d)
//   }, [])

//   return (
//     <Marker
//       // draggable={draggable}
//       draggable={true}
//       eventHandlers={eventHandlers}
//       position={position}
//       ref={markerRef}>
//       <Popup minWidth={90}>
//         <span onClick={toggleDraggable}>
//           {draggable
//             ? 'Marker is draggable'
//             : 'Click here to make marker draggable'}
//         </span>
//       </Popup>
//     </Marker>
//   )
// }

import React from "react";
import LocationPicker from "react-leaflet-location-picker";

const Location = () => {
  const pointVals = [50, 2];
  const pointMode = {
    banner: true,
    control: {
      values: pointVals,
      onClick: (point: any) =>
        console.log("I've just been clicked on the map!", point),
      onRemove: (point: any) =>
        console.log("I've just been clicked for removal :(", point)
    }
  };
  const circleMode = {
    banner: false
  };
  return <LocationPicker circleMode={circleMode} />;
};

export default Location;