<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.company_name" placeholder="公司名称"></el-input>
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
			<el-table-column prop="area" label="销售区域" width="100">
			</el-table-column>
			<el-table-column prop="company_name" label="公司名称" width="100">
			</el-table-column>
			<el-table-column prop="type" label="业务类型" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.type==0">总机</span>
					<span v-else>语音paas</span>
				</template>
			</el-table-column>
			<el-table-column prop="pay_time" label="收款时间" width="100">
			</el-table-column>
			<el-table-column prop="pay_money" label="收款金额" width="100">
			</el-table-column>
			<el-table-column prop="company_industry" label="公司行业" width="100">
			</el-table-column>
			<el-table-column prop="need_phonenumber" label="号码需求" width="100">
			</el-table-column>
			<el-table-column prop="business_type" label="业务类型" width="180">
			</el-table-column>
			<el-table-column prop="pay_type" label="付款方式" width="180">
			</el-table-column>
			<el-table-column prop="customer_region" label="客户所在区域" width="180">
			</el-table-column>
			<el-table-column prop="refunds" label="是否返款" width="180">
				<template slot-scope="scope">
					<span v-if="scope.row.refunds==0">未返款</span>
					<span v-else>已返款</span>
				</template>
			</el-table-column>
			<el-table-column prop="pay_voucher" label="打款凭证" width="180">
			</el-table-column>
			<el-table-column prop="need_data" label="申请号码所需材料" width="180">
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
				<el-form-item label="销售区域" prop="area">
					<el-input v-model="editForm.area" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="公司名称" prop="company_name">
					<el-input v-model="editForm.company_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务类型" prop="type">
					<el-radio-group v-model="editForm.type">
						<el-radio :label="1">语音paas</el-radio>
						<el-radio :label="0">总机</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="收款时间">
					<el-date-picker v-model="editForm.pay_time" @change="getEditTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="收款金额">
					<el-input v-model="editForm.pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="公司行业">
					<el-input v-model="editForm.company_industry" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码需求">
					<el-input v-model="editForm.need_phonenumber" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务类型">
					<el-input v-model="editForm.business_type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="付款方式">
					<el-input v-model="editForm.pay_type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户所在区域">
					<el-input v-model="editForm.customer_region" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否返款">
					<el-radio-group v-model="editForm.refunds">
						<el-radio :label="1">已返款</el-radio>
						<el-radio :label="0">未返款</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="打款凭证">
					<el-input v-model="editForm.pay_voucher" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="申请号码所需材料">
					<el-input v-model="editForm.need_data" auto-complete="off"></el-input>
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
				<el-form-item label="销售区域" prop="area">
					<el-input v-model="addForm.area" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="公司名称" prop="company_name">
					<el-input v-model="addForm.company_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务类型" prop="type">
					<el-radio-group v-model="addForm.type">
						<el-radio :label="1">语音paas</el-radio>
						<el-radio :label="0">总机</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="收款时间">
					<el-date-picker v-model="addForm.pay_time" @change="getAddTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="收款金额">
					 <el-radio-group v-model="addForm.pay_money">
						<el-radio :label="1">直客</el-radio>
						<el-radio :label="0">渠道</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="公司行业">
					<el-input v-model="addForm.company_industry" auto-complete="off"></el-input>
				</el-form-item>
				</el-form-item>
				<el-form-item label="号码需求">
					<el-input v-model="addForm.need_phonenumber" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务类型">
					<el-input v-model="addForm.business_type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="付款方式">
					<el-input v-model="addForm.pay_type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户所在区域">
					<el-input v-model="addForm.customer_region" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否返款">
					<el-radio-group v-model="addForm.refunds">
						<el-radio :label="1">已返款</el-radio>
						<el-radio :label="0">未返款</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="打款凭证">
					<el-input v-model="addForm.pay_voucher" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="申请号码所需材料">
					<el-input v-model="addForm.need_data" auto-complete="off"></el-input>
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
	import { getZjPaasProcessByParam, insertZjPaasProcess, updateZjPaasProcessById, deleteZjPaasProcessById} from '../../api/api';

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
					area: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					company_name: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],
				},
				//编辑界面数据
				editForm: {
					area:'',
					company_name:'',
					type:'',
					pay_time:'',
					pay_money:'',
					company_industry:'',
					need_phonenumber:'',
					business_type:'',
					pay_type:'',
					customer_region:'',
					refunds:'',
					pay_voucher:'',
					need_data:'',
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
					type:'',
					pay_time:'',
					pay_money:'',
					company_industry:'',
					need_phonenumber:'',
					business_type:'',
					pay_type:'',
					customer_region:'',
					refunds:'',
					pay_voucher:'',
					need_data:'',
					remark:'',
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
					area: this.filters.area
				};
				this.listLoading = true;
				getZjPaasProcessByParam(data).then((res) => {
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
					deleteZjPaasProcessById(data).then((res) => {
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
					area:'',
					company_name:'',
					pay_time:'',
					pay_money:'',
					company_industry:'',
					need_phonenumber:'',
					start_date:'',
					end_date:'',
				};
			},
			//编辑
			editSubmit() {
				this.editLoading = true;
				const data = Object.assign({}, this.editForm);
				updateZjPaasProcessById(data).then((res) => {
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
				insertZjPaasProcess(data).then((res) => {
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
			getAddTime(val){
				this.addForm.pay_time=val;
			},
			getEditTime(val){
				this.editForm.pay_time=val;
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