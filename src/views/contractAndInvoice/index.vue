<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.company_name" placeholder="公司名称"></el-input>
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
			<el-table-column prop="company_name" label="公司名称">
			</el-table-column>
			<el-table-column prop="invoice" label="是否开票">
        <template slot-scope="scope">
					<span v-if="scope.row.invoice==0">未开票</span>
					<span v-if="scope.row.invoice==1">已开票</span>
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
			<el-table-column prop="scan_file" label="双方盖章扫描件" width="210">
				<template slot-scope="scope">
					<div class="tableImg" v-if="scope.row.scan_file">
						<img v-for="(item,index)  in scope.row.scan_file" preview="6" class="smallImg" :src="item" :key="index" alt="" style="width: 40px;height: 40px;margin-right:5px;">
					  <!-- <img class="bigImg" :src="scope.row.url" alt="">   -->
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="user_name" label="添加人">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
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
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="130px" :rules="editFormRules" ref="editForm">
				<el-form-item label="公司名称" prop="company_name">
					<el-input v-model="editForm.company_name" clearable auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否开票" prop="invoice">
          <el-select v-model="editForm.invoice">
						<el-option label="已开票" value="1"></el-option>
						<el-option label="未开票" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="双方盖章扫描件">
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
				<el-form-item label="备注">
					<el-input v-model="editForm.remark" clearable auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" >提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="130px" :rules="editFormRules" ref="addForm">
				<el-form-item label="公司名称" prop="company_name">
					<el-input v-model="addForm.company_name" clearable auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否开票" prop="invoice">
          <el-select v-model="addForm.invoice">
						<el-option label="已开票" value="1"></el-option>
						<el-option label="未开票" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="双方盖章扫描件">
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
					
					<!-- <el-input v-model="addForm.scan_file" auto-complete="off"></el-input> -->
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
		<el-dialog :visible.sync="previewDialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</section>
</template>

<script>
	import { getContractProcessByParam, insertContractProcess, updateContractProcessById, deleteContractProcessById, insertProcess, updateReProcessById ,uploadContractByParam} from '../../api/api';

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
					company_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
					invoice: [{ required: true, message: '请输入是否开票', trigger: 'blur' }],
				},
				//编辑界面数据
				editForm: {
					company_name:'',
					invoice:'',
					scan_file:'',
					remark:'',
					del_pic:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					company_name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					company_name: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],

				},
				//新增界面数据
				addForm: {
					company_name:'',
					invoice:'',
					scan_file:'',
					remark:'',
				},
				dialogImageUrl: '',
				previewDialogVisible: false,
				headers:{authorLoginId:JSON.parse(sessionStorage.getItem('user')).login_id},
				uploadUrl:'api/clouddo-crm/upload/uploadFile',
				fileList:[],
				editFileList:[],
				formDate:'',
				delFiles:[]
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
				getContractProcessByParam(data).then((res) => {
					this.total = res.result.records;
					this.list=res.result.data.map(item=>{
						if(item.scan_file){
							item.scan_file=item.scan_file.split(',');
						};
						return item;
					})
					this.listLoading = false;
				});
			},
			uploadFile(file){
				this.formDate.append('file', file.file);
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
				console.log(fileList);
				let files=[];
				fileList.forEach(item=>{
					if(item.response &&item.response.result){
						files.push(item.response.result)
					}
				})
				this.addForm.scan_file=files.join(',')
			},
			onEditSuccess(response, file, fileList){
				console.log(fileList);
				
				let files=[];
				fileList.forEach(item=>{
					if(item.response &&item.response.result){
						files.push(item.response.result)
					}else if(item.url){
						files.push(item.url);
					}
				})
				this.editForm.scan_file=files.join(',')
			},
			handleRemove(file, fileList) {
				let files=[];
				fileList.forEach(item=>{
					if(item.response &&item.response.result){
						files.push(item.response.result)
					}
				})
				this.addForm.scan_file=files.join(',')
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
				this.editForm.scan_file=files.join(',')
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
					type:'2',
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
					type:'2',
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
					deleteContractProcessById(data).then((res) => {
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
				if(row.scan_file){
					this.editFileList=row.scan_file.map(item=>{
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
					company_name:'',
					company_name:'',
					income:'',
					reconciliation_cost:'',
					account_name:'',
					balance:'',
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
						if(this.editForm.scan_file instanceof Array){
							this.editForm.scan_file=this.editForm.scan_file.join(',');
						}
						const data = Object.assign({}, this.editForm);
						updateContractProcessById(data).then((res) => {
							this.editLoading = false;
							this.$message({
								message: res.errMsg,
								type: 'success'
							});
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
							this.delFiles=[];
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
						console.log(this.fileList);
						this.$refs.addUpload.submit();
						insertContractProcess(data).then((res) => {
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
				uploadContractByParam(data).then(res=>{
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
				this.addForm.company_name=val;
			},
			getEditTime(val){
				this.editForm.company_name=val;
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
}
.tableImg{
	position: relative;
}
.tableImg .smallImg{
	width: 100%;
	max-height: 100%;
}
/* .tableImg:hover .bigImg{
	display: block;
} */
/* .tableImg .bigImg{
	position: absolute;
	top:0;
	left: 200;
	display: none;
	z-index: 9999;
	max-width: 450px;
	max-height: 450px;
	transition: all .3s ease;
	outline:1px solid #eaeaea;
	outline-offset:0px;
} */
</style>