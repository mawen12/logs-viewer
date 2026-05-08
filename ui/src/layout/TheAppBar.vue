<script setup>
import { computed } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme()

const icon = computed(() => theme.name.value == 'dark' ? 'mdi-white-balance-sunny' : 'mdi-weather-night')
</script>

<template>
  <v-app-bar flat :elevation="1">
    <v-app-bar-title>
        Logs-Viewer
    </v-app-bar-title>

    <!-- <v-tooltip location="bottom">
        <template v-slot:activator="{props}">
            
        </template>
    </v-tooltip> -->

    <v-tooltip location="bottom">
        <template v-slot:activator="{props}">
            <v-btn @click="theme.toggle()" :icon="icon" v-bind="props" />
        </template>
        Theme
    </v-tooltip>
  </v-app-bar>
</template>

<style scoped>
</style>