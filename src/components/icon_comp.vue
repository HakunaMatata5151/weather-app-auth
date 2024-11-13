<script lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faMagnifyingGlass,
);

export type icons =
    | 'fa-magnifying-glass'
    ;
</script>

<script setup lang="ts">
import { type PropType } from 'vue';

const props = defineProps({
    icon: {
        type: String as PropType<icons>,
        required: true,
    },
});
</script>

<template>
    <FontAwesomeIcon :icon="`fa-solid ${props.icon}`" />
</template>
