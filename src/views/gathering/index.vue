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
			<el-table-column prop="company_name" label="公司名称" width="220" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="area" label="销售区域" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="pay_time" label="收款时间" width="160" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="customer_type" label="客户类型" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.customer_type==0">渠道</span>
					<span v-if="scope.row.customer_type==1">直客</span>
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
			<el-table-column prop="company_industry" label="公司行业" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="robot_number" label="机器人数量" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="customer_clues" label="客户线索来源" width="110" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.customer_clues==0">SEM</span>
					<span v-if="scope.row.customer_clues==1">公司</span>
					<span v-if="scope.row.customer_clues==2">商务本身</span>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="business_itself" label="商务本身" width="100">
			</el-table-column> -->
			<el-table-column prop="number_pay_money" label="号码费" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="call_customer_pay_money" label="客户自备线路" width="110" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.call_customer_pay_money==0">否</span>
					<span v-if="scope.row.call_customer_pay_money==1">是</span>
				</template>
			</el-table-column>
			<el-table-column prop="call_card_pay_money" label="卡槽费" width="140" show-overflow-tooltip>
			</el-table-column>

			<!-- <el-table-column prop="sales_name" label="销售经理" width="140" show-overflow-tooltip>
			</el-table-column> -->
			<el-table-column prop="customer_area" label="客户所在区域" width="140" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="projects_type" label="业务归属" width="140" show-overflow-tooltip>
			  <template slot-scope="scope">
					<span v-if="scope.row.projects_type==0">小水智能</span>
					<span v-if="scope.row.projects_type==1">小水总机</span>
					<span v-if="scope.row.projects_type==2">语音PAAS</span>
				</template>
			</el-table-column>
			<el-table-column prop="process_making_money" label="流程制作费" width="140" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="all_received_money" label="总收款金额" width="140" show-overflow-tooltip>
			</el-table-column>
				
			<el-table-column prop="cost_type" label="费用属性" width="140" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="line_price" label="线路单价" width="140" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="call_year_pay_money" label="通信费" width="140" show-overflow-tooltip>
			</el-table-column>

			<el-table-column prop="cost_interval" label="费用期间" width="100" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.cost_interval==0">月付</span>
					<span v-if="scope.row.cost_interval==1">季付</span>
					<span v-if="scope.row.cost_interval==2">年付</span>
					<span v-if="scope.row.cost_interval==3">测试</span>
				</template>
			</el-table-column>
			<el-table-column prop="pay_voucher" label="打款凭证" width="200" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="tableImg" v-if="scope.row.pay_voucher">
						<img v-for="(item,index) in scope.row.pay_voucher" class="smallImg" preview="2" :src="item" :key="index" alt="" style="width: 40px;height: 40px;margin-right:5px;">
					  <!-- <img class="bigImg" :src="scope.row.url" alt="">   -->
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="robot_pay_money" label="机器人费" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="user_name" label="销售经理" width="70" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="pay_type" label="付款方式" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.pay_type==0">对公</span>
					<span v-if="scope.row.pay_type==1">对私</span>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="refunds" label="是否返款" width="80" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.refunds==0">未返款</span>
					<span v-if="scope.row.refunds==1">已返款</span>
				</template>
			</el-table-column> -->
			<el-table-column prop="remark" label="备注" show-overflow-tooltip>
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
		<el-dialog title="编辑" width="57%" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="addFormRules" ref="editForm">
				<div class="flex">
					<el-form-item label="公司名称" prop="company_name">
						<el-input v-model="editForm.company_name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费" prop="number_pay_money">
						<el-input v-model="editForm.number_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="公司行业" prop="company_industry">
						<el-input v-model="editForm.company_industry" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="机器人数量" prop="robot_number">
						<el-input v-model="editForm.robot_number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="线路单价" prop="line_price">
						<el-input v-model="editForm.line_price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信费" prop="call_year_pay_money">
						<el-input v-model="editForm.call_year_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="卡槽费" prop="call_card_pay_money">
						<el-input v-model="editForm.call_card_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="机器人费" prop="robot_pay_money">
						<el-input v-model="editForm.robot_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="总收款金额" prop="all_received_money ">
						<el-input v-model="editForm.all_received_money " auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="流程制作费" prop="process_making_money">
						<el-input v-model="editForm.process_making_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="销售区域" prop="area">
						<area-cascader v-model="editForm.area" :level="0" type="text" :data="pca"></area-cascader> 
					</el-form-item>
					<el-form-item label="客户所在区域" prop="customer_area">
						<area-cascader v-model="editForm.customer_area" :level="0" type="text" :data="pca"></area-cascader> 
						<!-- <el-input v-model="editForm.customer_area" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				
				<div class="flex">
					<el-form-item label="业务归属" prop="projects_type">
						<el-select v-model="editForm.projects_type">
							<el-option label="小水智能" value="0"></el-option>
							<el-option label="小水总机" value="1"></el-option>
							<el-option label="语音PAAS" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="费用属性" prop="cost_type">
						<el-select v-model="editForm.cost_type" multiple collapse-tags>
							<el-option label="机器人费用" value="机器人费用"></el-option>
							<el-option label="机器人续费" value="机器人续费"></el-option>
							<el-option label="流程制作费" value="流程制作费"></el-option>
							<el-option label="通信费续费" value="通信费续费"></el-option>
							<el-option label="通信费" value="通信费"></el-option>
							<el-option label="号码费" value="号码费"></el-option>
							<el-option label="卡槽费" value="卡槽费"></el-option> 
							<el-option label="渠道代理费" value="渠道代理费"></el-option>
							<el-option label="退款" value="退款"></el-option>
							<el-option label="返款" value="返款"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.robot_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="付款方式" prop="pay_type">
						<el-select v-model="editForm.pay_type">
							<el-option label="对公" value="0"></el-option>
							<el-option label="对私" value="1"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.pay_type" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="客户自备线路" prop="call_customer_pay_money">
						<el-select v-model="editForm.call_customer_pay_money">
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间" prop="pay_time">
						<el-date-picker v-model="editForm.pay_time" @change="getEditPayTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="客户线索来源" prop="customer_clues">
						<el-select v-model="editForm.customer_clues">
							<el-option label="SEM" value="0"></el-option>
							<el-option label="公司" value="1"></el-option>
							<el-option label="商务本身" value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<!-- <el-form-item label="销售经理" prop="sales_name">
						<el-input v-model="editForm.sales_name" auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="费用期间" prop="cost_interval">
						<el-select v-model="editForm.cost_interval">
							<el-option label="月付" value="0"></el-option>
							<el-option label="季付" value="1"></el-option>
							<el-option label="年付" value="2"></el-option>
							<el-option label="测试" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="客户类型" prop="customer_type">
						<el-select v-model="editForm.customer_type">
							<el-option label="直客" value="1"></el-option>
							<el-option label="渠道" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-form-item label="打款凭证" prop="pay_voucher">
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
		<el-dialog title="新增" width="57%" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<div class="flex">
					<el-form-item label="公司名称" prop="company_name">
						<el-input v-model="addForm.company_name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费" prop="number_pay_money">
						<el-input v-model="addForm.number_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					<!-- <el-form-item label="销售经理" prop="sales_name">
						<el-input v-model="addForm.sales_name" auto-complete="off"></el-input>
					</el-form-item> -->
				</div>
				<div class="flex">
					<el-form-item label="公司行业" prop="company_industry">
						<el-input v-model="addForm.company_industry" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="机器人数量" prop="robot_number">
						<el-input v-model="addForm.robot_number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="卡槽费" prop="call_card_pay_money">
						<el-input v-model="addForm.call_card_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="机器人费" prop="robot_pay_money">
						<el-input v-model="addForm.robot_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				
				<div class="flex">
					<el-form-item label="总收款金额" prop="all_received_money ">
						<el-input v-model="addForm.all_received_money " auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="流程制作费" prop="process_making_money">
						<el-input v-model="addForm.process_making_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="线路单价" prop="line_price">
						<el-input v-model="addForm.line_price" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信费" prop="call_year_pay_money">
						<el-input v-model="addForm.call_year_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="销售区域" prop="area">
						<area-cascader v-model="addForm.area" :level="0" type="text" :data="pca"></area-cascader> 
					</el-form-item>
					<el-form-item label="客户所在区域" prop="customer_area">
						<area-cascader v-model="addForm.customer_area" :level="0" type="text" :data="pca"></area-cascader> 
						<!-- <el-input v-model="addForm.customer_area" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="付款方式" prop="pay_type">
						<el-select v-model="addForm.pay_type">
							<el-option label="对公" value="0"></el-option>
							<el-option label="对私" value="1"></el-option>
						</el-select>
						<!-- <el-input v-model="addForm.pay_type" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="客户线索来源" prop="customer_clues">
						<el-select v-model="addForm.customer_clues">
							<el-option label="SEM" value="0"></el-option>
							<el-option label="公司" value="1"></el-option>
							<el-option label="商务本身" value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务归属" prop="projects_type">
						<el-select v-model="addForm.projects_type">
							<el-option label="小水智能" value="0"></el-option>
							<el-option label="小水总机" value="1"></el-option>
							<el-option label="语音PAAS" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="费用属性" prop="cost_type">
						<el-select v-model="addForm.cost_type" multiple collapse-tags>
							<el-option label="机器人费用" value="机器人费用"></el-option>
							<el-option label="机器人续费" value="机器人续费"></el-option>
							<el-option label="流程制作费" value="流程制作费"></el-option>
							<el-option label="通信费续费" value="通信费续费"></el-option>
							<el-option label="通信费" value="通信费"></el-option>
							<el-option label="号码费" value="号码费"></el-option>
							<el-option label="卡槽费" value="卡槽费"></el-option> 
							<el-option label="渠道代理费" value="渠道代理费"></el-option>
							<el-option label="退款" value="退款"></el-option>
							<el-option label="返款" value="返款"></el-option>
						</el-select>
						<!-- <el-input v-model="editForm.robot_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				
				<div class="flex">
					<el-form-item  label="收款时间" prop="pay_time">
						<el-date-picker v-model="addForm.pay_time" @change="getAddPayTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="客户自备线路" prop="call_customer_pay_money">
						<el-select v-model="addForm.call_customer_pay_money">
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
						<!-- <el-input v-model="addForm.call_customer_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="费用期间" prop="cost_interval">
						<el-select v-model="addForm.cost_interval">
							<el-option label="月付" value="0"></el-option>
							<el-option label="季付" value="1"></el-option>
							<el-option label="年付" value="2"></el-option>
							<el-option label="测试" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="客户类型" prop="customer_type">
						<el-select v-model="addForm.customer_type">
							<el-option label="直客" value="0"></el-option>
							<el-option label="渠道" value="1"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<!-- <el-form-item style="width:45%" label="是否返款" prop="refunds">
						<el-select v-model="addForm.refunds">
							<el-option label="已返款" value="1"></el-option>
							<el-option label="未返款" value="0"></el-option>
						</el-select>
					</el-form-item> -->
				</div>
				<el-form-item label="打款凭证" prop="pay_voucher">
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
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="previewDialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</section>
</template>

<script>
	import { getCompanyCollectionByParam, insertCompanyCollection, updateCompanyCollectionById, deleteCompanyCollectionById, insertProcess ,updateReProcessById ,uploadGatheringByParam ,getCityById} from '../../api/api';
	import rules from '@/common/js/rule'
	import { pca, pcaa } from 'area-data'
	export default {
		data() {
			return {
				filters: {
					company_name: '',
					user_name: '',
				},
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				//编辑界面数据
				editForm: {
					company_name:'',
					area:[],
					customer_type:'',
					company_industry:'',
					robot_number:'',
					pay_time:'',
					customer_clues:'',
					// business_itself:'',
					number_pay_money:'',
					// start_date:'',
					// end_date:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					cost_interval:'',
					robot_pay_money:'',
					pay_type:'',
					refunds:'',
					pay_voucher:'',
					del_pic:'',
					sales_name:'',
					customer_area:'',
					projects_type:'',
					process_making_money:'',
					all_received_money :'',
					cost_type:[],
					line_price:'',
					call_year_pay_money:'',
				},
				headers:{authorLoginId:JSON.parse(sessionStorage.getItem('user')).login_id},
				uploadUrl:'api/clouddo-crm/upload/uploadFile',
				fileList:[],
				editFileList:[],
				dialogImageUrl:'',
				previewDialogVisible:false,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
					area: [{ required: true, message: '请输入销售区域', trigger: 'blur' }],
					pay_time: [{ required: true, message: '请输入收款时间', trigger: 'blur' }],
					customer_type: [{ required: true, message: '请输入客户类型', trigger: 'blur' }],
					company_industry: [{ required: true, message: '请输入公司行业', trigger: 'blur' }],
					robot_number: rules.InterNum,
					customer_clues: [{ required: true, message: '请输入客户线索来源', trigger: 'blur' }],
					// number_pay_money: [{ required: true,validator:checkNumPot2, trigger: 'blur' }],
					number_pay_money: rules.numPot2,
					call_customer_pay_money: [{ required: true, message: '请输入通信费客户自备线路', trigger: 'blur' }],
					call_card_pay_money: rules.numPot2,
					cost_interval: [{ required: true, message: '请输入通信费', trigger: 'blur' }],
					robot_pay_money: rules.numPot2,
					pay_type: [{ required: true, message: '请输入付款方式', trigger: 'blur' }],
					sales_name: [{ required: true, message: '请输入销售经理', trigger: 'blur' }],
					customer_area: [{ required: true, message: '请输入客户所在区域', trigger: 'blur' }],
					projects_type: [{ required: true, message: '请输入业务归属', trigger: 'blur' }],
					process_making_money: rules.numPot2,
					all_received_money : rules.numPot2,
					cost_type: [{ required: true, message: '请输入费用属性', trigger: 'blur' }],
					line_price: rules.numPot2,
					call_year_pay_money: rules.numPot2,
					// refunds: [{ required: true, message: '请输入是否返款', trigger: 'blur' }],
					// pay_voucher: [{ required: true, message: '请输入打款凭证', trigger: 'blur' }],

				},
				//新增界面数据
				addForm: {
					id:'',
					company_name:'',
					area:[],
					pay_time:'',
					customer_type:'',
					company_industry:'',
					robot_number:'',
					customer_clues:'',
					// business_itself:'',
					number_pay_money:'',
					// start_date:'',
					// end_date:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					cost_interval:'',
					robot_pay_money:'',
					pay_type:'',
					refunds:'',
					pay_voucher:'',
					sales_name:'',
					customer_area:'',
					projects_type:'',
					process_making_money:'',
					all_received_money :'',
					cost_type:[],
					line_price:'',
					call_year_pay_money:'',
				},
				delFiles:[],
				role_id:'',
				options1:[],
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
					company_name: this.filters.company_name,
					user_name: this.filters.user_name,
				};
				this.listLoading = true;
				getCompanyCollectionByParam(data).then((res) => {
					this.total = res.result.records;
					// this.list = res.result.data;
					this.list=res.result.data.map(item=>{
						if(item.pay_voucher){
							item.pay_voucher=item.pay_voucher.split(',');
						};
						return item;
					})
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
			//提交审核
			auditSubmit(row){
				const data={
					type:'1',
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
					type:'1',
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
					deleteCompanyCollectionById(data).then((res) => {
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
				if(typeof this.editForm.area==='string'){
					this.editForm.area=this.editForm.area.split('/')
				}
				if(typeof this.editForm.customer_area==='string'){
					this.editForm.customer_area=this.editForm.customer_area.split('/')
				}
				if(typeof this.editForm.cost_type==='string'){
					this.editForm.cost_type=this.editForm.cost_type.split(',')
				}
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
					company_name:'',
					area:[],
					pay_time:'',
					customer_type:'',
					company_industry:'',
					robot_number:'',
					customer_clues:'',
					// business_itself:'',
					number_pay_money:'',
					// start_date:'',
					// end_date:'',
					call_customer_pay_money:'',
					call_card_pay_money:'',
					cost_interval:'',
					sales_name:'',
					customer_area:'',
					projects_type:'',
					process_making_money:'',
					all_received_money :'',
					cost_type:[],
					line_price:'',
					call_year_pay_money:'',
				};
				this.fileList=[];
				this.getCityById();
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						// console.log(this.editForm.pay_voucher);
						if(this.editForm.pay_voucher instanceof Array){
							this.editForm.pay_voucher=this.editForm.pay_voucher.join(',');
						};
						this.editForm.area=this.editForm.area.join('/');
						this.editForm.customer_area=this.editForm.customer_area.join('/');
						const data = Object.assign({}, this.editForm);
						updateCompanyCollectionById(data).then((res) => {
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
						this.addForm.customer_area=this.addForm.customer_area.join('/');
						this.addForm.cost_type=this.addForm.cost_type.join(',');
						const data = Object.assign({}, this.addForm);
						insertCompanyCollection(data).then((res) => {
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
				uploadGatheringByParam(data).then(res=>{
					var aDom = document.createElement('a');
					var evt = document.createEvent('HTMLEvents');
					evt.initEvent('click', false, false);
					aDom.download = true;
					aDom.href = res.result;
					aDom.dispatchEvent(evt);
					aDom.click();
				})
			},
			getCityById(){
				getCityById({}).then(res=>{
					this.options1=res.result.map(item=>{
						this.$set(item,'cities',[]);
						return item
					});
				})
			},
			handleItemChange(val){
				let value = val[0];
				getCityById({id:value}).then(res=>{
					let cities =  res.result ;
					for (let i = 0; i < this.options1.length; i++) {
						let current=this.options1[i];
						if(current.id==value){
							this.$set(this.options1[i],'cities',cities)
							break;
						}
						
					}
				})
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