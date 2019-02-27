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
		<el-col :span="24" class="toolbar mytoolbar" style="padding-bottom: 0px;margin-top:0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item style="width:13%;margin-right:0;">
					<el-input size="small" clearable v-model="filters.name" placeholder="通道名称"></el-input>
				</el-form-item>
				<el-form-item style="width:13%;margin-right:0;">
					<el-input size="small" clearable v-model="filters.prefix" placeholder="通道前缀"></el-input>
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
					<el-select size="small" clearable v-model="filters.belong" placeholder="业务归属">
						<el-option label="小水总机" value="0"></el-option>
						<el-option label="小水智能" value="1"></el-option>
						<el-option label="语音PASS" value="2"></el-option>
					</el-select> 
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
			<el-table-column prop="level" label="号码类型" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.level==0">大号</span>
					<span v-if="scope.row.level==1">强显</span>
					<span v-if="scope.row.level==2">手机号</span>
				</template>
			</el-table-column>
			<el-table-column prop="distance" label="市话长途" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.distance==0">市话</span>
					<span v-if="scope.row.distance==1">长途</span>
					<span v-if="scope.row.distance==2">市话长途</span>
				</template>
			</el-table-column>
			<el-table-column prop="belong" label="业务归属" width="140" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.belong==0">小水总机</span>
					<span v-if="scope.row.belong==1">小水智能</span>
					<span v-if="scope.row.belong==2">语音PASS</span>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="audit_status" label="状态" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.audit_status==0">未审批</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.audit_status==1">转发中</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.audit_status==2">审批通过</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.audit_status==3">审批拒绝</el-button>
				</template>
			</el-table-column> -->
			<el-table-column prop="number" label="号码" width="150" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="address" label="地区" width="150" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="name" label="通道名称" width="260" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="business" label="业务类型" width="180" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="attribute" label="通道属性" width="180" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="start_date" label="开通时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="end_date" label="关停时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="communications_charges" label="通信资费" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="number_charges" label="号码费" width="100" show-overflow-tooltip>
			</el-table-column>
			<!-- <el-table-column prop="invoice" label="是否开票" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.invoice==0">未开票</span>
					<span v-if="scope.row.invoice==1">已开票</span>
				</template>
			</el-table-column>
			<el-table-column prop="invoice_type" label="发票类型" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.invoice_type==0">专票</span>
					<span v-if="scope.row.invoice_type==1">普票</span>
				</template>
			</el-table-column>
			<el-table-column prop="tax_point" label="税点" width="100" show-overflow-tooltip>
			</el-table-column> -->
			<el-table-column prop="remark" label="备注" show-overflow-tooltip>
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
		<el-dialog title="编辑" :visible.sync="editFormVisible" @close="editDialogClose" :close-on-click-modal="false">
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
					<el-form-item label="号码" prop="number">
						<el-input v-model="editForm.number" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="市话长途" prop="distance">
						<el-select v-model="editForm.distance">
							<el-option label="市话" value="0"></el-option>
							<el-option label="长途" value="1"></el-option>
							<el-option label="市话长途" value="2"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.distance" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="地区" prop="address">
						<area-cascader v-if="showArea" v-model="editForm.address" :level="0" type="text" :data="pca"></area-cascader> 
						<!-- <el-input v-model="editForm.address" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="业务类型" prop="business">
						<el-select v-model="editForm.business" filterable clearable>
							<el-option v-for="(item,index) in businessList"
												 :label="item.label"
												 :value="item.value"
												 :key="index">
							</el-option>
						</el-select>
						<!-- <el-input v-model="editForm.business" auto-complete="off"></el-input> -->
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
					<el-form-item label="业务归属" prop="belong">
						<el-select v-model="editForm.belong">
							<el-option label="小水总机" value="0"></el-option>
							<el-option label="小水智能" value="1"></el-option>
							<el-option label="语音PASS" value="2"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.belong" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="号码类型" prop="level">
						<el-select v-model="editForm.level">
							<el-option label="大号" value="0"></el-option>
							<el-option label="强显" value="1"></el-option>
							<el-option label="手机号" value="2"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.level" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="开始时间" prop="start_date">
						<el-date-picker v-model="editForm.start_date" @change="getEditSTime" value-format="yyyy-MM-dd" type="date" placeholder="选择开始日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间" prop="end_date">
						<el-date-picker v-model="editForm.end_date"  @change="getEditETime" value-format="yyyy-MM-dd" type="date" placeholder="选择结束日期">
						</el-date-picker>
					</el-form-item>
				</div>
				<!-- <div class="flex">
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
				</div> -->
				<!-- <div class="flex">
					<el-form-item label="税点" prop="tax_point">
						<el-input v-model="editForm.tax_point" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信费" prop="charges">
						<el-input v-model="editForm.charges" auto-complete="off"></el-input>
					</el-form-item>
				</div> -->
				<el-form-item label="通道属性" prop="attribute">
					<el-input type="textarea" :rows="2" v-model="editForm.attribute" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <div class="flex"> -->
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" auto-complete="off"></el-input>
				</el-form-item>
				<!-- </div> -->
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
					<el-form-item label="市话长途" prop="distance">
						<el-select v-model="addForm.distance">
							<el-option label="市话" value="0"></el-option>
							<el-option label="长途" value="1"></el-option>
							<el-option label="市话长途" value="2"></el-option>
						</el-select>
						<!-- <el-input v-model="addForm.distance" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="号码" prop="number">
						<el-input v-model="addForm.number" auto-complete="off"></el-input>
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
					<el-form-item label="地区" prop="address">
						<area-cascader v-model="addForm.address" :level="0" type="text" :data="pca"></area-cascader> 
						<!-- <el-input v-model="addForm.address" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="业务类型" prop="business">
						<el-select v-model="addForm.business" filterable clearable>
							<el-option v-for="(item,index) in businessList"
												 :label="item.label"
												 :value="item.value"
												 :key="index">
							</el-option>
						</el-select>
						<!-- <el-input v-model="addForm.business" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务归属" prop="belong">
						<el-select v-model="addForm.belong">
							<el-option label="小水总机" value="0"></el-option>
							<el-option label="小水智能" value="1"></el-option>
							<el-option label="语音PASS" value="2"></el-option>
						</el-select>
						<!-- <el-input v-model="addForm.belong" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="号码类型" prop="level">
						<el-select v-model="addForm.level">
							<el-option label="大号" value="0"></el-option>
							<el-option label="强显" value="1"></el-option>
							<el-option label="手机号" value="2"></el-option>
						</el-select>
						<!-- <el-input v-model="addForm.level" auto-complete="off"></el-input> -->
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
				<!-- <div class="flex">
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
				</div> -->
				<!-- <div class="flex">
					<el-form-item label="税点" prop="tax_point">
						<el-input v-model="addForm.tax_point" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信费" prop="charges">
						<el-input v-model="addForm.charges" auto-complete="off"></el-input>
					</el-form-item>
				</div> -->
				<el-form-item label="通道属性" prop="attribute">
					<el-input type="textarea" :rows="2" v-model="addForm.attribute" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" auto-complete="off"></el-input>
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
  const Base64 = require('js-base64').Base64;
	import { getChannelByParam, insertChannel, updateChannelById, deleteChannelById ,insertProcess ,updateReProcessById ,uploadChannelByParam} from '../../api/api';
	import rules from '@/common/js/rule'
	import { pca, pcaa } from 'area-data'
	export default {
		
		data() {
			return {
				filters: {
					name: '',
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
				headers:{
					authorLoginId:Base64.encode(JSON.parse(sessionStorage.getItem('user')).login_id),
					type:0
				},
				uploadUrl:'api/clouddo-crm/upload/exportExcel',
				importData:{ },
				fileList:[],
				
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
					prefix: [{ required: true, message: '请输入前缀', trigger: 'blur' }],
					level: [{ required: true, message: '请输入号码类型', trigger: 'blur' }],
					distance: [{ required: true, message: '请输入市话长途', trigger: 'blur' }],
					belong: [{ required: true, message: '请输入业务归属', trigger: 'blur' }],
					number: [{ required: true, message: '请输入号码', trigger: 'blur' }],
					address: [{ required: true, message: '请输入地区', trigger: 'blur' }],
					business: [{ required: true, message: '请输入业务', trigger: 'blur' }],
					attribute: [{ required: true, message: '请输入通道属性', trigger: 'blur' }],
					start_date: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
					// end_date: [{ required: true, message: '请输入关停时间', trigger: 'blur' }],
					charges: rules.numPot2,
					communications_charges: [{ required: true, message: '请输入通信资费', trigger: 'blur' }],
					number_charges: rules.numPot2,
					invoice: [{ required: true, message: '请输入是否开票', trigger: 'blur' }],
					invoice_type: [{ required: true, message: '请输入发票类型', trigger: 'blur' }],
					tax_point: rules.numPot2,

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
				},
				pca: pca,
				pcaa: pcaa,
				businessList:[
					{label:'调研',value:'调研'},
					{label:'回访',value:'回访'},
					{label:'装修',value:'装修'},
					{label:'保险',value:'保险'},
					{label:'教育',value:'教育'},
					{label:'增值',value:'增值'},
					{label:'邀约',value:'邀约'},
					{label:'通知',value:'通知'},
					{label:'催收',value:'催收'},
					{label:'贷款',value:'贷款'},
					{label:'房产',value:'房产'},
					{label:'机器人催收',value:'机器人催收'},
					{label:'酒水',value:'酒水'},
					{label:'POS机',value:'POS机'},
					{label:'AI股票',value:'AI股票'},
					{label:'股票',value:'股票'},
					{label:'代理记账',value:'代理记账'},
					{label:'财税',value:'财税'},
					{label:'信用卡',value:'信用卡'},
					{label:'知识产权',value:'知识产权'},
					{label:'物流',value:'物流'},
				],
				showArea:false
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
					name: this.filters.name,
					prefix: this.filters.prefix,
					number: this.filters.number,
					address: this.filters.address?this.filters.address.join('/'):'',
					belong: this.filters.belong,
					start_date: this.filters.start_date
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
				if(typeof this.editForm.address==='string'){
					this.editForm.address=this.editForm.address.split('/')
				}
				this.showArea=true;
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
						this.editForm.address=this.editForm.address.join('/');
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
						this.addForm.address=this.addForm.address.join('/');
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
				window.open('../../../static/channelTemplate.xlsx')
			},
			//导出
			exportExcel(){
				const data={
					name:this.filters.name,
					prefix: this.filters.prefix,
					number: this.filters.number,
					address: this.filters.address?this.filters.address.join('/'):'',
					belong: this.filters.belong,
					start_date: this.filters.start_date,
					role_id: this.role_id
				};
				uploadChannelByParam(data).then(res=>{
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
			getEditSTime(val){
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

<style>
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