<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { MountedModel } from '../core/modal copy';

let on_unmounted_callback: Function | undefined = undefined;

onMounted(() => {
    on_unmounted_callback = MountedModel();
});

onUnmounted(() => {
    if (on_unmounted_callback) {
        on_unmounted_callback();
    }
});
</script>

<template>
    <Teleport to="#modal">
        <div class="container">
            <slot />
        </div>
    </Teleport>
</template>

<style scoped>
.container {
    margin: auto;
    overflow: scroll;
    width: 100vw;
    height: 100vh;
}
</style>

<style>
#modal {
    position: sticky;
    top: 0px;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>
