<template>
	<section>
		<el-col :span="24">
			<el-form :inline="true" class="flexEnd">
				<el-form-item style="margin-bottom:0;">
					<el-button v-if="role_id==='6'||role_id=='4'" type="primary" size="small" @click="exportExcel">导出</el-button>
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
						<el-button v-if="role_id==='6'||role_id=='4'" type="primary" size="small">导入</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item style="margin-bottom:0;">
					<div class="downloadTemplate" v-if="role_id==='6'||role_id=='4'" @click="downloadTemplate">下载导入模板</div>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col :span="24" class="toolbar mytoolbar" style="padding-bottom:0px;margin-top:0;">
			<el-form :inline="true" :model="filters">
				<el-form-item class="filter">
					<el-date-picker v-model="filters.create_time"
													format="yyyy-MM-dd"
													style="width:100%"
													:pickerOptions="pickerOptions"
													value-format="yyyy-MM-dd"
													size="small"
													clearable
													placeholder="创建日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item v-if="role_id==='6'||role_id=='4'" class="filter">
					<el-select size="small" v-model="filters.user_name" clearable filterable placeholder="销售经理">
						<el-option v-for="item in salesList" :label="item.user_name" :value="item.user_name" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="filter">
					<el-input size="small" clearable v-model="filters.contract" placeholder="联系方式"></el-input>
				</el-form-item>
				<el-form-item class="filter">
					<el-input size="small" clearable v-model="filters.content_key" placeholder="关键词"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getTableList">查询</el-button>
				</el-form-item>
				<el-form-item v-if="role_id=='6'||role_id=='4'">
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<div class="totalNum">总条数：{{this.total}}</div>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="40">
			</el-table-column>
			<el-table-column prop="customer_name" label="客户名称" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="contract" label="联系方式" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="contract_type" label="联系方式类型" width="120" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.contract_type==1">电话</span>
					<span v-if="scope.row.contract_type==2">微信</span>
					<span v-if="scope.row.contract_type==3">qq</span>
					<span v-if="scope.row.contract_type==4">邮箱</span>
				</template>
			</el-table-column>
      <el-table-column prop="area" label="销售区域" width="160" show-overflow-tooltip>
			</el-table-column>
      <el-table-column prop="createtime" label="创建时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="content_key" label="关键词" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="content" label="对话内容" width="200" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="type" label="业务类型" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.type==0">小水总机</span>
					<span v-if="scope.row.type==1">小水智能</span>
					<span v-if="scope.row.type==2">语音PAAS</span>
				</template>
			</el-table-column>
			<el-table-column prop="channel" label="客户渠道" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.channel==1">百度</span>
					<span v-if="scope.row.channel==2">搜狗</span>
					<span v-if="scope.row.channel==3">神马</span>
					<span v-if="scope.row.channel==4">360</span>
					<span v-if="scope.row.channel==5">信息流</span>
					<span v-if="scope.row.channel==6">400电话</span>
					<span v-if="scope.row.channel==7">注册</span>
					<span v-if="scope.row.channel==8">公司资源</span>
					<span v-if="scope.row.channel==9">自拓</span>
				</template>
			</el-table-column>
			<el-table-column prop="user_name" label="销售经理" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="state" label="状态" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.state==1">未处理</span>
					<span v-if="scope.row.state==2">已分配</span>
					<span v-if="scope.row.state==3">重新分配</span>
				</template>
			</el-table-column>
			<el-table-column v-if="role_id=='6'||role_id=='4'" label="操作" fixed="right" width="220">
				<template slot-scope="scope">
					<el-button v-if="role_id=='6'" :disabled="scope.row.state==2" size="small" @click="handleAllot(scope.row)">分配</el-button>
					<!-- <el-button v-if="scope.row.audit_status==3" size="small" @click="resubmit(scope.row)">重新提交</el-button> -->
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
		<el-dialog title="编辑" @close="editDialogClose" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<div class="flex">
					<el-form-item label="客户名称" prop="customer_name">
						<el-input v-model="editForm.customer_name" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="联系方式" prop="contract">
						<el-input v-model="editForm.contract" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="联系方式类型" prop="contract_type">
						<el-select v-model="editForm.contract_type">
							<el-option label="电话" value="1"></el-option>
						<el-option label="微信" value="2"></el-option>
						<el-option label="qq" value="3"></el-option>
						<el-option label="邮箱" value="4"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="业务类型" prop="type">
						<el-select v-model="editForm.type">
							<el-option label="小水总机" value="0"></el-option>
							<el-option label="小水智能" value="1"></el-option>
							<el-option label="语音PAAS" value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
          <el-form-item label="销售区域" prop="area">
						<el-input v-model="editForm.area" clearable auto-complete="off"></el-input>
						<!-- <area-cascader v-if="showArea" v-model="editForm.area" :level="0" type="text" :data="pcaa"></area-cascader> -->
					</el-form-item>
					<el-form-item label="关键词" prop="content_key">
						<el-input v-model="editForm.content_key" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
          <el-form-item label="客户渠道" prop="channel">
						<el-select v-model="editForm.channel">
							<el-option label="百度" value="1"></el-option>
							<el-option label="搜狗" value="2"></el-option>
							<el-option label="神马" value="3"></el-option>
							<el-option label="360" value="4"></el-option>
							<el-option label="信息流" value="5"></el-option>
							<el-option label="400电话" value="6"></el-option>
							<el-option label="注册" value="7"></el-option>
							<el-option label="公司资源" value="8"></el-option>
							<el-option label="自拓" value="9"></el-option>>
						</el-select>
					</el-form-item>
					
				</div>
				<el-form-item label="对话内容" prop="content">
					<el-input type="textarea" :rows="3" v-model="editForm.content" clearable auto-complete="off"></el-input>
				</el-form-item>
        <!-- <div class="flex">
          <el-form-item label="状态" prop="state">
						<el-select v-model="editForm.state">
							<el-option label="未处理" value="1"></el-option>
							<el-option label="已分配" value="2"></el-option>
							<el-option label="重新分配" value="3"></el-option>
						</el-select>
					</el-form-item>
        </div> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" @close="editDialogClose" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="editFormRules" ref="addForm">
				<div class="flex">
					<el-form-item label="客户名称" prop="customer_name">
						<el-input v-model="addForm.customer_name" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="联系方式" prop="contract">
						<el-input v-model="addForm.contract" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="联系方式类型" prop="contract_type">
						<el-select v-model="addForm.contract_type">
							<el-option label="电话" value="1"></el-option>
              <el-option label="微信" value="2"></el-option>
              <el-option label="qq" value="3"></el-option>
              <el-option label="邮箱" value="4"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="业务类型" prop="type">
						<el-select v-model="addForm.type">
							<el-option label="小水总机" value="0"></el-option>
							<el-option label="小水智能" value="1"></el-option>
							<el-option label="语音PAAS" value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
          <el-form-item label="销售区域" prop="area">
						<el-input v-model="addForm.area" clearable auto-complete="off"></el-input>
            <!-- <area-cascader v-if="showArea" v-model="addForm.area" :level="0" type="text" :data="pcaa"></area-cascader> -->
					</el-form-item>
					</el-form-item>
					<el-form-item label="关键词" prop="content_key">
						<el-input v-model="addForm.content_key" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="客户渠道" prop="channel">
						<el-select v-model="addForm.channel">
							<el-option label="百度" value="1"></el-option>
							<el-option label="搜狗" value="2"></el-option>
							<el-option label="神马" value="3"></el-option>
							<el-option label="360" value="4"></el-option>
							<el-option label="信息流" value="5"></el-option>
							<el-option label="400电话" value="6"></el-option>
							<el-option label="注册" value="7"></el-option>
							<el-option label="公司资源" value="8"></el-option>
							<el-option label="自拓" value="9"></el-option>>
						</el-select>
					</el-form-item>
				</div>
				<el-form-item label="对话内容" prop="content">
					<el-input type="textarea" :rows="3" v-model="addForm.content" clearable auto-complete="off"></el-input>
				</el-form-item>
        <!-- <div class="flex">
          <el-form-item label="状态" prop="state">
						<el-select v-model="addForm.state">
							<el-option label="未处理" value="1"></el-option>
							<el-option label="已分配" value="2"></el-option>
							<el-option label="重新分配" value="3"></el-option>
						</el-select>
					</el-form-item>
        </div> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit">提交</el-button>
			</div>
		</el-dialog>
    <!--分配界面-->
    <el-dialog title="分配" width="35%" :visible.sync="allotVisible" :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="销售人员">
          <el-select v-model="allotSaleId" filterable>
							<el-option v-for="item in salesList" 
                         :label="item.user_name" 
                         :value="item.login_id"
                         :key="item.login_id">
              </el-option>
						</el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
				<el-button @click.native="allotVisible = false">取消</el-button>
				<el-button type="primary" @click.native="allotSubmit">提交</el-button>
			</div>
    </el-dialog>
	</section>
</template>

<script>
	const Base64 = require('js-base64').Base64;
  import { getClueByParam, 
           insertclue, 
           updateClueById, 
           deleteClueById,
           getUserInfoByParam,
           insertDistributionClue, 
           insertProcess,
           uploadClueByParam} from '../../api/api';
	import rules from '@/common/js/rule'
	import { pca, pcaa } from 'area-data'
	export default {
		data() {
			return {
				pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
				filters: {
					contract: '',
					content_key: '',
					user_name:'',
					create_time:''
				},
				role_id:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				allotVisible: false,
				editLoading: false,
				showArea: false,
				editFormRules: {
					content: [{ required: true, message: '请输入对话内容', trigger: 'blur' }],
					contract: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
					contract_type: [{ required: true, message: '请输入联系方式类型', trigger: 'blur' }],
					type: [{ required: true, message: '请输入业务类型', trigger: 'blur' }],
					area: [{ required: true, message: '请输入销售区域', trigger: 'blur' }],
					content_key: [{ required: true, message: '请输入关键词', trigger: 'blur' }],
					customer_name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
					channel: [{ required: true, message: '请输入客户渠道', trigger: 'blur' }],
					state: [{ required: true, message: '请输入状态', trigger: 'blur' }],
				},
				//编辑界面数据
				editForm: {
					customer_name:'',
					contract:'',
					contract_type:'',
					type:'',
					area:'',
					content:'',
					customer_address:'',
          content_key:'',
          state:''
				},
				headers:{
					authorLoginId:Base64.encode(JSON.parse(sessionStorage.getItem('user')).login_id),
					type:3
				},
				uploadUrl:'api/clouddo-crm/upload/exportExcel',
				fileList:[],

				addFormVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
					customer_name:'',
					contract:'',
					contract_type:'',
					type:'',
					area:'',
					content:'',
					customer_address:'',
          content_key:'',
          state:''
        },
        salesList:[],
				pca: pca,
				pcaa: pcaa,
        allotSaleId:'',
				allotId:'',
				currentId:''
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
					contract: this.filters.contract,
					content_key: this.filters.content_key,
					create_time: this.filters.create_time,
					user_name: this.filters.user_name,
				};
				this.listLoading = true;
				getClueByParam(data).then((res) => {
					this.total = res.result.records;
					this.list = res.result.data;
					this.listLoading = false;
				});
      },
      //获取所有销售人员
      getSalesList(){
        const data={
          page:1,
          rows:1000,
          role_id:0
        };
        getUserInfoByParam(data).then(res=>{
          this.salesList=res.result.data;
        })
      },
      //分配给销售
      handleAllot(row){
        this.allotSaleId='';
        this.allotVisible=true;
        this.allotId=row.id;
      },
      //分配提交
      allotSubmit(){
        if(!this.allotSaleId){
          this.$message({
						message: '请选择销售人员',
						type: 'warning'
          });
          return
        };
        const data={
          id:this.currentId?this.currentId:this.allotId,
          login_id:this.allotSaleId
        };
        insertDistributionClue(data).then(res=>{
					this.allotVisible=false;
					this.currentId='';
					this.allotSaleId='';
          this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.getTableList();
        })
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
					deleteClueById(data).then((res) => {
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
				// if(typeof this.editForm.area==='string'){
				// 	this.editForm.area=this.editForm.area.split('/')
				// }
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.showArea = true;
				this.addForm = {
					customer_name:'',
					content:'',
					contract:'',
					contract_type:'1',
					type:'1',
					area:'',
					channel:'1',
					customer_address:'',
					content_key:'',
					state:'',
				};
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						// this.editForm.area=this.editForm.area.join('/');
						const data = Object.assign({}, this.editForm);
						updateClueById(data).then((res) => {
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
						// this.addForm.area=this.addForm.area.join('/');
						const data = Object.assign({}, this.addForm);
						insertclue(data).then((res) => {
							if(res.result){
								this.currentId=res.result.id;
							};
							// this.$message({
							// 	message: res.errMsg,
							// 	type: 'success'
							// });
							this.$refs['addForm'].resetFields();
							this.allotVisible=true;
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
				window.open('../../../static/cluesInfo.xlsx')
			},
			//导出
			exportExcel(){
				const data={
					contract: this.filters.contract,
					content_key: this.filters.content_key,
					create_time: this.filters.create_time,
					user_name: this.filters.user_name,
					role_id: this.role_id,
				};
				uploadClueByParam(data).then(res=>{
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
      this.getSalesList();
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
.totalNum{
	color: #909399;
}
.filter{
	width: 16%;
}
</style>