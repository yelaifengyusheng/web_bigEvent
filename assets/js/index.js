$(function() {

    // 获取用户的基本信息
    getUserInfo()

    var layer = layui.layer
        // 为退出按钮绑定点击事件
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 清空本地存储的token
            localStorage.removeItem('token')

            // 重新跳转到登陆页面
            location.href = '/login.html'
            layer.close(index);

        });

    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status != 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data)
        },

        //不论成功还是失败，最终都会调用用complete
        // complete: function(res) {
        //     console.log('complete');
        //     console.log(res);
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1、强制清空token
        //         localStorage.removeItem('token')

        //         // 2、强制跳转到登陆页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 获取用户名称  优先获取nickname
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 判断用户是否有头像 有头像显示用户头像 没头像显示文本头像
    if (user.user_pic !== null) {
        // 用户有头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 用户没有头像
        var frist = name[0].toUpperCase()
        $('.text-avatar').html(frist).show()
        $('.layui-nav-img').hide()
    }
}