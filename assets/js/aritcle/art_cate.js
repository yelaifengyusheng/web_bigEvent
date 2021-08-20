$(function() {
    var layer = layui.layer
    var form = layui.form

    // 获取文章分类列表
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html(),
        });
    })

    // （表单是动态添加的）通过代理的形式，为 form-add 表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 获取文章分类列表
                initArtCateList()

                // 根据索引 关闭弹出层
                layer.close(indexAdd)
                layer.msg(res.message)
            }
        })
    })


    // 通过代理的形式，为 btn-edit 绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function(e) {
        // alert('ok')
        // 弹出修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        });

        var id = $(this).attr('data-id')
        console.log(id);
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败！')
                }

                layer.msg('更新数据成功！')

                // 根据索引 关闭弹出层
                layer.close(indexEdit)

                // 获取文章分类列表
                initArtCateList()
            }
        })

    })

    // 通过代理的形式，为 btn-remove 绑定点击事件
    $('tbody').on('click', '.btn-delete', function(e) {
        // alert('ok')
        var id = $(this).attr('data-id')
            // console.log(id);
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // 发起请求获取对应分类的数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index);
                    // 获取文章分类列表
                    initArtCateList()
                }
            })
        })
    })
})