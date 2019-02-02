<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item style="width:15%">
					<el-input size="small" clearable v-model="filters.company_name" placeholder="公司全称"></el-input>
				</el-form-item>
				<el-form-item style="width:15%">
					<el-input size="small" clearable v-model="filters.user_name" placeholder="添加人"></el-input>
				</el-form-item>
				<el-form-item style="width:15%">
					<el-date-picker style="width:98%" size="small" v-model="filters.pay_time" @change="getFiltersPayTime" value-format="yyyy-MM-dd" type="date" placeholder="选择收款日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item style="width:15%">
					<el-select size="small" v-model="filters.customer_type" placeholder="客户类型" clearable>
						<el-option label="直客" value="0"></el-option>
						<el-option label="渠道" value="1"></el-option>
					</el-select>
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
			
			<el-table-column prop="company_name" label="公司全称" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="pay_time" label="收款时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="customer_type" label="客户类型" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.customer_type==0">直客</span>
					<span v-if="scope.row.customer_type==1">渠道</span>
				</template>
			</el-table-column>
			<el-table-column prop="line_price" label="线路单价" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="audit_status" label="状态" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.audit_status==0">未审批</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.audit_status==1">转发中</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.audit_status==2">审批通过</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.audit_status==3">审批拒绝</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="business_type" label="行业类型" width="80" show-overflow-tooltip>
			</el-table-column>>
			<el-table-column prop="robot_number" label="机器人数量" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="user_name" label="销售经理" width="90" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="line_concurrency" label="线路并发数" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="number_pay_money" label="号码费" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="call_customer_pay_money" label="客户自备线路" width="110" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.call_customer_pay_money==0">否</span>
					<span v-if="scope.row.call_customer_pay_money==1">是</span>
				</template>
			</el-table-column>
			<el-table-column prop="refunds" label="是否到款" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.refunds==0">未到款</span>
					<span v-if="scope.row.refunds==1">已到款</span>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="sales_name" label="销售经理" width="100" show-overflow-tooltip>
			</el-table-column> -->
			<el-table-column prop="call_card_pay_money" label="卡槽费" width="110" show-overflow-tooltip>
			</el-table-column>
			<!-- <el-table-column prop="cost_interval" label="费用期间" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.cost_interval==0">月付</span>
					<span v-if="scope.row.cost_interval==1">季付</span>
					<span v-if="scope.row.cost_interval==2">年付</span>
					<span v-if="scope.row.cost_interval==3">测试</span>
				</template>
			</el-table-column> -->
			<el-table-column prop="call_year_pay_money" label="通信费" width="80" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="robot_pay_money" label="机器人费" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="pay_voucher" label="打款凭证" width="200">
				<template slot-scope="scope">
					<div class="tableImg" v-if="scope.row.pay_voucher">
						<img v-for="(item,index) in scope.row.pay_voucher" class="smallImg" preview="4" :src="item" :key="index" alt="" style="width: 40px;height: 40px;margin-right:5px;">
					  <!-- <img class="bigImg" :src="scope.row.url" alt="">   -->
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="verbal_trick" label="话术" width="110" show-overflow-tooltip>
				<template slot-scope="scope">
					<a :href="scope.row.verbal_trick" download>
					  <el-button v-if="scope.row.verbal_trick" type="text" size="small">下载</el-button>
					</a>
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
		<el-dialog title="编辑" width="55%" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<div class="flex">
					<el-form-item label="公司全称" prop="company_name">
						<el-input v-model="editForm.company_name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="线路单价" prop="line_price">
						<el-input v-model="editForm.line_price" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间" prop="pay_time">
						<el-date-picker v-model="editForm.pay_time" @change="getEditTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="客户自备线路" style="width:44%" prop="call_customer_pay_money">
						<el-select v-model="editForm.call_customer_pay_money">
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.call_customer_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="行业类型" prop="business_type">
						<el-input v-model="editForm.business_type" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="机器人数量" prop="robot_number">
						<el-input v-model="editForm.robot_number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="是否到款" prop="refunds">
						<el-select v-model="editForm.refunds">
							<el-option label="未到款" value="0"></el-option>
							<el-option label="已到款" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="通信费" prop="call_year_pay_money">
						<el-input v-model="editForm.call_year_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					<!-- <el-form-item label="销售经理" prop="sales_name">
						<el-input v-model="editForm.sales_name" auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="线路并发数" prop="line_concurrency">
						<el-input v-model="editForm.line_concurrency" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费" prop="number_pay_money">
						<el-input v-model="editForm.number_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="机器人费" prop="robot_pay_money">
						<el-input v-model="editForm.robot_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="卡槽费" prop="call_card_pay_money">
						<el-input v-model="editForm.call_card_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<!-- <el-form-item label="费用期间" prop="cost_interval">
						<el-select v-model="editForm.cost_interval">
							<el-option label="月付" value="0"></el-option>
							<el-option label="季付" value="1"></el-option>
							<el-option label="年付" value="2"></el-option>
							<el-option label="测试" value="3"></el-option>
						</el-select>
					</el-form-item> -->
					
				</div>
				<div class="flex">
					<el-form-item label="客户类型" prop="customer_type">
						<el-select v-model="editForm.customer_type">
							<el-option label="直客" value="0"></el-option>
							<el-option label="渠道" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="editForm.remark" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="话术" prop="verbal_trick">
						<el-upload :headers="headers"
											:action="uploadUrl"
											:before-upload="beforeVerbalUpload"
											:on-success="onEditVerbalSuccess"
											:on-change="uploadVerbalChange"
											:show-file-list="false"
											multiple
											:limit="2"
											:file-list="verbalFileList">
							<el-button size="small" type="primary">点击上传</el-button>
							<span slot="tip" style="padding-left:10px;color:#E6A23C;" class="el-upload__tip">请上传excel/word文件</span>
						</el-upload>
					</el-form-item>
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
							<span slot="tip" style="padding-left:10px;color:#E6A23C;" class="el-upload__tip">请上传zip/rar文件</span>
						</el-upload>
					</el-form-item>
				</div>
				<el-form-item label="打款凭证">
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
		<el-dialog title="新增" width="55%" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="editFormRules" ref="addForm">
				<div class="flex">
					<el-form-item label="线路单价" prop="line_price">
						<el-input v-model="addForm.line_price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司全称" prop="company_name">
						<el-input v-model="addForm.company_name" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间" prop="pay_time">
						<el-date-picker v-model="addForm.pay_time" @change="getAddTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="客户自备线路" style="width:44%" prop="call_customer_pay_money">
						<el-select v-model="addForm.call_customer_pay_money">
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
						<!-- <el-input v-model="addForm.call_customer_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="行业类型" prop="business_type">
						<el-input v-model="addForm.business_type" auto-complete="off"></el-input>
					</el-form-item>
					</el-form-item>
					<el-form-item label="机器人数量" prop="robot_number">
						<el-input v-model="addForm.robot_number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="是否到款" prop="refunds">
						<el-select v-model="addForm.refunds">
							<el-option label="未到款" value="0"></el-option>
							<el-option label="已到款" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="通信费" prop="call_year_pay_money">
						<el-input v-model="addForm.call_year_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					<!-- <el-form-item label="销售经理" prop="sales_name">
						<el-input v-model="addForm.sales_name" auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="线路并发数" prop="line_concurrency">
						<el-input v-model="addForm.line_concurrency" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费" prop="number_pay_money">
						<el-input v-model="addForm.number_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="机器人费" prop="robot_pay_money">
						<el-input v-model="addForm.robot_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="卡槽费" prop="call_card_pay_money">
						<el-input v-model="addForm.call_card_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<!-- <el-form-item label="费用期间" prop="cost_interval">
						<el-select v-model="addForm.cost_interval">
							<el-option label="月付" value="0"></el-option>
							<el-option label="季付" value="1"></el-option>
							<el-option label="年付" value="2"></el-option>
							<el-option label="测试" value="3"></el-option>
						</el-select>
					</el-form-item> -->
					
				</div>
				<div class="flex">
					<el-form-item label="客户类型" prop="customer_type">
						<el-select v-model="addForm.customer_type">
							<el-option label="直客" value="0"></el-option>
							<el-option label="渠道" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="addForm.remark" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="话术" prop="verbal_trick">
						<el-upload :headers="headers"
											:action="uploadUrl"
											:before-upload="beforeVerbalUpload"
											:on-change="uploadVerbalChange"
											:on-success="onAddVerbalSuccess"
											:show-file-list="false"
											multiple
											:limit="2"
											:file-list="verbalFileList">
							<el-button size="small" type="primary">点击上传</el-button>
							<span slot="tip" style="padding-left:10px;color:#E6A23C;" class="el-upload__tip">请上传excel/word文件</span>
						</el-upload>
					</el-form-item>
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
							<span slot="tip" style="padding-left:10px;color:#E6A23C;" class="el-upload__tip">请上传zip/rar文件</span>
						</el-upload>
					</el-form-item>
				</div>
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
	import { getXsznProcessByParam, insertXsznProcess, updateXsznProcessById, deleteXsznProcessById ,updateReProcessById ,insertProcess ,uploadRobotByParam} from '../../api/api';
  import rules from '@/common/js/rule'
	export default {
		data() {
			return {
				filters: {
					company_name: '',
					user_name: '',
					pay_time:'',
					customer_type:''
				},
				role_id:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					line_price: [{ required: true, message: '请输入销售区域', trigger: 'blur' }],
					company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur'}],
					customer_type: [{ required: true, message: '请输入客户类型', trigger: 'blur'}],
					pay_time: [{ required: true, message: '请输入收款时间', trigger: 'blur'}],
					business_type: [{ required: true, message: '请输入公司行业', trigger: 'blur'}],
					robot_number: rules.InterNum,
					line_concurrency: rules.InterNum,
					number_pay_money: rules.numPot2,
					call_customer_pay_money: [{ required: true, message: '请输入自备线路收款', trigger: 'blur'}],
					call_card_pay_money: rules.numPot2,
					cost_interval: [{ required: true, message: '请输入包年正常收款金额', trigger: 'blur'}],
					robot_pay_money: rules.numPot2,
					call_year_pay_money:rules.numPot2,
					refunds: [{ required: true, message: '请输入是否到款', trigger: 'blur'}],
					sales_name: [{ required: true, message: '请输入销售经理', trigger: 'blur'}],
					// verbal_trick: [{ required: true, message: '请上传话术', trigger: 'change blur'}],
					// need_data: [{ required: true, message: '请上传号码申请材料', trigger: 'change blur'}],
				},
				//编辑界面数据
				editForm: {
					line_price:'',
					company_name:'',
					pay_time:'',
					customer_type:'',
					business_type:'',
					robot_number:'',
					line_concurrency:'',
					number_pay_money:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					cost_interval:'',
					robot_pay_money:'',
					call_year_pay_money:'',
					sales_name:'',
					refunds:'',
					remark:'',
				},
				headers:{authorLoginId:JSON.parse(sessionStorage.getItem('user')).login_id},
				uploadUrl:'api/clouddo-crm/upload/uploadFile',
        fileList:[],
				editFileList:[],
				dialogImageUrl:'',
				previewDialogVisible:false,
				delFiles:[],
				numMaterialfileList:[],
				verbalFileList:[],

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {
					line_price:'',
					company_name:'',
					pay_time:'',
					customer_type:'',
					business_type:'',
					robot_number:'',
					line_concurrency:'',
					number_pay_money:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					cost_interval:'',
					robot_pay_money:'',
					call_year_pay_money:'',
					sales_name:'',
					refunds:'',
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
					company_name: this.filters.company_name,
					user_name: this.filters.user_name,
					pay_time: this.filters.pay_time,
					customer_type: this.filters.customer_type
				};
				this.listLoading = true;
				getXsznProcessByParam(data).then((res) => {
					this.total = res.result.records;
					// this.list = res.result.data;
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
			//上传话术excel、word
			onAddVerbalSuccess(response, file, fileList){
				if(response.errCode==200){
					this.$message({
						message: response.errMsg,
						type: 'success'
					});
					this.addForm.verbal_trick=response.result;
				}else{
					this.$message({
						message: response.errMsg,
						type: 'warning'
					});
				}
			},
			onEditVerbalSuccess(response, file, fileList){
				if(response.errCode==200){
					this.$message({
						message: response.errMsg,
						type: 'success'
					});
					this.editForm.verbal_trick=response.result;
				}else{
					this.$message({
						message: response.errMsg,
						type: 'warning'
					});
				}
			},
			beforeVerbalUpload(file){
				let fileType=file.name.substring(file.name.lastIndexOf(".")+1).toUpperCase();;
				if(fileType=='XLS' || fileType=='XLSX' || fileType=='DOC' || fileType=='DOCX'){
					return true;
				}else{
					this.$message({
						message: '请上传excel/word类型文件',
						type: 'warning'
					});
					return false;
				};
			},
			uploadVerbalChange(file, fileList){
        this.verbalFileList=fileList.slice(-1);
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
			//提交审核
			auditSubmit(row){
				const data={
					type:'3',
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
					type:'3',
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
					deleteXsznProcessById(data).then((res) => {
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
					line_price:'',
					company_name:'',
					pay_time:'',
					customer_type:'',
					business_type:'',
					robot_number:'',
					start_date:'',
					end_date:'',
					sales_name:'',
					refunds:'',
					call_year_pay_money:'',
				};
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						const data = Object.assign({}, this.editForm);
						updateXsznProcessById(data).then((res) => {
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
						insertXsznProcess(data).then((res) => {
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
					company_name: this.filters.company_name,
					user_name: this.filters.user_name,
					pay_time: this.filters.pay_time,
					customer_type: this.filters.customer_type,
					role_id: this.role_id
				};
				uploadRobotByParam(data).then(res=>{
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
				this.addForm.pay_time=val;
			},
			getEditTime(val){
				this.editForm.pay_time=val;
			},
			getEditTime(val){
				this.editForm.start_date=val;
			},
			getEditETime(val){
				this.editForm.end_date=val;
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
</style>