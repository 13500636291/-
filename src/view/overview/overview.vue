<template>
    <div class="overview"  v-cloak  v-if="statList">
        <div class="top">
            <div class="numTotal">
                <p>{{statList.schoolCount}}</p>
                <p>学校总数</p>
                <i class="el-icon-document school"></i>
            </div>
            <div class="numTotal">
                <p>{{statList.seatCount}}</p>
                <p>座位总数</p>
                <i class="el-icon-document seat"></i>
            </div>
            <div class="numTotal">
                <p>{{statList.schoolAccountCount}}</p>
                <p>学校账号总数</p>
                <i class="el-icon-document account"></i>
            </div>
        </div>
        <!-- 趋势数据图表 -->
        <div id="dataImg">
          <div style="width:100%;" class="page-line-chart">
            <!-- 图标标题 -->
            <h4>趋势图</h4>
            <!-- 选择区域 -->
            <div class="select">
                <!-- 日期选择 -->
                <el-date-picker
                    class="dataSelect"
                    size='small'
                    v-model="value6"
                    @change="startCav"
                    type="daterange"
                    align="left"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2">
                </el-date-picker>
                <!-- 选择学校 -->
                <el-select class="selSc" popper-class="selScOptions" v-model="valueShool" placeholder="请选择" @focus="ScoolList" @change="goselCav">
                    <el-option
                        :filterable="true"
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        small
                        :page-size="7"
                        :pager-count="5"
                        layout="prev, pager, next"
                        :total="totalCount">
                    </el-pagination>
                </el-select>
                <!-- 搜索学校 -->
                <el-input
                class="search"
                placeholder="搜索学校"
                prefix-icon="el-icon-search"
                @keyup.enter.native="goSeSchool"
                v-model="searchSchool">
                <i class="el-icon-search"></i>
                </el-input>
            </div>
            <!-- canvas核心图 -->
            <ve-line
            :tooltip-visible="true"
            :legend-visible="false"
            :data="chartData"
            :settings="chartSettings"
            :width="width"
            :height="height">
            </ve-line>
            <!-- 图表数据总结 -->
            <div class="totalNum">
              <span>座位数:{{seatCount}}</span>
              <span>座位总数:{{seatTotalCount}}</span>
              <span>使用人数:{{seatUsedCount}}</span>
            </div>
          </div>
        </div>
        <!-- 数据列表 -->
        <div class="dataList">
            <!-- 数据列表顶部 -->
            <div class="top">
                <h3>数据列表</h3>
                <el-date-picker
                    class="listData"
                    v-model="listDateValue"
                    type="date"
                    @change="selScData"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
            <!-- 数据列表内容 -->
            <el-table
                :data="tableData3"
                height="140"
                :header-row-style="headerStyle"
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="#"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="schoolName"
                    label="学校名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="seatNum"
                    label="座位使用数">
                </el-table-column>
                <el-table-column
                    prop="userNum"
                    label="使用人数">
                </el-table-column>
                <el-table-column
                    prop="usePro"
                    label="使用率">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import {getStat,getTrendData,getViewSchoolList,getScoolList} from '@/api/index'
export default {
    data(){
        return {
            width:'767px',
            height:'310px',
            chartData: {
                columns: ["日期", "数量"],
                rows: []
            },
            chartSettings: {
                area: true
            },
            headerStyle:{
                color:'#000000',
                fontSize:'12px',
                fontWeight:'bold'
            },
            statList:{},//总计数据            
            //趋势图日期选择
            value6: [new Date(+new Date()-7*24*3600*1000),new Date()],
            pickerOptions2: {
                shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
                }, {
                text: '最近一个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
                }, {
                text: '最近三个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
                }]
            },
            // 趋势图选择学校的值
            valueShool:null,
            options: [],
            totalCount:0,
            currentPage:1,
            //搜索学校
            searchSchool: null,
            time1:0,
            time2:0,        
            //趋势图统计数据
            seatCount:"0",
            seatTotalCount:0,
            seatUsedCount:0,
            // 数据列表
            listDateValue:'',
            tableData3: []
        }
    },
    mounted(){
        //渲染默认的总计数据
        this.Stat()
        //渲染默认趋势图(默认id=1的学校的最近一周的数据)
        this.startCav()
        //渲染当天学校排行
        const nowDate = this.$moment(new Date()).format('YYYY-MM-DD')
        this.getselScData(nowDate)
    },
    methods:{
        //定义一个获取总计数据的函数
        Stat(){
            getStat().then(res=>{
                if(res.retCode==2000){
                    this.statList=res.data;
                } else {
                    this.$message({
                        message: '数据错误:'+res.info.tip,
                        type: "warning"
                    });
                }
            }).catch((err)=>{
                localStorage.setItem("myToken", '');
                localStorage.setItem("deadTime", '');
                this.$message({
                message: "token过期请重新登录"+err,
                type: "warning"
                });
                setTimeout(() => {
                    this.$router.push("/login");      
                }, 3000);
            })
        },
        //定义一个趋势图选择的函数
        getCanvas(id,name){
            const date =this.$moment(this.value6[0]).format('YYYY-MM-DD')+'|'+this.$moment(this.value6[1]).format('YYYY-MM-DD')            
            getTrendData({params:{schoolId:id,dateBetween:date,schoolName:name}}).then(res=>{
                if(res.retCode==2000){
                    const arr = res.data.items.map((val)=>{
                        return {
                            "日期":val.date,
                            "数量":val.count
                        }
                    })
                    this.chartData.rows = arr;
                    this.seatCount = res.data.seatCount;
                    this.seatTotalCount = res.data.seatTotalCount;
                    this.seatUsedCount = res.data.seatUsedCount;
                }
            })
        },
        //定义获取学校列表的请求函数
        getScListAxios(page,rows){
            getScoolList({params:{page:page,rows:rows}}).then(res=>{
                if(res.retCode==2000){
                    const option = res.data.items.map((val)=>{
                        return {
                            value: val.id,
                            label: val.name
                        }
                    });
                    this.options = option;
                    this.totalCount = res.data.totalCount-0;
                }
            })
        },
        //定义学校排行的默认函数
        getselScData(date){
            getViewSchoolList({params:{date:date}}).then(res=>{
                if(res.retCode==2000){
                    const data = res.data.items.map((val)=>{
                        return {
                            id: val.schoolId,
                            schoolName: val.schoolName,
                            seatNum: val.seatUsedCount,
                            userNum: val.seatUsedUserCount,
                            usePro: Math.round(val.seatUsedUserCount*100/val.seatTotalCount)+'%'
                        }
                    });
                    this.tableData3 = data;
                }
            })
        },
        //绘制趋势图
        startCav(){
            if(this.time1){
                this.getCanvas(this.valueShool)
            } else if(this.time2) {
                this.getCanvas(null,this.searchSchool)
            } else {
                // const dateBetween =this.$moment(new Date(+new Date()-90*24*3600*1000)).format('YYYY-MM-DD')+'|'+this.$moment(new Date()).format('YYYY-MM-DD')
                getScoolList({params:{page:1,rows:1}}).then(res=>{
                    if(res.retCode==2000){
                        this.getCanvas(+res.data.items[0].id)
                    }
                })
            }
        },
        goselCav(){
            this.getCanvas(this.valueShool)
            this.time2=0
            this.time1=1
        },
        goSeSchool(ev){
            if(ev.keyCode==13){
                this.getCanvas(null,this.searchSchool)
                this.time2=1
                this.time1=0
            }
        },
        //获取学校列表
        ScoolList(){
            this.getScListAxios(1,7)
        },
        //获取分页学校列表
        handleCurrentChange(val){
            this.getScListAxios(val,7)
        },
        // 选择学校排名日期
        selScData(){
            const date = this.$moment(this.listDateValue).format('YYYY-MM-DD')
            this.getselScData(date)
        }
    }
}
</script>
<style lang="scss">
[v-cloak]{ display: none!important; }
.overview {
    width: 100%;
    height: 100%;
    .top {
        width: 100%;
        height: 102px;
        font-size: 18px;
        font-weight: bold;
        .numTotal {
            width: 32.38%;
            padding: 32px 24px; 
            border-radius:6px;
            -webkit-box-sizing: border-box;
            background-color: white;
            position: relative;
            float: left;
            margin-right: 1.43%;
            &:last-of-type {
                margin: 0;
            }
            i {
                position: absolute;
                top: 36px;
                right: 32px;
                font-size: 32px;
            }
            .school {
                color: #FF2161;
            }
            .seat {
                color: #5C2089;
            }
            .account {
                color: #00ABDE;
            }
        }
    }
    #dataImg {
        width: 100%;
        margin: 12px 0 9px 0;
        padding: 20px 26px 9px 18px;
        box-sizing: border-box;
        background-color: white;
        h4 {
          font-weight: bold;
          font-size: 15px;
        }
        .select {
          margin-top: 18px;
          width: 100%;
          height: 33px;
            .dataSelect {
                width: 200px;
            }
            .selSc {
                margin-left: 9px;
                width: 179px;
            }
            .search {
                float: right;
                width: 179px;
                .el-input__inner {
                    height: 33px!important;
                    line-height: 33px;
                }
            }
        }
        .totalNum {
          text-align: center;
          word-spacing: 10px;
          font-weight: bold;
          font-size: 13px;
          span{
            margin-right: 92px;            
          }
        }
    }
    .dataList {
        width: 100%;
        height: 200px;
        margin-top: 12px;
        padding-left: 24px;
        padding-top: 20px;
        box-sizing: border-box;
        background-color: white;
        .top {
            height: 40px;
            h3 {
                font-size: 16px;
                font-weight: bold;
                float: left;
            }
            .listData {
                width: 200px;
                float: right;
            }
        }
    }
}
.selScOptions{
    .el-select-dropdown__wrap{
        max-height: 276px;
    }
}
</style>


