<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.customer_name" placeholder="客户名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getClientList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
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
			<el-table-column prop="number_charges" label="号码费" width="100">
			</el-table-column>>
			<el-table-column prop="charges" label="通信资费" width="100">
			</el-table-column>
			<el-table-column prop="start_date" label="开通时间" width="180">
			</el-table-column>
			<el-table-column prop="end_date" label="关停时间" width="180">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="150">
				<template slot-scope="scope">
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
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="前缀" prop="prefix">
					<el-input v-model="editForm.prefix" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户名称" prop="customer_name">
					<el-input v-model="editForm.customer_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务归属">
				  <el-input v-model="editForm.belong" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="行业">
					<el-input v-model="editForm.industry" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码费">
					<el-input v-model="editForm.number_charges" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通信资费">
					<el-input v-model="editForm.charges" auto-complete="off"></el-input>
				</el-form-item>
				<div class="flex">
					<el-form-item label="开始时间">
						<el-date-picker v-model="editForm.start_date" @change="getEditTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间">
						<el-date-picker v-model="editForm.end_date"  @change="getEditETime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="前缀" prop="prefix">
					<el-input v-model="addForm.prefix" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户名称" prop="customer_name">
					<el-input v-model="addForm.customer_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务归属">
					<el-input v-model="addForm.belong" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="行业">
					<el-input v-model="addForm.industry" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码费">
					<el-input v-model="addForm.number_charges" auto-complete="off"></el-input>
				</el-form-item>
				</el-form-item>
				<el-form-item label="通信资费">
					<el-input v-model="addForm.charges" auto-complete="off"></el-input>
				</el-form-item>
				<div class="flex">
					<el-form-item label="开始时间">
						<el-date-picker v-model="addForm.start_date" @change="getSTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间">
						<el-date-picker v-model="addForm.end_date"  @change="getETime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getCustomerListByParam, insertCustomer, updateCustomerById, deleteCustomerById} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					customer_name: ''
				},
				role_id:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					prefix: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					customer_name: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],
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
				this.getClientList();
			},
			//获取table列表
			getClientList() {
				const data = {
					role_id:this.role_id,
					page: this.page,
					rows:10,
					prefix: this.filters.prefix
				};
				this.listLoading = true;
				getCustomerListByParam(data).then((res) => {
					this.total = res.result.records;
					this.list = res.result.data;
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
					deleteCustomerById(data).then((res) => {
						this.listLoading = false;
						this.$message({
							message: res.errMsg,
							type: 'success'
						});
						this.getClientList();
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
					this.getClientList();
				});
			},
			//新增
			addSubmit() {
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
					this.getClientList();
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
			this.getClientList();
		}
	}

</script>

<style scoped>
.flex{
	display: flex;
	flex-direction: row;
}
</style>