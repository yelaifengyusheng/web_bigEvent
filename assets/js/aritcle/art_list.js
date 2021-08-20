$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        // 实例化对象
        const dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDay())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.setSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器 
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据 
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的  Id 
        state: '' // 文章的发布状态 
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                console.log(res);

                // 调用模板引擎
                var htmlStr = template('tpl-table', res)

                // // 渲染数据
                $('tbody').html(htmlStr)

                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败！')
                }
                // 调用模板引擎
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);

                // 渲染页面
                $('[name=cate_id]').html(htmlStr)

                // 通知 layui 重新渲染表单区域
                form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 获取表单中选中项的值
        var cate_id = $('[name = cate_id]').val()
        var state = $('[name = state]').val()

        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8, 10],
            // 分页发生切换的时候，就触发 jump 回调函数
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调 
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr

                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中 
                q.pagesize = obj.limit

                //首次不执行
                if (!first) {

                    // 根据最新的 q，重新渲染表格的数据
                    initTable()
                }
            }
        })

        // （删除文章列表）通过代理的形式 为 btn-delete 绑定点击事件 
        $('tbody').on('click', '.btn-delete', function() {
            var id = $(this).attr('data-id')
            var len = $('.btn-delete').length
            layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除文章失败！')
                        }
                        layer.msg('删除文章成功！')

                        // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                        // 如果没有剩余的数据了,则让页码值 -1 之后, 
                        // 再重新调用 initTable 方法
                        if (len === 1) {
                            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了 
                            // 页码值最小必须是 1 
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                            initTable()
                        }
                    }
                })
                layer.close(index);
            });
        })
    }






})