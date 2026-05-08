<script setup>
import { ref } from 'vue';


const queryLabel = ref('Query')
const search = ref('')
const limit = ref(50)
</script>


<template>
    <v-container fluid class="page-root w-md-100 w-lg-75 w-xl-50 pa-2 ga-3">
        <v-card class="page-query d-flex flex-column rounded-lg" :elevation="0" >
            <v-card-text>
                <div class="d-flex flex-column ga-2">
                    <div class="page-query-content">
                        <v-text-field 
                            :label="queryLabel"
                            v-model="search"
                            variant="outlined" 
                            density="compact" 
                            autocomplete="suppress" 
                            hide-details
                            clearable 
                            style="flex: 3"
                        />

                        <v-text-field 
                            label="Limit"
                            v-model="limit"
                            variant="outlined" 
                            density="compact" 
                            type="number"
                            hide-details
                            style="flex: 1"
                        />
                    </div>

                    <div class="page-query-content" style="align-items: center;">
                        <v-btn style="margin-left: auto;" size="small" color="primary">
                            <template #prepend>
                                <v-icon size="25">mdi-menu-right</v-icon>
                            </template>
                            Execute
                        </v-btn>
                    </div>
                </div>
                
            </v-card-text>
        </v-card>

        <v-card class="page-chart d-flex flex-column rounded-lg" :elevation="1">
            <v-card-text>
                Area 2
            </v-card-text>
        </v-card>

        <v-card class="page-content d-flex flex-column rounded-lg" :elevation="1">
            <v-card-text>
                Area 3
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style scoped>
.page-root {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.page-card {
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.2);
}

.v-theme-dark .page-card {
    border-color: rgba(255, 255, 255, 0.2);
}

.page-query {
    height: 100px;
}

.page-query-content {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.page-chart {
    height: 240px;
}

.page-content {
    flex: 1;
    overflow-y: auto !important;
}
</style>