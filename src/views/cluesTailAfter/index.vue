<template>
	<section>
		<!-- <el-col :span="24" class="toolbar mytoolbar" style="padding-bottom:0px;margin-top:0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.feed1" placeholder="第一次反馈"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input size="small" clearable v-model="filters.feed3" placeholder="第三次反馈"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getTableList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->
    <el-col style="margin-bottom:20px;"></el-col>
		<!--列表-->
		<el-table :data="list" border highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="state" label="状态" width="100">
				<template slot-scope="scope">
          <el-button type="danger" size="small" plain v-if="scope.row.state==1">失败</el-button>
					<el-button type="primary" size="small" plain v-if="scope.row.state==2">跟进</el-button>
					<el-button type="success" size="small" plain v-if="scope.row.state==3">成交</el-button>
				</template>
			</el-table-column>
      <el-table-column prop="feed1" label="第一次反馈" show-overflow-tooltip>
			</el-table-column>
      <el-table-column prop="feed2" label="第二次反馈" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="feed3" label="第三次反馈" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="result" label="线索结果" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="remark" label="备注" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="180">
				<template slot-scope="scope">
					<el-button size="small" @click="handleDetail(scope.$index, scope.row)">查看详情</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<!-- <el-button v-if="role_id==='4'" type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
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
			<el-form :model="editForm" label-width="120px" ref="editForm">
				<div class="flex">
					<el-form-item label="第一次反馈" prop="feed1">
						<el-input v-model="editForm.feed1" clearable auto-complete="off"></el-input>
					</el-form-item>
          <el-form-item label="第二次反馈" prop="feed2">
						<el-input v-model="editForm.feed2" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="第三次反馈" prop="feed3">
						<el-input v-model="editForm.feed3" clearable auto-complete="off"></el-input>
					</el-form-item>
          <el-form-item label="状态" prop="state">
						<el-select v-model="editForm.state">
							<el-option label="未处理" value="1"></el-option>
							<el-option label="已分配" value="2"></el-option>
							<el-option label="重新分配" value="3"></el-option>
						</el-select>
					</el-form-item>
				</div>
        <div class="flex">
          <el-form-item label="线索结果" prop="result">
						<el-input v-model="editForm.result" clearable auto-complete="off"></el-input>
					</el-form-item>
          <el-form-item label="备注" prop="remark">
						<el-input v-model="editForm.remark" clearable auto-complete="off"></el-input>
					</el-form-item>
        </div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit">提交</el-button>
			</div>
		</el-dialog>

    <!--查看详情界面-->
		<el-dialog title="详情" @close="editDialogClose" :visible.sync="detailFormVisible" :close-on-click-modal="false">
			<el-form :model="detailForm" label-width="120px" ref="editForm">
				<div class="flex">
					<el-form-item label="客户名称" prop="content">
						<el-input disabled v-model="detailForm.content" clearable auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="联系方式" prop="contract">
						<el-input disabled v-model="detailForm.contract" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
					<el-form-item label="联系方式类型" prop="contract_type">
						<el-select disabled v-model="detailForm.contract_type">
							<el-option label="电话" value="1"></el-option>
              <el-option label="微信" value="2"></el-option>
              <el-option label="qq" value="3"></el-option>
              <el-option label="邮箱" value="4"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="业务类型" prop="type">
						<el-select disabled v-model="detailForm.type">
							<el-option label="小水总机" value="0"></el-option>
							<el-option label="小水智能" value="1"></el-option>
							<el-option label="语音PAAS" value="2"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="flex">
          <el-form-item label="销售区域" prop="area">
						<area-cascader v-if="showArea" disabled v-model="detailForm.area" :level="0" type="text" :data="pcaa"></area-cascader>
					</el-form-item>
					<el-form-item label="对话内容" prop="content">
						<el-input disabled v-model="detailForm.content" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
				<div class="flex">
          <el-form-item label="客户渠道" prop="channel">
						<el-select disabled v-model="detailForm.channel">
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
					<el-form-item label="关键词" prop="content_key">
						<el-input disabled v-model="detailForm.content_key" clearable auto-complete="off"></el-input>
					</el-form-item>
				</div>
        <div class="flex">
          <el-form-item label="状态" prop="state">
						<el-select disabled v-model="detailForm.state">
							<el-option label="未处理" value="1"></el-option>
							<el-option label="已分配" value="2"></el-option>
							<el-option label="重新分配" value="3"></el-option>
						</el-select>
					</el-form-item>
        </div>
			</el-form>
		</el-dialog>
	</section>
</template>

<script>
	const Base64 = require('js-base64').Base64;
  import { getSalesClueByParam, 
           insertSalesClue, 
           updateSalesClueById, 
           deleteSalesClueById,
           getClueById } from '../../api/api';
  import rules from '@/common/js/rule';
  import { pca, pcaa } from 'area-data';
	export default {
		data() {
			return {
				// filters: {
				// 	feed1: '',
				// 	feed3: '',
				// },
				role_id:'',
				list: [],
				total: 0,
				page: 1,
				listLoading: false,
        editFormVisible: false,//编辑界面是否显示
        detailFormVisible:false,
				editLoading: false,
				//编辑界面数据
				editForm: {
					result:'',
					feed1:'',
					feed2:'',
          feed3:'',
          state:'',
          remark:''
        },
        detailForm:{},
        showArea:false,
        pca: pca,
				pcaa: pcaa,
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
				};
				this.listLoading = true;
				getSalesClueByParam(data).then((res) => {
					this.total = res.result.records;
					this.list = res.result.data;
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
					deleteSalesClueById(data).then((res) => {
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
				if(typeof this.editForm.feed2==='string'){
					this.editForm.feed2=this.editForm.feed2.split('/')
				}
			},
			//显示新增界面
			handleAdd() {
				this.addFormVisible = true;
				this.addForm = {
					result:'',
					feed1:'',
					contract_type:'',
					type:'',
					feed2:'',
					result:'',
					customer_address:'',
					feed3:'',
					state:'',
				};
			},
			//编辑
			editSubmit() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.editLoading = true;
						this.editForm.feed2=this.editForm.feed2.join('/');
						const data = Object.assign({}, this.editForm);
						updateSalesClueById(data).then((res) => {
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
						this.addForm.feed2=this.addForm.feed2.join('/');
						const data = Object.assign({}, this.addForm);
						insertSalesClue(data).then((res) => {
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
      //查看详情
      handleDetail(index,row){
        const data={ id : row.clue_id };
        getClueById(data).then(res=>{
          this.detailForm=res.result[0];
          this.detailForm.area=res.result[0].area?res.result[0].area.split('/'):[];
          this.detailFormVisible=true;
          this.showArea=true;
        })
      },
			editDialogClose(){
				this.showArea=false;
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
	justify-feed2: space-between;
}
.downloadTemplate{
	font-size: 12px;
	color: #409EFF;
	cursor: pointer;
}
.flexEnd{
	display: flex;
	flex-direction: row;
	justify-feed2: flex-end;
	
}
.mytoolbar .feed2-select.large{
	margin-top: 5px;
	width: 162px;
	height: 30px;
}
.mytoolbar .feed2-select .feed2-selected-trigger{
	font-size: 14px;
	line-height: 32px;
	height: 32px;
	color: #bbb;
}
</style>