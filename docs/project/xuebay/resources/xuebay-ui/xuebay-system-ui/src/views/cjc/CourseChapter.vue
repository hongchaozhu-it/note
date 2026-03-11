<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :model="filters" :inline="true">
				<el-form-item>
					<el-input v-model="filters.keyword" size="small" placeholder="课程名/章节名" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="warning"  v-on:click="getCoursesChapter"   size="small" icon="el-icon-search">章节查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="addHandler"  icon="el-icon-plus">新增章节</el-button>
				</el-form-item>

				<el-form-item>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表v-loading="listLoading"-->
		<el-table  :data="coursesChapter" v-loading="listLoading" @row-click="chapterRowSlect"  @selection-change="selsChange"
				  highlight-current-row  style="width: 100%;">
			<!--多选框-->
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!--索引值,为什么不用id,id不序号-->
			<el-table-column prop="courseName" label="课程名称">
			</el-table-column>
			<el-table-column prop="name" label="章节名称">
			</el-table-column>
			<!--<el-table-column prop="courseType.name" label="类型">-->
			<!--</el-table-column>-->

			<el-table-column prop="number" label="章节号">
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
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>


		<!--新增章节界面-->
		<el-dialog title="新增章节" :visible.sync="addFormVisible"  :close-on-click-modal="false" width="800px">
			<el-form :model="addForm" label-width="80px"  ref="addForm">
				<el-form-item label="章节名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属课程" prop="courseId">
					<el-input v-model="addForm.courseName" auto-complete="off"  style="width: 550px"></el-input>
					<el-button type="primary" @click="dialogTableVisible = true" icon="el-icon-search" >选择课程</el-button>
				</el-form-item>
<!--				<el-form-item label="第几章" prop="number">-->
<!--					<el-input v-model="addForm.number" min="1" type="number" auto-complete="off"></el-input>-->
<!--				</el-form-item>-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false"  icon="el-icon-remove">取消</el-button>
				<el-button type="primary" @click.native="addCourseChapter"  icon="el-icon-check" >提交</el-button>
			</div>
		</el-dialog>


		<!--新增界面-->
		<el-dialog title="选择课程" :visible.sync="dialogTableVisible"  :close-on-click-modal="false" width="800px">
			<el-form :model="courseAddForm" label-width="80px"  ref="dialogTableAddForm">
				<!--工具条-->
				<el-form-item label-width="0px" style="border-bottom: 1px solid #eeeeee;padding-bottom: 20px">
					<el-input v-model="courseAddForm.keyword" placeholder="搜索课程名" style="width: 200px" size="small"></el-input>
					<el-button type="warning" v-on:click="getCourses"  icon="el-icon-search" size="small">查询</el-button>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: red">搜索课程后加载数据，双击行进行选择</span>
				</el-form-item>

				<el-form-item label-width="0px">
					<el-table :data="courses" highlight-current-row  @row-dblclick="selectCourse">
						<el-table-column property="id" label="ID"  width="100"></el-table-column>
						<el-table-column property="name" label="课程" ></el-table-column>
						<el-table-column property="gradeName" label="等级"></el-table-column>
					</el-table>
				</el-form-item>

				<el-form-item label-width="0px">
					<el-pagination layout="prev, pager, next"  :page-size="10" :total="0" style="float:right;">
					</el-pagination>
				</el-form-item>
			</el-form>
		</el-dialog>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				chapterRow:"",
				courses:[
				],
                addFormVisible:false,
				dialogTableVisible:false,
				courseAddForm:{
					keyword:'',
          rows:20
				},
				//添加章节的数据
				addForm:{
                	courseId:"",
					courseName:'',
					number:'',
				},
                listLoading:false,
				//查询对象
				filters:{
					keyword:''
				},
				page:1,//当前页,要传递到后台的
				total:0, //分页总数
			    coursesChapter:[], //当前页数据
				sels:[]
				//课程选择
			}
		},
		methods: {
            addSubmit(){
                this.$http.post("/course/course/save",this.addForm).then(res=>{
                    var ajaxResult = res.data;
                    if(ajaxResult.success){
                        this.$message({
                            message: '保存成功!',
                            type: 'success'
                        });
                        this.addFormVisible = false;
                        this.getCoursesChapter();
                    }else{
                        this.$message({
                            message: '上传失败!',
                            type: 'error'
                        });
                    }
				});
			},
			selectCourse(row){
				this.courseAddForm.keyword = "";
				this.addForm.courseId = row.id;
				this.addForm.courseName = row.name;
				this.dialogTableVisible = false;
			},
      getCourses(){
        this.$http.post("/course/course/pagelist",this.courseAddForm).then(result=>{
            this.courses = result.data.data.rows;
            console.log(this.courses);
        });
			},
            addHandler(){
				this.addFormVisible = true;
			},
            handleCurrentChange(curentPage){
                this.page = curentPage;
                this.getCoursesChapter();
			},
            getCoursesChapter(){
                //发送Ajax请求后台获取数据  axios
				//添加分页条件及高级查询条件
				let para = {
				    "page":this.page,
					"keyword":this.filters.keyword
				};
				this.listLoading = true; //显示加载圈
				//分页查询
                this.$http.post("/course/courseChapter/pagelist",para) //$.Post(.....)
                    .then(result=>{
                        this.total = result.data.data.total;
                        this.coursesChapter = result.data.data.rows;
                        this.listLoading = false;  //关闭加载圈
                    });
			},
			chapterRowSlect(row){
				this.chapterRow = row;
			},
			addCourseChapter(){
				let param = this.addForm;
				this.$http.post("/course/courseChapter/save",param).then(result=>{
					let {success,message,data} = result.data;
					console.log(success,message,data);
					if(success){
						this.$message({ message: "保存成功", type: 'success' });
						this.getCoursesChapter();
						this.addFormVisible = false;
					}else{
						this.$message({ message: "保存失败["+message+"]", type: 'error' });
					}
				}).catch(error => {
					this.$message({ message: "保存失败["+error.message+"]", type: 'error' });

				})
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
			selsChange(sels){
				this.sels = sels;
			}
		},
		mounted() {
		    this.getCoursesChapter();
		}
	}

</script>

<style scoped>

</style>