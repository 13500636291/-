<template>
    <div class="manageSc">
        <h3>添加新学校</h3>
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="ruleForm">
            <el-form-item label="学校名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="学校名称"></el-input>
            </el-form-item>
            <el-form-item label="国家" prop="country">
                <el-input v-model="ruleForm.country"></el-input>
            </el-form-item>
            <el-form-item label="省份" prop="sheng">
                <el-select
                    v-model="ruleForm.sheng"
                    @change="choseProvince"
                    @focus="runGetData"
                    placeholder="省级地区"
                    :automatic-dropdown="true">
                    <el-option
                        v-for="item in province"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地市" prop="shi">
                <el-select  v-model="ruleForm.shi" @change="choseCity" placeholder="市级地区" :automatic-dropdown="true">
                    <el-option
                        v-for="item in shi1"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="区县" prop="qu">
                <el-select v-model="ruleForm.qu" @change="choseBlock" placeholder="区级地区" :automatic-dropdown="true">
                    <el-option
                        v-for="item in qu1"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="ruleForm.address" placeholder="比如：xx路xx号" @keyup.enter.native="enterSubmitForm"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">立即添加</el-button>
                <el-button @click="resetForm('ruleForm')" class="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import mapJson from '@/assets/json/map.json'
import {addSchool} from '@/api/index'
export default {
    data(){
        return {
            mapJson: mapJson,
            province:'',
            shi1: [],
            qu1: [],
            city:'',
            block:'',
            ruleForm: {
                name: '',
                country:'中国',
                sheng: '',
                shi: '',
                qu: '',
                address:''
            },
            rules:{
                name: [
                    { required: true, message: '请输入学校名称', trigger: 'blur' },
                ],
                country: [
                    { required: true, message: '请输入国家', trigger: 'blur' },
                ],
                
                sheng: [
                    { required: true, message: '请选择省份', trigger: 'change' }
                ],
                shi: [
                    { required: true, message: '请选择地市', trigger: 'change' }
                ],
                qu: [
                    { required: true, message: '请选择区县', trigger: 'change' }
                ],
                address: [
                    { required: true, message: '请输入详细地址', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        // 鼠标进入表单加载数据
        runGetData:function(){
            this.getCityData()
        },
        // 加载china地点数据，三级
        getCityData:function(){
            var that = this
            var data = this.mapJson
            that.province = []
            that.city = []
            that.block = []
            // 省市区数据分类
            for (var item in data) {
                if (item.match(/0000$/)) {//省
                that.province.push({id: item, value: data[item], children: []})
                } else if (item.match(/00$/)) {//市
                that.city.push({id: item, value: data[item], children: []})
                } else {//区
                that.block.push({id: item, value: data[item]})
                }
            }
            // 分类市级
            for (var index in that.province) {
                for (var index1 in that.city) {
                if (that.province[index].id.slice(0, 2) === that.city[index1].id.slice(0, 2)) {
                    that.province[index].children.push(that.city[index1])
                }
                }
            }
            // 分类区级
            for(var item1 in that.city) {
                for(var item2 in that.block) {
                if (that.block[item2].id.slice(0, 4) === that.city[item1].id.slice(0, 4)) {
                    that.city[item1].children.push(that.block[item2])
                }
                }
            }
        },
            // 选省
        choseProvince:function(e) {
            for (var index2 in this.province) {
                if (e === this.province[index2].id) {
                    this.ruleForm.sheng = this.province[index2].value
                    this.shi1 = this.province[index2].children
                    this.ruleForm.shi = this.province[index2].children[0].value
                    this.qu1 =this.province[index2].children[0].children
                    this.ruleForm.qu = this.province[index2].children[0].children[0].value
                    this.E = this.qu1[0].id
                }
            }
        },
        // 选市
        choseCity:function(e) {
            for (var index3 in this.city) {
                if (e === this.city[index3].id) {
                    this.ruleForm.shi = this.city[index3].value
                    this.qu1 = this.city[index3].children
                    this.ruleForm.qu = this.city[index3].children[0].value
                    this.E = this.qu1[0].id
                }
            }
        },
        // 选区
        choseBlock:function(e) {
            for (var index4 in this.block) {
                if (e === this.block[index4].id) {
                    this.ruleForm.qu = this.block[index4].value
                    this.E=e;                
                }
            }
        },
        // 提交和重置
        submitForm() {
            this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
                const form = {
                    name:this.ruleForm.name,
                    country:this.ruleForm.country,
                    province:this.ruleForm.sheng,
                    city:this.ruleForm.shi,
                    district:this.ruleForm.qu,
                    address:this.ruleForm.address
                }
                addSchool(form).then(res=>{
                    if(res.retCode==2000){
                        this.$router.push("addSuccess");
                    }
                }).catch(()=>{
                    return false
                })
            } else {
                this.$message({
                    message:'请将表单填写完整！',
                    type:'warning'
                })
                return false;
            }
            });
        },
        enterSubmitForm(ev){
            if(ev.keyCode==13){
                this.submitForm();
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
}
</script>
<style lang="scss" scoped>
.manageSc {
    height: 100%;
    background-color: white;
    padding: 32px 0 0 26px;
    box-sizing: border-box;
    h3{
        font-size: 20px;
        font-weight: 400;
    }
    .ruleForm {
        width: 480px;
        margin-top: 20px;
        .resetForm {
            width: 98px;
            border: 1px solid #ccc;
            margin-left: 20px;
        }
    }
}
</style>


