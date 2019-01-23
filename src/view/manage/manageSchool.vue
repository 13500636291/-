<template>
    <div class="manageSchool">
      <div class="manForm">
            <p>
                <span>学校列表</span>
                <span>学校详情</span>
            </p>
            <el-table
                class="manList"
                :data="tableData"
                height="635"
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="学校编号"
                    width="76">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="创建时间"
                    width="98">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="学校名称"
                    min-width="130">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="学校地址"
                    min-width="200">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    width="60">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='normal'" style="color:#000000">正常</span>
                        <span v-else style="color: red">冻结</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="邀请码"
                    align="center"
                    width="100">
                    <template slot-scope="scope">
                        <el-button size="small " class="viewBtn" plain @click="open(scope.row.id)">点击查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="90"
                    align="left">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button
                            @click.native.prevent="deleteRow(scope.$index, tableData,scope.row.id)"
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
                class="elPage"
                layout="prev, pager, next, jumper"
                :total="total">
            </el-pagination>
      </div>
    </div>
</template>
<script>
import {getScoolList,genInviteCode,SchangeStatus} from '@/api/index'
import {mapMutations} from 'vuex'
export default {
    data(){
        return {
            inCode:[],
            tableData: [],
            currentPage:2,
            total:0
        }
    },
    mounted() {
        this.scoolLists(this.$store.state.currentPage,10)
    },
    methods: {
        //定义一个获取学校列表的函数
        scoolLists(page,rows){
            getScoolList({params:{page:page,rows:rows}}).then(res=>{
                if(res.retCode==2000){
                    const data = res.data.items.map((val)=>{
                        return {
                            id: val.id,
                            createdAt: val.createdAt.substr(0,10),
                            name: val.name,
                            address:val.address,
                            status: val.status
                        }
                    })
                    this.tableData = data
                    this.total = Math.ceil(res.data.totalCount/10)*10;
                    this.currentPage = this.$store.state.currentPage
                } else {
                    this.$message({
                        message: '数据获取失败',
                        type: "warning"
                    });
                }
            })
        },
        //查看邀请码
        open(id){
            genInviteCode({id:id}).then(res=>{
                const h = this.$createElement;
                this.$msgbox({
                    title: '邀请码',
                    message: h('p', null, [
                        h('h1', { style: 'color: teal,font-size:20px' }, res.data)
                    ]),
                    center:true,
                    showConfirmButton:false,
                    closeOnClickModal:true,
                    distinguishCancelAndClose: true,
                }).catch(()=>{
                    return false
                });
            })            
        },
        //查看学校
        handleClick(row) {
            this.postScDetail({id:+row.id,page:this.currentPage})
            this.$router.push("/manageDetail");
        },
        //移除学校
        deleteRow(index, rows,id) {
            SchangeStatus({id:id}).then(res=>{
                if(res.retCode==2000){
                    this.scoolLists(this.currentPage,10)
                }
            })
        },
        //分页列表
        handleCurrentChange(val){
            this.postScDetail({page:this.currentPage})    
            this.scoolLists(val,10)
        },
        ...mapMutations([
            'postScDetail'
        ])
        
    }
}
</script>
<style lang="scss" scoped>
.manageSchool {
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
            &:first-of-type {
                color: white;
            }
            &:last-of-type {
                color: #BBBBBB;
            }
        }
    }
}
</style>