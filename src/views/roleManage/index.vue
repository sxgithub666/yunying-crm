<template>
	<div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" v-model="filters.role_name" placeholder="角色名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select size="small" placeholder="角色检索" clearable v-model="filters.role_id">
            <el-option v-for="item in rolesList"
                       :key="item.role_id"
                       :label="item.role_name"
                       :value="item.role_id">
            </el-option>
          </el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" v-on:click="getRoleList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" 
							highlight-current-row 
							v-loading="listLoading"
							style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="role_name" label="角色名" sortable>
			</el-table-column>
      <el-table-column prop="remark" label="备注" sortable width="500">
			</el-table-column>
			<el-table-column prop="creator" label="添加人" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar center">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="rows" :total="total">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名" prop="role_name">
					<el-input v-model="editForm.role_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" :rows="3" v-model="editForm.remark"></el-input>
				</el-form-item>
				<el-form-item label="权限">
					<el-tree :data="menus"
										show-checkbox
										node-key="id"
										:props="treeProps"
										ref="menuAddTree">
					</el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名" prop="role_name">
					<el-input v-model="addForm.role_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" :rows="3" v-model="addForm.remark"></el-input>
				</el-form-item>
				<el-form-item label="权限">
					<el-tree :data="menus"
										show-checkbox
										node-key="id"
										:props="treeProps"
										ref="menuAddTree">
					</el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import util from '@/common/js/util'
	import { 
					getRoleInfoByParam, 
					insertRoleInfo, 
					updateRoleInfoById, 
					deleteRoleInfoById , 
					getMenuList,
					getMenuListByUserRoleId
				 } from '@/api/api';

	export default {
		data() {
			return {
				filters: {
					role_name: '',
					role_id:''
				},
				users: [],
				total: 0,
				page: 1,
				rows:10,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					role_name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					role_name: '',
					remark: '',
					role_id:''
				},
				isAdmin:false,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					role_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
					login_id: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
				},
				//新增界面数据
				addForm: {
					login_id:'',
					role_name: '',
					remark: '',
					role_id:''
				},
				rolesList:[],
				menus:[],
				menuIds: [],//角色拥有的权限
				treeProps:{
          children: 'children',
          label: 'name'
        }
			}
		},
		mounted() {
			this.getRoleList();
			this.getMenuList();
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getRoleList();
			},
			//获取用户列表
			getRoleList() {
				let para = {
					page: this.page,
					rows: this.rows,
					role_name:this.filters.role_name,
					role_id: this.filters.role_id
				};
				this.listLoading = true;
				getRoleInfoByParam(para).then((res) => {
					this.total = res.result.records;
					this.users = res.result.data;
					this.listLoading = false;
				});
			},
			//获取菜单列表
      getMenuList(){
        const data={};
        getMenuList(data).then(res=>{
          this.menus=res.result.data;
        })
      },
			//删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					const data = { id: row.id };
					deleteRoleInfoById(data).then((res) => {
						this.listLoading = false;
						this.$message({
							message: res.errMsg,
							type: 'success'
						});
						this.getRoleList();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				const data={role_id:row.role_id};
				getMenuListByUserRoleId(data).then(res=>{
					this.setMenuIds(res.result.data)
				})
			},
			//编辑提交
			editSubmit() {
				this.editLoading = true;
				const data = Object.assign({}, this.editForm);
				data.menuIds=this.getMenuIds();
				insertRoleInfo(data).then((res) => {
					this.editLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['editForm'].resetFields();
					this.editFormVisible = false;
					this.getRoleList();
				});
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.addForm = {
					login_id:'',
					role_name: '',
					remark: '',
					role_id:''
				};
			},
			//新增
			addSubmit() {
				this.addLoading = true;
				const data = Object.assign({}, this.addForm);
				updateRoleInfoById (data).then((res) => {
					this.addLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['addForm'].resetFields();
					this.addFormVisible = false;
					this.getRoleList();
				});
			},
			//获取选中、半选中节点
      getMenuIds() {
        return this.$refs.menuAddTree.getCheckedKeys().concat(this.$refs.menuAddTree.getHalfCheckedKeys())
      },
      /**
       * (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 true 则仅设置叶子节点的选中状态，默认值为 false
       */
      setMenuIds(keys) {
        this.$refs.menuAddTree.setCheckedKeys(keys, true)
      }
		},
		
	}

</script>

<style scoped>
.checkbox{
  margin-left: 30px;
}
</style>