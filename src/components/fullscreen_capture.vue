<template>
    <div class="overlay" @click="$emit('close-fullscreen')">
        <div class="overlay-content">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.overlay {
    height: 100vh;
    width: 100vw;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background-color: #000000be;
    overflow: hidden;
    animation-name: blur;
    animation-duration: 4s;
    animation-fill-mode: forwards;
}

@keyframes blur {
  from {backdrop-filter: blur(0px);}
  to {backdrop-filter: blur(5px);}
}

.overlay-content {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}
</style>
