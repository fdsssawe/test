<template>
    <div class="w-80 bg-card border-r border-border flex flex-col h-full">
        <div v-if="!selectedLocation" class="p-4 border-b border-border">
            <Input v-model="searchQuery" placeholder="Пошук населених пунктів..." class="w-full" />
        </div>

        <div v-if="!selectedLocation" class="flex-1 overflow-y-auto p-4 space-y-3">
            <Card v-for="location in filteredLocations" :key="location.id"
                class="cursor-pointer hover:shadow-md transition-shadow" @click="selectLocation(location)">
                <CardContent class="p-4">
                    <h3 class="font-semibold text-lg mb-2">{{ location.name }}</h3>
                    <div class="text-sm text-muted-foreground space-y-1">
                        <p>Широта: {{ location.lat.toFixed(4) }}</p>
                        <p>Довгота: {{ location.lng.toFixed(4) }}</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div v-else class="flex-1 overflow-y-auto p-4">
            <Card class="mb-4">
                <CardHeader>
                    <CardTitle>{{ selectedLocation.name }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="font-medium text-muted-foreground">Широта</p>
                            <p>{{ selectedLocation.lat.toFixed(3) }}</p>
                        </div>
                        <div>
                            <p class="font-medium text-muted-foreground">Довгота</p>
                            <p>{{ selectedLocation.lng.toFixed(3) }}</p>
                        </div>
                        <div v-if="selectedLocation.details?.type">
                            <p class="font-medium text-muted-foreground">Тип</p>
                            <p>{{ selectedLocation.details.type }}</p>
                        </div>
                        <div v-if="selectedLocation.details?.importance">
                            <p class="font-medium text-muted-foreground">Важливість</p>
                            <p>{{ selectedLocation.details.importance.toFixed(3) }}</p>
                        </div>
                        <div v-if="selectedLocation.details?.population" class="col-span-2">
                            <p class="font-medium text-muted-foreground">Населення</p>
                            <p>{{ selectedLocation.details.population }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button @click="backToList" variant="outline" class="w-full">
                Назад до списку
            </Button>
        </div>

        <div v-if="isLoading" class="p-4 text-center text-muted-foreground">
            Завантаження...
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocationStore } from '../../stores/location'
import { usePolygons } from '../../composables/usePolygons'
import Card from '../ui/Card.vue'
import CardHeader from '../ui/CardHeader.vue'
import CardContent from '../ui/CardContent.vue'
import CardTitle from '../ui/CardTitle.vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'

const store = useLocationStore()
const { loadLocationDetails } = usePolygons()

const searchQuery = computed({
    get: () => store.searchQuery,
    set: (value: string) => store.setSearchQuery(value)
})

const filteredLocations = computed(() => store.filteredLocations)
const selectedLocation = computed(() => store.selectedLocation)
const isLoading = computed(() => store.isLoading)

const selectLocation = async (location: any) => {
    await loadLocationDetails(location)
}

const backToList = () => {
    store.setSelectedLocation(null)
}
</script>