$(function () {
  var layer = layui.layer
  load()
  var form = layui.form
  //获取的数据进行渲染的函数
  function load() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取失败')
        }
        console.log(res);
        //通过变量进行接收数据，让其准备渲染到文本结构当中
        var htmlStr = template('tpl-table', res)
        //通过赋值进行将获取的数据对象进行渲染
        $('tbody').html(htmlStr)
      }
    })
  }

  //为了点击时候，关闭的是哪个弹出层，所以在这里需要给每个弹出层进行编号
  var indexAdd = null;
  //给按钮绑定点击事件
  $('#btnAddCate').click(function () {

    indexAdd = layer.open({
      title: '添加文章分类',
      type: 1,
      area: ['500px', '300px'],
      //content中可以写html标签，也可以写字符串
      content: $('#dialog-add').html()
    });
  })


  //给添加绑定点击事件，因为是动态进行添加的，所以需要进行委托来进行处理
  $('body').on('submit', '#form-add', function (e) {
    //先阻止浏览器的默认行为
    e.preventDefault()
    //发起ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      //数据就是你添加的这个表单所获取的数据
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('获取失败')
        }

        //获取成功以后，再次进行渲染
        load();
        layer.msg('渲染表单页面成功')
        //在此点击关闭按钮，能对其进行关闭
        layer.close(indexAdd);

      }
    })
  })



  //编辑的弹出层的进行提交新的留言
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {

    indexEdit = layer.open({
      title: '添加文章分类',
      type: 1,
      area: ['500px', '300px'],
      //content中可以写html标签，也可以写字符串
      content: $('#dialog-edit').html()
    });

    var id = $(this).attr('data-id')
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('提交失败')
        }

        form.val('form-edit', res.data)
        layer.msg('提交成功')
      }
    })

  })

  //通过代理的方式，对其修改的表单进行提交事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg('修改失败')
        }

        layer.close(indexEdit);
        load();
        // form.val('form-edit', res.data)
        layer.msg('更新分类信息成功')

      }
    })
  })

  //删除数据
  $('tbody').on('click', '.btn-delete', function () {
    //先拿到id
    var id = $(this).attr('data-id')
    console.log(id);
    layer.confirm('是否进行删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败')
          }
          layer.msg('删除成功')
          layer.close(index)

          load();
          //对其进行渲染
        }
      })
    })

  })




















  // initArtCateList()

  // // 获取文章分类的列表
  // function initArtCateList() {
  //   $.ajax({
  //     method: 'GET',
  //     url: '/my/article/cates',
  //     success: function(res) {
  //       var htmlStr = template('tpl-table', res)
  //       $('tbody').html(htmlStr)
  //     }
  //   })
  // }

  // // 为添加类别按钮绑定点击事件
  // var indexAdd = null
  // $('#btnAddCate').on('click', function() {
  //   indexAdd = layer.open({
  //     type: 1,
  //     area: ['500px', '250px'],
  //     title: '添加文章分类',
  //     content: $('#dialog-add').html()
  //   })
  // })

  // // 通过代理的形式，为 form-add 表单绑定 submit 事件
  // $('body').on('submit', '#form-add', function(e) {
  //   e.preventDefault()
  //   $.ajax({
  //     method: 'POST',
  //     url: '/my/article/addcates',
  //     data: $(this).serialize(),
  //     success: function(res) {
  //       if (res.status !== 0) {
  //         return layer.msg('新增分类失败！')
  //       }
  //       initArtCateList()
  //       layer.msg('新增分类成功！')
  //       // 根据索引，关闭对应的弹出层
  //       layer.close(indexAdd)
  //     }
  //   })
  // })
})
