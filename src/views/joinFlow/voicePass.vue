<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item style="width:15%">
					<el-input size="small" clearable v-model="filters.company_name" placeholder="公司名称"></el-input>
				</el-form-item>
				<el-form-item style="width:15%">
					<el-input size="small" clearable v-model="filters.user_name" placeholder="添加人"></el-input>
				</el-form-item>
				<el-form-item style="width:15%">
					<el-date-picker style="width:98%" size="small" v-model="filters.pay_time" @change="getFiltersPayTime" value-format="yyyy-MM-dd" type="date" placeholder="选择收款日期">
					</el-date-picker>
				</el-form-item>
				<!-- <el-form-item style="width:15%">
					<el-select size="small" v-model="filters.customer_type" placeholder="客户类型" clearable>
						<el-option label="直客" value="1"></el-option>
						<el-option label="渠道" value="0"></el-option>
					</el-select>
				</el-form-item> -->
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
			<!-- <el-table-column prop="area" label="销售区域" width="100" show-overflow-tooltip>
			</el-table-column> -->
			<el-table-column prop="company_name" label="公司名称" width="100" show-overflow-tooltip>
			</el-table-column>
			<!-- <el-table-column prop="type" label="业务类型" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.type==0">总机</span>
					<span v-if="scope.row.type==1">语音paas</span>
				</template>
			</el-table-column> -->
			<el-table-column prop="pay_time" label="收款时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="audit_status" label="状态" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.audit_status==0">未审批</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.audit_status==1">转发中</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.audit_status==2">审批通过</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.audit_status==3">审批拒绝</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="pay_money" label="收款金额" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="line_price" label="线路单价" width="100" show-overflow-tooltip>
			</el-table-column>
			<!-- <el-table-column prop="sales_name" label="销售经理" width="100" show-overflow-tooltip>
			</el-table-column> -->
			<el-table-column prop="user_name" label="销售经理" width="80" show-overflow-tooltip>
			</el-table-column>
			<!-- <el-table-column prop="company_industry" label="公司行业" width="100" show-overflow-tooltip>
			</el-table-column> -->
			<el-table-column prop="need_phonenumber" label="号码需求" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="business_type" label="行业类型" width="180" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="pay_type" label="付款方式" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.pay_type==0">对公</span>
					<span v-if="scope.row.pay_type==1">对私</span>
				</template>
			</el-table-column>
			<el-table-column prop="customer_region" label="客户所在区域" width="180" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="refunds" label="是否到款" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.refunds==0">未到款</span>
					<span v-if="scope.row.refunds==1">已到款</span>
				</template>
			</el-table-column>
			<el-table-column prop="pay_voucher" label="打款凭证" width="200">
				<template slot-scope="scope">
					<div class="tableImg" v-if="scope.row.pay_voucher">
						<img v-for="(item,index) in scope.row.pay_voucher" class="smallImg" preview="4" :src="item" :key="index" alt="" style="width: 40px;height: 40px;margin-right:5px;">
					  <!-- <img class="bigImg" :src="scope.row.url" alt="">   -->
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="need_data" label="申请号码材料" width="110" show-overflow-tooltip>
				<template slot-scope="scope">
					<a :href="scope.row.need_data" download>
					  <el-button v-if="scope.row.need_data" type="text" size="small">下载</el-button>
					</a>
				</template>
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
		<el-dialog title="编辑" @close="editDialogClose" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<div class="flex">
					<!-- <el-form-item label="销售区域" prop="area">
						<el-input v-model="editForm.area" clearable auto-complete="off"></el-input>
					</el-form-item> -->
					<el-form-item label="公司名称" prop="company_name">
						<el-input v-model="editForm.company_name" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码需求" prop="need_phonenumber">
						<el-input v-model="editForm.need_phonenumber" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item style="width:50%" label="收款时间" prop="pay_time">
						<el-date-picker v-model="editForm.pay_time" @change="getEditTime" value-format="yyyy-MM-dd" type="date" placeholder="选择收款日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="是否到款" prop="refunds">
						<el-select v-model="editForm.refunds">
							<el-option label="已到款" value="1"></el-option>
							<el-option label="未到款" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<!-- <el-form-item label="销售经理" prop="sales_name">
						<el-input v-model="editForm.sales_name" auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="行业类型" prop="business_type">
						<el-input v-model="editForm.business_type" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="付款方式" prop="pay_type">
						<el-select v-model="editForm.pay_type">
							<el-option label="对公" value="0"></el-option>
							<el-option label="对私" value="1"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.pay_type" clearable auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="客户所在区域" prop="customer_region">
						<area-cascader v-if="showArea" v-model="addForm.customer_region" :level="0" type="text" :data="pca"></area-cascader>
						<!-- <el-input v-model="editForm.customer_region" clearable auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="收款金额" prop="pay_money">
						<el-input v-model="editForm.pay_money" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="线路单价" prop="line_price">
						<el-input v-model="editForm.line_price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item style="width:50%" label="备注" prop="remark">
						<el-input v-model="editForm.remark" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<el-form-item label="申请号码材料" prop="need_data">
					<el-upload :headers="headers"
										 :action="uploadUrl"
										 :before-upload="beforeNumUpload"
										 :on-success="onEditNumSuccess"
										 :on-change="uploadChange"
										 :show-file-list="false"
										 multiple
										 :limit="2"
										 :file-list="numMaterialfileList">
						<el-button size="small" type="primary">点击上传</el-button>
						<span slot="tip" style="padding-left:10px;color:#E6A23C;" class="el-upload__tip">只能上传zip/rar文件</span>
					</el-upload>
					<!-- <el-input v-model="editForm.need_data" clearable auto-complete="off"></el-input> -->
				</el-form-item>
				<el-form-item label="打款凭证">
						<!-- <el-input v-model="editForm.pay_voucher" auto-complete="off"></el-input> -->
						<el-upload ref="editUpload"
					           :headers="headers"
					           :action="uploadUrl"
										 :file-list="editFileList"
										 list-type="picture-card"
										 :before-upload="beforeUpload"
										 :on-success="onEditSuccess"
										 :on-preview="handlePictureCardPreview"
										 :on-remove="handleEditRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" >提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="editFormRules" ref="addForm">
				<div class="flex">
					<!-- <el-form-item label="销售区域" prop="area">
						<el-input v-model="addForm.area" clearable auto-complete="off"></el-input>
					</el-form-item> -->
					<el-form-item label="公司名称" prop="company_name">
						<el-input v-model="addForm.company_name" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码需求" prop="need_phonenumber">
						<el-input v-model="addForm.need_phonenumber" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间" style="width:50%" prop="pay_time">
						<el-date-picker v-model="addForm.pay_time" @change="getAddTime" value-format="yyyy-MM-dd" type="date" placeholder="选择收款日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="是否到款" prop="refunds">
						<el-select v-model="addForm.refunds">
							<el-option label="已到款" value="1"></el-option>
							<el-option label="未到款" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					
					<!-- <el-form-item label="销售经理" prop="sales_name">
						<el-input v-model="addForm.sales_name" auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="行业类型" prop="business_type">
						<el-input v-model="addForm.business_type" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="付款方式" prop="pay_type">
						<el-select v-model="addForm.pay_type">
							<el-option label="对公" value="0"></el-option>
							<el-option label="对私" value="1"></el-option>
						</el-select>
						<!-- <el-input v-model="addForm.pay_type" clearable auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款金额" prop="pay_money">
						<el-input v-model="addForm.pay_money" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="客户所在区域" prop="customer_region">
						<area-cascader v-model="addForm.customer_region" :level="0" type="text" :data="pca"></area-cascader>
						<!-- <el-input v-model="addForm.customer_region" clearable auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="线路单价" prop="line_price">
						<el-input v-model="addForm.line_price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item style="width:50%" label="备注" prop="remark">
						<el-input v-model="addForm.remark" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<el-form-item label="申请号码材料" prop="need_data">
					<el-upload :headers="headers"
										:action="uploadUrl"
										:before-upload="beforeNumUpload"
										:on-change="uploadChange"
										:on-success="onAddNumSuccess"
										:show-file-list="false"
										multiple
										:limit="2"
										:file-list="numMaterialfileList">
						<el-button size="small" type="primary">点击上传</el-button>
						<span slot="tip" style="padding-left:10px;color:#E6A23C;" class="el-upload__tip">只能上传zip/rar文件</span>
					</el-upload>
				</el-form-item>
				<el-form-item label="打款凭证">
					<el-upload ref="addUpload"
										:headers="headers"
										:action="uploadUrl"
										:file-list="fileList"
										list-type="picture-card"
										:before-upload="beforeUpload"
										:on-success="onSuccess"
										:on-preview="handlePictureCardPreview"
										:on-remove="handleRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="previewDialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</section>
</template>

<script>
	import { getZjPaasProcessByParam, insertZjPaasProcess, updateZjPaasProcessById, deleteZjPaasProcessById ,updateReProcessById ,insertProcess ,uploadSwitchboardByParam} from '../../api/api';
	import rules from '@/common/js/rule'
	import { pca, pcaa } from 'area-data'
	export default {
		data() {
			return {
				filters: {
					company_name: '',
					user_name: '',
					pay_time:'',
					customer_type:''
				},
				pca: pca,
				pcaa: pcaa,
				role_id:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				showArea:false,
				editFormRules: {
					area: [{ required: true, message: '请输入销售区域', trigger: 'blur' }],
					company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur'}],
					type: [{ required: true, message: '请输入业务类型', trigger: 'blur'}],
					pay_time: [{ required: true, message: '请输入收款时间', trigger: 'blur'}],
					company_industry: [{ required: true, message: '请输入公司行业', trigger: 'blur'}],
					pay_money: rules.numPot2,
					need_phonenumber: [{ required: true, message: '请输入号码需求', trigger: 'blur'}],
					business_type: [{ required: true, message: '请输入行业类型', trigger: 'blur'}],
					pay_type: [{ required: true, message: '请输入付款方式', trigger: 'blur'}],
					customer_region: [{ required: true, message: '请输入客户所在区域', trigger: 'blur'}],
					refunds: [{ required: true, message: '请输入是否返款', trigger: 'blur'}],
					need_data: [{ required: true, message: '请输入申请号码材料', trigger: 'change'}],
					line_price: rules.numPot2,
					sales_name:[{ required: true, message: '请输入销售经理', trigger: 'blur'}],
				},
				//编辑界面数据
				editForm: {
					type:'1',
					area:'',
					company_name:'',
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
					del_pic:'',
					line_price:'',
					sales_name:'',
				},
        headers:{authorLoginId:JSON.parse(sessionStorage.getItem('user')).login_id},
				uploadUrl:'api/clouddo-crm/upload/uploadFile',
				fileList:[],
				editFileList:[],
				dialogImageUrl:'',
				previewDialogVisible:false,
				delFiles:[],

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {
					type:'1',
					area:'',
					company_name:'',
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
					line_price:'',
					sales_name:'',
				},
				numMaterialfileList:[]

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
					type:'1',
					role_id:this.role_id,
					page: this.page,
					rows:10,
					company_name: this.filters.company_name,
					user_name: this.filters.user_name,
					pay_time: this.filters.pay_time,
					customer_type: this.filters.customer_type
				};
				this.listLoading = true;
				getZjPaasProcessByParam(data).then((res) => {
					this.total = res.result.records;
					this.list = res.result.data.map(item=>{
						if(item.pay_voucher){
							item.pay_voucher=item.pay_voucher.split(',');
						};
						return item;
					});;
					this.listLoading = false;
				});
			},
			beforeUpload(file){
				let fileType = file.name.substring(file.name.lastIndexOf(".")+1).toUpperCase();
				const isJPG = fileType === 'JPG';
				const isGIF = fileType === 'GIF';
				const isPNG = fileType === 'PNG';
				const isBMP = fileType === 'BMP';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG && !isGIF && !isPNG && !isBMP) {
					this.$message({
						message: '上传图片必须是JPG/GIF/PNG/BMP 格式!',
						type: 'warning'
					});
				}
				if (!isLt2M) {
					this.$message({
						message: '上传图片大小不能超过 2MB!',
						type: 'warning'
					});
				}
				// return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
				return isJPG || isBMP || isGIF || isPNG;
			},
			onSuccess(response, file, fileList){
				let files=[];
				fileList.forEach(item=>{
					if(item.response &&item.response.result){
						files.push(item.response.result)
					}
				})
				this.addForm.pay_voucher=files.join(',')
			},
			onEditSuccess(response, file, fileList){
				let files=[];
				fileList.forEach(item=>{
					if(item.response &&item.response.result){
						files.push(item.response.result)
					}else if(item.url){
						files.push(item.url);
					}
				})
				this.editForm.pay_voucher=files.join(',')
			},
			handleRemove(file, fileList) {
				let files=[];
				fileList.forEach(item=>{
					if(item.response &&item.response.result){
						files.push(item.response.result)
					}
				})
				this.addForm.pay_voucher=files.join(',')
			},
			handleEditRemove(file,fileList){
				let files=[];
				this.delFiles.push(file.url);
				fileList.forEach(item=>{
					if(item.response &&item.response.result){
						files.push(item.response.result)
					}else if(item.url){
						files.push(item.url);
					}
				})
				this.editForm.pay_voucher=files.join(',')
				this.editForm.del_pic=this.delFiles.join(',')
			},
			//上传照片预览
			handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.previewDialogVisible = true;
			},
			//号码材料上传zip包
			onAddNumSuccess(response, file, fileList){
				if(response.errCode==200){
					this.$message({
						message: response.errMsg,
						type: 'success'
					});
					this.addForm.need_data=response.result;
				}else{
					this.$message({
						message: response.errMsg,
						type: 'warning'
					});
				}
			},
			onEditNumSuccess(response, file, fileList){
				if(response.errCode==200){
					this.$message({
						message: response.errMsg,
						type: 'success'
					});
					this.editForm.need_data=response.result;
				}else{
					this.$message({
						message: response.errMsg,
						type: 'warning'
					});
				}
			},
			beforeNumUpload(file){
				let fileType=file.name.substring(file.name.lastIndexOf(".")+1).toUpperCase();;
				if(fileType=='RAR' || fileType=='ZIP'){
					return true;
				}else{
					this.$message({
						message: '请上传zip/rar类型文件',
						type: 'warning'
					});
					return false;
				};
			},
			uploadChange(file, fileList){
        this.numMaterialfileList=fileList.slice(-1);
      },
			handleNumRemove(){

			},
			//提交审核
			auditSubmit(row){
				const data={
					type:'4',
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
					type:'4',
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
					deleteZjPaasProcessById(data).then((res) => {
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
				if(typeof this.editForm.customer_region==='string'){
					this.editForm.customer_region=this.editForm.customer_region.split('/')
				}
				if(row.pay_voucher){
					this.editFileList=row.pay_voucher.map(item=>{
						let obj={};
						obj['url']=item;
						return obj;
				  })
				}else{
					this.editFileList=[];
				}
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.addForm = {
					type:'1',
					area:'',
					company_name:'',
					pay_time:'',
					pay_money:'',
					company_industry:'',
					need_phonenumber:'',
					start_date:'',
					end_date:'',
					line_price:'',
					sales_name:'',
				};
				this.fileList=[];
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						// this.editForm.pay_voucher=this.editForm.pay_voucher.join(',');
						if(this.editForm.pay_voucher instanceof Array){
							this.editForm.pay_voucher=this.editForm.pay_voucher.join(',');
						};
						this.editForm.customer_region=this.editForm.customer_region.join('/');
						const data = Object.assign({}, this.editForm);
						updateZjPaasProcessById(data).then((res) => {
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
						insertZjPaasProcess(data).then((res) => {
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
					type:'1',
					company_name:this.filters.company_name,
					user_name:this.filters.user_name,
					pay_time: this.filters.pay_time,
					customer_type: this.filters.customer_type,
					role_id: this.role_id,
				};
				uploadSwitchboardByParam(data).then(res=>{
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
			getAddTime(val){
				this.addForm.pay_time=val;
			},
			getEditTime(val){
				this.editForm.pay_time=val;
			},
			getFiltersPayTime(val){
				this.filters.pay_time=val;
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
.tableImg{
	position: relative;
}
.tableImg .smallImg{
	width: 100%;
	max-height: 100%;
}
</style>