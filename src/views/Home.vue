<template>
	<el-row class="home-container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				<!-- {{collapsed?'':sysName}} -->
				<div v-if="!collapsed">
					<img src="../assets/logo.png" alt="">
				</div>
			</el-col>
			<el-col :span="1">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="6">
				<span class="title">运营部管理系统</span>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-badge :is-dot="hasBacklog" class="badge">
					<i class="message el-icon-message" @click="goBacklog"></i>
				</el-badge>
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">您好, {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="goBacklog">待办事项</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in menu" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
							<el-menu-item style="min-width:160px" v-for="child in item.children" :index="child.url" :key="child.url" v-if="!child.hidden"><i :class="child.icon"></i>{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf" :index="item.url"><i :class="item.icon"></i>{{item.name}}</el-menu-item>
					</template>
				</el-menu>
				<!-- 导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in menu" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.icon"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.url" class="el-menu-item" :class="$route.path==child.url?'is-active':''" @click="$router.push(child.url)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title" :class="$route.path==item.url?'is-active':''" @click="$router.push(item.url)"><i :class="item.icon"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<!-- <strong class="title">{{$route.name}}</strong> -->
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
import { getProcessByParam } from '../api/api';
	export default {
		data() {
			return {
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				menu:[],
				hasBacklog:false
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//获取是否有待办事项
			isBacklog(){
				const data={
					page:1,
					rows:10,
					role_id:JSON.parse(sessionStorage.getItem('user')).role_id,
					state:'0'
				};
				getProcessByParam(data).then(res=>{
					if(res.result){
						if(res.result.records==0){
							this.hasBacklog=false;
						}else{
							this.hasBacklog=true;
						}
					}
				})
			},
			//待办事项
			goBacklog(){
				this.$router.push('/backlog')
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					sessionStorage.removeItem('menu');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {
			this.menu =JSON.parse(sessionStorage.getItem('menu'));
			let user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.user_name || '';
			}
			this.isBacklog();
		}
	}

</script>

<style lang="scss">
	@import '~scss_vars';
	
	.home-container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.badge{
				cursor: pointer;
				margin-right: 40px;
				.message{
					font-size: 20px;
				}
				.el-badge__content.is-fixed{
					top: 20px;
					right: 5px;
				}
			} 
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					// width: 40px;
					// float: left;
					// margin: 10px 10px 10px 18px;
					width: 100%;
					height: 30px;
					margin-top: 15px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:160px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
			.title{
				font-size: 17px;
				font-weight: 500;
				letter-spacing: 2px;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside::-webkit-scrollbar {
				display: none;
			}
			aside {
				flex:0 0 160px;
				width: 160px;
				overflow-x: hidden;
        overflow-y: auto;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 160px;
				width: 160px;
				.el-menu.el-menu-vertical-demo{
					width: 100%!important;
					background: #f2f2f2;
				}
				.el-menu.el-menu--inline{
					background: #f2f2f2;
				}
				.el-menu-item:focus, 
				.el-menu-item:hover,
				.el-submenu__title:hover{
					background: #eee;
				}
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 160px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>