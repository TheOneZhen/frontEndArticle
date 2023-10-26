# 疑问点

1. OOP、FP、FRP
2. Nest使用的服务器框架（Express[default]、Fastify），为什么使用它们，Nest是什么东西

    Nest提供开箱即用的应用架构，

    @Body()的优势：解析POST body需要消耗服务器资源且存在安全问题，nodejs默认不解析POST body，但是nestjs的装饰器工具实现这点。

    推测nestjs不支持http2，也是因为上述原因。

3. controller + DTO完整案例：https://nest.nodejs.cn/controllers#%E5%AE%8C%E6%95%B4%E8%B5%84%E6%BA%90%E6%A0%B7%E6%9C%AC

    还包括Module，每个controller都是一个Module

4. providers中的依赖注入是如何实现的？单纯的依赖TS？

5. 依赖注入与控制反转
6. SOLID原则：（漫画很有意思https://baijiahao.baidu.com/s?id=1747492023134059981&wfr=spider&for=pc）
    1. 单一责任
    2. 开放封闭
    3. 里氏替换
    4. 接口分离
    5. 依赖倒置
7. AOP：在不修改核心源码的情况下，给程序添加功能。可以隔离各个业务、降低业务之间耦合度、提升程序复用性、提高开发效率