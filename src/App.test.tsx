import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Mock modules that use ES exports
jest.mock('react-leaflet', () => ({
  MapContainer: () => <div data-testid="map-container" />,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: () => <div data-testid="marker" />,
  useMap: () => ({ fitBounds: jest.fn() })
}));

jest.mock('./Location', () => ({
  Location: () => <div data-testid="location" />
}));

// Mock problematic es module dependencies
jest.mock('react-slugify', () => (str) => str.toLowerCase().replace(/\s+/g, '-'));

// Mock any other ES module dependencies if needed
jest.mock('diacritics', () => ({
  remove: (str) => str
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<App />);
    root.unmount();
});
