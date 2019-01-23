import axios from 'axios'
import qs from 'qs'

const API_ENV = process.env.NODE_ENV;
const API_BASE_URL = 'https://boss-api.inansy.com';
if (API_ENV == 'development') {
    axios.defaults.baseURL = 'http://shang.com';
}
if (API_ENV == 'test') {
    axios.defaults.baseURL = 'https://boss-api-test.inansy.com';
}
if (API_ENV == 'production') {
    axios.defaults.baseURL = API_BASE_URL;
}

//设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function(data) { //在请求之前对data传参进行格式转换
    data = qs.stringify(data)
    return data
}]

// 拦截器
axios.interceptors.request.use(function(config) {
    let token = localStorage.getItem('myToken')
    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});
// axios.post('https://ts-test.inansy.com/user');

// 登陆验证
export const loginPost = form => axios.post('/v1/user/login', form).then(res => res.data)
    // 刷新token
export const refreshToken = () => axios.post('/v1/user/refresh-token').then(res => res.data)
    // 退出登录
export const logOut = () => axios.post('/v1/user/logout').then(res => res.data)
    // 总计
export const getStat = () => axios.get('/v1/overview/stat').then(res => res.data)
    // 趋势图
export const getTrendData = params => axios.get('/v1/overview/trend-data', params).then(res => res.data)
    // 学校排行
export const getViewSchoolList = params => axios.get('/v1/overview/school-list', params).then(res => res.data)
    // 投诉列表
export const getCompaintList = params => axios.get('/v1/complaint/lists', params).then(res => res.data)
    // 冻结用户账号
export const freezingAccount = form => axios.post('/v1/complaint/freezing-account', form).then(res => res.data)
    // 释放座位
export const releaseSeat = form => axios.post('/v1/complaint/release-seat', form).then(res => res.data)
    // 新增记录
    // export const addRecord = form => axios.post('/v1/complaint/add-record', form).then(res => res.data)
    // 学校列表
export const getScoolList = params => axios.get('/v1/school/lists', params).then(res => res.data)
    // 查看学校
export const getScoolShow = params => axios.get('/v1/school/show', params).then(res => res.data)
    // 更改状态
export const SchangeStatus = form => axios.post('/v1/school/change-status', form).then(res => res.data)
    // 生成邀请码
export const genInviteCode = form => axios.post('/v1/school/gen-invite-code', form).then(res => res.data)
    // 添加学校
export const addSchool = form => axios.post('/v1/school/add', form).then(res => res.data)
    // 账号列表
export const accountLists = params => axios.get('/v1/account/lists', params).then(res => res.data)
    // 查看账号
    // export const accountShow = params => axios.get('/v1/account/show', params).then(res => res.data)
    // 更改状态
export const AchangeStatus = form => axios.post('/v1/account/change-status', form).then(res => res.data)
    // 删除学校账号
export const destoryAccount = form => axios.post('v1/account/destroy', form).then(res => res.data)