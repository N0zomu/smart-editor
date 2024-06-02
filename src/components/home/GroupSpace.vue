<template>
  <h1>{{team_id}}</h1>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
const route = useRoute()
let team_id = ref(0)


onMounted(() => {
  team_id.value = route.params.teamId
});
</script>

<style>

</style>