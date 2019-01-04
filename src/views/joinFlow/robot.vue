<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.company_name" placeholder="公司全称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input size="small" clearable v-model="filters.user_name" placeholder="添加人"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getTableList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="exportExcel">导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="area" label="销售区域" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="company_name" label="公司全称" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="pay_time" label="收款时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="customer_type" label="客户类型" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.customer_type==0">直客</span>
					<span v-if="scope.row.customer_type==1">渠道</span>
				</template>
			</el-table-column>
			<el-table-column prop="audit_status" label="状态" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.audit_status==0">未审批</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.audit_status==1">转发中</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.audit_status==2">审批通过</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.audit_status==3">审批拒绝</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="company_industry" label="公司行业" width="80" show-overflow-tooltip>
			</el-table-column>>
			<el-table-column prop="robot_number" label="机器人数量" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="user_name" label="添加人" width="70" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="line_concurrency" label="线路并发数" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="number_pay_money" label="号码费" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="call_customer_pay_money" label="客户自备线路" width="110" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.call_customer_pay_money==0">否</span>
					<span v-if="scope.row.call_customer_pay_money==1">是</span>
				</template>
			</el-table-column>
			<el-table-column prop="call_card_pay_money" label="通信费卡槽费" width="110" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="call_year_pay_money" label="通信费" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.call_year_pay_money==0">月付</span>
					<span v-if="scope.row.call_year_pay_money==1">季付</span>
					<span v-if="scope.row.call_year_pay_money==2">年付</span>
					<span v-if="scope.row.call_year_pay_money==3">测试(XXX)</span>
				</template>
			</el-table-column>
			<el-table-column prop="robot_pay_money" label="机器人费" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="260">
				<template slot-scope="scope">
					<el-button v-if="scope.row.audit_status!=3" size="small" @click="auditSubmit(scope.row)">提交审核</el-button>
					<el-button v-if="scope.row.audit_status==3" size="small" @click="resubmit(scope.row)">重新提交</el-button>
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
		<el-dialog title="编辑" width="55%" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<div class="flex">
					<el-form-item label="销售区域" prop="area">
						<el-input v-model="editForm.area" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司全称" prop="company_name">
						<el-input v-model="editForm.company_name" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间" prop="pay_time">
						<el-date-picker v-model="editForm.pay_time" @change="getEditTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="客户自备线路" style="width:44%" prop="call_customer_pay_money">
						<el-select v-model="editForm.call_customer_pay_money">
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.call_customer_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
					
				</div>
				<div class="flex">
					<el-form-item label="公司行业" prop="company_industry">
						<el-input v-model="editForm.company_industry" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="机器人数量" prop="robot_number">
						<el-input v-model="editForm.robot_number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="线路并发数" prop="line_concurrency">
						<el-input v-model="editForm.line_concurrency" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费" prop="number_pay_money">
						<el-input v-model="editForm.number_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="机器人费" prop="robot_pay_money">
						<el-input v-model="editForm.robot_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信费卡槽费" prop="call_card_pay_money">
						<el-input v-model="editForm.call_card_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="通信费" prop="call_year_pay_money">
						<el-select v-model="editForm.call_year_pay_money">
							<el-option label="月付" value="0"></el-option>
							<el-option label="季付" value="1"></el-option>
							<el-option label="年付" value="2"></el-option>
							<el-option label="测试(XXX)" value="3"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.call_year_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="客户类型" prop="customer_type">
						<el-select v-model="editForm.customer_type">
							<el-option label="直客" value="0"></el-option>
							<el-option label="渠道" value="1"></el-option>
						</el-select>
					</el-form-item>
					
				</div>
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
		<el-dialog title="新增" width="55%" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="editFormRules" ref="addForm">
				<div class="flex">
					<el-form-item label="销售区域" prop="area">
						<el-input v-model="addForm.area" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司全称" prop="company_name">
						<el-input v-model="addForm.company_name" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间" prop="pay_time">
						<el-date-picker v-model="addForm.pay_time" @change="getAddTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="客户自备线路" style="width:44%" prop="call_customer_pay_money">
						<el-select v-model="addForm.call_customer_pay_money">
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
						<!-- <el-input v-model="addForm.call_customer_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="公司行业" prop="company_industry">
						<el-input v-model="addForm.company_industry" auto-complete="off"></el-input>
					</el-form-item>
					</el-form-item>
					<el-form-item label="机器人数量" prop="robot_number">
						<el-input v-model="addForm.robot_number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="线路并发数" prop="line_concurrency">
						<el-input v-model="addForm.line_concurrency" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费" prop="number_pay_money">
						<el-input v-model="addForm.number_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="机器人费" prop="robot_pay_money">
						<el-input v-model="addForm.robot_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					
					<el-form-item label="通信费卡槽费" prop="call_card_pay_money">
						<el-input v-model="addForm.call_card_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="通信费" prop="call_year_pay_money">
						<el-select v-model="addForm.call_year_pay_money">
							<el-option label="月付" value="0"></el-option>
							<el-option label="季付" value="1"></el-option>
							<el-option label="年付" value="2"></el-option>
							<el-option label="测试(XXX)" value="3"></el-option>
						</el-select>
						<!-- <el-input v-model="addForm.call_year_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="客户类型" prop="customer_type">
						<el-select v-model="addForm.customer_type">
							<el-option label="直客" value="1"></el-option>
							<el-option label="渠道" value="0"></el-option>
						</el-select>
					</el-form-item>
					
				</div>
					<el-form-item label="备注">
						<el-input v-model="addForm.remark" auto-complete="off"></el-input>
					</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getXsznProcessByParam, insertXsznProcess, updateXsznProcessById, deleteXsznProcessById ,updateReProcessById ,insertProcess ,uploadRobotByParam} from '../../api/api';
  import rules from '@/common/js/rule'
	export default {
		data() {
			return {
				filters: {
					company_name: '',
					user_name: '',
				},
				role_id:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					area: [{ required: true, message: '请输入销售区域', trigger: 'blur' }],
					company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur'}],
					customer_type: [{ required: true, message: '请输入客户类型', trigger: 'blur'}],
					pay_time: [{ required: true, message: '请输入收款时间', trigger: 'blur'}],
					company_industry: [{ required: true, message: '请输入公司行业', trigger: 'blur'}],
					robot_number: rules.InterNum,
					line_concurrency: rules.InterNum,
					number_pay_money: rules.numPot2,
					call_customer_pay_money: [{ required: true, message: '请输入自备线路收款', trigger: 'blur'}],
					call_card_pay_money: rules.numPot2,
					call_year_pay_money: [{ required: true, message: '请输入包年正常收款金额', trigger: 'blur'}],
					robot_pay_money: rules.numPot2,
				},
				//编辑界面数据
				editForm: {
					area:'',
					company_name:'',
					pay_time:'',
					customer_type:'',
					company_industry:'',
					robot_number:'',
					line_concurrency:'',
					number_pay_money:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					call_year_pay_money:'',
					robot_pay_money:'',
					remark:'',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					area: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					company_name: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],

				},
				//新增界面数据
				addForm: {
					area:'',
					company_name:'',
					pay_time:'',
					customer_type:'',
					company_industry:'',
					robot_number:'',
					line_concurrency:'',
					number_pay_money:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					call_year_pay_money:'',
					robot_pay_money:'',
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
					company_name: this.filters.company_name,
					user_name: this.filters.user_name,
				};
				this.listLoading = true;
				getXsznProcessByParam(data).then((res) => {
					this.total = res.result.records;
					this.list = res.result.data;
					this.listLoading = false;
				});
			},
			//提交审核
			auditSubmit(row){
				const data={
					type:'3',
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
					type:'3',
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
					deleteXsznProcessById(data).then((res) => {
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
					area:'',
					company_name:'',
					pay_time:'',
					customer_type:'',
					company_industry:'',
					robot_number:'',
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
						updateXsznProcessById(data).then((res) => {
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
						insertXsznProcess(data).then((res) => {
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
					company_name:this.filters.company_name,
					user_name:this.filters.user_name,
					};
				uploadRobotByParam(data).then(res=>{
					var aDom = document.createElement('a');
					var evt = document.createEvent('HTMLEvents');
					evt.initEvent('click', false, false);
					aDom.download = true;
					aDom.href = res.result;
					aDom.dispatchEvent(evt);
					aDom.click();
				})
			},
			getAddTime(val){
				this.addForm.pay_time=val;
			},
			getEditTime(val){
				this.editForm.pay_time=val;
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