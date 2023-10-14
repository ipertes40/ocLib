import axios from 'axios';
// axios 配置
var request = axios.create({
    headers: {
        post: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        } //post请求头
    },
    timeout: 10000, //请求超时时间
    baseURL: '/api', //请求默认地址
    withCredentials: true, //允许请求携带cookie信息
    crossDomain: true,
});
// 添加请求拦截器
request.interceptors.request.use(
        config => {
            // 在发送请求之前做些什么，比如传token
            return config
        }, error => {
            // 对请求错误做些什么
            console.log(error) // for debug
            return Promise.reject(error);
        })
    // 添加响应拦截器
request.interceptors.response.use(
    response => {
        //对请求响应做点什么
        return response;
    }, error => {
        // 对响应错误做点什么
        console.log('err' + error); // for debug
        if (error.response) {

            return Promise.reject(error);
        }
        switch (error.response.status) {

            case 401:
                {
                    //401没有权限做点什么
                    console.log('登录失效，请重新登录');
                    break;
                }
            case 403:
                {
                    // 返回 403 没有资格访问
                    console.log('没有访问权限');
                    break;
                }
            default:
                {

                    console.log('其他错误处理');
                }
        }
    });
export default request;