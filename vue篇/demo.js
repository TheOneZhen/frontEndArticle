const obj = { a: 1 }
const p = new Proxy(obj, {
  get (target, key, receiver) {
    console.log('trapped object getter!')
    return Reflect.get(target, key, receiver)
  },
  set (target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver)
  }
})

console.log(p.a) // 1