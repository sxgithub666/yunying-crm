<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.customer_name" placeholder="客户名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input size="small" clearable v-model="filters.user_name" placeholder="销售名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getTableList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="prefix" label="前缀" width="100">
			</el-table-column>
			<el-table-column prop="customer_name" label="客户名称" width="100">
			</el-table-column>
			<el-table-column prop="belong" label="业务归属" width="100">
			</el-table-column>
			<el-table-column prop="industry" label="行业" width="100">
			</el-table-column>
			<el-table-column prop="audit_status" label="状态" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.audit_status==0">未审批</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.audit_status==1">转发中</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.audit_status==2">审批通过</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.audit_status==3">审批拒绝</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="number_charges" label="号码费" width="100">
			</el-table-column>>
			<el-table-column prop="charges" label="通信资费" width="100">
			</el-table-column>
			<el-table-column prop="start_date" label="开通时间" width="180">
			</el-table-column>
			<el-table-column prop="user_name" label="所属销售" width="180">
			</el-table-column>
			<el-table-column prop="end_date" label="关停时间" width="180">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="260">
				<template slot-scope="scope">
					<el-button v-if="scope.row.audit_status!=3" size="small" @click="auditSubmit(scope.row)">提交审核</el-button>
					<el-button v-if="scope.row.audit_status==3" size="small" @click="resubmit(scope.row)">重新提交</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar center">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<div class="flex">
					<el-form-item label="前缀" prop="prefix">
						<el-input v-model="editForm.prefix" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="客户名称" prop="customer_name">
						<el-input v-model="editForm.customer_name" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务归属" prop="belong">
						<el-input v-model="editForm.belong" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="行业" prop="industry">
						<el-input v-model="editForm.industry" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="号码费" prop="number_charges">
						<el-input v-model="editForm.number_charges" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信资费" prop="charges">
						<el-input v-model="editForm.charges" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="开始时间" prop="start_date">
						<el-date-picker v-model="editForm.start_date" @change="getEditTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间" prop="end_date">
						<el-date-picker v-model="editForm.end_date"  @change="getEditETime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="editFormRules" ref="addForm">
				<div class="flex">
					<el-form-item label="前缀" prop="prefix">
						<el-input v-model="addForm.prefix" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="客户名称" prop="customer_name">
						<el-input v-model="addForm.customer_name" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务归属" prop="belong">
						<el-input v-model="addForm.belong" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="行业" prop="industry">
						<el-input v-model="addForm.industry" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="号码费" prop="number_charges">
						<el-input v-model="addForm.number_charges" clearable auto-complete="off"></el-input>
					</el-form-item>
					</el-form-item>
					<el-form-item label="通信资费" prop="charges">
						<el-input v-model="addForm.charges" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="开始时间" prop="start_date">
						<el-date-picker v-model="addForm.start_date" @change="getSTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间" prop="end_date">
						<el-date-picker v-model="addForm.end_date"  @change="getETime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getCustomerListByParam, insertCustomer, updateCustomerById, deleteCustomerById, insertProcess} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					customer_name: '',
					user_name:''
				},
				role_id:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					prefix: [{ required: true, message: '请输入前缀', trigger: 'blur' }],
					customer_name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
					belong: [{ required: true, message: '请输入业务归属', trigger: 'blur' }],
					industry: [{ required: true, message: '请输入行业', trigger: 'blur' }],
					number_charges: [{ required: true, message: '请输入号码费', trigger: 'blur' }],
					charges: [{ required: true, message: '请输入通信资费', trigger: 'blur' }],
					start_date: [{ required: true, message: '请输入开通时间', trigger: 'blur' }],
					end_date: [{ required: true, message: '请输入关停时间', trigger: 'blur' }],
				},
				//编辑界面数据
				editForm: {
					prefix:'',
					customer_name:'',
					belong:'',
					industry:'',
					number_charges:'',
					charges:'',
					start_date:'',
					end_date:'',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					prefix: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					customer_name: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],

				},
				//新增界面数据
				addForm: {
					prefix:'',
					customer_name:'',
					belong:'',
					industry:'',
					number_charges:'',
					charges:'',
					start_date:'',
					end_date:'',
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getTableList();
			},
			//获取table列表
			getTableList() {
				const data = {
					role_id:this.role_id,
					page: this.page,
					rows:10,
					customer_name: this.filters.customer_name,
					user_name:this.filters.user_name
				};
				this.listLoading = true;
				getCustomerListByParam(data).then((res) => {
					this.total = res.result.records;
					this.list = res.result.data;
					this.listLoading = false;
				});
			},
			//提交审核
			auditSubmit(row){
				const data={
					type:'5',
					type_id:row.id
				};
				insertProcess(data).then(res=>{
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.getTableList();
				})
			},
			//重新提交审核
			resubmit(row){
				const data={
					type:'5',
					type_id:row.id
				};
				updateReProcessById(data).then(res=>{
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.getTableList();
				})
			},
			//删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					const data = { id: row.id };
					deleteCustomerById(data).then((res) => {
						this.listLoading = false;
						this.$message({
							message: res.errMsg,
							type: 'success'
						});
						this.getTableList();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.addForm = {
					prefix:'',
					customer_name:'',
					belong:'',
					industry:'',
					number_charges:'',
					charges:'',
					start_date:'',
					end_date:'',
				};
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						const data = Object.assign({}, this.editForm);
						updateCustomerById(data).then((res) => {
							this.editLoading = false;
							this.$message({
								message: res.errMsg,
								type: 'success'
							});
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
							this.getTableList();
						});
					};
				});
			},
			//新增
			addSubmit() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.addLoading = true;
						const data = Object.assign({}, this.addForm);
						insertCustomer(data).then((res) => {
							this.addLoading = false;
							this.$message({
								message: res.errMsg,
								type: 'success'
							});
							this.$refs['addForm'].resetFields();
							this.addFormVisible = false;
							this.getTableList();
						});
					};
				});
			},
			getSTime(val){
				this.addForm.start_date=val;
			},
			getETime(val){
				this.addForm.end_date=val;
			},
			getEditTime(val){
				this.editForm.start_date=val;
			},
			getEditETime(val){
				this.editForm.end_date=val;
			}
		},
		mounted() {
			this.role_id=JSON.parse(sessionStorage.getItem('user')).role_id; 
			this.getTableList();
		}
	}

</script>

<style scoped>
.flex{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
</style>