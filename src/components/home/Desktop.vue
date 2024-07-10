<template>
  <el-container class="desktop-layout">
    <el-header class="desktop-header" style="white-space: nowrap;">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-text size="large" style="font-size: 20px; font-weight:bold; White-space:nowrap">我的桌面</el-text>
        </el-col>
        <el-col :span="16"><div class="grid-content ep-bg-purple" /></el-col>
        <el-col :span="2">
          <div class="desktop-btn">
            <el-icon style="margin-right: 10px"><CirclePlus /></el-icon>
            <el-text>移动</el-text>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="desktop-btn">
            <el-icon style="margin-right: 10px"><CirclePlus /></el-icon>
            <el-text>删除</el-text>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="desktop-btn">
            <el-icon style="margin-right: 10px"><CirclePlus /></el-icon>
            <el-text>收藏</el-text>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-divider style="margin: 1px;"/>
    <el-main class="desktop-main">
      <!-- <el-table :data="teamTable" style="width: 100%" v-loading="teamLoading">
        <el-table-column label="团队名称" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-icon><user /></el-icon>
              <el-link :href="`/home/space/${scope.row.team_id}`">
                <span style="margin-left: 10px">{{ scope.row.team_name }}</span>
              </el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建者" width="180" />
        <el-table-column prop="created_time" label="创建时间" :formatter="formatDate" sortable/>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <el-button type="danger"  @click=openDeleteDialog(scope.row)>
              <el-icon ><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </el-main>
  </el-container>
</template>

<script setup>

</script>

<style lang="less" scoped>
.desktop-layout{
  height: 100%;
  .desktop-header{
    height: 5%;
    .desktop-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  .desktop-main{
    height: 95%;
  }
}
</style>