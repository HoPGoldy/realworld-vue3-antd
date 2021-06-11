<template>
<h1>Editor, {{route.params}}</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Editor',
    setup() {
        const route = useRoute();

        return { route }
    }
})
</script>

<style>

</style>