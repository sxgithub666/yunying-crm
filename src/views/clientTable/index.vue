<template>
	<section>
		<!--工具条-->
		<el-col :span="24">
			<el-form :inline="true" class="flexEnd">
				<el-form-item style="margin-bottom:0;">
					<el-button v-if="role_id==='4'" type="primary" size="small" @click="exportExcel">导出</el-button>
				</el-form-item>
				<el-form-item style="margin-bottom:0;">
					<el-upload :headers="headers"
											:action="uploadUrl"
											:before-upload="beforeUpload"
											:on-change="uploadChange"
											:on-success="onSuccess"
											:show-file-list="false"
											multiple
											:limit="2"
											:file-list="fileList">
						<el-button v-if="role_id==='4'" type="primary" size="small">导入</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item style="margin-bottom:0;">
					<div class="downloadTemplate" v-if="role_id==='4'" @click="downloadTemplate">下载导入模板</div>
					<!-- <el-button v-if="role_id==='4'" type="text" size="mini">下载导入模板</el-button> -->
				</el-form-item>
			</el-form>
		</el-col>
		<el-col :span="24" class="toolbar mytoolbar" style="padding-bottom:0px;margin-top:0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item style="width:13%;margin-right:0;">
					<el-input size="small" clearable v-model="filters.customer_name" placeholder="客户名称"></el-input>
				</el-form-item>
				<el-form-item style="width:13%;margin-right:0;">
					<el-input size="small" clearable v-model="filters.prefix" placeholder="前缀"></el-input>
				</el-form-item>
				<el-form-item style="width:13%;margin-right:0;">
					<el-input size="small" clearable v-model="filters.number" placeholder="号码"></el-input>
				</el-form-item>
				<el-form-item style="width:15%;margin-right:0;">
					<el-date-picker style="width:95%" size="small" v-model="filters.start_date" @change="getFiltersSTime" value-format="yyyy-MM-dd" type="date" placeholder="开始日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item style="width:15%;margin-right:0;">
					<area-cascader v-model="filters.address" :level="0" type="text" placeholder="地区" :data="pca"></area-cascader> 
				</el-form-item>
				<el-form-item style="width:15%;margin-right:0;">
					<el-select size="small" v-model="filters.belong" placeholder="业务归属">
						<el-option label="小水总机" value="0"></el-option>
						<el-option label="小水智能" value="1"></el-option>
						<el-option label="语音PASS" value="2"></el-option>
					</el-select> 
				</el-form-item>
				<!-- <el-form-item>
					<el-input size="small" clearable v-model="filters.user_name" placeholder="销售名称"></el-input>
				</el-form-item> -->
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
			<el-table-column prop="prefix" label="前缀" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="customer_name" label="客户名称" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="belong" label="业务归属" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.belong==0">小水总机</span>
					<span v-if="scope.row.belong==1">小水智能</span>
					<span v-if="scope.row.belong==2">语音PASS</span>
				</template>
			</el-table-column>
			<el-table-column prop="industry" label="行业" width="80" show-overflow-tooltip
			</el-table-column>
			<el-table-column prop="audit_status" label="状态" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.audit_status==0">未审批</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.audit_status==1">转发中</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.audit_status==2">审批通过</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.audit_status==3">审批拒绝</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="number" label="号码" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="number_charges" label="号码费" width="80" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="call_card_pay_money" label="卡槽费" width="80" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="charges" label="通信资费" width="80" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="start_date" label="开通时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="end_date" label="关停时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="area" label="地区" width="140" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="user_name" label="所属销售" width="80" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="180">
				<template slot-scope="scope">
					<!-- <el-button v-if="scope.row.audit_status!=3" size="small" @click="auditSubmit(scope.row)">提交审核</el-button>
					<el-button v-if="scope.row.audit_status==3" size="small" @click="resubmit(scope.row)">重新提交</el-button> -->
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
		<el-dialog title="编辑" @close="editDialogClose" :visible.sync="editFormVisible" :close-on-click-modal="false">
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
						<el-select v-model="editForm.belong">
							<el-option label="小水总机" value="0"></el-option>
							<el-option label="小水智能" value="1"></el-option>
							<el-option label="语音PASS" value="2"></el-option>
						</el-select>
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
					<el-form-item label="卡槽费" prop="call_card_pay_money">
						<el-input v-model="editForm.call_card_pay_money" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="地区" prop="area">
						<area-cascader v-if="showArea" v-model="editForm.area" :level="0" type="text" :data="pcaa"></area-cascader> 
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="开始时间" prop="start_date">
						<el-date-picker v-model="editForm.start_date" @change="getEditTime" value-format="yyyy-MM-dd" type="date" placeholder="选择开始日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间" prop="end_date">
						<el-date-picker v-model="editForm.end_date"  @change="getEditETime" value-format="yyyy-MM-dd" type="date" placeholder="选择结束日期">
						</el-date-picker>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="号码" prop="number">
						<el-input v-model="editForm.number" clearable auto-complete="off"></el-input>
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
						<el-select v-model="addForm.belong">
							<el-option label="小水总机" value="0"></el-option>
							<el-option label="小水智能" value="1"></el-option>
							<el-option label="语音PASS" value="2"></el-option>
						</el-select>
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
					<el-form-item label="卡槽费" prop="call_card_pay_money">
						<el-input v-model="addForm.call_card_pay_money" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="地区" prop="area">
						<area-cascader v-model="addForm.area" :level="0" type="text" :data="pcaa"></area-cascader> 
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="开始时间" prop="start_date">
						<el-date-picker v-model="addForm.start_date" @change="getSTime" value-format="yyyy-MM-dd" type="date" placeholder="选择开始日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间" prop="end_date">
						<el-date-picker v-model="addForm.end_date"  @change="getETime" value-format="yyyy-MM-dd" type="date" placeholder="选择结束日期">
						</el-date-picker>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="号码" prop="number">
						<el-input v-model="addForm.number" clearable auto-complete="off"></el-input>
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
	const Base64 = require('js-base64').Base64;
	import { getCustomerListByParam, insertCustomer, updateCustomerById, deleteCustomerById, insertProcess ,uploadClientTableByParam} from '../../api/api';
	import rules from '@/common/js/rule'
	import { pca, pcaa } from 'area-data'
	export default {
		data() {
			return {
				filters: {
					customer_name: '',
					user_name:'',
					prefix: '',
					number: '',
					address: '',
					belong: '',
					start_date:''
				},
				role_id:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				showArea: false,
				editFormRules: {
					prefix: [{ required: true, message: '请输入前缀', trigger: 'blur' }],
					customer_name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
					belong: [{ required: true, message: '请输入业务归属', trigger: 'blur' }],
					industry: [{ required: true, message: '请输入行业', trigger: 'blur' }],
					number_charges: rules.numPot2,
					charges: rules.numPot2,
					start_date: [{ required: true, message: '请输入开通时间', trigger: 'blur' }],
					// end_date: [{ required: true, message: '请输入关停时间', trigger: 'blur' }],
					call_card_pay_money: rules.numPot2,
					area: [{ required: true, message: '请选择地区', trigger: 'blur' }],
					number: rules.InterNum,
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
					call_card_pay_money:'',
					area:'',
					number:'',
				},
				headers:{
					authorLoginId:Base64.encode(JSON.parse(sessionStorage.getItem('user')).login_id),
					type:1
				},
				uploadUrl:'api/clouddo-crm/upload/exportExcel',
				fileList:[],

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
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
					call_card_pay_money:'',
					area:'',
					number:'',
				},
				pca: pca,
				pcaa: pcaa

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
					user_name:this.filters.user_name,
					prefix: this.filters.prefix,
					number: this.filters.number,
					address: this.filters.address?this.filters.address.join('/'):'',
					belong: this.filters.belong,
					start_date: this.filters.start_date
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
				this.showArea = true;
				this.editForm = Object.assign({}, row);
				if(typeof this.editForm.area==='string'){
					this.editForm.area=this.editForm.area.split('/')
				}
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
					call_card_pay_money:'',
					area:'',
					number:'',
				};
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						this.editForm.area=this.editForm.area.join('/');
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
						this.addForm.area=this.addForm.area.join('/');
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
			beforeUpload(file){
				let fileType = file.name.substring(file.name.lastIndexOf(".")+1).toUpperCase();
				const isXLS = fileType === 'XLS';
				const isXLSX = fileType === 'XLSX';

				if (!isXLS && !isXLSX) {
					this.$message({
						message: '上传图片必须是XLS/XLSX/ 格式!',
						type: 'warning'
					});
				}
				return isXLS || isXLSX ;
			},
			uploadChange(file, fileList){
        this.fileList=fileList.slice(-1);
			},
			onSuccess(response, file, fileList){
				if(response.errCode=='200'){
					this.$message({
						message: response.errMsg,
						type: 'success'
					});
				}else{
					this.$message({
						message: response.errMsg,
						type: 'error'
					});
				}
				this.getTableList();
			},
			//下载模板
			downloadTemplate(){
				window.open('../../../static/clientTemplate.xlsx')
			},
			//导出
			exportExcel(){
				const data={
					customer_name:this.filters.customer_name,
					user_name:this.filters.user_name,
					prefix: this.filters.prefix,
					number: this.filters.number,
					address: this.filters.address?this.filters.address.join('/'):'',
					belong: this.filters.belong,
					start_date: this.filters.start_date,
					role_id: this.role_id,
				};
				uploadClientTableByParam(data).then(res=>{
					var aDom = document.createElement('a');
					var evt = document.createEvent('HTMLEvents');
					evt.initEvent('click', false, false);
					aDom.download = true;
					aDom.href = res.result;
					aDom.dispatchEvent(evt);
					aDom.click();
				})
			},
			editDialogClose(){
				this.showArea=false;
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
			},
			getFiltersSTime(val){
				this.filters.start_date=val;
			},
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
.downloadTemplate{
	font-size: 12px;
	color: #409EFF;
	cursor: pointer;
}
.flexEnd{
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	
}
.mytoolbar .area-select.large{
	margin-top: 5px;
	width: 162px;
	height: 30px;
}
.mytoolbar .area-select .area-selected-trigger{
	font-size: 14px;
	line-height: 32px;
	height: 32px;
	color: #bbb;
}
</style>