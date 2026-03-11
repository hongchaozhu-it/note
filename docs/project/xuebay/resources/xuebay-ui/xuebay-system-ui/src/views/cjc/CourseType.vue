<template id="courseType">
    <div>
        <el-row style="height: 100%; margin-top: 10px;">
            <div style="border: 1px solid #eeeeee; min-height:600px;width: 20%;float: left;border-radius: 5px">
                <div class="grid-content bg-purple">
                    <el-tree :data="courseTypes" :props="defaultProps"  @node-click="handleNodeClick">
                    </el-tree>
                </div>
            </div>
            <div  style="width: 79%;float: left;margin-left: 5px;border: 1px solid #eeeeee;min-height:600px;border-radius: 5px">
                <!--工具条-->
                <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                    <el-form :inline="true" :model="filters">
                        <el-form-item>
                            <el-input v-model="filters.keyword" size="small" placeholder="关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="warning" v-on:click="getList" size="small" icon="el-icon-search">查询分类</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleAdd" size="small" icon="el-icon-plus">新增分类</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <!--列表-->
                <el-table :data="datas" highlight-current-row  @selection-change="selsChange" style="width: 100%;">
                    <el-table-column type="selection" >
                    </el-table-column>
                    <el-table-column prop="name" label="标题" width="200" sortable>
                    </el-table-column>
                    <el-table-column prop="description" label="描述" width="200" sortable>
                    </el-table-column>
                    <el-table-column prop="totalCount" label="课程数" width="120" sortable>
                    </el-table-column>
                    <el-table-column prop="pName" label="上级分类" width="130" sortable>
                    </el-table-column>

                    <el-table-column label="操作" width="200">
                        <template scope="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"  icon="el-icon-edit" type="primary">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDel(scope.row)"  icon="el-icon-remove">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0" icon="el-icon-remove" size="small">批量删除</el-button>
                    <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange"
                                   :page-size="10" :total="total" style="float:right;">
                    </el-pagination>
                </el-col>

            </div>
        </el-row>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible"  :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px"  ref="addForm">
                <el-form-item label="分类标题" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="LOGO" prop="logo">
                    <el-input v-model="addForm.logo" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="排序" prop="sortIndex">
                    <el-input v-model="addForm.sortIndex" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="addForm.description" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" >提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style>
    .el-row {
        margin-bottom: 20px;
        height: 100%;
    }
    :last-child {
        margin-bottom: 0;
    }
    #courseType el-col {
        border: 1px solid red;
        border-radius: 4px;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .toolbar{
        margin: 0px;
    }
</style>

<script>
    export default {
        data() {
            return {
                addForm:{
                    name:"",
                    logo:"",
                    sortIndex:"",
                    description:"",
                    pid:""
                },
                addFormVisible:false,
                sels:[],
                filters:{
                    keyword:""
                },
                datas:[],
                page:1,//当前页,要传递到后台的
                total:0, //分页总数
                courseTypes:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods:{
            handleAdd(){
              this.addFormVisible = true;
            },
            addSubmit(){
                //提交
                this.$http.post("/course/courseType/save",this.addForm).then(res=>{
                    //{success: true, ..
                    var ajaxResult = res.data;
                    if(ajaxResult.success){
                        this.addFormVisible = false;
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.getTreeData();
                    }else{
                        this.$message({
                            message: ajaxResult.message,
                            type: 'error'
                        });
                    }
                });
            },
            getChildrenByPid(pid){
                this.$http.get("/course/courseType/selectChildrenById/"+pid).then(res=>{
                    this.datas = res.data.data.data;
                });
            },
            handleCurrentChange(page){
                this.page = page;
                this.getList();
            },
            batchRemove(){

            },
            handleEdit(){

            },
            handleDel(row){
              this.$http.delete("/course/courseType/"+row.id).then(result=>{
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getList();
                this.getTreeData();
              })

            },
            selsChange(){

            },
            getList(){
                this.listLoading = true; //显示加载圈
                let para = {
                    "page":this.page,
                    "keyword":this.filters.keyword
                };
                //分页查询
                this.$http.post("/course/courseType/pagelist",para).then(result=>{
                    this.total = result.data.data.total;
                    this.datas = result.data.data.rows;
                    this.listLoading = false;  //关闭加载圈
                }).catch(error => {
                    this.$message({ message: error.message,type: 'error'});
                    this.listLoading = false;  //关闭加载圈
                });
            },
            handleNodeClick(row){
                this.datas = row.children;
                this.addForm.pid = row.id;
            },
            getTreeData(){
                // 发送一个异步请求: get请求 /product/courseType/treeData
                this.$http.get("/course/courseType/treeData").then(res=>{
                    this.courseTypes = res.data.data;
                });
            }
        },
        mounted(){ // 页面加载
          this.getList();
            //对courseTypes数据赋值
           this.getTreeData();
        }
    };
</script>