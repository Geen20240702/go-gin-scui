<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">

			<el-form-item label="请求方式" prop="method">
				<el-select v-model="form.method" filterable style="width: 100%">
					<el-option label="POST" value="POST"/>
					<el-option label="GET" value="GET"/>
					<el-option label="DELETE" value="DELETE"/>
				</el-select>
			</el-form-item>

			<el-form-item label="访问路径" prop="path">
				<el-input v-model="form.path" placeholder="" clearable></el-input>
			</el-form-item>

			<el-form-item label="所属类别" prop="category">
				<el-select v-model="form.category" filterable style="width: 100%">
					<el-option label="role" value="role"/>
					<el-option label="menu" value="menu"/>
					<el-option label="api" value="api"/>
					<el-option label="base" value="base"/>
					<el-option label="log" value="log"/>
				</el-select>
			</el-form-item>

			<el-form-item label="说明" prop="desc">
				<el-input v-model="form.desc" placeholder="" clearable></el-input>
			</el-form-item>

		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaveing" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增用户',
					edit: '编辑用户',
					show: '查看'
				},
				visible: false,
				isSaveing: false,
				//表单数据
				form: {
					id:"",
					method: "",
					path: "",
					category: "",
					desc: "",
				},
				//验证规则
				rules: {

				},
			}
		},
		mounted() {


		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},

			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						this.form.status = this.form.status*1
						var res = null

						if(this.mode == 'add') {
							res = await this.$API.system.api.create.post(this.form);
						}
						else{
							res = await this.$API.system.api.update.post(this.form);
						}
						this.isSaveing = false;
						if(res.code == 200){
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}else{
						return false;
					}
				})
			},
			//表单注入数据
			setData(data) {
				this.form.id = data.ID
				this.form.method = data.method
				this.form.path = data.path
				this.form.category = data.category
				this.form.desc = data.desc
				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
