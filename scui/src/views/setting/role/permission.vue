<template>
	<el-dialog title="角色权限设置" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-tabs v-model="activeName" tab-position="top">
			<el-tab-pane label="菜单权限" name="menu">
				<div class="treeMain">
					<el-tree ref="menu" node-key="ID" :data="menu.list" :props="menu.props" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
			<el-tab-pane label="接口权限" name="api">
				<div class="treeMain">
					<el-tree ref="api" node-key="ID" :data="api.list" :props="api.props" show-checkbox></el-tree>
				</div>
			</el-tab-pane>
		</el-tabs>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				activeName: 'menu',
				visible: false,
				isSaveing: false,
				menu: {
					list: [],
					checked: [],
					props: {
						label: (data)=>{
							return data.meta.title
						}
					}
				},
				api: {
					list: [],
					checked: [],
					props: {
						label: (data)=>{
							return data.desc
						}
					}
				},
				roleId: 0,
			}
		},
		mounted() {

		},
		methods: {
			open(){
				this.visible = true;
				return this
			},
			setData(data){
				this.roleId = data.id
				this.getMenu()
				this.getApi()
			},

			async submit(){
				if(this.activeName === 'menu') {
					this.submitMenu()
				} else {
					this.submitApi()
				}
			},

			async submitMenu(){
				this.isSaveing = true;

				//选中的和半选的合并后传值接口
				var checkedKeys = this.$refs.menu.getCheckedKeys().concat(this.$refs.menu.getHalfCheckedKeys())
				console.log(checkedKeys)

				var res = await this.$API.system.role.menu.update.post({id:this.roleId, menuIds:checkedKeys})
				if(res.code == '200') {
					this.isSaveing = false;
					this.visible = false;
					this.$message.success("操作成功")
					this.$emit('success')
				} else {
					this.$message.error(res.msg)
				}

			},

			async submitApi(){
				this.isSaveing = true;

				//选中的和半选的合并后传值接口
				var checkedKeys = this.$refs.api.getCheckedKeys().concat(this.$refs.api.getHalfCheckedKeys())
				console.log(checkedKeys)

				let apiIds = []
				for (const i in checkedKeys) {
					if(checkedKeys[i] > 0) {
						apiIds.push(checkedKeys[i])
					}
				}

				var res = await this.$API.system.role.api.update.post({id:this.roleId, apiIds:apiIds})
				if(res.code == '200') {
					this.isSaveing = false;
					this.visible = false;
					this.$message.success("操作成功")
					this.$emit('success')
				} else {
					this.$message.error(res.msg)
				}

			},
			async getMenu(){
				var roleMenuRes = await this.$API.system.role.menu.list.get({id:this.roleId})
				for (let i in roleMenuRes.data.menus) {
					this.menu.checked.push(roleMenuRes.data.menus[i].ID)
				}

				var res = await this.$API.system.menu.list.get()
				this.menu.list = res.data.menuTree

				//获取接口返回的之前选中的和半选的合并，处理过滤掉有叶子节点的key
				// this.menu.checked = ["system", "user", "user.add", "user.edit", "user.del", "directive.edit", "other", "directive"]
				this.$nextTick(() => {
					let filterKeys = this.menu.checked.filter(key => this.$refs.menu.getNode(key).isLeaf)
					this.$refs.menu.setCheckedKeys(filterKeys, true)
				})
			},

			async getApi(){
				var roleMenuRes = await this.$API.system.role.api.list.get({id:this.roleId})
				for (let i in roleMenuRes.data.apis) {
					this.api.checked.push(roleMenuRes.data.apis[i].ID)
				}

				var res = await this.$API.system.api.tree.get()
				this.api.list = res.data.apiTree

				//获取接口返回的之前选中的和半选的合并，处理过滤掉有叶子节点的key
				// this.menu.checked = ["system", "user", "user.add", "user.edit", "user.del", "directive.edit", "other", "directive"]
				this.$nextTick(() => {
					let filterKeys = this.api.checked.filter(key => this.$refs.api.getNode(key).isLeaf)
					this.$refs.api.setCheckedKeys(filterKeys, true)
				})
			},
		}
	}
</script>

<style scoped>
	.treeMain {height:280px;overflow: auto;border: 1px solid #dcdfe6;margin-bottom: 10px;}
</style>
