<template>
	<div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" v-model="filters.user_name" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select size="small" placeholder="角色检索" clearable v-model="filters.role_id">
            <el-option v-for="item in rolesList"
                       :key="item.id"
                       :label="item.role_name"
                       :value="item.id">
            </el-option>
          </el-select>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="login_id" label="登录名" sortable>
			</el-table-column>
			<el-table-column prop="user_name" label="用户名" sortable>
			</el-table-column>
			<el-table-column prop="role_name" label="角色" sortable>
			</el-table-column>
			<!-- <el-table-column prop="password" label="密码" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" sortable>
			</el-table-column> -->
			<el-table-column label="操作" width="260">
				<template slot-scope="scope">
					<el-button size="small" @click="initPwd(scope.$index, scope.row)">初始化密码</el-button>
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
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名" prop="user_name">
					<el-input v-model="editForm.user_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="editForm.password"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="role_id">
					<el-radio-group v-model="editForm.role_id">
						<el-radio  v-for="role in rolesList" :label="role.id" :key="role.id">
							{{role.role_name}}
						</el-radio>
					</el-radio-group>
					<!-- <el-checkbox-group v-model="editForm.role_id">
						<el-checkbox class="checkbox" v-for="role in rolesList" :label="role.id" :key="role.id">
							{{role.role_name}}
						</el-checkbox>
					</el-checkbox-group> -->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" >提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="登录名" prop="login_id">
					<el-input v-model="addForm.login_id" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="user_name">
					<el-input v-model="addForm.user_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="role_id">
					<el-radio-group v-model="addForm.role_id">
						<el-radio  v-for="role in rolesList" :label="role.id" :key="role.id">
							{{role.role_name}}
						</el-radio>
					</el-radio-group>
					<!-- <el-checkbox-group v-model="addForm.role_id">
						<el-checkbox class="checkbox" v-for="role in rolesList" :label="role.id" :key="role.id">
							{{role.role_name}}
						</el-checkbox>
					</el-checkbox-group> -->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import util from '@/common/js/util'
	import { getUserInfoByParam,getUserInfoById, deleteUserInfoById, updateUserInfoById, insertUserInfo ,getRoleInfoByParam} from '@/api/api';

	export default {
		data() {
			return {
				filters: {
					user_name: '',
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
					user_name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					user_name: '',
					password: '',
					role_id:''
				},
				isAdmin:false,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					user_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
					login_id: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
				},
				//新增界面数据
				addForm: {
					login_id:'',
					user_name: '',
					password: '',
					email: '',
					role_id:''
				},
				rolesList:[]

			}
		},
		mounted() {
			this.getUsers();
			this.getRoleList();
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取角色列表
			getRoleList(){
				const data={
					page:1,
					rows:10
				}
				getRoleInfoByParam(data).then(res=>{
					this.rolesList = res.result.data;
				})
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					rows: this.rows,
					user_name:this.filters.user_name,
					role_id: this.filters.role_id
				};
				this.listLoading = true;
				getUserInfoByParam(para).then((res) => {
					this.total = res.result.records;
					this.users = res.result.data;
					this.listLoading = false;
				});
			},
			//删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					const data = { id: row.id };
					deleteUserInfoById(data).then((res) => {
						this.listLoading = false;
						this.$message({
							message: res.errMsg,
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//初始化密码
			initPwd(index,row){
				this.$confirm('确认初始化密码吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					const data = { 
						login_id:row.login_id,
						user_name:row.user_name,
						role_name:row.role_name
					 };
					updateUserInfoById(data).then((res) => {
						this.listLoading = false;
						this.$message({
							message: res.errMsg,
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//编辑提交
			editSubmit() {
				this.editLoading = true;
				const data = Object.assign({}, this.editForm);
				updateUserInfoById(data).then((res) => {
					this.editLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['editForm'].resetFields();
					this.editFormVisible = false;
					this.getUsers();
				});
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.addForm = {
					login_id:'',
					user_name: '',
					password: '',
					role_id:''
				};
			},
			//新增
			addSubmit() {
				this.addLoading = true;
				const data = Object.assign({}, this.addForm);
				insertUserInfo(data).then((res) => {
					this.addLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['addForm'].resetFields();
					this.addFormVisible = false;
					this.getUsers();
				});
			},
		},
		
	}

</script>

<style scoped>
.checkbox{
  margin-left: 30px;
}
</style>