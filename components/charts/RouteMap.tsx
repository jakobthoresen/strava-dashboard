'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface Props {
  coordinates: [number, number][]
}

function FitBounds({ coordinates }: { coordinates: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (coordinates.length > 0) {
      map.fitBounds(coordinates, { padding: [20, 20] })
    }
  }, [map, coordinates])
  return null
}

export function RouteMap({ coordinates }: Props) {
  const center = coordinates[0] ?? [60.3913, 5.3221]

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: '240px', width: '100%', borderRadius: '8px' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Polyline
        positions={coordinates}
        color="#3b82f6"
        weight={3}
        opacity={0.9}
      />
      <FitBounds coordinates={coordinates} />
    </MapContainer>
  )
}