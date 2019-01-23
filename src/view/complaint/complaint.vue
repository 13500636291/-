<template>
    <div class="complaint">
      <div>
            <p>
                <span>投诉列表</span>
            </p>
            <el-table
                :data="tableData"
                @row-click="showRight"
                height="638"
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="投诉编号"
                    width="80"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="Complainant"
                    label="投诉人"
                    width="90"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="Respondent"
                    label="被投诉人"
                    width="90"
                    align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.accState==1" style="color:#000000">{{scope.row.Respondent}}</span>
                        <span v-else style="color:#69B2FF">{{scope.row.Respondent}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="学校"
                    width="180"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="seat"
                    label="座位号"
                    width="70">
                    <template slot-scope="scope">
                        <span v-if="scope.row.seatState==1" style="color:#000000">{{scope.row.seat}}</span>
                        <span v-else style="color:#69B2FF">{{scope.row.seat}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="content"
                    label="内容"
                    min-width="105"
                    :show-overflow-tooltip="true"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="imgUrl"
                    label="图片"
                    align="center"
                    width="60">
                    <template slot-scope="scope">
                        <img :src="scope.row.imgUrl" height="27" alt="">
                    </template>
                </el-table-column>
                <el-table-column
                    prop="data"
                    label="投诉时间"
                    width="100"
                    align="center">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    class-name="action"
                    width="100">
                    <template slot-scope="scope">
                        <el-dropdown placement="top-start"  @command="handleCommand" trigger="click">
                            <span class="el-dropdown-link">
                                操作
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item  command="a">冻结账户</el-dropdown-item>
                                <el-dropdown-item  command="b">释放座位</el-dropdown-item>
                                <el-dropdown-item  command="c">内容展示</el-dropdown-item>
                                <el-dropdown-item  command="d">图片展示</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination 
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="10"
                layout="prev, pager, next, jumper"
                :total="total">
            </el-pagination>
      </div>
    </div>
</template>
<script>
import {getCompaintList,freezingAccount,releaseSeat} from '@/api/index'
export default {
    data(){
        return {
            inCode:[],
            tableData: [],
            row:{},
            currentPage:1,
            total:0
        }
    },
    mounted(){
        this.CompaintList(1,10)
    },
    methods: {
        showRight(row){
            this.row=row
        },
        //定义一个获取投诉列表的函数
        CompaintList(page,rows){
            getCompaintList({params:{page:page,rows:rows}}).then(res=>{
                if(res.retCode==2000){
                    const data = res.data.items.map((val)=>{
                        return {
                            id: val.id,
                            Complainant: val.userName,
                            Respondent: val.toUserName,
                            name: val.schoolName,
                            seat: val.seatNum,
                            content: val.content,
                            imgUrl: val.imageUrl,
                            data: this.$moment(val.createTime*1000).format('YYYY-MM-DD'),
                            accState:val.accState,
                            seatState:val.seatState,
                        }
                    })
                    this.tableData = data;
                    this.total = res.data.totalCount-0
                } else {
                    this.$message({
                        message: '数据获取失败',
                        type: "warning"
                    });
                }
            }).catch(err=>{
                this.$message({
                    message: '网络错误:'+err,
                    type: "error"
                });
            })
        },
        //定义一个确定弹窗
        MessageBox(message,beforeClose){
            const h = this.$createElement;
            this.$msgbox({
                message: h('p', null, `${message}`),
                customClass:"MessageBox",
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                center:true,
                beforeClose: beforeClose
            })
        },
        //点击操作
        handleCommand(command) {
            if(command=='a'){
                const message = "确定冻结该账号吗？"
                this.MessageBox(message,(action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中';
                        freezingAccount({complaintId:this.row.id}).then(res=>{
                            if(res.retCode==2000){
                                this.$message({
                                    type: 'success',
                                    message: '冻结成功'
                                });
                                this.CompaintList(this.currentPage,10)
                                setTimeout(() => {
                                    done();
                                    instance.confirmButtonLoading = false;
                                }, 100);
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: '未冻结成功'
                                });
                                setTimeout(() => {
                                    done();                                    
                                    instance.confirmButtonLoading = false;
                                }, 100);
                            }
                        }).catch(err=>{
                            this.$message({
                                type: 'error',
                                message: '请求失败:'+err
                            });
                            setTimeout(() => {
                                done();                                    
                                instance.confirmButtonLoading = false;
                            }, 100);
                        })
                    } else {
                        done();
                    }
                })
            } else if(command=='b'){
                const message = "确定释放该座位吗？"
                this.MessageBox(message,(action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中';
                        releaseSeat({complaintId:this.row.id}).then(res=>{
                            if(res.retCode==2000){
                                this.$message({
                                    type: 'success',
                                    message: '释放成功'
                                });
                                this.CompaintList(this.currentPage,10)
                                setTimeout(() => {
                                    done();                                    
                                    instance.confirmButtonLoading = false;
                                }, 100);
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: '未释放成功'
                                });
                                setTimeout(() => {
                                    done();                                    
                                    instance.confirmButtonLoading = false;
                                }, 100);
                            }
                        }).catch(err=>{
                            this.$message({
                                type: 'error',
                                message: '请求失败:'+err
                            });
                            setTimeout(() => {
                                done();                                    
                                instance.confirmButtonLoading = false;
                            }, 100);
                        })
                    } else {
                        done();
                    }
                })
            } else if(command=='c'){
                const h = this.$createElement;
                this.$msgbox({
                    title: '内容展示',
                    message: h('p', null, [
                        h('span', null, `${this.row.content}`),
                    ]),
                    showCancelButton: false,
                    confirmButtonText: '确定',
                }).then(()=>{
                    return false
                }).catch((err)=>{
                    this.$message({
                        type: 'error',
                        message: '请求失败:'+err
                    });
                });
            } else {
                this.$alert(`<div style="width:100%;height:100%;background-color:#686869;text-align:center;padding:0 50px;box-sizing:border-box;"><img src=${this.row.imgUrl} height="370" height="100%" style="vertical-align: middle;" /></div>`, '图片查看', {
                dangerouslyUseHTMLString: true,
                customClass: 'showImg'
                });
            }
        },
        //分页列表
        handleCurrentChange(val){
            this.CompaintList(val,10)
        }
    }
}
</script>
<style lang="scss">
.complaint {
    width: 100%;
    height: 100%;
    padding-top: 16px;
    padding-left: 17px;
    padding-right: 20px;
    box-sizing: border-box;
    border-radius: 5px;
    background-color: white;
    p {
        width: 100%;
        height: 31px;
        background-color: #0E1935;
        span {
            display: block;
            float: left;
            width: 61px;
            line-height: 31px;
            font-size: 12px;
            text-align: center;
            
        }
        span:first-of-type {
            color: #ffffff;
        }
        span:last-of-type {
            color: #BBBBBB;
        }
    }
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
}
.showImg {
    width: auto!important;
}
</style>