<template>
  <SidebarProvider class="">
    <div class="flex h-screen bg-background w-full">
      <Sidebar />

      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger class="md:hidden" />
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-semibold">Карта України</h1>
          </div>
        </header>

        <div class="flex-1 p-4">
          <MapContainer />
        </div>
      </SidebarInset>
    </div>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from '@/components/pages/Sidebar.vue'
import MapContainer from '@/components/pages/MapContainer.vue'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { usePolygons } from '@/composables/usePolygons'

const { processPolygons } = usePolygons()

onMounted(() => {
    processPolygons()
})
</script>