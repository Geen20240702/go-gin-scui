<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.keyword" placeholder="角色名称" clearable></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" row-key="id" @selection-change="selectionChange" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="ID" prop="ID" width="50"></el-table-column>
				<el-table-column label="角色名称" prop="name" width=""></el-table-column>
				<el-table-column label="状态" prop="status" width="">
					<template #default="scope">
						<div>
							<el-tag v-if="scope.row.status=='1'">正常</el-tag>
							<el-tag v-else-if="scope.row.status=='2'">禁用</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="CreatedAt"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="">
					<template #default="scope">
						<el-button type="primary" plain @click="permission(scope.row.ID)">权限设置</el-button>

						<el-button-group>
							<el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
								<template #reference>
									<el-button text type="primary" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>

			</scTable>
		</el-main>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

	<permission-dialog v-if="dialog.permission" ref="permissionDialog" @closed="dialog.permission=false"></permission-dialog>

</template>

<script>
	import saveDialog from './save'
	import permissionDialog from './permission'

	export default {
		name: 'role',
		components: {
			saveDialog,
			permissionDialog
		},
		data() {
			return {
				dialog: {
					save: false,
					permission: false
				},
				apiObj: this.$API.system.role.list,
				selection: [],
				search: {
					keyword: null
				}
			}
		},
		methods: {
			//添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open()
				})
			},
			//编辑
			table_edit(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(row)
				})
			},
			//查看
			table_show(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('show').setData(row)
				})
			},
			//权限设置
			permission(id){
				this.dialog.permission = true
				this.$nextTick(() => {
					this.$refs.permissionDialog.open().setData({id:id})
				})
			},
			//删除
			async table_del(row){
				var reqData = {roleIds: [row.ID]}
				var res = await this.$API.system.role.delete.delete(reqData);
				if(res.code == 200){
					this.$refs.table.refresh()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				var confirmRes = await this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning',
					confirmButtonText: '删除',
					confirmButtonClass: 'el-button--danger'
				}).catch(() => {})

				if(!confirmRes){
					return false
				}

				var ids = this.selection.map(v => v.ID)
				var reqData = {roleIds: ids}
				var res = await this.$API.system.role.delete.delete(reqData);
				if(res.code == 200){
					this.$message.success("操作成功")
					this.$refs.table.refresh()
				} else {
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//表格内开关
			changeSwitch(val, row){
				row.status = row.status == '1'?'2':'1'
				row.$switch_status = true;
				setTimeout(()=>{
					delete row.$switch_status;
					row.status = val;
					this.$message.success("操作成功")
				}, 500)
			},
			//搜索
			upsearch(){

			},
			//根据ID获取树结构
			filterTree(id){
				var target = null;
				function filter(tree){
					tree.forEach(item => {
						if(item.id == id){
							target = item
						}
						if(item.children){
							filter(item.children)
						}
					})
				}
				filter(this.$refs.table.tableData)
				return target
			},
			//本地更新数据
			handleSaveSuccess(data, mode){
				console.log(data, mode)
				this.$refs.table.refresh()
			}
		}
	}
</script>

<style>
</style>
