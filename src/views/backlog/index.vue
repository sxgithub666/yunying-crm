<template>
	<div>
		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" v-model="filters.user_name" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" v-on:click="getTableList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->
		<div style="padding-bottom:20px"></div>
		<!--列表-->
		<el-table :data="users" border	highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="type" label="类型" sortable>
        <template slot-scope="scope">
					<span v-if="scope.row.type==0">通道信息</span>
					<span v-if="scope.row.type==1">收款信息</span>
					<span v-if="scope.row.type==2">合同与发票</span>
					<span v-if="scope.row.type==3">小水智能</span>
					<span v-if="scope.row.type==4">总机/Paas</span>
					<span v-if="scope.row.type==5">客户信息</span>
				</template>
			</el-table-column>
			<el-table-column prop="state" label="状态" sortable>
        <template slot-scope="scope">
					<el-button type="info" size="small" plain v-if="scope.row.state==0">未审核</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.state==1">转发中</el-button>
					<el-button type="danger" size="small" plain v-if="scope.row.state==3">审核拒绝</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.state==2">审核通过</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="redirect_1" label="一级审核人" sortable>
				<template slot-scope="scope">
					<span v-if="scope.row.redirect_1=='0'">销售</span>
					<span v-if="scope.row.redirect_1=='1'">产品</span>
					<span v-if="scope.row.redirect_1=='2'">财务</span>
					<span v-if="scope.row.redirect_1=='3'">运营</span>
					<span v-if="scope.row.redirect_1=='4'">超级管理员</span>
					<span v-if="scope.row.redirect_1=='5'">客服</span>
				</template>
			</el-table-column>
			<el-table-column prop="redirect_2" label="二级审核人" sortable>
				<template slot-scope="scope">
					<span v-if="scope.row.redirect_2=='0'">销售</span>
					<span v-if="scope.row.redirect_2=='1'">产品</span>
					<span v-if="scope.row.redirect_2=='2'">财务</span>
					<span v-if="scope.row.redirect_2=='3'">运营</span>
					<span v-if="scope.row.redirect_2=='4'">超级管理员</span>
					<span v-if="scope.row.redirect_2=='5'">客服</span>
				</template>
			</el-table-column>
			<el-table-column prop="redirect_3" label="三级审核人" sortable>
				<template slot-scope="scope">
					<span v-if="scope.row.redirect_3=='0'">销售</span>
					<span v-if="scope.row.redirect_3=='1'">产品</span>
					<span v-if="scope.row.redirect_3=='2'">财务</span>
					<span v-if="scope.row.redirect_3=='3'">运营</span>
					<span v-if="scope.row.redirect_3=='4'">超级管理员</span>
					<span v-if="scope.row.redirect_3=='5'">客服</span>
				</template>
			</el-table-column>
			<el-table-column prop="user_name" label="提交人" sortable>
			</el-table-column>
			<el-table-column prop="remark" label="备注" sortable>
			</el-table-column>
			<el-table-column label="操作" width="260">
				<template slot-scope="scope">
					<el-button size="small" @click="viewDetails(scope.$index, scope.row)">查看</el-button>
					<el-button v-if="role_id!=='0'" size="small" @click="handleTranspond(scope.$index, scope.row)">转发</el-button>
					<el-button v-if="role_id!=='0'" type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar center">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="rows" :total="total">
			</el-pagination>
		</el-col>
		<!--转发-->
    <el-dialog title="转发" :visible.sync="transpondVisible" :close-on-click-modal="false">
			<el-form :model="transpondForm" label-width="80px" ref="addForm">
				<el-form-item label="角色" prop="role_id">
					<el-radio-group v-model="transpondForm.role_id">
						<el-radio  v-for="role in rolesList" :label="role.id" :key="role.id">
							{{role.role_name}}
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="transpondForm.remark" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="transpondVisible = false">取消</el-button>
				<el-button type="primary" @click.native="transpondSubmit">提交</el-button>
			</div>
		</el-dialog>
		<!--查看通道信息-->
		<el-dialog title="通道信息"  :visible.sync="channelVisible" :close-on-click-modal="false">
			<el-form :model="channelForm" label-width="100px">
				<div class="flex">
					<el-form-item label="通道名称" prop="name">
						<el-input disabled v-model="channelForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通道前缀" prop="prefix">
						<el-input disabled v-model="channelForm.prefix" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="级别" prop="level">
						<el-input disabled v-model="channelForm.level" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="市话长途" prop="distance">
						<el-input disabled v-model="channelForm.distance" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务归属" prop="belong">
						<el-input disabled v-model="channelForm.belong" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码" prop="number">
						<el-input disabled v-model="channelForm.number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="地区" prop="address">
						<el-input disabled v-model="channelForm.address" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="业务" prop="business">
						<el-input disabled v-model="channelForm.business" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="通道属性" prop="attribute">
						<el-input disabled v-model="channelForm.attribute" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费" prop="number_charges">
						<el-input disabled v-model="channelForm.number_charges" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="开始时间" prop="start_date">
						<el-date-picker disabled v-model="channelForm.start_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间" prop="end_date">
						<el-date-picker disabled v-model="channelForm.end_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="通信费" prop="charges">
						<el-input disabled v-model="channelForm.charges" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信资费" prop="communications_charges">
						<el-input disabled v-model="channelForm.communications_charges" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="是否开票" prop="invoice">
						<el-select disabled v-model="channelForm.invoice">
							<el-option label="已开票" value="1"></el-option>
							<el-option label="未开票" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发票类型" prop="invoice_type">
						<el-select disabled v-model="channelForm.invoice_type">
							<el-option label="普票" value="1"></el-option>
							<el-option label="专票" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-form-item label="税点" prop="tax_point">
					<el-input disabled v-model="channelForm.tax_point" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div v-if="role_id!=='0'" slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="approve('2')">审核通过</el-button>
				<el-button type="danger" @click.native="refused('3')">审核拒绝</el-button>
			</div>
		</el-dialog>
		<!--查看客户信息-->
		<el-dialog title="客户信息" :visible.sync="clientVisible" :close-on-click-modal="false">
			<el-form :model="clientForm" label-width="80px">
				<div class="flex">
					<el-form-item label="前缀" prop="prefix">
						<el-input disabled v-model="clientForm.prefix" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="客户名称" prop="customer_name">
						<el-input disabled v-model="clientForm.customer_name" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务归属">
						<el-input disabled v-model="clientForm.belong" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="行业">
						<el-input disabled v-model="clientForm.industry" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="号码费">
						<el-input disabled v-model="clientForm.number_charges" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="通信资费">
						<el-input disabled v-model="clientForm.charges" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="开始时间">
						<el-date-picker disabled v-model="clientForm.start_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间">
						<el-date-picker disabled v-model="clientForm.end_date" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div>
			</el-form>
			<div v-if="role_id!=='0'" slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="approve('2')">审核通过</el-button>
				<el-button type="danger" @click.native="refused('3')">审核拒绝</el-button>
			</div>
		</el-dialog>
		<!--查看收款信息--> 
		<el-dialog title="收款信息" :visible.sync="gatheringVisible" :close-on-click-modal="false">
			<el-form :model="gatheringForm" label-width="100px">
				<div class="flex">
					<el-form-item label="公司名称" prop="company_name">
						<el-input disabled v-model="gatheringForm.company_name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="销售区域" prop="area">
						<el-input disabled v-model="gatheringForm.area" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="号码费" prop="number_pay_money">
						<el-input disabled v-model="gatheringForm.number_pay_money" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="机器人费" prop="robot_pay_money">
						<el-input disabled v-model="gatheringForm.robot_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="公司行业" prop="company_industry">
						<el-input disabled v-model="gatheringForm.company_industry" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="机器人数量" prop="robot_number">
						<el-input disabled v-model="gatheringForm.robot_number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="付款方式" prop="pay_type">
						<el-select disabled v-model="gatheringForm.pay_type">
							<el-option label="对公" value="0"></el-option>
							<el-option label="对私" value="1"></el-option>
						</el-select>
						<!-- <el-input disabled v-model="gatheringForm.pay_type" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="通信费卡槽费" prop="call_card_pay_money">
						<el-input disabled v-model="gatheringForm.call_card_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间" prop="pay_time">
						<el-date-picker disabled v-model="gatheringForm.pay_time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="客户线索来源" prop="customer_clues">
						<el-select disabled v-model="gatheringForm.customer_clues">
							<el-option label="SEM" value="0"></el-option>
							<el-option label="公司" value="1"></el-option>
							<el-option label="商务本身" value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="通信费" prop="call_year_pay_money">
						<el-select disabled v-model="gatheringForm.call_year_pay_money">
							<el-option label="月付" value="0"></el-option>
							<el-option label="季付" value="1"></el-option>
							<el-option label="年付" value="2"></el-option>
							<el-option label="测试(XXX)" value="3"></el-option>
						</el-select>
						<!-- <el-input v-model="gatheringForm.call_year_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="客户类型" prop="customer_type">
						<el-select disabled v-model="gatheringForm.customer_type">
							<el-option label="直客" value="1"></el-option>
							<el-option label="渠道" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="客户自备线路" prop="call_customer_pay_money">
						<el-select disabled v-model="gatheringForm.call_customer_pay_money">
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
						<!-- <el-input v-model="gatheringForm.call_customer_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="是否返款" prop="refunds">
						<el-select disabled v-model="gatheringForm.refunds">
							<el-option label="已返款" value="1"></el-option>
							<el-option label="未返款" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
					<el-form-item label="打款凭证" prop="pay_voucher">
						<div class="editImg">
							<div class="item" v-for="(item,index) in gatheringFileList" :key="index">
								<img class="smallImg" :preview="index" :src="item" alt="">
							</div>
						</div>
						<!-- <el-input disabled v-model="gatheringForm.pay_voucher" auto-complete="off"></el-input> -->
					</el-form-item>
			</el-form>
			<div v-if="role_id!=='0'" slot="footer" class="dialog-footer">
			  <el-button type="primary" @click.native="approve('2')">审核通过</el-button>
				<el-button type="danger" @click.native="refused('3')">审核拒绝</el-button>
			</div>
		</el-dialog>
		<!--查看小水智能信息-->
		<el-dialog title="小水智能信息" :visible.sync="robotVisible" :close-on-click-modal="false">
			<el-form :model="robotForm" label-width="120px">
				<div class="flex">
					<el-form-item label="销售区域" prop="area">
						<el-input v-model="robotForm.area" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司全称" prop="company_name">
						<el-input v-model="robotForm.company_name" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间">
						<el-date-picker v-model="robotForm.pay_time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="客户类型">
						<el-select v-model="robotForm.customer_type">
							<el-option label="直客" value="1"></el-option>
							<el-option label="渠道" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="公司行业">
						<el-input v-model="robotForm.company_industry" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="机器人数量">
						<el-input v-model="robotForm.robot_number" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="线路并发数">
						<el-input v-model="robotForm.line_concurrency" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码费">
						<el-input v-model="robotForm.number_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="客户自备线路">
						<el-select v-model="robotForm.call_customer_pay_money">
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
						<!-- <el-input v-model="robotForm.call_customer_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="通信费卡槽费">
						<el-input v-model="robotForm.call_card_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="通信费">
						<el-select v-model="robotForm.call_year_pay_money">
							<el-option label="月付" value="0"></el-option>
							<el-option label="季付" value="1"></el-option>
							<el-option label="年付" value="2"></el-option>
							<el-option label="测试(XXX)" value="3"></el-option>
						</el-select>
						<!-- <el-input v-model="robotForm.call_year_pay_money" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="机器人费">
						<el-input v-model="robotForm.robot_pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
					<el-form-item label="备注">
						<el-input v-model="robotForm.remark" auto-complete="off"></el-input>
					</el-form-item>
			</el-form>
			<div v-if="role_id!=='0'" slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="approve('2')">审核通过</el-button>
				<el-button type="danger" @click.native="refused('3')">审核拒绝</el-button>
			</div>
		</el-dialog>
		<!--查看小水总机信息-->
		<el-dialog title="小水总机信息" :visible.sync="switchboardVisible" :close-on-click-modal="false">
			<el-form :model="switchboardForm" label-width="80px">
				<el-form-item label="销售区域" prop="area">
					<el-input v-model="switchboardForm.area" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="公司名称" prop="company_name">
					<el-input v-model="switchboardForm.company_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="收款时间">
					<el-date-picker v-model="switchboardForm.pay_time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="收款金额">
					<el-input v-model="switchboardForm.pay_money" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="公司行业">
					<el-input v-model="switchboardForm.company_industry" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码需求">
					<el-input v-model="switchboardForm.need_phonenumber" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务类型">
					<el-input v-model="switchboardForm.business_type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="付款方式">
					<el-select v-model="switchboardForm.pay_type">
						<el-option label="对公" value="0"></el-option>
						<el-option label="对私" value="1"></el-option>
					</el-select>
					<!-- <el-input v-model="switchboardForm.pay_type" auto-complete="off"></el-input> -->
				</el-form-item>
				<el-form-item label="客户所在区域">
					<el-input v-model="switchboardForm.customer_region" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否返款">
					<el-select v-model="switchboardForm.refunds">
						<el-option label="已返款" value="1"></el-option>
						<el-option label="未返款" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="打款凭证">
					<el-input v-model="switchboardForm.pay_voucher" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="申请号码所需材料">
					<el-input v-model="switchboardForm.need_data" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="switchboardForm.remark" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div v-if="role_id!=='0'" slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="approve('2')">审核通过</el-button>
				<el-button type="danger" @click.native="refused('3')">审核拒绝</el-button>
			</div>
		</el-dialog>
		<!--查看语音Pass信息-->
		<el-dialog title="总机Pass信息" :visible.sync="voicePassVisible" :close-on-click-modal="false">
			<el-form :model="voicePassForm" label-width="100px">
				<div class="flex">
					<el-form-item label="销售区域" prop="area">
						<el-input disabled v-model="voicePassForm.area" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="公司名称" prop="company_name">
						<el-input disabled v-model="voicePassForm.company_name" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="收款时间">
						<el-date-picker disabled v-model="voicePassForm.pay_time" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择收款日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="收款金额">
						<el-input disabled v-model="voicePassForm.pay_money" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="公司行业">
						<el-input disabled v-model="voicePassForm.company_industry" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="号码需求">
						<el-input disabled v-model="voicePassForm.need_phonenumber" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="业务类型">
						<el-input disabled v-model="voicePassForm.business_type" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="付款方式">
						<el-select disabled v-model="voicePassForm.pay_type">
							<el-option label="对公" value="0"></el-option>
							<el-option label="对私" value="1"></el-option>
						</el-select>
						<!-- <el-input disabled v-model="voicePassForm.pay_type" auto-complete="off"></el-input> -->
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="客户所在区域">
						<el-input disabled v-model="voicePassForm.customer_region" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="是否返款">
						<el-select disabled v-model="voicePassForm.refunds">
							<el-option label="已返款" value="1"></el-option>
							<el-option label="未返款" value="0"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="申请号码材料">
						<a :href="voicePassForm.need_data" download>
							<el-button v-if="voicePassForm.need_data" type="text" size="small">下载</el-button>
						</a>
						<!-- <el-input disabled v-model="voicePassForm.need_data" auto-complete="off"></el-input> -->
					</el-form-item>
					<el-form-item label="备注">
						<el-input disabled v-model="voicePassForm.remark" auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<el-form-item label="打款凭证">
					<div class="editImg">
						<div class="item" v-for="(item,index) in voicePassFileList" :key="index">
							<img class="smallImg" :preview="index" :src="item" alt="">
						</div>
					</div>
					<!-- <el-input disabled v-model="voicePassForm.pay_voucher" auto-complete="off"></el-input> -->
				</el-form-item>
			</el-form>
			<div v-if="role_id!=='0'" slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="approve('2')">审核通过</el-button>
				<el-button type="danger" @click.native="refused('3')">审核拒绝</el-button>
			</div>
		</el-dialog>
		<!--查看合同发票-->
		<el-dialog title="合同发票" :visible.sync="contractAndInvoiceVisible" :append-to-body="true" :close-on-click-modal="false">
			<el-form :model="contractAndInvoiceForm" label-width="130px">
				<el-form-item label="公司名称" prop="company_name">
					<el-input v-model="contractAndInvoiceForm.company_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否开票">
          <el-select v-model="contractAndInvoiceForm.invoice">
						<el-option label="已开票" value="1"></el-option>
						<el-option label="未开票" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="双方盖章扫描件">
					<div class="editImg">
						<div class="item" v-for="(item,index) in editFileList" :key="index">
							<img class="smallImg" :preview="index" :src="item" alt="">
							<!-- <img class="bigImg" :src="item" alt=""> -->
						</div>
					</div>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="contractAndInvoiceForm.remark" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div v-if="role_id!=='0'" slot="footer" class="dialog-footer">
				<el-button type="primary" @click.native="approve('2')">审核通过</el-button>
				<el-button type="danger" @click.native="refused('3')">审核拒绝</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import util from '@/common/js/util'
	import { getProcessByParam, 
					 deleteProcessById, 
					 updateProcessById, 
					 getRoleInfoByParam,
					 getChannelById,//通道信息
					 getCompanyCollectionById,//收款信息
					 getZjPaasProcessById,//总机、pass
					 getContractProcessById,//合同发票
					 getXsznProcessById,//小水智能
					 getCustomerById//客户信息
					 } from '@/api/api';

	export default {
		data() {
			return {
				filters: {
					user_name: '',
				},
				users: [],
				total: 0,
				page: 1,
				rows:10,
				listLoading: false,
        transpondVisible:false,
        role_id:'',
        rolesList:[],
        transpondForm:{
					login_id:'',
					redirect_1:'',
					id:'',
					state:'',
					type:'',
					login_id:'',
					type_id:'',
					redirect_2:'',
					redirect_3:'',
					remark:'',
				},
				channelVisible:false,
				clientVisible:false,
				robotVisible:false,
				switchboardVisible:false,
				voicePassVisible:false,
				gatheringVisible:false,
				contractAndInvoiceVisible:false,
				channelForm:{},
				clientForm:{},
				robotForm:{},
				switchboardForm:{},
				voicePassForm:{},
				gatheringForm:{},
				contractAndInvoiceForm:{},
				showDilagForm:{
					login_id:'',
					redirect_1:'',
					type_id:'',
					type:'',
					id:''
				},
				editFileList:[],
				voicePassFileList:[],
				gatheringFileList:[],
			}
		},
		mounted() {
			this.role_id=JSON.parse(sessionStorage.getItem('user')).role_id;
			this.getTableList();
			this.getRoleList();
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getTableList();
			},
			//获取角色列表
			getRoleList(){
				const data={
					page:1,
					rows:10
				}
				getRoleInfoByParam(data).then(res=>{
					this.rolesList = res.result.data;
				})
			},
			//获取用户列表
			getTableList() {
				let data = {
					page: this.page,
					rows: this.rows,
					role_id: this.role_id
				};
				this.listLoading = true;
				getProcessByParam(data).then((res) => {
					this.total = res.result.records;
					this.users = res.result.data;
					this.listLoading = false;
				});
			},
			//删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					const data = { id: row.id };
					deleteProcessById(data).then((res) => {
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
			//查看详情
			viewDetails(index,row){
				this.showDilagForm=Object.assign({},row);
        switch (row.type) {
					case '0':
						this.showChannel();
						break;
					case '1':
						this.showGathering();
						break;
					case '2':
						this.showContractAndInvoice();
						break;
					case '3':
						this.showRobot();
						break;
					case '4':
						this.showVoicePass();
						break;
					case '5':
						this.showClientTable();
						break;
					default:
						break;
				}
			},
			//通道信息
			showChannel(){
				getChannelById({id:this.showDilagForm.type_id}).then(res=>{
					this.channelForm=res.result[0];
					this.channelVisible=true;
				})
			},
			//收款信息
			showGathering(){
				getCompanyCollectionById({id:this.showDilagForm.type_id}).then(res=>{
					this.gatheringForm=res.result[0];
					if(this.gatheringForm.pay_voucher){
						this.gatheringFileList=this.gatheringForm.pay_voucher.split(',')
					};
					this.gatheringVisible=true;
				})
			},
			//合同发票
			showContractAndInvoice(){
				getContractProcessById({id:this.showDilagForm.type_id}).then(res=>{
					this.contractAndInvoiceForm=res.result[0];
					if(this.contractAndInvoiceForm.scan_file){
						this.editFileList=this.contractAndInvoiceForm.scan_file.split(',')
					}
					this.contractAndInvoiceVisible=true;
				})
			},
			//小水智能
			showRobot(){
				getXsznProcessById({id:this.showDilagForm.type_id}).then(res=>{
					this.robotForm=res.result[0];
					this.robotVisible=true;
				})
			},
			//语音pass
			showVoicePass(){
				getZjPaasProcessById({id:this.showDilagForm.type_id}).then(res=>{
					this.voicePassForm=res.result[0];
					if(this.voicePassForm.pay_voucher){
						this.voicePassFileList=this.voicePassForm.pay_voucher.split(',')
					};
					this.voicePassVisible=true;
				})
			},
			//客户信息
			showClientTable(){
				getCustomerById({id:this.showDilagForm.type_id}).then(res=>{
					this.clientForm=res.result[0];
					this.clientVisible=true;
				});
			},

			//审核通过
			approve(state){
				const data=Object.assign({},this.showDilagForm,{state:state});
				updateProcessById(data).then(res=>{
					switch (this.showDilagForm.type) {
					case '0':
						this.channelVisible=false;
						break;
					case '1':
						this.gatheringVisible=false;
						break;
					case '2':
						this.contractAndInvoiceVisible=false;
						break;
					case '3':
						this.robotVisible=false;
						break;
					case '4':
						this.voicePassVisible=false;
						break;
					case '5':
						this.clientVisible=false;
						break;
					default:
						break;
					};
					this.getTableList();
				})

			},
			//审核拒绝
			refused(state){
				const data=Object.assign({},this.showDilagForm,{state:state});
				updateProcessById(data).then(res=>{
					switch (this.showDilagForm.type) {
					case '0':
						this.channelVisible=false;
						break;
					case '1':
						this.gatheringVisible=false;
						break;
					case '2':
						this.contractAndInvoiceVisible=false;
						break;
					case '3':
						this.robotVisible=false;
						break;
					case '4':
						this.voicePassVisible=false;
						break;
					case '5':
						this.clientVisible=false;
						break;
					default:
						break;
					};
					this.getTableList();
				})
			},
      //转发
      handleTranspond(index,row){
        this.transpondForm=Object.assign({},row);
        this.transpondVisible=true;
      },
      //转发提交
      transpondSubmit(){
        if(this.transpondForm.redirect_2){
					this.transpondForm.redirect_3=this.transpondForm.role_id;
				}else{
					this.transpondForm.redirect_2=this.transpondForm.role_id;
				};
				const data=Object.assign({},this.transpondForm,{state:'1'});
				updateProcessById(data).then(res=>{
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.transpondVisible = false;
					this.getTableList();
				})
      }
		},
		
	}

</script>

<style scoped>
.checkbox{
  margin-left: 30px;
}
.flex{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.editImg{
	display: flex;
	width: 100%;
	height: 100px;
	
}
.editImg .item{
	width: 30%;
	margin-right: 10px;
}
.editImg .item .smallImg{
	width: 100%;
	height: 150px;
}
.el-radio{
	  margin-left: 30px;
    padding-bottom: 5px;
}
/* .editImg .item .smallImg:hover .editImg .item .bigImg{
	display: block;
}
.editImg .item .bigImg{
	width: 100%;
	height: 100%;
  display: none;
} */
</style>