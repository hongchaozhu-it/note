<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :model="filters" :inline="true">
				<el-form-item>
					<el-input v-model="filters.keywords" placeholder="关键字" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getPagers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addHandler" >新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表v-loading="listLoading"-->
		<el-table  :data="pagers" v-loading="listLoading" highlight-current-row  style="width: 100%;">
			<!--多选框-->
			<el-table-column type="selection" width="55">
			</el-table-column>
			<!--索引值,为什么不用id,id不序号-->
			<el-table-column type="index" width="60">
			</el-table-column>
			<!--其他都设置值,只有一个不设置值就自动适应了-->
			<el-table-column prop="name" label="英文名">
			</el-table-column>
			<el-table-column prop="alias" label="别名">
			</el-table-column>
			<el-table-column prop="physicalPath" label="站点路径">
			</el-table-column>
			<el-table-column prop="templateUrl" label="模板" >
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small"  @click="edit(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"  :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible"  :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px"  ref="addForm">
				<el-form-item label="英文名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="中文名" prop="alias">
					<el-input v-model="addForm.alias" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="输出路径" prop="physicalPath">
					<el-input  v-model="addForm.physicalPath" auto-complete="off"></el-input>
					例如：D:\install\nginx-1.12.2\html\static\home.html
				</el-form-item>

				<el-form-item prop="siteId" label="站点选择">
					<el-select v-model="addForm.siteId" placeholder="请选择">
						<el-option
								v-for="item in sites"
								:key="item.id"
								:label="item.name"
								:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>


				<el-form-item prop="logo" label="页面模板">
					<el-upload
							class="upload-demo"
							action="http://localhost:1020/hrm/fastdfs/fastdfs/upload"
							:on-success="handleSuccess"
							:file-list="fileList"
							list-type="picture">
						<el-button size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" >提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>

	export default {
		data() {
			return {
                addFormVisible:false,
				addForm:{
                    name:'',
                    alias:'',
                    siteId:'',
                    physicalPath:'',
                    templateUrl:'',
				},
                sites:[],
                listLoading:false,
				//查询对象
				filters:{
					keywords:''
				},
				page:1,//当前页,要传递到后台的
				total:0, //分页总数
			    pagers:[], //当前页数据
			}
		},
		methods: {
            handleSuccess(response, file, fileList){
                if(response.success){
                    this.addForm.templateUrl = response.resultObj;
                }else{
                    this.$message({
                        message: '上传失败!',
                        type: 'error'
                    });
                }
            },
            addSubmit(){
                this.$http.post("/pager/pager/save",this.addForm).then(res=>{
                    var ajaxResult = res.data;
                    if(ajaxResult.success){
                        this.$message({
                            message: '保存成功!',
                            type: 'success'
                        });
                        this.addFormVisible = false;
                        this.getPagers();
                    }else{
                        this.$message({
                            message: '上传失败!',
                            type: 'error'
                        });
                    }
				});
			},
            addHandler(){
				this.addFormVisible = true;
			},
            handleCurrentChange(curentPage){
                this.page = curentPage;
                this.getPagers();
			},
            getSites(){
                this.$http.get("/pager/site/list")
                    .then(result=>{
                        this.sites = result.data;
                    });
			},
            getPagers(){
                //发送Ajax请求后台获取数据  axios
				//添加分页条件及高级查询条件
				let para = {
				    "page":this.page,
					"keyword":this.filters.keywords
				};
				this.listLoading = true; //显示加载圈
				//分页查询
                this.$http.post("/pager/pager/pagelist",para) //$.Post(.....)
                    .then(result=>{
                        this.total = result.data.total;
                        this.pagers = result.data.rows;
                        this.listLoading = false;  //关闭加载圈
                    });
			}
		},
		mounted() {
		    this.getPagers();
		    this.getSites();
		}
	}

</script>

<style scoped>

</style>