<template>
    <div class="flex h-screen bg-background">

        <div v-if="showSidebar" class="w-80 flex-shrink-0">
            <Sidebar />
        </div>

        <div class="flex-1 p-4">
            <MapContainer />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/pages/Sidebar.vue'
import MapContainer from '@/components/pages/MapContainer.vue'
import Button from '@/components/ui/Button.vue'
import { usePolygons } from '@/composables/usePolygons'

const { processPolygons } = usePolygons()

const showSidebar = ref(true)

const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value
}

onMounted(() => {
    processPolygons()
})
</script>