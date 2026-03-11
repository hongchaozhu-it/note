<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.keyword" placeholder="关键字" size="small"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getTableData" icon="el-icon-search" size="small">执行查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  icon="el-icon-plus" size="small"  v-on:click="addTeacher" >讲师新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column  label="头像">
				<template scope="scope">
					<el-image style="width: 40px;height: 40px"
							:src="scope.row.headImg"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="名称" >
			</el-table-column>
			<el-table-column prop="position" label="职位"  >
			</el-table-column>
			<el-table-column prop="tags" label="标签"  >
			</el-table-column>
			<el-table-column prop="intro" label="介绍" width="200" >
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top" >
						<div style="width: 400px;">{{ scope.row.intro }}</div>
						<div slot="reference" class="name-wrapper" >
							<el-tag >
								{{ scope.row.intro }}
							</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small"  @click="edit(scope.row)" icon="el-icon-edit" type="primary">编辑</el-button>
					<el-button type="danger" size="small" @click="del(scope.row)" icon="el-icon-remove">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" icon="el-icon-remove" size="small">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


	</section>
</template>

<script>

	export default {
		data() {
			return {
				filters: {
					keyword: ''
				},
				tableData: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels:[]
			}

		},
		methods: {
			selsChange(sels){
				this.sels = sels;
			},
			//性别显示转换
			formatState: function (row, column) {
				return row.sex == 1 ? '禁用' : '启用';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getTableData();
			},
			//获取用户列表
			getTableData() {
				let para = {
					page: this.page,
					keyword: this.filters.keyword
				};
				this.listLoading = true; //显示加载圈
				this.$http.post("/course/teacher/pagelist",para).then(result=>{
					this.total = result.data.total;
					this.tableData = result.data.data.rows;
					this.listLoading = false;  //关闭加载圈
				});
			},
			edit(){
				this.$message({ message: "功能未开放", type: 'error' });
			},
			del(){
				this.$message({ message: "功能未开放", type: 'error' });
			},
			batchRemove(){
				this.$message({ message: "功能未开放", type: 'error' });
			},
			addTeacher(){
				this.$message({ message: "功能未开放", type: 'error' });
			}

		},
		mounted() {
			this.getTableData();
		}
	}

</script>

<style scoped>

</style>