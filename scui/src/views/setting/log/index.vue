<template>
	<el-container>
		<el-container>
				<el-header>
					<div class="left-panel">
<!--						<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>-->
						<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
					</div>
<!--					<div class="right-panel">-->
<!--						<div class="right-panel-search">-->
<!--							<el-input v-model="search.name" placeholder="登录账号 / 姓名" clearable></el-input>-->
<!--							<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>-->
<!--						</div>-->
<!--					</div>-->
				</el-header>
				<el-main class="nopadding">
					<scTable ref="table" :apiObj="apiObj" @selection-change="selectionChange" stripe remoteSort remoteFilter>
						<el-table-column type="selection" width="50"></el-table-column>
						<el-table-column label="ID" prop="ID" width="80" sortable='custom'></el-table-column>
						<el-table-column label="用户登录名" prop="username" width="" sortable='custom' column-key="filterUserName" :filters="[{text: '系统账号', value: '1'}, {text: '普通账号', value: '0'}]"></el-table-column>
						<el-table-column label="Ip地址" prop="ip" width="" sortable='custom'></el-table-column>
						<el-table-column label="Ip所在地" prop="ip_location" width="" sortable='custom'></el-table-column>
						<el-table-column label="请求方式" prop="method" width="" sortable='custom'></el-table-column>
						<el-table-column label="访问路径" prop="path" width="" sortable='custom'></el-table-column>
						<el-table-column label="说明" prop="desc" width="" sortable='custom'></el-table-column>
						<el-table-column label="响应状态码" prop="status" width="" sortable='custom'></el-table-column>
						<el-table-column label="发起时间" prop="start_time" width="" sortable='custom'></el-table-column>
						<el-table-column label="请求耗时(ms)" prop="time_cost" width="" sortable='custom'></el-table-column>
						<el-table-column label="浏览器标识" prop="user_agent" width="" sortable='custom'></el-table-column>
						<el-table-column label="创建时间" prop="CreatedAt" width="" sortable='custom'></el-table-column>
						<el-table-column label="操作" fixed="right" align="right" width="">
							<template #default="scope">
								<el-button-group>
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
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './save'

	export default {
		name: 'user',
		components: {
			saveDialog
		},
		data() {
			return {
				dialog: {
					save: false
				},
				showGrouploading: false,
				groupFilterText: '',
				group: [],
				apiObj: this.$API.system.log.list,
				selection: [],
				search: {
					name: null
				}
			}
		},
		watch: {
			groupFilterText(val) {
				this.$refs.group.filter(val);
			}
		},
		mounted() {

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
			//删除
			async table_del(row, index){
				console.log(index)
				var reqData = {operationLogIds: [row.ID]}
				var res = await this.$API.system.log.delete.delete(reqData);
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
				var reqData = {operationLogIds: ids}
				var res = await this.$API.system.log.delete.delete(reqData);
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
			//树过滤
			groupFilterNode(value, data){
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			//树点击事件
			groupClick(data){
				var params = {
					groupId: data.id
				}
				this.$refs.table.reload(params)
			},
			//搜索
			upsearch(){
				this.$refs.table.upData(this.search)
			},
			//本地更新数据
			handleSuccess(data, mode){
				console.log(data, mode)
				this.$refs.table.refresh()
				// if(mode=='add'){
				// 	data.id = new Date().getTime()
				// 	this.$refs.table.tableData.unshift(data)
				// }else if(mode=='edit'){
				// 	this.$refs.table.tableData.filter(item => item.id===data.id ).forEach(item => {
				// 		Object.assign(item, data)
				// 	})
				// }
			}
		}
	}
</script>

<style>
</style>
