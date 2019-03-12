<template>
	<section>
		<!--工具条-->
		<!-- <el-col :span="24">
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
				</el-form-item>
			</el-form>
		</el-col> -->
		<el-col :span="24" class="toolbar mytoolbar" style="padding-bottom:0px;margin-top:0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item style="width:13%;margin-right:0;">
					<el-input size="small" clearable v-model="filters.company_industry" placeholder="公司行业"></el-input>
				</el-form-item>
				<el-form-item style="width:13%;margin-right:0;">
					<el-input size="small" clearable v-model="filters.company_name" placeholder="公司全称"></el-input>
				</el-form-item>
				<el-form-item style="width:13%;margin-right:0;">
					<el-input size="small" clearable v-model="filters.customer_phone" placeholder="客户联系电话"></el-input>
				</el-form-item>
				<el-form-item style="width:15%;margin-right:0;">
					<el-select size="small" v-model="filters.customer_type" clearable placeholder="客户类型">
						<el-option label="渠道" value="0"></el-option>
						<el-option label="直客" value="1"></el-option>
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
			<el-table-column prop="company_name" label="公司全称" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="company_industry" label="公司行业" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="customer_type" label="客户类型" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.customer_type==0">渠道</span>
					<span v-if="scope.row.customer_type==1">直客</span>
				</template>
			</el-table-column>
			<el-table-column prop="customer_clues" label="客户线索来源" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.customer_clues==0">SEM</span>
					<span v-if="scope.row.customer_clues==1">公司</span>
					<span v-if="scope.row.customer_clues==2">商务</span>
				</template>
			</el-table-column>
			<el-table-column prop="customer_area" label="客户所在区域" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="customer_phone" label="客户联系电话" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="customer_name" label="客户联系人" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="customer_address" label="客户联系地址" show-overflow-tooltip>
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
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<div class="flex">
					<el-form-item label="公司全称" prop="company_name">
						<el-input v-model="editForm.company_name" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司行业" prop="company_industry">
						<el-input v-model="editForm.company_industry" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="客户类型" prop="customer_type">
						<el-select v-model="editForm.customer_type">
							<el-option label="渠道" value="0"></el-option>
							<el-option label="直客" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="客户线索来源" prop="customer_clues">
						<el-select v-model="editForm.customer_clues">
							<el-option label="SEM" value="0"></el-option>
							<el-option label="公司" value="1"></el-option>
							<el-option label="商务" value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
          <el-form-item label="客户所在区域" prop="customer_area">
						<area-cascader v-model="editForm.customer_area" :level="0" type="text" :data="pcaa"></area-cascader>
					</el-form-item>
					<el-form-item label="客户联系人" prop="customer_name">
						<el-input v-model="editForm.customer_name" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
          <el-form-item label="客户联系地址" prop="customer_address">
						<el-input v-model="editForm.customer_address" clearable auto-complete="off"></el-input> 
					</el-form-item>
					<el-form-item label="客户联系电话" prop="customer_phone">
						<el-input v-model="editForm.customer_phone" clearable auto-complete="off"></el-input>
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
			<el-form :model="addForm" label-width="120px" :rules="editFormRules" ref="addForm">
				<div class="flex">
					<el-form-item label="公司全称" prop="company_name">
						<el-input v-model="addForm.company_name" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司行业" prop="company_industry">
						<el-input v-model="addForm.company_industry" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="客户类型" prop="customer_type">
						<el-select v-model="addForm.customer_type">
							<el-option label="渠道" value="0"></el-option>
							<el-option label="直客" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="客户线索来源" prop="customer_clues">
						<el-select v-model="addForm.customer_clues">
							<el-option label="SEM" value="0"></el-option>
							<el-option label="公司" value="1"></el-option>
							<el-option label="商务" value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
          <el-form-item label="客户所在区域" prop="customer_area">
            <area-cascader v-model="addForm.customer_area" :level="0" type="text" :data="pcaa"></area-cascader>
					</el-form-item>
					</el-form-item>
					<el-form-item label="客户联系人" prop="customer_name">
						<el-input v-model="addForm.customer_name" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
          <el-form-item label="客户联系电话" prop="customer_phone">
						<el-input v-model="addForm.customer_phone" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="客户联系地址" prop="customer_address">
						<el-input v-model="addForm.customer_address" clearable auto-complete="off"></el-input>
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
	import { getSalesCustomerByParam, insertSalesCustomer, updateSalesCustomerById, deleteSalesCustomerById, insertProcess ,uploadClientTableByParam} from '../../api/api';
	import rules from '@/common/js/rule'
	import { pca, pcaa } from 'area-data'
	export default {
		data() {
			return {
				filters: {
					company_industry: '',
					user_name:'',
					company_name: '',
					customer_phone: '',
					address: '',
					customer_type: '',
					customer_clues: '',
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
					company_name: [{ required: true, message: '请输入公司全称', trigger: 'blur' }],
					company_industry: [{ required: true, message: '请输入公司行业', trigger: 'blur' }],
					customer_type: [{ required: true, message: '请输入客户类型', trigger: 'blur' }],
					customer_clues: [{ required: true, message: '请输入客户线索来源', trigger: 'blur' }],
					customer_area: [{ required: true, message: '请输入客户所在区域', trigger: 'blur' }],
					customer_name: [{ required: true, message: '请输入客户联系人', trigger: 'blur' }],
					customer_address: [{ required: true, message: '请输入客户联系地址', trigger: 'blur' }],
					customer_phone: [{ required: true, message: '请输入客户联系电话', trigger: 'blur' }],
				},
				//编辑界面数据
				editForm: {
					company_name:'',
					company_industry:'',
					customer_type:'',
					customer_clues:'',
					customer_area:'',
					customer_name:'',
					customer_address:'',
					customer_phone:'',
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
					company_name:'',
					company_industry:'',
					customer_type:'',
					customer_clues:'',
					customer_area:'',
					customer_name:'',
					customer_address:'',
					customer_phone:'',
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
					company_industry: this.filters.company_industry,
					company_name: this.filters.company_name,
					customer_phone: this.filters.customer_phone,
					customer_type: this.filters.customer_type,
					customer_clues: this.filters.customer_clues,
				};
				this.listLoading = true;
				getSalesCustomerByParam(data).then((res) => {
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
					deleteSalesCustomerById(data).then((res) => {
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
				if(typeof this.editForm.customer_area==='string'){
					this.editForm.customer_area=this.editForm.customer_area.split('/')
				}
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.addForm = {
					company_name:'',
					company_industry:'',
					customer_type:'',
					customer_clues:'',
					customer_area:'',
					customer_name:'',
					customer_address:'',
					customer_phone:'',
				};
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						this.editForm.customer_area=this.editForm.customer_area.join('/');
						const data = Object.assign({}, this.editForm);
						updateSalesCustomerById(data).then((res) => {
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
						this.addForm.customer_area=this.addForm.customer_area.join('/');
						const data = Object.assign({}, this.addForm);
						insertSalesCustomer(data).then((res) => {
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
					company_industry:this.filters.company_industry,
					user_name:this.filters.user_name,
					company_name: this.filters.company_name,
					customer_phone: this.filters.customer_phone,
					address: this.filters.address?this.filters.address.join('/'):'',
					customer_type: this.filters.customer_type,
					customer_clues: this.filters.customer_clues,
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