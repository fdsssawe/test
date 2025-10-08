import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Polygon {
    id: number
    name: string
    polygon: { lat: number; lng: number }[]
}

export interface Location {
    id: number
    name: string
    lat: number
    lng: number
    details?: any
    boundary?: any
}

export const useLocationStore = defineStore('location', () => {
    const polygons = ref<Polygon[]>([])
    const locations = ref<Location[]>([])
    const selectedLocation = ref<Location | null>(null)
    const searchQuery = ref('')
    const isLoading = ref(false)

    const filteredLocations = computed(() => {
        if (!searchQuery.value) return locations.value
        return locations.value.filter(loc =>
            loc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
    })

    const setPolygons = (data: Polygon[]) => {
        polygons.value = data
    }

    const setLocations = (data: Location[]) => {
        locations.value = data
    }

    const addLocation = (location: Location) => {
        const existing = locations.value.find(l => l.id === location.id)
        if (!existing) {
            locations.value.push(location)
        }
    }

    const setSelectedLocation = (location: Location | null) => {
        selectedLocation.value = location
    }

    const setSearchQuery = (query: string) => {
        searchQuery.value = query
    }

    const setLoading = (loading: boolean) => {
        isLoading.value = loading
    }

    return {
        polygons,
        locations,
        selectedLocation,
        searchQuery,
        isLoading,
        filteredLocations,
        setPolygons,
        setLocations,
        addLocation,
        setSelectedLocation,
        setSearchQuery,
        setLoading
    }
})