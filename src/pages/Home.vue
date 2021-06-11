<template>
<h1>home</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ArticlesAPI } from '@/api'

export default defineComponent({
    name: 'Home',
    setup() {
        const fetchList = async () => {
            const list = await ArticlesAPI.getTagList()
            console.log('🚀 ~ file: Home.vue ~ line 13 ~ fetchList ~ list', list)
        }

        fetchList()
    }
})
</script>

<style>

</style>