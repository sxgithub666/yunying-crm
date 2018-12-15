<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.company_name" placeholder="公司名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getGatherList">查询</el-button>
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
			<el-table-column prop="company_name" label="公司名称" width="200">
			</el-table-column>
			<el-table-column prop="area" label="销售区域">
			</el-table-column>
			<el-table-column prop="pay_time" label="收款时间" width="190">
			</el-table-column>
			<el-table-column prop="customer_type" label="客户类型" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.customer_type==0">渠道</span>
					<span v-if="scope.row.customer_type==1">直客</span>
				</template>
			</el-table-column>
			<el-table-column prop="company_industry" label="公司行业" width="100">
			</el-table-column>
			<el-table-column prop="robot_number" label="机器人数量" width="100">
			</el-table-column>
			<el-table-column prop="customer_clues" label="客户线索来源" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.customer_clues==0">SEM</span>
					<span v-if="scope.row.customer_clues==1">公司</span>
				</template>
			</el-table-column>
			<el-table-column prop="business_itself" label="商务本身" width="100">
			</el-table-column>
			<el-table-column prop="number_pay_money" label="号码费收款金额" width="100">
			</el-table-column>
			<el-table-column prop="call_customer_pay_money" label="通信费客户自备线路收款金额" width="100">
			</el-table-column>
			<el-table-column prop="call_card_pay_money" label="通信费卡槽费收款金额" width="100">
			</el-table-column>
			<el-table-column prop="call_year_pay_money" label="通信费包年正常收款金额" width="100">
			</el-table-column>
			<el-table-column prop="robot_pay_money" label="机器人费收款金额" width="100">
			</el-table-column>
			<el-table-column prop="pay_type" label="付款方式" width="100">
			</el-table-column>
			<el-table-column prop="refunds" label="是否返款" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.refunds==0">未返款</span>
					<span v-if="scope.row.refunds==1">已返款</span>
				</template>
			</el-table-column>
			<el-table-column prop="pay_voucher" label="打款凭证">
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
				<el-form-item label="公司名称" prop="company_name">
					<el-input v-model="editForm.company_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="销售区域" prop="area">
					<el-input v-model="editForm.area" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="收款时间">
					<el-date-picker v-model="editForm.pay_time" @change="getEditPayTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="客户类型">
					<el-select v-model="editForm.customer_type" size="small" placeholder="客户类型">
            <el-option label="直客" value="1"></el-option>
            <el-option label="渠道" value="0"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="公司行业">
					<el-input v-model="editForm.company_industry" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="机器人数量">
					<el-input v-model="editForm.robot_number" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户线索来源">
					<el-select v-model="editForm.customer_clues" size="small" placeholder="客户线索来源">
            <el-option label="公司" value="1"></el-option>
            <el-option label="SEM" value="0"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="商务本身">
					<el-input v-model="editForm.business_itself" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码费收款金额">
					<el-input v-model="editForm.number_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <div class="flex">
					<el-form-item label="开始时间">
						<el-date-picker v-model="editForm.start_date" @change="getEditPayTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间">
						<el-date-picker v-model="editForm.end_date"  @change="getEditETime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div> -->
				<el-form-item label="通信费客户自备线路收款金额">
					<el-input v-model="editForm.call_customer_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通信费卡槽费收款金额">
					<el-input v-model="editForm.call_card_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通信费包年正常收款金额">
					<el-input v-model="editForm.call_year_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="机器人费收款金额">
					<el-input v-model="editForm.robot_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="付款方式">
					<el-input v-model="editForm.pay_type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否返款">
					<el-select v-model="editForm.refunds" size="small" placeholder="是否返款">
            <el-option label="已返款" value="1"></el-option>
            <el-option label="未返款" value="0"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="打款凭证">
					<el-input v-model="editForm.pay_voucher" auto-complete="off"></el-input>
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
				<el-form-item label="公司名称" prop="company_name">
					<el-input v-model="addForm.company_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="销售区域" prop="area">
					<el-input v-model="addForm.area" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="收款时间">
					<el-date-picker v-model="addForm.pay_time" @change="getAddPayTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="客户类型">
					<el-select v-model="addForm.customer_type" size="small" placeholder="客户类型">
            <el-option label="直客" value="1"></el-option>
            <el-option label="渠道" value="0"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="公司行业">
					<el-input v-model="addForm.company_industry" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="机器人数量">
					<el-input v-model="addForm.robot_number" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="客户线索来源">
					<el-select v-model="addForm.customer_clues" size="small" placeholder="客户线索来源">
            <el-option label="公司" value="1"></el-option>
            <el-option label="SEM" value="0"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="商务本身">
					<el-input v-model="addForm.business_itself" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码费收款金额">
					<el-input v-model="addForm.number_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <div class="flex">
					<el-form-item label="开始时间">
						<el-date-picker v-model="addForm.start_date" @change="getSTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间">
						<el-date-picker v-model="addForm.end_date"  @change="getETime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div> -->
				<el-form-item label="通信费客户自备线路收款金额">
					<el-input v-model="addForm.call_customer_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通信费卡槽费收款金额">
					<el-input v-model="addForm.call_card_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通信费包年正常收款金额">
					<el-input v-model="addForm.call_year_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="机器人费收款金额">
					<el-input v-model="addForm.robot_pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="付款方式">
					<el-input v-model="addForm.pay_type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否返款">
					<el-select v-model="addForm.refunds" size="small" placeholder="是否返款">
            <el-option label="已返款" value="1"></el-option>
            <el-option label="未返款" value="0"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="打款凭证">
					<el-input v-model="addForm.pay_voucher" auto-complete="off"></el-input>
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
	import { getCompanyCollectionByParam, insertCompanyCollection, updateCompanyCollectionById, deleteCompanyCollectionById} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					company_name: ''
				},
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					company_name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					area: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],
				},
				//编辑界面数据
				editForm: {
					company_name:'',
					area:'',
					pay_time:'',
					customer_type:'',
					company_industry:'',
					robot_number:'',
					customer_clues:'',
					business_itself:'',
					number_pay_money:'',
					start_date:'',
					end_date:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					call_year_pay_money:'',
					robot_pay_money:'',
					pay_type:'',
					refunds:'',
					pay_voucher:'',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					company_name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					area: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],

				},
				//新增界面数据
				addForm: {
					id:'',
					company_name:'',
					area:'',
					pay_time:'',
					customer_type:'',
					company_industry:'',
					robot_number:'',
					customer_clues:'',
					business_itself:'',
					number_pay_money:'',
					start_date:'',
					end_date:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					call_year_pay_money:'',
					robot_pay_money:'',
					pay_type:'',
					refunds:'',
					pay_voucher:'',
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getGatherList();
			},
			//获取table列表
			getGatherList() {
				const data = {
					page: this.page,
					rows:10,
					company_name: this.filters.company_name
				};
				this.listLoading = true;
				getCompanyCollectionByParam(data).then((res) => {
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
					deleteCompanyCollectionById(data).then((res) => {
						this.listLoading = false;
						this.$message({
							message: res.errMsg,
							type: 'success'
						});
						this.getGatherList();
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
					company_name:'',
					area:'',
					pay_time:'',
					customer_type:'',
					company_industry:'',
					robot_number:'',
					customer_clues:'',
					business_itself:'',
					number_pay_money:'',
					start_date:'',
					end_date:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					call_year_pay_money:'',
				};
			},
			//编辑
			editSubmit() {
				this.editLoading = true;
				const data = Object.assign({}, this.editForm);
				updateCompanyCollectionById(data).then((res) => {
					this.editLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['editForm'].resetFields();
					this.editFormVisible = false;
					this.getGatherList();
				});
			},
			//新增
			addSubmit() {
				this.addLoading = true;
				const data = Object.assign({}, this.addForm);
				insertCompanyCollection(data).then((res) => {
					this.addLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['addForm'].resetFields();
					this.addFormVisible = false;
					this.getGatherList();
				});
			},
			getSTime(val){
				this.addForm.start_date=val;
			},
			getETime(val){
				this.addForm.end_date=val;
			},
			getEditPayTime(val){
				this.editForm.pay_time=val;
			},
			getAddPayTime(val){
				this.addForm.pay_time=val;
			}
		},
		mounted() {
			this.getGatherList();
		}
	}

</script>

<style scoped>
.flex{
	display: flex;
	flex-direction: row;
}
</style>