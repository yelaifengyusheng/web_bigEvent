$(function() {
    var form = layui.form

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value, item) {
            //value：表单的值、item：表单的DOM对象
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function(value, item) {
            //value：表单的值、item：表单的DOM对象
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        },

    })

    // 表单绑定 submit 事件  发起 Ajax请求 修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)

                // 重置表单的值
                $('.layui-form')[0].reset()
            }
        })

    })

})