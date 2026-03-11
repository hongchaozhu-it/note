# 用户服务
用户注册接口：
http://127.0.0.1/xuebay/user/user/register
# 认证服务
认证注册接口：
http://127.0.0.1/xuebay/uaa/login/register
# 课程服务：
课程树接口：
http://127.0.0.1/xuebay/course/courseType/treeData
# 课程服务
查询课程章节：
http://127.0.0.1/xuebay/course/courseChapter/listByCourseId/{courseId}
查询课程列表：
http://127.0.0.1/xuebay/course/course/info/{courseIds}
查询课程详情：
http://127.0.0.1/xuebay/course/course/detail/data/{courseId}
# 媒体服务
注册文件上传：
http://127.0.0.1/xuebay/media/mediaFile/register
检测切块文件：
http://127.0.0.1/xuebay/media/mediaFile/listByCourseId/{courseId}
上传切块文件：
http://127.0.0.1/xuebay/media/mediaFile/uploadchunk
合并切块文件：
http://127.0.0.1/xuebay/media/mediaFile/mergechunks
过滤出推流完成的课程ID：
http://127.0.0.1/xuebay/media/mediaFile/listPushSuc
根据课程ID查询课程的所有媒体文件：
http://127.0.0.1/xuebay/media/mediaFile/listByCourseId/{courseId}
根据媒体文件ID查询视频M3U8索引文件：
http://127.0.0.1/xuebay/media/mediaFile/getForUrl/{id}
# 搜索服务
上架课程文档到ES
http://127.0.0.1/xuebay/media/opsDoc/onshelf
下架课程文档从ES
http://127.0.0.1/xuebay/media/opsDoc/offshelf
课程检索：
http://127.0.0.1/xuebay/media/course/search
# 订单服务
查询订单中包含的课程ID列表
http://127.0.0.1/xuebay/media/courseOrderItem/items/{orderNo}
课程下单：
http://127.0.0.1/xuebay/media/courseOrder/placeOrder
# 支付服务
付款单支付接口：
http://127.0.0.1/xuebay/pay/pay/apply
查询付款单是否支付：
http://127.0.0.1/xuebay/pay/pay/checkPayOrder/{orderNo}
支付宝回调：
http://127.0.0.1/xuebay/pay/callback
# 公共服务
上传文件：
http://127.0.0.1/xuebay/common/oss/uploadFile
删除文件：
http://127.0.0.1/xuebay/common/oss/delFile
短信验证码发送：
http://127.0.0.1/xuebay/common/verifycode/sendSmsCode/{phone}
创建订单放重复令牌：
http://127.0.0.1/xuebay/common/createToken/{courseId}
