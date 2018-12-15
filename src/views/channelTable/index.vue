<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input size="small" clearable v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" v-on:click="getChannelList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="prefix" label="前缀">
			</el-table-column>
			<el-table-column prop="level" label="级别">
			</el-table-column>
			<el-table-column prop="distance" label="市话长途" width="100">
			</el-table-column>
			<el-table-column prop="belong" label="业务归属" width="100">
			</el-table-column>
			<el-table-column prop="number" label="号码" width="100">
			</el-table-column>
			<el-table-column prop="address" label="地区" width="100">
			</el-table-column>
			<el-table-column prop="name" label="通道名称" width="100">
			</el-table-column>
			<el-table-column prop="business" label="业务" width="100">
			</el-table-column>
			<el-table-column prop="attribute" label="通道属性" width="100">
			</el-table-column>
			<el-table-column prop="start_date" label="开通时间" width="100">
			</el-table-column>
			<el-table-column prop="end_date" label="关停时间" width="100">
			</el-table-column>
			<el-table-column prop="communications_charges" label="通信资费" width="100">
			</el-table-column>
			<el-table-column prop="number_charges" label="号码费" width="100">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="150">
				<template slot-scope="scope">
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
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="通道名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通道前缀" prop="prefix">
					<el-input v-model="editForm.prefix" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="级别">
					<el-input v-model="editForm.level" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="市话长途">
					<el-input v-model="editForm.distance" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务归属">
					<el-input v-model="editForm.belong" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码">
					<el-input v-model="editForm.number" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地区">
					<el-input v-model="editForm.address" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务">
					<el-input v-model="editForm.business" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通道属性">
					<el-input v-model="editForm.attribute" auto-complete="off"></el-input>
				</el-form-item>
				<div class="flex">
					<el-form-item label="开始时间">
						<el-date-picker v-model="editForm.start_date" @change="getEditSTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间">
						<el-date-picker v-model="editForm.end_date"  @change="getEditETime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div>
				<el-form-item label="通信费">
					<el-input v-model="editForm.charges" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通信资费">
					<el-input v-model="editForm.communications_charges" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码费">
					<el-input v-model="editForm.number_charges" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="通道名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通道前缀" prop="prefix">
					<el-input v-model="addForm.prefix" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="级别">
					<el-input v-model="addForm.level" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="市话长途">
					<el-input v-model="addForm.distance" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务归属">
					<el-input v-model="addForm.belong" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码">
					<el-input v-model="addForm.number" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地区">
					<el-input v-model="addForm.address" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="业务">
					<el-input v-model="addForm.business" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通道属性">
					<el-input v-model="addForm.attribute" auto-complete="off"></el-input>
				</el-form-item>
				<div class="flex">
					<el-form-item label="开始时间">
						<el-date-picker v-model="addForm.start_date" @change="getSTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="关停时间">
						<el-date-picker v-model="addForm.end_date"  @change="getETime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间">
						</el-date-picker>
					</el-form-item>
				</div>
				<el-form-item label="通信费">
					<el-input v-model="addForm.charges" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="通信资费">
					<el-input v-model="addForm.communications_charges" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="号码费">
					<el-input v-model="addForm.number_charges" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getChannelByParam, insertChannel, updateChannelById, deleteChannelById} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
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
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					prefix: [
						{ required: true, message: '请输入前缀', trigger: 'blur' }
					],

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
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getChannelList();
			},
			//获取通道列表
			getChannelList() {
				const data = {
					page: this.page,
					rows:10,
					name: this.filters.name
				};
				this.listLoading = true;
				getChannelByParam(data).then((res) => {
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
					deleteChannelById(data).then((res) => {
						this.listLoading = false;
						this.$message({
							message: res.errMsg,
							type: 'success'
						});
						this.getChannelList();
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
				this.editLoading = true;
				const data = Object.assign({}, this.editForm);
				updateChannelById(data).then((res) => {
					this.editLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['editForm'].resetFields();
					this.editFormVisible = false;
					this.getChannelList();
				});
			},
			//新增
			addSubmit() {
				this.addLoading = true;
				const data = Object.assign({}, this.addForm);
				insertChannel(data).then((res) => {
					this.addLoading = false;
					this.$message({
						message: res.errMsg,
						type: 'success'
					});
					this.$refs['addForm'].resetFields();
					this.addFormVisible = false;
					this.getChannelList();
				});
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
			}
		},
		mounted() {
			this.getChannelList();
		}
	}

</script>

<style scoped>
.flex{
	display: flex;
	flex-direction: row;
}
</style>