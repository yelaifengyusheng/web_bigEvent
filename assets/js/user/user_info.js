$(function() {
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1-6 个'
            }
        }
    })

    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res);

                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            },
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
            // 阻止表单的重置默认行为
            e.preventDefault()

            // 初始化用户的基本信息
            initUserInfo()
        })
        // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单提交的默认行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！') <
                    // iframe > 中的子页面， 如果想要调用父页面中的方法， 使用 window.parent 即可。
                    window.parent.getUserInfo()
            }

        })

    })


})