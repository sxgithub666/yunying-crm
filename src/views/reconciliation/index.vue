<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.customer_name" placeholder="客户名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker size="small" v-model="filters.reconciliation_time" :picker-options="pickerOptions" @change="getFiltersTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
					</el-date-picker>
					<!-- <el-input size="small" clearable v-model="filters.reconciliation_time" placeholder="对账时间"></el-input> -->
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getTableList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button v-if="role_id==='4'" type="primary" size="small" @click="exportExcel">导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="customer_name" label="客户名称" width="100">
			</el-table-column>
			<el-table-column prop="reconciliation_time" label="对账时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="income" label="收入" width="100">
			</el-table-column>
			<el-table-column prop="reconciliation_cost" label="成本" width="100">
			</el-table-column>
			<el-table-column prop="vos_type" label="vos类型" width="100">
			</el-table-column>
			<el-table-column prop="balance" label="余额" width="100">
			</el-table-column>
			<!-- <el-table-column prop="amount_adjustment" label="调整金额" width="100">
			</el-table-column> -->
			<el-table-column prop="pay_record" label="缴费记录" width="100">
			</el-table-column>
			<el-table-column prop="payment_desc" label="缴费备注" width="100">
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="100">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button v-if="role_id==='4'" type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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
				<el-form-item label="客户名称" prop="customer_name">
					<el-input v-model="editForm.customer_name" clearable auto-complete="off"></el-input>
				</el-form-item>
				<div class="flex">
					<el-form-item label="对账时间" prop="reconciliation_time">
						<el-date-picker v-model="editForm.reconciliation_time" :picker-options="pickerOptions" @change="getEditTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="收入" prop="income">
						<el-input v-model="editForm.income" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="成本" prop="reconciliation_cost">
						<el-input v-model="editForm.reconciliation_cost" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="余额" prop="balance">
						<el-input v-model="editForm.balance" clearable auto-complete="off"></el-input>
					</el-form-item>
					<!-- <el-form-item label="账户名称" prop="account_name">
						<el-input v-model="editForm.account_name" clearable auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="缴费记录" prop="pay_record">
						<el-input v-model="editForm.pay_record" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="缴费记录备注" prop="payment_desc">
						<el-input v-model="editForm.payment_desc" clearable auto-complete="off"></el-input>
					</el-form-item>
					<!-- <el-form-item label="调整金额" prop="amount_adjustment">
						<el-input v-model="editForm.amount_adjustment" clearable auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="vos类型" prop="vos_type">
						<el-input v-model="editForm.vos_type" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="editForm.remark" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" >提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="editFormRules" ref="addForm">
				<el-form-item label="客户名称" prop="customer_name">
					<el-input v-model="addForm.customer_name" clearable auto-complete="off"></el-input>
				</el-form-item>
				<div class="flex">
					<el-form-item label="对账时间" prop="reconciliation_time">
						<el-date-picker v-model="addForm.reconciliation_time" :picker-options="pickerOptions" @change="getAddTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="收入" prop="income">
						<el-input v-model="addForm.income" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="成本" prop="reconciliation_cost">
						<el-input v-model="addForm.reconciliation_cost" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="余额" prop="balance">
						<el-input v-model="addForm.balance" clearable auto-complete="off"></el-input>
					</el-form-item>
					<!-- <el-form-item label="账户名称" prop="account_name">
						<el-input v-model="addForm.account_name" clearable auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="缴费记录" prop="pay_record">
						<el-input v-model="addForm.pay_record" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="缴费备注" prop="payment_desc">
						<el-input v-model="addForm.payment_desc" clearable auto-complete="off"></el-input>
					</el-form-item>
					<!-- <el-form-item label="调整金额" prop="amount_adjustment">
						<el-input v-model="addForm.amount_adjustment" clearable auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="vos类型" prop="vos_type">
						<el-input v-model="addForm.vos_type" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="addForm.remark" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getReconciliationByParam, insertReconciliation, updateReconciliationById, deleteReconciliationById ,uploadReconciliationByParam} from '../../api/api';
  import rules from '@/common/js/rule'
	export default {
		data() {
			return {
				pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
				filters: {
					customer_name:'',
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
					customer_name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
					reconciliation_time: [{ required: true, message: '请输入对账时间', trigger: 'blur' }],
					income: [{ required: true, message: '请输入收入', trigger: 'blur' }],
					reconciliation_cost: [{ required: true, message: '请输入成本', trigger: 'blur' }],
					// account_name: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
					balance: rules.numPot2,
					// amount_adjustment: rules.numPot2,
					pay_record: [{ required: true, message: '请输入缴费记录', trigger: 'blur' }],
					payment_desc: [{ required: true, message: '请输入缴费记录备注', trigger: 'blur' }],
					vos_type: [{ required: true, message: '请输入vos类型', trigger: 'blur' }],
				},
				//编辑界面数据
				editForm: {
					customer_name:'',
					reconciliation_time:'',
					income:'',
					reconciliation_cost:'',
					account_name:'',
					balance:'',
					amount_adjustment:'',
					pay_record:'',
					remark:'',
					payment_desc:'',
					vos_type:'',
					
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {
					customer_name:'',
					reconciliation_time:'',
					income:'',
					reconciliation_cost:'',
					account_name:'',
					balance:'',
					amount_adjustment:'',
					pay_record:'',
					remark:'',
					payment_desc:'',
					vos_type:'',
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
					payment_desc:'',
					vos_type:'',
				};
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
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
					};
				});
			},
			//新增
			addSubmit() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
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
					};
				});
			},
			//导出
			exportExcel(){
				const data={
					customer_name:this.filters.customer_name,
					reconciliation_time:this.filters.reconciliation_time,
				};
				uploadReconciliationByParam(data).then(res=>{
					var aDom = document.createElement('a');
					var evt = document.createEvent('HTMLEvents');
					evt.initEvent('click', false, false);
					aDom.download = true;
					aDom.href = res.result;
					aDom.dispatchEvent(evt);
					aDom.click();
				})
			},
			getFiltersTime(val){
				this.filters.reconciliation_time=val;
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
	justify-content: space-between;
}
</style>