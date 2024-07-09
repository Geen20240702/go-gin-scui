<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
			<el-form-item label="角色名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="角色别名" prop="keyword">
				<el-input v-model="form.keyword" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" active-value="1" inactive-value="2"></el-switch>
			</el-form-item>
			<el-form-item label="备注" prop="desc">
				<el-input v-model="form.desc" clearable type="textarea"></el-input>
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
					add: '新增',
					edit: '编辑',
					show: '查看'
				},
				visible: false,
				isSaveing: false,
				//表单数据
				form: {
					id:"",
					name: "",
					keyword: "",
					status: 1,
					desc: "",
					sort: 10,
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入角色名称'}
					],
					keyword: [
						{required: true, message: '请输入角色别名'}
					]
				}
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
							res = await this.$API.system.role.create.post(this.form);
						}else {
							res = await this.$API.system.role.update.post(this.form);
						}

						this.isSaveing = false;
						if(res.code == 200){
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
			//表单注入数据
			setData(data){
				this.form.id = data.ID
				this.form.name = data.name
				this.form.keyword = data.keyword
				this.form.status = data.status+''
				this.form.desc = data.desc
				this.form.sort = data.sort

				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
