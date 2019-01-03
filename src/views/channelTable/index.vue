<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.name" placeholder="通道名称"></el-input>
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
			<el-table-column prop="prefix" label="前缀" show-overflow-tooltip width="110">
			</el-table-column>
			<el-table-column prop="level" label="级别" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="distance" label="市话长途" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="belong" label="业务归属" width="140" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="audit_status" label="状态" width="110" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.audit_status==0">未审批</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.audit_status==1">转发中</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.audit_status==2">审批通过</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.audit_status==3">审批拒绝</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="number" label="号码" width="150" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="address" label="地区" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="name" label="通道名称" width="260" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="business" label="业务" width="180" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="attribute" label="通道属性" width="180" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="start_date" label="开通时间" width="170" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="end_date" label="关停时间" width="170" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="communications_charges" label="通信资费" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="number_charges" label="号码费" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="invoice" label="是否开票" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.invoice==0">未开票</span>
					<span v-if="scope.row.invoice==1">已开票</span>
				</template>
			</el-table-column>
			<el-table-column prop="invoice_type" label="发票类型" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.invoice_type==0">专票</span>
					<span v-if="scope.row.invoice_type==1">普票</span>
				</template>
			</el-table-column>
			<el-table-column prop="tax_point" label="税点" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="remark" label="备注" show-overflow-tooltip>
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
			<el-form :model="editForm" label-width="100px" :rules="addFormRules" ref="editForm">
				<div class="flex">
					<el-form-item label="通道名称" prop="name">
						<el-input v-model="editForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通道前缀" prop="prefix">
						<el-input v-model="editForm.prefix" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="级别" prop="level">
						<el-input v-model="editForm.level" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="市话长途" prop="distance">
						<el-input v-model="editForm.distance" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务归属" prop="belong">
						<el-input v-model="editForm.belong" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码" prop="number">
						<el-input v-model="editForm.number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="地区" prop="address">
						<el-input v-model="editForm.address" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="业务" prop="business">
						<el-input v-model="editForm.business" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="开始时间" prop="start_date">
						<el-date-picker v-model="editForm.start_date" @change="getEditSTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间" prop="end_date">
						<el-date-picker v-model="editForm.end_date"  @change="getEditETime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div>
			  </div>
				<div class="flex">
					<el-form-item label="通道属性" prop="attribute">
						<el-input v-model="editForm.attribute" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信费" prop="charges">
						<el-input v-model="editForm.charges" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="通信资费" prop="communications_charges">
						<el-input v-model="editForm.communications_charges" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费" prop="number_charges">
						<el-input v-model="editForm.number_charges" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="是否开票" prop="invoice">
						<el-select v-model="editForm.invoice">
							<el-option label="已开票" value="1"></el-option>
							<el-option label="未开票" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发票类型" prop="invoice_type">
						<el-select v-model="editForm.invoice_type">
							<el-option label="普票" value="1"></el-option>
							<el-option label="专票" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-form-item label="税点" prop="tax_point">
					<el-input v-model="editForm.tax_point" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
				<div class="flex">
					<el-form-item label="通道名称" prop="name">
						<el-input v-model="addForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通道前缀" prop="prefix">
						<el-input v-model="addForm.prefix" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="级别" prop="level">
						<el-input v-model="addForm.level" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="市话长途" prop="distance">
						<el-input v-model="addForm.distance" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务归属" prop="belong">
						<el-input v-model="addForm.belong" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码" prop="number">
						<el-input v-model="addForm.number" auto-complete="off"></el-input>
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
				<div class="flex">
					<el-form-item label="通道属性" prop="attribute">
						<el-input v-model="addForm.attribute" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信费" prop="charges">
						<el-input v-model="addForm.charges" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="通信资费" prop="communications_charges">
						<el-input v-model="addForm.communications_charges" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费" prop="number_charges">
						<el-input v-model="addForm.number_charges" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="是否开票" prop="invoice">
						<el-select v-model="addForm.invoice">
							<el-option label="已开票" value="1"></el-option>
							<el-option label="未开票" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发票类型" prop="invoice_type">
						<el-select v-model="addForm.invoice_type">
							<el-option label="普票" value="1"></el-option>
							<el-option label="专票" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-form-item label="税点" prop="tax_point">
					<el-input v-model="addForm.tax_point" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getChannelByParam, insertChannel, updateChannelById, deleteChannelById ,insertProcess ,updateReProcessById} from '../../api/api';

	export default {
		
		data() {
			
			return {
				filters: {
					name: ''
				},
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					prefix: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],
				},
				//编辑界面数据
				editForm: {
					name:'',
					prefix:'',
					level:'',
					distance:'',
					belong:'',
					number:'',
					address:'',
					business:'',
					attribute:'',
					start_date:'',
					end_date:'',
					charges:'',
					communications_charges:'',
					number_charges:'',
					invoice:'',
					invoice_type:'',
					tax_point:'',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
					prefix: [{ required: true, message: '请输入前缀', trigger: 'blur' }],
					level: [{ required: true, message: '请输入级别', trigger: 'blur' }],
					distance: [{ required: true, message: '请输入市话长途', trigger: 'blur' }],
					belong: [{ required: true, message: '请输入业务归属', trigger: 'blur' }],
					number: [{ required: true, message: '请输入号码', trigger: 'blur' }],
					address: [{ required: true, message: '请输入地区', trigger: 'blur' }],
					business: [{ required: true, message: '请输入业务', trigger: 'blur' }],
					attribute: [{ required: true, message: '请输入通道属性', trigger: 'blur' }],
					start_date: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
					end_date: [{ required: true, message: '请输入关停时间', trigger: 'blur' }],
					charges: [{ required: true, message: '请输入通信费', trigger: 'blur' }],
					communications_charges: [{ required: true, message: '请输入通信资费', trigger: 'blur' }],
					number_charges: [{ required: true, message: '请输入号码费', trigger: 'blur' }],
					invoice: [{ required: true, message: '请输入是否开票', trigger: 'blur' }],
					invoice_type: [{ required: true, message: '请输入发票类型', trigger: 'blur' }],
					tax_point: [{ required: true, message: '请输入税点', trigger: 'blur' }],

				},
				//新增界面数据
				addForm: {
					id:'',
					name:'',
					prefix:'',
					level:'',
					distance:'',
					belong:'',
					number:'',
					address:'',
					business:'',
					attribute:'',
					start_date:'',
					end_date:'',
					charges:'',
					communications_charges:'',
					number_charges:'',
					invoice:'',
					invoice_type:'',
					tax_point:'',
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getTableList();
			},
			//获取通道列表
			getTableList() {
				const data = {
					page: this.page,
					rows:10,
					name: this.filters.name
				};
				this.listLoading = true;
				getChannelByParam(data).then((res) => {
					this.total = res.result.records;
					this.list = res.result.data;
					this.listLoading = false;
				});
			},
			//提交审核
			auditSubmit(row){
				const data={
					type:'0',
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
					type:'0',
					type_id:row.id}
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
					deleteChannelById(data).then((res) => {
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
					name:'',
					prefix:'',
					level:'',
					distance:'',
					belong:'',
					number:'',
					address:'',
					business:'',
					attribute:'',
					start_date:'',
					end_date:'',
					charges:'',
					communications_charges:'',
					number_charges:'',
				};
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						const data = Object.assign({}, this.editForm);
						updateChannelById(data).then((res) => {
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
						insertChannel(data).then((res) => {
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
			getEditSTime(val){
				this.editForm.start_date=val;
			},
			getEditETime(val){
				this.editForm.end_date=val;
			}
		},
		mounted() {
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