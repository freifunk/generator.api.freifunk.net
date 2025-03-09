import { render } from '@testing-library/react';
import App from './App';
import { describe, it, vi } from 'vitest';

// Mock modules that use ES exports
vi.mock('react-leaflet', () => ({
  MapContainer: () => <div data-testid="map-container" />,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: () => <div data-testid="marker" />,
  useMap: () => ({ fitBounds: vi.fn(), setView: vi.fn() })
}));

vi.mock('./Location', () => ({
  Location: () => <div data-testid="location" />
}));

// Fix: Mock react-slugify with proper default export
vi.mock('react-slugify', () => {
  return {
    default: (str: string) => str.toLowerCase().replace(/\s+/g, '-')
  };
});

// Mock any other ES module dependencies if needed
vi.mock('diacritics', () => ({
  remove: (str: string) => str
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Add assertions as needed
  });
});
