<template>
	<div>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" v-model="filters.name" placeholder="参数名称"></el-input>
				</el-form-item>
				<!-- <el-form-item>
					<el-select size="small" placeholder="角色检索" clearable v-model="filters.role_id">
            <el-option v-for="item in rolesList"
                       :key="item.role_id"
                       :label="item.name"
                       :value="item.role_id">
            </el-option>
          </el-select>
				</el-form-item> -->
				<el-form-item>
					<el-button size="small" type="primary" v-on:click="getRoleList">查询</el-button>
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
			<el-table-column prop="name" label="参数名称" sortable>
			</el-table-column>
      <el-table-column prop="value" label="参数值" sortable>
			</el-table-column>
			<el-table-column prop="remark" label="备注" sortable>
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
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="参数名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="参数值">
          <el-input v-model="editForm.value" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
          <el-input v-model="editForm.remark" auto-complete="off"></el-input>
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
				<el-form-item label="参数名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="参数值">
					<el-input v-model="addForm.value" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="addForm.remark" auto-complete="off"></el-input>
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
	import { getSystemParamByParam, insertSystemParam, updateSystemParamById, deleteSystemParamById ,} from '@/api/api';

	export default {
		data() {
			return {
				filters: {
					name: '',
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
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					name: '',
					value: '',
					remark:''
				},
				isAdmin:false,
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
					login_id: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
				},
				//新增界面数据
				addForm: {
					login_id:'',
					name: '',
					value: '',
					remark:''
				},
			}
		},
		mounted() {
			this.getRoleList();
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
					name:this.filters.name,
					role_id: this.filters.role_id
				};
				this.listLoading = true;
				getSystemParamByParam(para).then((res) => {
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
					deleteSystemParamById(data).then((res) => {
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
			},
			//编辑提交
			editSubmit() {
				this.editLoading = true;
				const data = Object.assign({}, this.editForm);
				updateSystemParamById(data).then((res) => {
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
					name: '',
					value: '',
					role_id:''
				};
			},
			//新增
			addSubmit() {
				this.addLoading = true;
				const data = Object.assign({}, this.addForm);
				insertSystemParam (data).then((res) => {
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
		},
		
	}

</script>

<style scoped>
.checkbox{
  margin-left: 30px;
}
</style>