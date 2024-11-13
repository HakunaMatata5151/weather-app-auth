<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useDark, useToggle } from "@vueuse/core";
import theme_change from './components/theme_change.vue';
import Icon from './components/icon_comp.vue';
import { onBeforeMount, ref, shallowRef, watch } from 'vue';
import Loading from './components/loading_overlay.vue';
import { GetReverseGeoCoding } from './api/client';
import Sleep from './core/sleep';
import { useToast } from "vue-toastification";

const _DEBOUNCE_WAIT_MS_ = 1000;
const _DEBOUNCE_SYMBOL_NAME_ = 'filter';

const isDark = useDark({
  selector: "body",
  attribute: "theme",
  valueDark: "custom-dark",
  valueLight: "custom-light",
});
const toggleDark = useToggle(isDark);

const toast = useToast();
const router = useRouter();
const location = ref();
const latitude = ref();
const longitude = ref();
const is_loading = shallowRef(false);

function getPosition(): Promise<any> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
}

let debounce = Symbol(_DEBOUNCE_SYMBOL_NAME_);
watch(location, async () => {
  let current_debounce = Symbol(_DEBOUNCE_SYMBOL_NAME_);
  debounce = current_debounce;
  await Sleep(_DEBOUNCE_WAIT_MS_);
  if (current_debounce != debounce) return;
  router.push(`/${location.value}`)
})

onBeforeMount(async () => {
  is_loading.value = true;
  try {
    const position: GeolocationPosition = await getPosition();
    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;
    try {
      const result = await GetReverseGeoCoding(longitude.value, latitude.value);
      location.value = result.features[0].properties.city;
    }
    catch (err: any) {
      location.value = 'Rawalpindi'
      is_loading.value = false;
      return
    }
    is_loading.value = false;
  } catch (err: any) {
    toast.warning('Didnt Give permission. Default to Rawalpindi.')
    location.value = 'Rawalpindi'
    is_loading.value = false;
    return;
  }

})

</script>

<template>
  <div class="main-container">
    <header>
      <nav class="wrapper">
        <theme_change v-on:toggle-dark="toggleDark" />
        <div class="search-filter">
          <Icon icon="fa-magnifying-glass" />
          <input class="search-bar" placeholder="Location" v-model="location" />
        </div>
      </nav>
    </header>
    <div class="main">
      <div class="loading" v-show="is_loading">
        <Loading :isLoading="is_loading" color="grey" :delay_ms="100" />
      </div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.wrapper {
  height: 2.8rem;
  padding: 40px 22px;
  font-size: 1.35rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.main {
  flex: 1 1 auto;
}

.search-filter {
  display: flex;
  justify-items: center;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  padding: 12px;
  gap: 12px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
