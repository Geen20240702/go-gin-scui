<template>
	<el-container>
		<el-aside width="300px" v-loading="menuloading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="menuFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="menu" class="menu" node-key="id" :data="menuList" :props="menuProps" draggable highlight-current :expand-on-click-node="false" check-strictly show-checkbox :filter-node-method="menuFilterNode" @node-click="menuClick" @node-drop="nodeDrop">

						<template #default="{node, data}">
							<span class="custom-tree-node">
								<span class="label">
									{{ node.label }}
								</span>
								<span class="do">
									<el-button icon="el-icon-plus" size="small" @click.stop="add(node, data)"></el-button>
								</span>
							</span>
						</template>

					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="primary" size="small" icon="el-icon-plus" @click="add()"></el-button>
					<el-button type="danger" size="small" plain icon="el-icon-delete" @click="delMenu"></el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container>
			<el-main class="nopadding" style="padding:20px;" ref="main">
				<save ref="save" :menu="menuList"></save>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	let newMenuIndex = 1;
	import save from './save'

	export default {
		name: "settingMenu",
		components: {
			save
		},
		data(){
			return {
				menuloading: false,
				menuList: [],
				menuProps: {
					label: (data)=>{
						return data.meta.title
					}
				},
				menuFilterText: ""
			}
		},
		watch: {
			menuFilterText(val){
				this.$refs.menu.filter(val);
			}
		},
		mounted() {
			this.getMenu();
		},
		methods: {
			//加载树数据
			async getMenu(){
				this.menuloading = true
				var res = await this.$API.system.menu.list.get();
				this.menuloading = false
				this.menuList = res.data.menuTree;
			},
			//树点击
			menuClick(data, node){
				console.log(node.level, node.parent.data.ID)
				var pid = node.level==1?undefined:node.parent.data.ID;
				this.$refs.save.setData(data, pid)
				this.$refs.main.$el.scrollTop = 0
			},
			//树过滤
			menuFilterNode(value, data){
				if (!value) return true;
				var targetText = data.meta.title;
				return targetText.indexOf(value) !== -1;
			},
			//树拖拽
			nodeDrop(draggingNode, dropNode, dropType){
				this.$refs.save.setData({})
				this.$message(`拖拽对象：${draggingNode.data.meta.title}, 释放对象：${dropNode.data.meta.title}, 释放对象的位置：${dropType}`)
			},
			//增加
			async add(node, data){
				var newMenuName = "未命名" + newMenuIndex++;
				var newMenuData = {
					parentId: data ? data.id : 0,
					name: newMenuName,
					path: "/",
					component: "/",
					title: newMenuName,
					type: "menu",
					sort: 99,
					status: 1,
					hidden: 2,
					noCache:2,
					alwaysShow:2,
					activeMenu:"",
					breadcrumb:2,
				}
				this.menuloading = true
				var res = await this.$API.system.menu.create.post(newMenuData)
				this.menuloading = false
				this.getMenu();
			},
			//删除菜单
			async delMenu(){
				var CheckedNodes = this.$refs.menu.getCheckedNodes()
				if(CheckedNodes.length == 0){
					this.$message.warning("请选择需要删除的项")
					return false;
				}

				var confirm = await this.$confirm('确认删除已选择的菜单吗？','提示', {
					type: 'warning',
					confirmButtonText: '删除',
					confirmButtonClass: 'el-button--danger'
				}).catch(() => {})
				if(confirm != 'confirm'){
					return false
				}

				this.menuloading = true
				var reqData = {
					menuIds: CheckedNodes.map(item => item.ID)
				}
				var res = await this.$API.system.menu.delete.delete(reqData)
				this.menuloading = false
				this.getMenu();
			}
		}
	}
</script>

<style scoped>
	.menu:deep(.el-tree-node__label) {display: flex;flex: 1;height:100%;}
	.custom-tree-node {display: flex;flex: 1;align-items: center;justify-content: space-between;font-size: 14px;height:100%;padding-right:24px;}
	.custom-tree-node .label {display: flex;align-items: center;;height: 100%;}
	.custom-tree-node .label .el-tag {margin-left: 5px;}
	.custom-tree-node .do {display: none;}
	.custom-tree-node .do i {margin-left:5px;color: #999;}
	.custom-tree-node .do i:hover {color: #333;}

	.custom-tree-node:hover .do {display: inline-block;}
</style>
