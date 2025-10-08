<template>
    <div ref="mapContainer" class="flex-1 h-full"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLocationStore } from '../../stores/location'
import polygonsData from '../../../polygons.json'

const store = useLocationStore()
const mapContainer = ref<HTMLDivElement>()
let map: L.Map | null = null
let polygonLayers: L.Polygon[] = []
let boundaryLayer: L.Polygon | null = null

const polygons = computed(() => store.polygons)
const selectedLocation = computed(() => store.selectedLocation)

const getRandomColor = (id: number) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
    return colors[id % colors.length]
}

const initMap = () => {
    if (!mapContainer.value) return

    map = L.map(mapContainer.value).setView([49.0, 31.0], 6)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    polygons.value.forEach(polygon => {
        const latlngs = polygon.polygon.map(point => [point.lat, point.lng] as [number, number])
        const layer = L.polygon(latlngs, {
            color: getRandomColor(polygon.id),
            fillOpacity: 0.3
        }).addTo(map!)
        polygonLayers.push(layer)
    })
}

const updateBoundary = () => {
    if (boundaryLayer) {
        map!.removeLayer(boundaryLayer)
        boundaryLayer = null
    }

    if (selectedLocation.value?.boundary) {
        const geojson = selectedLocation.value.boundary
        if (geojson.type === 'Polygon') {
            const coordinates = geojson.coordinates[0].map((coord: number[]) => [coord[1], coord[0]] as [number, number])
            boundaryLayer = L.polygon(coordinates, {
                color: 'red',
                fillOpacity: 0.5
            }).addTo(map!)
        }
    }
}

watch(selectedLocation, (newLocation) => {
    if (!map) return

    if (newLocation) {
        map.setView([newLocation.lat, newLocation.lng], 13)
    } else {
        const group = new L.FeatureGroup(polygonLayers)
        if (polygonLayers.length > 0) {
            map.fitBounds(group.getBounds())
        } else {
            map.setView([49.0, 31.0], 6)
        }
    }

    updateBoundary()
})

onMounted(async () => {
    store.setPolygons(polygonsData)
    await nextTick()
    initMap()
})
</script>

<style scoped></style>