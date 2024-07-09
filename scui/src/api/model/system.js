import config from "@/config"
import http from "@/utils/request"

export default {
	api:{
		tree: {
			url: `${config.API_URL}/api/tree`,
			name: "列表",
			get: async function(params){
				return await http.get(this.url,params);
			}
		},
		list: {
			url: `${config.API_URL}/api/list`,
			name: "列表",
			get: async function(params){
				return await http.get(this.url,params);
			}
		},
		update: {
			url: `${config.API_URL}/api/update`,
			name: "编辑",
			post: async function(params){
				let url = this.url+"/"+params.id
				return await http.post(url, params);
			}
		},
		create: {
			url: `${config.API_URL}/api/create`,
			name: "新增",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delete: {
			url: `${config.API_URL}/api/delete/batch`,
			name: "删除",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
	},
	menu: {
		myMenus: {
			url: `${config.API_URL}/menu/tree`,
			name: "获取我的菜单",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/menu/tree`,
			name: "获取菜单",
			get: async function(){
				return await http.get(this.url);
			}
		},
		update: {
			url: `${config.API_URL}/menu/update`,
			name: "编辑",
			post: async function(params){
				let url = this.url+"/"+params.id
				return await http.post(url, params);
			}
		},
		create: {
			url: `${config.API_URL}/menu/create`,
			name: "新增",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delete: {
			url: `${config.API_URL}/menu/delete/batch`,
			name: "删除",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
	},
	dic: {
		tree: {
			url: `${config.API_URL}/system/dic/tree`,
			name: "获取字典树",
			get: async function(){
				return await http.get(this.url);
			}
		},
		list: {
			url: `${config.API_URL}/system/dic/list`,
			name: "字典明细",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		get: {
			url: `${config.API_URL}/system/dic/get`,
			name: "获取字典数据",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	role: {
		list: {
			url: `${config.API_URL}/role/list`,
			name: "获取角色列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		update: {
			url: `${config.API_URL}/role/update`,
			name: "编辑",
			post: async function(params){
				let url = this.url+"/"+params.id
				return await http.post(url, params);
			}
		},
		create: {
			url: `${config.API_URL}/role/create`,
			name: "新增",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delete: {
			url: `${config.API_URL}/role/delete/batch`,
			name: "删除",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
		menu:{
			list: {
				url: `${config.API_URL}/role/menus/get`,
				name: "列表",
				get: async function(params){
					let url = this.url+"/"+params.id
					return await http.get(url, params);
				}
			},
			update: {
				url: `${config.API_URL}/role/menus/update`,
				name: "编辑",
				post: async function(params){
					let url = this.url+"/"+params.id
					return await http.post(url, params);
				}
			},
		},
		api:{
			list: {
				url: `${config.API_URL}/role/apis/get`,
				name: "列表",
				get: async function(params){
					let url = this.url+"/"+params.id
					return await http.get(url, params);
				}
			},
			update: {
				url: `${config.API_URL}/role/apis/update`,
				name: "编辑",
				post: async function(params){
					let url = this.url+"/"+params.id
					return await http.post(url, params);
				}
			},
		},
	},
	dept: {
		list: {
			url: `${config.API_URL}/system/dept/list`,
			name: "获取部门列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	user: {
		list: {
			url: `${config.API_URL}/user/list`,
			name: "获取用户列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		update: {
			url: `${config.API_URL}/user/update`,
			name: "编辑",
			post: async function(params){
				let url = this.url+"/"+params.id
				return await http.post(url, params);
			}
		},
		create: {
			url: `${config.API_URL}/user/create`,
			name: "新增",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
		delete: {
			url: `${config.API_URL}/user/delete/batch`,
			name: "删除",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
		resetPwd: {
			url: `${config.API_URL}/user/resetPwd`,
			name: "重置密码",
			post: async function(params){
				return await http.post(this.url, params);
			}
		},
	},
	app: {
		list: {
			url: `${config.API_URL}/system/app/list`,
			name: "应用列表",
			get: async function(){
				return await http.get(this.url);
			}
		}
	},
	log: {
		list: {
			url: `${config.API_URL}/log/operation/list`,
			name: "获取菜单",
			get: async function(params){
				return await http.get(this.url,params);
			}
		},
		delete: {
			url: `${config.API_URL}/log/operation/delete/batch`,
			name: "删除",
			delete: async function(params){
				return await http.delete(this.url, params);
			}
		},
	},
	table: {
		list: {
			url: `${config.API_URL}/system/table/list`,
			name: "表格列管理列表",
			get: async function(params){
				return await http.get(this.url, params);
			}
		},
		info: {
			url: `${config.API_URL}/system/table/info`,
			name: "表格列管理详情",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	},
	tasks: {
		list: {
			url: `${config.API_URL}/system/tasks/list`,
			name: "系统任务管理",
			get: async function(params){
				return await http.get(this.url, params);
			}
		}
	}
}
