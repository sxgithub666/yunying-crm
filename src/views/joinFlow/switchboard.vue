<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.company_name" placeholder="公司名称"></el-input>
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
			<el-table-column prop="company_name" label="公司名称" width="100">
			</el-table-column>
			<el-table-column prop="type" label="业务类型" width="100">
				<template slot-scope="scope">
					<span v-if="scope.row.type==0">总机</span>
					<span v-if="scope.row.type==1">语音paas</span>
				</template>
			</el-table-column>
			<el-table-column prop="pay_time" label="收款时间" width="160">
			</el-table-column>
			<el-table-column prop="audit_status" label="状态" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.audit_status==0">未审核</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.audit_status==1">审核中</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.audit_status==2">审核通过</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.audit_status==3">审核拒绝</el-button>
				</template>
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
					<span v-if="scope.row.refunds==1">已返款</span>
				</template>
			</el-table-column>
			<el-table-column prop="pay_voucher" label="打款凭证" width="200">
				<template slot-scope="scope">
					<div class="tableImg" v-if="scope.row.pay_voucher">
						<img v-for="(item,index) in scope.row.pay_voucher" class="smallImg" preview="3" :src="item" :key="index" alt="" style="width: 40px;height: 40px;margin-right:5px;">
					  <!-- <img class="bigImg" :src="scope.row.url" alt="">   -->
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="need_data" label="申请号码材料" width="180">
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
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<div class="flex">
					<el-form-item label="销售区域" prop="area">
						<el-input v-model="editForm.area" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司名称" prop="company_name">
						<el-input v-model="editForm.company_name" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="客户所在区域" prop="customer_region">
						<el-input v-model="editForm.customer_region" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="收款金额" prop="pay_money">
						<el-input v-model="editForm.pay_money" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="公司行业" prop="company_industry">
						<el-input v-model="editForm.company_industry" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码需求" prop="need_phonenumber">
						<el-input v-model="editForm.need_phonenumber" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务类型" prop="business_type">
						<el-input v-model="editForm.business_type" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="付款方式" prop="pay_type">
						<el-input v-model="editForm.pay_type" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间" prop="pay_time">
						<el-date-picker v-model="editForm.pay_time" @change="getEditTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="是否返款" prop="refunds">
						<el-radio-group v-model="editForm.refunds">
							<el-radio label="1">已返款</el-radio>
							<el-radio label="0">未返款</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="申请号码材料" prop="need_data">
						<el-input v-model="editForm.need_data" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="editForm.remark" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
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
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="editFormRules" ref="addForm">
				<div class="flex">
					<el-form-item label="销售区域" prop="area">
						<el-input v-model="addForm.area" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司名称" prop="company_name">
						<el-input v-model="addForm.company_name" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="公司行业" prop="company_industry">
						<el-input v-model="addForm.company_industry" clearable auto-complete="off"></el-input>
					</el-form-item>
					</el-form-item>
					<el-form-item label="号码需求" prop="need_phonenumber">
						<el-input v-model="addForm.need_phonenumber" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务类型" prop="business_type">
						<el-input v-model="addForm.business_type" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="付款方式" prop="pay_type">
						<el-input v-model="addForm.pay_type" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="客户所在区域" prop="customer_region">
						<el-input v-model="addForm.customer_region" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="收款金额" prop="pay_money">
						<el-input v-model="addForm.pay_money" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间" prop="pay_time">
						<el-date-picker v-model="addForm.pay_time" @change="getAddTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="是否返款" prop="refunds">
						<el-radio-group v-model="addForm.refunds">
							<el-radio label="1">已返款</el-radio>
							<el-radio label="0">未返款</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="申请号码材料" prop="need_data">
						<el-input v-model="addForm.need_data" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="addForm.remark" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<el-form-item label="打款凭证">
						<!-- <el-input v-model="addForm.pay_voucher" auto-complete="off"></el-input> -->
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
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="previewDialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</section>
</template>

<script>
	import { getZjPaasProcessByParam, insertZjPaasProcess, updateZjPaasProcessById, deleteZjPaasProcessById ,updateReProcessById ,insertProcess} from '../../api/api';

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
					type: [{ required: true, message: '请输入业务类型', trigger: 'blur'}],
					pay_time: [{ required: true, message: '请输入收款时间', trigger: 'blur'}],
					company_industry: [{ required: true, message: '请输入公司行业', trigger: 'blur'}],
					pay_money: [{ required: true, message: '请输入收款金额', trigger: 'blur'}],
					need_phonenumber: [{ required: true, message: '请输入号码需求', trigger: 'blur'}],
					business_type: [{ required: true, message: '请输入业务类型', trigger: 'blur'}],
					pay_type: [{ required: true, message: '请输入付款方式', trigger: 'blur'}],
					customer_region: [{ required: true, message: '请输入客户所在区域', trigger: 'blur'}],
					refunds: [{ required: true, message: '请输入是否返款', trigger: 'blur'}],
					need_data: [{ required: true, message: '请输入申请号码材料', trigger: 'blur'}],
				},
				//编辑界面数据
				editForm: {
					type:'0',
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
					del_pic:''
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
				this.getTableList();
			},
			//获取table列表
			getTableList() {
				const data = {
					role_id:this.role_id,
					page: this.page,
					rows:10,
					type:'0',
					area: this.filters.area
				};
				this.listLoading = true;
				getZjPaasProcessByParam(data).then((res) => {
					this.total = res.result.records;
					this.list = res.result.data.map(item=>{
						if(item.pay_voucher){
							item.pay_voucher=item.pay_voucher.split(',');
						};
						return item;
					});
					this.listLoading = false;
				});
			},
			beforeUpload(file){
				const isJPG = file.type === 'image/jpeg';
				const isGIF = file.type === 'image/gif';
				const isPNG = file.type === 'image/png';
				const isBMP = file.type === 'image/bmp';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG && !isGIF && !isPNG && !isBMP) {
					this.common.errorTip('上传图片必须是JPG/GIF/PNG/BMP 格式!');
				}
				if (!isLt2M) {
					this.common.errorTip('上传图片大小不能超过 2MB!');
				}
				return (isJPG || isBMP || isGIF || isPNG) && isLt2M;
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
				this.editForm = Object.assign({}, row);
				if(row.pay_voucher){
					this.editFileList=row.pay_voucher.map(item=>{
						let obj={};
						obj['url']=item;
						return obj;
				  })
				}
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.addForm = {
					type:'0',
					area:'',
					company_name:'',
					pay_time:'',
					pay_money:'',
					company_industry:'',
					need_phonenumber:'',
					start_date:'',
					end_date:'',
				};
				this.fileList=[];
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
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
			getAddTime(val){
				this.addForm.pay_time=val;
			},
			getEditTime(val){
				this.editForm.pay_time=val;
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
.tableImg{
	position: relative;
}
.tableImg .smallImg{
	width: 100%;
	max-height: 100%;
}
</style>