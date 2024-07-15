<script setup>
import { useEditorStore } from '@/stores/heading'
import { storeToRefs } from 'pinia'

const editorStore = useEditorStore()
const { headings } = storeToRefs(editorStore)
/**
 * 左侧区域
 */
const handleHeadingClick = (data) => {
  editorStore.setActiveHeading(data.text)
  editorStore.editorInstance.commands.focus(data.end+1)
  editorStore.editorInstance.commands.scrollIntoView();
}
</script>

<template>
  <el-scrollbar height="80vh" style="height:85%">
    <div class="outline__list" style="display: flex; flex-direction: column;">
      <el-text  class="text-gray-400" style="margin-top:20px;font-size:20px" tag="b">大纲</el-text>
      <el-divider style="margin: 2px; width:99%"></el-divider>
      <template v-for="(heading, index) in headings" :key="index">
        <!-- <el-popover
          trigger="click"
          placement="right"
        >
          <template #reference>
            <el-button
              @click="handleHeadingClick(heading.text)"
              text
              class="outline__item"
              :class="`outline__item--${heading.level}`"
            >
              {{ heading.text }}
              <el-icon v-if="heading.icon"><component :is="heading.icon"/></el-icon>
            </el-button>
          </template>
        </el-popover> -->
        <el-button
          @click="handleHeadingClick(heading)"
          text
          class="outline__item"
          :class="`outline__item--${heading.level}`"
        >
          <el-text style="max-width: 20vh" truncated>{{ heading.text }}</el-text>
          <el-icon v-if="heading.icon"><component :is="heading.icon"/></el-icon>
        </el-button>
      </template>
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.outline {
  opacity: 0.75;
  border-radius: 0.5rem;
  padding: 0.75rem;
  background: rgba(black, 0.1);
  

  &__list {
    list-style: none;
    font-size: 18px;
    padding: 0;
  }

  &__item {
    max-width: 20vw;
    text-overflow: ellipsis;
    a:hover {
      opacity: 0.5;
    }
    &--1 {
      padding-left: 0rem;
    }
    &--2 {
      padding-left: 2rem;
    }
    &--3 {
      padding-left: 4rem;
    }

    &--4 {
      padding-left: 6rem;
    }

    &--5 {
      padding-left: 4rem;
    }

    &--6 {
      padding-left: 5rem;
    }
  }
}
</style>
