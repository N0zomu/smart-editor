<template>
  <button
    class="menu-item"
    :class="{ 'is-active': props.isActive ? props.isActive() : null }"
    @click="props.action"
    :title="props.title"
    >
    <!-- <svg class="remix">
      <use :xlink:href="`/src/assets/remixicon.symbol.svg#ri-${props.icon}`" />
    </svg> -->
    <div class="remix">
      <i :class="`ri-${props.icon} ri-lg`"></i>
    </div>
  </button>
</template>

<script setup>
import 'remixicon/fonts/remixicon.css'
import { onMounted } from 'vue'
  const props = defineProps({
    icon: String,
    title: String,
    action: Function,
    isActive: Function
  })
</script>

<style lang="scss">
  .menu-item {
    background: transparent;
    border: none;
    border-radius: 0.4rem;
    color: #333;
    cursor: pointer;
    height: 1.75rem;
    padding: 0.25rem;
    margin-right: 0.25rem;
    width: 1.75rem;

    svg {
      fill: currentColor;
      height: 100%;
      width: 100%;
    }
    .remix {
      width: 24px;
      height: 24px;
      fill: #333;
    }

    &.is-active,
    &:hover {
      background-color: #d6d6d6;
    }
  }
</style>
