<template>
  <div>
    <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleAddOne">新增</el-button>
        </el-form-item>
      </el-form>
		</el-col>
    <zk-table ref="table"  
              sum-text="sum"
              index-text="序号" 
              :data="data" 
              :columns="columns"
              :stripe="true" 
              :border="true" 
              :show-header="true"
              :show-summary="false" 
              :show-row-hover="true"
              :show-index="true" 
              :tree-type="true"
              :is-fold="true" 
              :expand-type="false"
              :selection-type="false">
      <template slot="type" slot-scope="scope">
        <el-tag type="success" v-if="scope.row.type == 0">目录</el-tag>
        <el-tag type="success" v-if="scope.row.type == 1">菜单</el-tag>
      </template>
      <template slot="handle" slot-scope="scope">
        <el-button type="primary" size="small" @click="handleAdd(scope.$index, scope.row)">新增</el-button>
        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button type="danger" size="small"  @click="handleDel(scope.$index, scope.row)">删除</el-button>
      </template>
   </zk-table>
   <!--新增一级菜单-->
		<el-dialog title="新增" :visible.sync="addOneFormVisible" :close-on-click-modal="false">
			<el-form :model="addOneForm" label-width="80px" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addOneForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路径" prop="url">
					<el-input v-model="addOneForm.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="addOneForm.type">
						<el-radio class="radio" label="1">菜单</el-radio>
						<el-radio class="radio" label="0">目录</el-radio>
					</el-radio-group>
				</el-form-item>
        <el-form-item label="图标" prop="url">
					<el-input v-model="addOneForm.icon" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="序号" prop="order_num">
					<el-input v-model="addOneForm.order_num" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addOneFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addOneSubmit" >提交</el-button>
			</div>
		</el-dialog>
   <!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路径" prop="url">
					<el-input v-model="editForm.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="editForm.type">
						<el-radio class="radio" label="1">菜单</el-radio>
						<el-radio class="radio" label="0">目录</el-radio>
					</el-radio-group>
				</el-form-item>
        <el-form-item label="图标" prop="url">
					<el-input v-model="editForm.icon" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="序号" prop="order_num">
					<el-input v-model="editForm.order_num" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" >提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="路径" prop="url">
					<el-input v-model="addForm.url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="addForm.type">
						<el-radio class="radio" label="1">菜单</el-radio>
						<el-radio class="radio" label="0">目录</el-radio>
					</el-radio-group>
				</el-form-item>
        <el-form-item label="图标" prop="url">
					<el-input v-model="addForm.icon" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="序号" prop="order_num">
					<el-input v-model="addForm.order_num" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
  import { getMenuList, insertMenu, updateMenuById, deleteMenuById } from '@/api/api';
  export default {
    name: 'example',
    data() {
      return {
        idArr:"",
        props: {
          stripe: false, //间隔斑马纹是否显示
          border: false, //是否显示边框
          showHeader: true,//是否显示表头
          showSummary: false,//是否显示表格尾合计行
          showRowHover: true,//鼠标悬停时，是否高亮当前行
          showIndex: false,//是否显示数据索引
          treeType: true,//是否为树形表格 此为关键
          isFold: true, //树形表格中父级是否默认折叠
          expandType: false, //是否为展开行类型表格（为 True 时，需要添加作用域插槽, 它可以获取到 row, rowIndex)
          selectionType: false,//是否显示间隔斑马纹
        },
        //表格数据
        data:[],
        //table Header 显示字段
        columns: [ 
          {
            label: '名称',
            prop: 'name',
            width: '300px',
          },
          {
            label: '路径',
            prop: 'url',
            minWidth: '50px',
          },
          {
            label: '类型',
            prop: 'type',
            type: 'template',
            template: 'type'
          },
          {
            label: '操作',
            prop: 'handle',
            minWidth: '60px',
            type: 'template',
            template: 'handle',
          },
        ],
        addOneFormVisible:false,
        editFormVisible: false,
        addFormVisible: false,
        addLoading: false,
        editLoading: false,
        addOneForm:{
          name:'',
          url:'',
          type:'',
          icon:'',
          order_num:''
        },
        editForm:{
          name:'',
          url:'',
          type:'',
          icon:'',
          order_num:''
        },
        addForm:{
          name:'',
          url:'',
          type:'',
          icon:'',
          order_num:''
        },
        addId:''
      };
    },
    computed: {
      propList() {
        return Object.keys(this.props).map(item => ({
          name: item,
        }));
      },
    },
    mounted(){
      this.getMenuList();
    },
    methods: {
      //获取菜单列表
      getMenuList(){
        const data={};
        getMenuList(data).then(res=>{
          if(res.result && res.result.data.length>0){
            this.data=res.result.data.sort(this.createCompare('order_num'));
          }
        })
      },
      createCompare(property){
        return function(a,b){
          var value1 = a[property];
          var value2 = b[property];
          return value1-value2;
        }
      },
      //新增一级菜单显示
      handleAddOne(){
        this.addOneForm={
          name:'',
          url:'',
          type:'',
          icon:''
        };
        this.addOneFormVisible=true;
      },
      //新增一级菜单提交
      addOneSubmit(){
        const data=Object.assign({},this.addOneForm);
        insertMenu(data).then(res=>{
          this.$message({ message: res.errMsg, type: 'success' });
          this.addOneFormVisible=false;
          this.getMenuList();
        })
      },
      //显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        this.editForm.type=Number(this.editForm.type)
      },
      //编辑
			editSubmit() {
        this.editLoading = true;
        const data=Object.assign({},this.editForm)
        updateMenuById(data).then((res) => {
          this.editLoading = false;
          this.$message({
            message: res.errMsg,
            type: 'success'
          });
          this.editFormVisible = false;
          this.getMenuList();
        });
			},
			//显示新增界面
			handleAdd(index,row) {
        this.addFormVisible = true;
        this.addId=row.id;
				this.addForm = {
					name:'',
          url:'',
          type:'',
          icon:''
				};
			},
			//新增
			addSubmit() {
        this.addLoading = true;
        const data=Object.assign({parent_id:this.addId},this.addForm)
        insertMenu(data).then((res) => {
          this.addLoading = false;
          this.$message({
            message: res.errMsg,
            type: 'success'
          });
          this.addFormVisible = false;
          this.getMenuList();
        });
      },
      //删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					const data = { id: row.id};
					deleteMenuById(data).then((res) => {
						this.$message({
							message: res.errMsg,
							type: 'success'
						});
						this.getMenuList();
					});
				}).catch(() => {

				});
			},
    }
  };
</script>

<style scoped>

</style>