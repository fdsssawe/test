import axios from 'axios'

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

export class NominatimService {
    private cache = new Map<string, any>()

    async searchLocations(lat: number, lng: number): Promise<any[]> {
        const key = `search_${lat}_${lng}`
        if (this.cache.has(key)) {
            return this.cache.get(key)
        }

        try {
            const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
                params: {
                    q: `${lat},${lng}`,
                    format: 'json',
                    limit: 5,
                    countrycodes: 'ua',
                    addressdetails: 1
                }
            })

            const results = response.data.filter((item: any) =>
                item.type === 'city' || item.type === 'town' || item.type === 'village'
            )

            this.cache.set(key, results)
            return results
        } catch (error) {
            console.error('Error searching locations:', error)
            return []
        }
    }

    async getLocationDetails(osmId: string): Promise<any> {
        const key = `details_${osmId}`
        if (this.cache.has(key)) {
            return this.cache.get(key)
        }

        try {
            const response = await axios.get(`${NOMINATIM_BASE_URL}/details`, {
                params: {
                    osmtype: 'N',
                    osmid: osmId,
                    format: 'json',
                    addressdetails: 1
                }
            })

            this.cache.set(key, response.data)
            return response.data
        } catch (error) {
            console.error('Error getting location details:', error)
            return null
        }
    }

    async getLocationBoundary(osmId: string): Promise<any> {
        const key = `boundary_${osmId}`
        if (this.cache.has(key)) {
            return this.cache.get(key)
        }

        try {
            const response = await axios.get(`${NOMINATIM_BASE_URL}/lookup`, {
                params: {
                    osm_ids: `N${osmId}`,
                    format: 'json',
                    polygon_geojson: 1
                }
            })

            if (response.data && response.data[0] && response.data[0].geojson) {
                const geojson = response.data[0].geojson
                this.cache.set(key, geojson)
                return geojson
            }
            return null
        } catch (error) {
            console.error('Error getting location boundary:', error)
            return null
        }
    }
}

export const nominatimService = new NominatimService()