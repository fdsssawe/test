<script setup lang="ts">
import { cn } from '../../lib/utils'

interface InputProps {
    type?: string
    modelValue?: string | number
    placeholder?: string
}

const props = withDefaults(defineProps<InputProps>(), {
    type: 'text'
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number]
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}
</script>

<template>
    <input :type="type" :value="modelValue" :placeholder="placeholder" @input="handleInput" :class="cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
    )" />
</template>