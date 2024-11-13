<script setup lang="ts">
import { Get5dayForcast } from '@/api/client';
import { onMounted, watch, ref, } from 'vue';
import Loading from '@/components/loading_overlay.vue';
import { useToast } from "vue-toastification";
import FullScreen from '@/components/fullscreen_capture.vue';

const toast = useToast();
const props = defineProps({
  location: {
    type: String,
    required: true,
  }
})

const loading_state = ref(false);
const weather_data = ref();

async function GetData() {
  loading_state.value = true
  try {
    if (props.location) {
      const result = await Get5dayForcast(props.location)
      if (result.error) {
        toast.error('Please add a proper place name or try again.')
      }
      else {
        weather_data.value = result;
        console.log(weather_data.value)
      }
    }
  } catch (error: any) {
  }
  loading_state.value = false
}

onMounted(async () => {
  await GetData();
})

watch(props, async () => {
  await GetData();
})
</script>

<template>
  <FullScreen v-if="loading_state">
    <Loading :isLoading="loading_state" color="grey" :delay_ms="100" />
  </FullScreen>
  <div class="main" v-if="!loading_state && weather_data">
    <div class="current-day">
      <div class="text-size">TODAY</div>
      <div class="cover">
        <div class="left">
          <img :src="weather_data.forecast.forecastday[0].day.condition.icon" alt="not found" width="150px"
            height="150px" />
        </div>
        <div class="right">
          {{ weather_data.forecast.forecastday[0].day.avgtemp_c }}&deg; C
        </div>
      </div>
      <div class="lower">
        <div><span>Min:</span> {{ weather_data.forecast.forecastday[0].day.mintemp_c }}&deg; C</div>
        <div><span>Max:</span> {{ weather_data.forecast.forecastday[0].day.maxtemp_c }}&deg; C</div>
        <div><span>Wind:</span> {{ weather_data.forecast.forecastday[0].day.maxwind_kph }} KPH</div>
        <div><span>Rain Chance:</span> {{ weather_data.forecast.forecastday[0].day.maxwind_kph }}%</div>
      </div>
    </div>
    <div class="cover-other-days">
      <div class="other-days" v-for="weather in weather_data.forecast.forecastday" :key="weather.date">
        <div class="day-header">{{ weather.date }}</div>
        <div class="day-cover">
          <img :src="weather.day.condition.icon" alt="not found" width="100px" height="100px" />
          {{ weather.day.avgtemp_c }}&deg; C
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  padding: 120px 200px;
}

.current-day {
  padding: 20px 30px;
  min-height: 32rem;
  background: var(--linear-gradient);
  border-radius: 25px;
  border: 3px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  font-weight: bold;
}

.text-size {
  font-size: 1.8rem;
}

.today {
  font-weight: bold;
  text-align: center;
}

.cover {
  display: flex;
  align-items: center;
  justify-content: center;
}

.left {
  font-size: 1.75rem;
}

.right {
  font-size: 1.5rem;
}

.lower {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
}

.lower>div>span {
  font-weight: bolder;
  color: var(--secondary-container-color);
}

.cover-other-days {
  margin-top: 100px;
  display: flex;
  justify-content: space-between;
  margin-left: 22px;
  margin-right: 22px;
  flex-wrap: wrap;
  text-align: center;
  gap: 42px;
}

.day-header {
  font-size: 1.2rem;
  font-weight: bold;
}

.day-cover {
  margin-top: 12px;
  padding: 22px 12px;
  background: var(--linear-gradient);
  border-radius: 25px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 120px;
}

@media only screen and (max-width: 1050px) {
  .main {
    padding: 120px 10px;
  }
}
</style>
