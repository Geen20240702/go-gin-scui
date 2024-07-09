<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">

			<el-form-item label="登录账号" prop="username">
				<el-input v-model="form.username" placeholder="用于登录系统" clearable></el-input>
			</el-form-item>

			<template v-if="mode=='add'">
				<el-form-item label="登录密码" prop="password">
					<el-input type="password" v-model="form.password" clearable show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input type="password" v-model="form.password2" clearable show-password></el-input>
				</el-form-item>
			</template>

			<el-form-item label="昵称" prop="nickname">
				<el-input v-model="form.nickname" placeholder="" clearable></el-input>
			</el-form-item>

			<el-form-item label="手机" prop="mobile">
				<el-input v-model="form.mobile" placeholder="" clearable></el-input>
			</el-form-item>

			<el-form-item label="简介" prop="introduction">
				<el-input v-model="form.introduction" placeholder="" clearable></el-input>
			</el-form-item>

			<el-form-item label="所属角色" prop="roleIds">
				<el-select v-model="form.roleIds" multiple filterable style="width: 100%">
					<el-option v-for="item in roles" :key="item.ID" :label="item.name" :value="item.ID"/>
				</el-select>
			</el-form-item>

			<el-form-item label="状态" prop="roleIds">
				<el-select v-model="form.status" filterable style="width: 100%">
					<el-option label="正常" value="1"/>
					<el-option label="禁用" value="2"/>
				</el-select>
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
					username: "test",
					nickname: "测试",
					avatar: "",
					mobile: "13800138001",
					introduction: "测试",
					status: "1",
					password: "123456",
					password2: "123456",
					roleIds: []
				},
				//验证规则
				rules: {
					username: [
						{required: true, message: '请输入登录账号'}
					],
					password: [
						{required: true, message: '请输入登录密码'},
						{validator: (rule, value, callback) => {
							if (this.form.password2 !== '') {
								this.$refs.dialogForm.validateField('password2');
							}
							callback();
						}}
					],
					password2: [
						{required: true, message: '请再次输入密码'},
						{validator: (rule, value, callback) => {
							if (value !== this.form.password) {
								callback(new Error('两次输入密码不一致!'));
							}else{
								callback();
							}
						}}
					],
					dept: [
						{required: true, message: '请选择所属部门'}
					],
					group: [
						{required: true, message: '请选择所属角色', trigger: 'change'}
					]
				},
				//所需数据选项
				roles: [],
			}
		},
		mounted() {
			this.getRoles()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//加载树数据
			async getRoles(){
				var res = await this.$API.system.role.list.get();
				this.roles = res.data.rows;
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaveing = true;
						this.form.status = this.form.status*1
						var res = null

						if(this.mode == 'add') {
							res = await this.$API.system.user.create.post(this.form);
						}
						else{
							res = await this.$API.system.user.update.post(this.form);
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
			setData(data){
				this.form.id = data.ID
				this.form.username = data.username
				this.form.nickname = data.nickname
				this.form.roleIds = data.roleIds
				this.form.mobile = data.mobile
				this.form.introduction = data.introduction
				this.form.status = data.status+''
				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
