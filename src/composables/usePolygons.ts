import * as turf from '@turf/turf'
import { useLocationStore, type Location } from '../stores/location'
import { nominatimService } from '../services/nominatimService'

export function usePolygons() {
    const store = useLocationStore()

    const processPolygons = async () => {
        store.setLoading(true)

        for (const polygon of store.polygons) {
            try {
                const coordinates = polygon.polygon.map(point => [point.lng, point.lat])
                const firstCoord = coordinates[0]
                if (firstCoord) {
                    coordinates.push(firstCoord)
                }
                const geoJsonPolygon = turf.polygon([coordinates])

                const centroid = turf.centroid(geoJsonPolygon)
                const coords = centroid.geometry.coordinates
                const lng = coords[0]
                const lat = coords[1]

                if (typeof lat === 'number' && typeof lng === 'number') {
                    const locations = await nominatimService.searchLocations(lat, lng)

                    if (locations.length > 0) {
                        const bestLocation = locations[0]
                        const location: Location = {
                            id: polygon.id,
                            name: bestLocation.display_name.split(',')[0],
                            lat: parseFloat(bestLocation.lat),
                            lng: parseFloat(bestLocation.lon),
                            details: bestLocation
                        }

                        store.addLocation(location)
                    }
                }
            } catch (error) {
                console.error(`Error processing polygon ${polygon.id}:`, error)
            }
        }

        store.setLoading(false)
    }

    const loadLocationDetails = async (location: Location) => {
        store.setLoading(true)

        try {
            if (location.details?.osm_id) {
                const osmId = location.details.osm_id
                const details = await nominatimService.getLocationDetails(osmId)
                const boundary = await nominatimService.getLocationBoundary(osmId)

                const updatedLocation = { ...location, details, boundary }
                store.setSelectedLocation(updatedLocation)
            }
        } catch (error) {
            console.error('Error loading location details:', error)
        }

        store.setLoading(false)
    }

    return {
        processPolygons,
        loadLocationDetails
    }
}