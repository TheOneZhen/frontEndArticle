# JS数据类型
原始值类型存放在栈空间中，对象类型存放在堆空间中。*栈空间内存释放由编译器？*，堆空间内存释放由垃圾回收机制（GC）

function create (proto) {
    const obj = {}
    Object.setPrototypeOf(proto)
    return obj
}