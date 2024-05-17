<template>
	<el-container class="home-container" v-if="true">
		<el-header>
			<el-icon><document /></el-icon>
		</el-header>
		<el-container class="lower-container">
			<el-aside>
				<div class="btn">
					<el-button type="primary" class="cbtn">创建</el-button>
				</div>
				<el-divider />
				<div class="up-menu">
					<el-menu
					:default-active="activePath"
					class="el-menu-vertical-demo"
					background-color="#ecf5ff"
					:router="true">
						<el-menu-item :index=recentPath @click="saveNavState(recentPath)">
							<el-icon><Clock /></el-icon>
							<span>最近文件</span>
						</el-menu-item>
						<el-menu-item :index=collectionPath @click="saveNavState(collectionPath)">
							<el-icon><CollectionTag /></el-icon>
							<span>我的收藏</span>
						</el-menu-item>
						<el-menu-item :index=desktopPath @click="saveNavState(desktopPath)">
							<el-icon><Monitor /></el-icon>
							<span>我的桌面</span>
						</el-menu-item>
						<el-menu-item :index=groupPath @click="saveNavState(groupPath)">
							<el-icon><User /></el-icon>
							<span>团队空间</span>
						</el-menu-item>
					</el-menu>
				</div>
				<el-divider />
				<div class="down-menu">
					<el-menu
					:default-active="activePath"
					class="el-menu-vertical-demo"
					background-color="#ecf5ff"
					:router="true">
						<el-menu-item :index=trashPath @click="saveNavState(trashPath)">
							<el-icon><Delete /></el-icon>
							<span>回收站</span>
						</el-menu-item>
					</el-menu>
				</div>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
export default {
	data() {
		return{
			recentPath: '/home/recent',
			desktopPath: '/home/desktop',
			groupPath: '/home/group',
			collectionPath: '/home/collection',
      trashPath: '/home/trash',
			activePath: '',
		}
	},
	created() {
		// window.sessionStorage.setItem('activePath', this.recentPath)
		this.activePath = window.location.pathname
	},
	watch: {
    $route(to, from) {
      this.activePath = to.path
      // console.log(to.path)
      // console.log(from.path)
    }
  },
	methods: {
		saveNavState(path) {
      this.activePath = path
    }
	}
}
</script>

<style lang="less" scoped>
.home-container {
	min-height: 100vh;
	height: 100%;
}
.el-header {
	background-color: #d9ecff;
}
.el-aside {
	background-color: #ecf5ff;
	width: 15%;
	.btn {
		.cbtn {
			margin-top: 10%;
			padding-left: 35%;
			padding-right: 35%;
		}
	}
	.up-menu{
		height: 73%;

	}
}
.el-main {
	background-color: #FAFCFF;
}
</style>
