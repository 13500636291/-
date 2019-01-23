<template>
    <div class="home">
        <el-container class="el-container">
            <el-aside class="el-aside">
                <h3>不占座后台管理系统</h3>
                <el-menu
                    default-active="2"
                    class="el-menu-admin"
                    background-color="#0E1935"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    :router="true"
                    :unique-opened="true"
                    >
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span slot="title">概况</span>
                        </template>
                        <el-menu-item index="overview" class="elHover">
                            <span>概况</span>
                        </el-menu-item>
                    </el-submenu>
                   
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>学校管理</span>
                        </template>
                        <el-menu-item index="manageAdd" class="elHover">增加学校</el-menu-item>
                        <el-menu-item index="manageSchool" class="elHover">管理学校</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-edit"></i>
                            <span>学校账号</span>
                        </template>
                        <el-menu-item index="account" class="elHover">账号管理</el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-document"></i>
                            <span>用户投诉</span>
                        </template>
                        <el-menu-item index="complaint" class="elHover">用户投诉</el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item index="permission" class="elHover">权限管理</el-menu-item>
                    </el-submenu>
                </el-menu>
                <el-button type="primary" class="layout" @click="logout">退出</el-button>
            </el-aside>
            <el-main class="elMain"><router-view></router-view></el-main>
            <div class="right">
                <div class="helptitle">
                    <i class="iconfont icon-bangzhuzhongxin"></i>
                    <span>帮助中心</span>
                </div>
                <div class="helptext">
                    <p>客服电话:</p>
                    <p>13851863098</p>
                    <p>工作时间：</p>
                    <p>9.30~18.30</p>
                </div>
            </div>
        </el-container>
    </div>
</template>
<script>
// refreshToken
import {logOut,refreshToken} from '@/api/index'
export default {
    data(){
        return {
            deadTime:localStorage.getItem("deadTime"),
           
        }
    },
    mounted () {
        var lastTime=new Date().getTime();//鼠标最后一次移动的时刻
        var currentTime=new Date().getTime();//检测的当前时刻
        const testTime = 60*60*1000;//检测的间隔时间
        var diffTime =0;//记录鼠标最后一次移动的时刻到刚开始检测时刻的时间
        (function(){//立即执行函数之前的一句话必须加';'，负责打包的时候报错
            document.documentElement.addEventListener("mouseover", function(){
                lastTime = new Date().getTime(); //更新操作时间
            })
        })();

        /* 定时器  间隔testTime秒检测是否长时间未操作页面  */
        var intervalTime = window.setInterval(()=>{
            currentTime = new Date().getTime();//更新时间
            if(currentTime - lastTime < testTime+10){//如果检测时间-停顿时间
                refreshToken().then(res=>{
                    if(res.retCode==2000){
                        localStorage.setItem("myToken", res.data.jwt);
                        localStorage.setItem("deadTime", res.data.expiredAt-new Date().getTime());
                    } else {
                        localStorage.setItem("myToken", '');
                        localStorage.setItem("deadTime", '');
                        this.$message({
                        message: "token过期请重新登录",
                        type: "warning"
                        });
                        setTimeout(() => {
                            this.$router.push("/login");      
                        }, 3000);
                    }
                }).catch((err)=>{
                    localStorage.setItem("myToken", '');
                        localStorage.setItem("deadTime", '');
                        this.$message({
                        message: "token刷新报错:"+err,
                        type: "warning"
                        });
                        setTimeout(() => {
                            this.$router.push("/login");      
                        }, 3000);
                })
                diffTime = testTime-(currentTime - lastTime)//记录停顿到移动的时间
            } else if(currentTime - lastTime > this.deadTime + diffTime){
                logOut().then(res=>{
                    if(res.retCode==2000){
                        localStorage.setItem("myToken", "");                
                        localStorage.setItem("deadTime", "");                
                        this.$message({
                        message: "长时间未操作请重新登录",
                        type: "warning"
                        });
                        setTimeout(() => {
                            this.$router.push("/login");      
                        }, 3000);
                    }
                }).catch(err=>{
                    this.$message({
                        message: '网络故障:'+err,
                        type: "error"
                    });
                })
                clearInterval(intervalTime);        
            }
        }, testTime);
    },
    
    methods: {
        //退出登录
        logout() {
            logOut().then(res=>{
                if(res.retCode==2000){
                    localStorage.setItem("myToken", "");                
                    localStorage.setItem("deadTime", "");                
                    this.$message({
                    message: "退出成功",
                    type: "warning"
                    });
                    setTimeout(() => {
                        this.$router.push("/login");            
                    }, 2000);
                }
            }).catch(err=>{
                this.$message({
                    message: '报错:'+err,
                    type: "error"
                });
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.home {
    width: 100%;
    height: 100%;
    background-color:#F5F5F5;
    .el-container {
        width: 100%;
        height: 100%;
        .el-aside {
            width: 224px!important;
            width: 100%;
            height: 100%;
            background-color: #0E1935;
            h3{
            margin: 32px 0 0 18px;
            font-size: 20px;
            margin-bottom: 20px;
            color: white;
            }
            .el-menu-admin{
                width: 100%;
                font-size: 16px;
                border-right: 0;
                .el-menu-item {
                    min-width: 0;
                    padding: 0;
                    position: relative;
                    &:hover {
                        &:after{
                            position: absolute;
                            left: 0;
                            top: 0;
                            content: "";
                            width: 6px;
                            height: 62px;
                            background-color: #409EFF;
                        }
                    }
                }
            }
            .layout {
                position: absolute;
                left: 18px;
                bottom: 42px;
                width: 188px;
                text-align: center;
            }
        }
        .elMain {
          width: 914px;
          margin: 14px 216px 10px 12px;
        }
        .right {
            position: fixed;
            top: 14px;
            right: 0;
            background-color: #F5F5F5;
            width: 192px;
            .helptitle {
                width: 198px;
                height: 48px;
                line-height: 48px;
                background-color: #ECECEC;
                i{
                    font-size: 24px;
                    margin-left: 22px;
                    vertical-align: middle
                }
                span{
                    font-size: 18px;
                    margin-left: 7px;
                    font-weight: bold;
                    text-align: center;
                    vertical-align: middle;                               
                    
                }
            }
            .helptext {
                background-color: white;
                padding-top: 16px;
                padding-left: 22px;
                padding-bottom: 8px;
                box-sizing: border-box;
                p {
                    font-size: 12px;
                    font-weight: bold;
                    margin-bottom: 12px;
                }
            }
        }
    }
    
}

</style>