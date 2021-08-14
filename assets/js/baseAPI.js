// 注意每次调用$.get 或 $.post() 或 $.ajax()的时候会先调用ajaxprefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 1、在发起真正的Ajax之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        // console.log(options.url);

    // 2、 统一为有权限的接口，设置 header 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全局统一挂载 complete 回调函数
    //不论成功还是失败，最终都会调用用complete
    options.complete = function(res) {
        console.log('complete');
        console.log(res);
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、强制清空token
            localStorage.removeItem('token')

            // 2、强制跳转到登陆页面
            location.href = '/login.html'
        }
    }
})