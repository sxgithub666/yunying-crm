<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.reconciliation_time" placeholder="对账时间"></el-input>
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
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="customer_name" label="客户名称" width="100">
			</el-table-column>
			<el-table-column prop="reconciliation_time" label="对账时间" width="100">
			</el-table-column>
			<el-table-column prop="income" label="收入" width="100">
			</el-table-column>
			<el-table-column prop="reconciliation_cost" label="成本" width="100">
			</el-table-column>
			<el-table-column prop="account_name" label="账户名称" width="100">
			</el-table-column>
			<el-table-column prop="balance" label="余额" width="100">
			</el-table-column>
			<el-table-column prop="invoice_state" label="是否开票" width="180">
        <template slot-scope="scope">
					<span v-if="scope.row.invoice_state==0">未开票</span>
					<span v-else>已开票</span>
				</template>
			</el-table-column>
			<el-table-column prop="special_ticket" label="专票普票" width="180">
			</el-table-column>
			<el-table-column prop="amount_adjustment" label="调整金额" width="180">
			</el-table-column>
			<el-table-column prop="tax_point" label="税点" width="180">
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="180">
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
				<el-form-item label="客户名称" prop="customer_name">
					<el-input v-model="editForm.customer_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="对账时间" prop="reconciliation_time">
          <el-date-picker v-model="editForm.reconciliation_time" @change="getEditTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="收入">
					<el-input v-model="editForm.income" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="成本">
					<el-input v-model="editForm.reconciliation_cost" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账户名称">
					<el-input v-model="editForm.account_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="余额">
					<el-input v-model="editForm.balance" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否开票">
          <el-radio-group v-model="editForm.invoice_state">
						<el-radio :label="1">已开票</el-radio>
						<el-radio :label="0">未开票</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="专票普票">
					<el-input v-model="editForm.special_ticket" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="调整金额">
					<el-input v-model="editForm.amount_adjustment" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="税点">
					<el-input v-model="editForm.tax_point" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="editForm.remark" auto-complete="off"></el-input>
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
				<el-form-item label="客户名称" prop="customer_name">
					<el-input v-model="addForm.customer_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="对账时间" prop="reconciliation_time">
					<el-date-picker v-model="addForm.reconciliation_time" @change="getAddTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="收入">
          <el-input v-model="addForm.income" auto-complete="off"></el-input>
					
				</el-form-item>
				<el-form-item label="成本">
          <el-input v-model="addForm.reconciliation_cost" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账户名称">
					<el-input v-model="addForm.account_name" auto-complete="off"></el-input>
				</el-form-item>
				</el-form-item>
				<el-form-item label="余额">
					<el-input v-model="addForm.balance" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否开票">
          <el-radio-group v-model="addForm.invoice_state">
						<el-radio :label="1">已开票</el-radio>
						<el-radio :label="0">未开票</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="专票普票">
					<el-input v-model="addForm.special_ticket" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="调整金额">
					<el-input v-model="addForm.amount_adjustment" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="税点">
					<el-input v-model="addForm.tax_point" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="addForm.remark" auto-complete="off"></el-input>
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
	import { getReconciliationByParam, insertReconciliation, updateReconciliationById, deleteReconciliationById} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					reconciliation_time: ''
				},
				role_id:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					customer_name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					reconciliation_time: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],
				},
				//编辑界面数据
				editForm: {
					customer_name:'',
					reconciliation_time:'',
					income:'',
					reconciliation_cost:'',
					account_name:'',
					balance:'',
					invoice_state:'',
					special_ticket:'',
					amount_adjustment:'',
					tax_point:'',
					remark:'',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					customer_name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					reconciliation_time: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],

				},
				//新增界面数据
				addForm: {
					customer_name:'',
					reconciliation_time:'',
					income:'',
					reconciliation_cost:'',
					account_name:'',
					balance:'',
					invoice_state:'',
					special_ticket:'',
					amount_adjustment:'',
					tax_point:'',
					remark:'',
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
					customer_name: this.filters.customer_name
				};
				this.listLoading = true;
				getReconciliationByParam(data).then((res) => {
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
					deleteReconciliationById(data).then((res) => {
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
					customer_name:'',
					reconciliation_time:'',
					income:'',
					reconciliation_cost:'',
					account_name:'',
					balance:'',
					start_date:'',
					end_date:'',
				};
			},
			//编辑
			editSubmit() {
				this.editLoading = true;
				const data = Object.assign({}, this.editForm);
				updateReconciliationById(data).then((res) => {
					this.editLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['editForm'].resetFields();
					this.editFormVisible = false;
					this.getTableList();
				});
			},
			//新增
			addSubmit() {
				this.addLoading = true;
				const data = Object.assign({}, this.addForm);
				insertReconciliation(data).then((res) => {
					this.addLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['addForm'].resetFields();
					this.addFormVisible = false;
					this.getTableList();
				});
			},
			getAddTime(val){
				this.addForm.reconciliation_time=val;
			},
			getEditTime(val){
				this.editForm.reconciliation_time=val;
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
}
</style>