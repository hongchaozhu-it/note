<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.keyword" placeholder="关键字" size="small"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getTableData" icon="el-icon-search" size="small">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success"  icon="el-icon-plus" size="small"  v-on:click="add">新增活动</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="活动名" width="200" >
			</el-table-column>
			<el-table-column prop="beginTimeStr" label="开始时间" sortable>
			</el-table-column>
			<el-table-column prop="endTimeStr" label="结束时间" >
			</el-table-column>
			<el-table-column prop="timeStr" label="时间段" >
			</el-table-column>
			<el-table-column prop="killStatus" label="状态" :formatter="formatStatus" sortable width="80">
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small" @click="edit( scope.row)" icon="el-icon-edit" type="primary">编辑</el-button>
<!--					<el-button size="small" @click="edit( scope.row)" icon="el-icon-edit">取消发布</el-button>-->
					<el-button type="danger" size="small" @click="del( scope.row)" icon="el-icon-close">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" icon="el-icon-close">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="selectPage" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="活动名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="秒杀时间"  >
					<el-date-picker  style="width: 290px" prop="beginTime"
									 v-model="addForm.beginTime"
									 type="datetime"
									 value-format="yyyy-MM-dd HH:mm:ss"
									 size="small"
									 placeholder="秒杀开始时间">
					</el-date-picker> -
					<el-date-picker   style="width: 295px" prop="endTime"
									  v-model="addForm.endTime"
									  type="datetime"
									  value-format="yyyy-MM-dd HH:mm:ss"
									  size="small"
									  placeholder="秒杀技术时间">
					</el-date-picker>
				</el-form-item >
<!--				<el-form-item label="发布方式">-->
<!--					<el-switch-->
<!--							v-model="addForm.publish"-->
<!--							active-text="立即发布"-->
<!--							inactive-text="定时发布">-->
<!--					</el-switch>-->
<!--					<br/>默认为定时发布，每天晚上发布近2天即将开秒的课程，或者选择立即发布-->
<!--				</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false" icon="el-icon-close">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading" icon="el-icon-check">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	export default {
		data() {
			return {
				//start 表格相关========================================================================================
				filters: {
					name: ''
				},
				tableData: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],
				//start 添加相关========================================================================================
				addFormVisible: false,
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					beginTime:"",
					endTime:""
				}

			}
		},
		methods: {
			//start 表格相关============================================================================================
			selsChange: function (sels) {
				this.sels = sels;
			},
			//性别显示转换
			formatStatus: function (row, column) {
				return row.publishStatus == 1 ? '已发布' : row.publishStatus == 0 ? '未发布' : '下架';
			},
			selectPage(val) {
				this.page = val;
				this.getTableData();
			},
			//获取用户列表
			getTableData() {
				this.listLoading = true;
				let para = {
					page: this.page,
					keyword: this.filters.keyword
				};
				this.$http.post("/kill/killActivity/pagelist",para).then(result=>{
					let {success , data, message ,code} = result.data;
					if(success){
						this.total = data.total;
						this.tableData = data.rows;
					}else{
						this.$message({ message: "数据加载失败["+message+"]", type: 'error' });
					}
					this.listLoading = false;
				}).catch(error => {
					this.listLoading = false;
					this.$message({ message: "数据加载失败["+error.message+"]", type: 'error' });
				})
			},

			//start: 基础CRUD功能=======================================================================================
			//显示新增界面
			add: function () {
				this.addFormVisible = true;
				for(let p in this.addForm){
					this.addForm[p] = '';f
				}
				this.addForm.sex = -1;
				this.addForm.age = 0;
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.listLoading = true;
							this.$http.post("/kill/killActivity/save",this.addForm).then(result=>{
								let {success , data, message ,code} = result.data;
								if(success){
									this.$message({ message: "提交成功", type: 'success' });
									this.addFormVisible = false;
									this.getTableData();
								}else{
									this.$message({ message: "数据加载失败["+message+"]", type: 'error' });
								}
								this.listLoading = false;
							}).catch(error => {
								this.listLoading = false;
								this.$message({ message: "数据加载失败["+error.message+"]", type: 'error' });
							})
						});
					}
				});
			},

		},
		mounted() {
			this.getTableData();
		}
	}

</script>

<style scoped>

</style>