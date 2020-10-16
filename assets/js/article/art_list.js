$(function () {
    var layer = layui.layer
    var form = layui.form
    //设置要选中的分页
    var laypage = layui.laypage;

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    };
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var r = padZero(dt.getUTCDate())

        //对模板引擎进行消除，让其进行渲染，数字类型发生改变
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getUTCMinutes())
        var ss = padZero(dt.getUTCSeconds())

        return y + '-' + m + '-' + r + ' ' + hh + ':' + mm + ':' + ss
    }
    //对数字进行过滤，让其日期
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //先渲染列表数据,让其全部显示
    // load()
    // function load() {
    //     $.ajax({
    //         method: 'GET',
    //         url: '/my/article/list',
    //         //让其全部显示出来，p只是让它以几页和显示几个的方式来进行显示出来
    //         data: q,
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg('获取列表失败')
    //             }
    //             layer.msg('获取成功')
    //             var htmlStr = template('tpl-cate', res)
    //             //让其数据渲染到tbody结构当中
    //             $('tbody').html(htmlStr);
    //             //当页面的数据渲染完成以后
    //             // 调用获取文章数据后，渲染下部的页码

    //             
    //         }
    //     })
    // }
    initTable()
    //获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    //这个是获取整个数据后，只获取id属性，让其进行渲染到列表当中
    // function check() {
    //     $.ajax({
    //         method: 'GET',
    //         url: '/my/article/cates',
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg('')
    //             }
    //         }
    //     })
    // }
    initCate()
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }

                layer.msg('获取分类数据成功')
                var htmlStr = template('tpl-cate', res)
                //对下拉框数据尽心渲染
                $('[name=cate_id]').html(htmlStr)
                //再次通知layui进行表单结构的渲染
                form.render();
            }
        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').submit(function (e) {
        e.preventDefault()
        //获取到当前表单中的数据
        //为当前的表单添加提交事件，让其能够
        // var
        var id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        q.cate_id = id
        q.state = state
        initTable()
    })

    //total为传入的数据个数
    function renderPage(total) {
        console.log(total);
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            //这个是旁边的显示的条数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) return
                initTable()
            }
        })

        //删除按钮,通过事件委托的形式来进行删除数据
        $('tbody').on('click', '.btn-delete', function () {
            //先获取要删除的自定义的id舒心
            var id = $(this).attr('data-id')
            var len = $('.btn-delete').length
            layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('删除失败');
                        }
                        layer.msg('删除成功')

                        //重新渲染页面，让其删除完的数据进行渲染到tbody下面来进行显示

                        if (len === 1) {
                            q.pagenum = q.pagenum = 1 ? 1 : q.pagenum - 1
                        }
                        initTable()

                    }
                })
                layer.close(index);
            });


        })




    }




})