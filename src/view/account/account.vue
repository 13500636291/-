<template>
    <div class="account">
      <div class="accountForm">
            <p>
                <span>账号管理</span>
            </p>
            <el-table
                class="accountList"
                :data="tableData"
                height="646"
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="用户编号"
                    width="70">
                </el-table-column>
                <el-table-column
                    prop="data"
                    label="创建时间"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="email"
                    label="用户邮编"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="学校名称"
                    align="center"
                    min-width="180">
                </el-table-column>
                <el-table-column
                    prop="inCode"
                    label="邀请码"
                    align="center"
                    :show-overflow-tooltip="true"
                    min-width="110">
                </el-table-column>
                <el-table-column
                    prop="tel"
                    label="手机号码"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="60">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='正常'" style="color:#000000">{{ scope.row.status }}</span>
                        <span v-else style="color: red">{{ scope.row.status }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="90"
                    fixed="right"
                    align="left">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">冻结</el-button>
                        <el-button
                            @click.native.prevent="deleteRow(scope.$index, tableData,scope.row)"
                            type="text"
                            size="small">
                            移除
                        </el-button>
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
import {accountLists,AchangeStatus,destoryAccount} from '@/api/index'
export default {
    data(){
        return {
            inCode:[],
            tableData: [],
            currentPage:1,
            total:0
        }
    },
    mounted(){
        this.getaccountLists(1,10)
    },
    methods: {
        //定义获取账户列表函数
        getaccountLists(page,rows){
            accountLists({params:{page:page,rows:rows}}).then(res=>{
                if(res.retCode==2000){
                    const data = res.data.items.map((val)=>{
                        return {
                            id: val.id,
                            data: val.createdAt.substr(0,10),
                            email: val.email,
                            name: val.username,
                            inCode: val.inviteCode,
                            tel: val.phone,
                            status:val.status=='normal'?'正常':'冻结',
                        }
                    })
                    this.tableData=data
                    this.total = res.data.totalCount-0                 
                }
            })
        },
        //冻结账户
        handleClick(row) {
            const h = this.$createElement;
            this.$msgbox({
                message: h('p', null, '确定冻结该账号吗？'),
                customClass:"MessageBox",
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                center:true,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中';
                        AchangeStatus({id:row.id}).then(res=>{
                            if(res.retCode==2000){
                                this.$message({
                                    type: 'success',
                                    message: '冻结成功'
                                });
                                this.getaccountLists(this.currentPage,10)
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
                        })
                    } else {
                        done();
                    }
                }
            })
        },
        //移除账户
        deleteRow(index, tableData,row) {
            // tableData.splice(index, 1);
            const h = this.$createElement;
            this.$msgbox({
                message: h('p', null, '确定移除该账号吗？'),
                customClass:"MessageBox",
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose:false,
                center:true,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '执行中';
                        destoryAccount({id:row.id}).then(res=>{
                            if(res.retCode==2000){
                                this.$message({
                                    type: 'success',
                                    message: '移除成功'
                                });
                                this.getaccountLists(this.currentPage,10)
                                setTimeout(() => {
                                    done();                                    
                                    instance.confirmButtonLoading = false;
                                }, 100);
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: '未移除成功'
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
                        })
                    } else {
                        done();
                    }
                }
            })
        },
        //分页列表
        handleCurrentChange(val){
            this.getaccountLists(val,10)
        }
    }
}
</script>
<style lang="scss" scoped>
.account {
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
            color: white;
        }
        span:last-of-type {
            color: #BBBBBB;
        }
    }
    .accountList {
        font-size: 12px;
    }
}
</style>