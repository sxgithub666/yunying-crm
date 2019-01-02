<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.company_name" placeholder="公司全称"></el-input>
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
			<el-table-column prop="area" label="销售区域" width="100">
			</el-table-column>
			<el-table-column prop="company_name" label="公司全称" width="100">
			</el-table-column>
			<el-table-column prop="pay_time" label="收款时间" width="160">
			</el-table-column>
			<el-table-column prop="customer_type" label="客户类型" width="100">
			</el-table-column>
			<el-table-column prop="audit_status" label="状态" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.audit_status==0">未审核</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.audit_status==1">审核中</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.audit_status==2">审核通过</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.audit_status==3">审核拒绝</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="company_industry" label="公司行业" width="100">
			</el-table-column>>
			<el-table-column prop="robot_number" label="机器人数量" width="100">
			</el-table-column>
			<el-table-column prop="line_concurrency" label="线路并发数" width="180">
			</el-table-column>
			<el-table-column prop="number_pay_money" label="号码费" width="180">
			</el-table-column>
			<el-table-column prop="call_customer_pay_money" label="客户自备线路" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.call_customer_pay_money==0">否</span>
					<span v-if="scope.row.call_customer_pay_money==1">是</span>
				</template>
			</el-table-column>
			<el-table-column prop="call_card_pay_money" label="通信费卡槽费" width="180">
			</el-table-column>
			<el-table-column prop="call_year_pay_money" label="通信费" width="180">
				<template slot-scope="scope">
					<span v-if="scope.row.call_year_pay_money==0">月付</span>
					<span v-if="scope.row.call_year_pay_money==1">季付</span>
					<span v-if="scope.row.call_year_pay_money==2">年付</span>
					<span v-if="scope.row.call_year_pay_money==3">测试(XXX)</span>
				</template>
			</el-table-column>
			<el-table-column prop="robot_pay_money" label="机器人费" width="180">
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="180">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="260">
				<template slot-scope="scope">
					<el-button v-if="scope.row.audit_status==0" size="small" @click="auditSubmit(scope.row)">提交审核</el-button>
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
		<el-dialog title="编辑" width="57%" :visible.sync="editFormVisible" :close-on-click-modal="false">
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
						<el-radio-group v-model="editForm.call_customer_pay_money" size="small">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>
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
						<el-radio-group v-model="editForm.call_year_pay_money">
							<el-radio label="0">月付</el-radio>
							<el-radio label="1">季付</el-radio>
							<el-radio label="2">年付</el-radio>
							<el-radio label="3">测试(XXX)</el-radio>
						</el-radio-group>
						<!-- <el-input v-model="editForm.call_year_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="客户类型" prop="customer_type">
						<el-radio-group v-model="editForm.customer_type">
							<el-radio label="1">直客</el-radio>
							<el-radio label="0">渠道</el-radio>
						</el-radio-group>
					</el-form-item>
					
				</div>
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
		<el-dialog title="新增" width="57%" :visible.sync="addFormVisible" :close-on-click-modal="false">
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
						<el-radio-group v-model="addForm.call_customer_pay_money" size="small">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>
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
						<el-radio-group v-model="addForm.call_year_pay_money">
							<el-radio label="0">月付</el-radio>
							<el-radio label="1">季付</el-radio>
							<el-radio label="2">年付</el-radio>
							<el-radio label="3">测试(XXX)</el-radio>
						</el-radio-group>
						<!-- <el-input v-model="addForm.call_year_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="客户类型" prop="customer_type">
						<el-radio-group v-model="addForm.customer_type">
							<el-radio label="1">直客</el-radio>
							<el-radio label="0">渠道</el-radio>
						</el-radio-group>
					</el-form-item>
					
				</div>
					<el-form-item label="备注">
						<el-input v-model="addForm.remark" auto-complete="off"></el-input>
					</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getXsznProcessByParam, insertXsznProcess, updateXsznProcessById, deleteXsznProcessById ,updateReProcessById ,insertProcess} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					company_name: ''
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
					robot_number: [{ required: true, message: '请输入机器人数量', trigger: 'blur'}],
					line_concurrency: [{ required: true, message: '请输入线路并发数', trigger: 'blur'}],
					number_pay_money: [{ required: true, message: '请输入号码费收款金额', trigger: 'blur'}],
					call_customer_pay_money: [{ required: true, message: '请输入自备线路收款', trigger: 'blur'}],
					call_card_pay_money: [{ required: true, message: '请输入卡槽费收款金额', trigger: 'blur'}],
					call_year_pay_money: [{ required: true, message: '请输入包年正常收款金额', trigger: 'blur'}],
					robot_pay_money: [{ required: true, message: '请输入机器人费收款金额', trigger: 'blur'}],
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
					area: this.filters.area
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