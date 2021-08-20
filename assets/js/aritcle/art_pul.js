$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                layer.msg('初始化文章分类成功！')
                    // 调用模板引擎
                var htmlStr = template('tpl-cate', res)

                // 渲染下拉菜单
                $('[name=cate_id]').html(htmlStr)

                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮绑定点击事件 模拟手动点击文件选择框
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听 文件选择框 的 change 事件， 获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取文件的列表数组
        var file = e.target.files
            // console.log(file);
            // console.log(file[0]);

        // 判断用户是否选择了文件
        if (file.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file[0])

        // 为裁剪区重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'

    // 为存为草稿，绑定点击事件处理函数
    $('#btnSave2').on('click', function(e) {
        art_state = '草稿'
    })

    // 为表单绑定 submit 事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
            // console.log(fd);

        // 3.将文章的发布状态，存到fd 中
        fd.append('state', art_state)

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                // 6.发起 ajax 数据请求

                publishArtcle(fd)
            })
    })

    // 定义一个发布文章的方法
    function publishArtcle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')

                // 发布文章成功后，跳转到文章列表页面 
                location.href = '/aritcle/art_list.html'
            }
        })
    }

})