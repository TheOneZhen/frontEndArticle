// const obj = { a: 1 }
// const p = new Proxy(obj, {
//   get (target, key, receiver) {
//     console.log('trapped object getter!')
//     return Reflect.get(target, key, receiver)
//   },
//   set (target, key, value, receiver) {
//     return Reflect.set(target, key, value, receiver)
//   }
// })

// console.log(p.a) // 1

function process() {
  Promise.resolve().then(function () {
    console.log(1);
  });
  setTimeout(function () {
    console.log(2);
  });
  new Promise((resolve) => setTimeout(() => resolve(3))).then(function (res) {
    console.log(res);
  });
}

process();

const TemplateStr = `
<template>
  <div>
    <p>这是一行文本</p>
  </div>
  <custom-com>这是一个自定义组件</custom-com>
</template>
`;

function tokenize(str) {
  const result = [];
  const re = /<[a-z\-]+>|(?<=\>).*(?=\<)|<\/[a-z\-]+>/g;
  const matched = str.match(re);
  if (matched) {
    Array.from(matched).map((token) => {
      if (token.startsWith("</"))
        result.push({ type: "tagEnd", name: token.replace(/<\/|>/g, "") });
      else if (token.startsWith("<"))
        result.push({ type: "tag", name: token.replace(/<|>/g, "") });
      else result.push({ type: "text", name: token });
    });
  }
  return result;
}

function parse(str) {
  const tokens = tokenize(str);
  const root = { type: "root", children: [] };
  const stack = [root];

  while (tokens.length) {
    const parent = stack[stack.length - 1];
    const t = tokens[0];
    switch (t.type) {
      case "tag":
        const elementNode = {
          type: "Element",
          tag: t.name,
          children: [],
        };
        parent.children.push(elementNode);
        stack.push(elementNode);
        break;
      case "text":
        const textNode = {
          type: "Text",
          content: t.content,
        };
        parent.children.push(textNode);
        break;
      case "tagEnd":
        stack.pop();
        break;
    }
    tokens.shift();
  }

  return root;
}

console.log(parse(TemplateStr));

const len = 10000000
const target1 = {};
const target2 = Array(len).fill(null).reduce((pre, cur, index) => (pre[index] = index, pre), {})

Object.defineProperties(
  target1,
  Array(10000)
    .fill(null)
    .reduce(
      (pre, cur, index) => (pre[index] = {
        get() {
          return index;
        },
        set(val) {
          index = val;
        },
      }, pre),
      {}
    )
);

const proxy = new Proxy(target2, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    return Reflect.set(target, prop, value, receiver);
  },
});

function readTest(obj, sign) {
  let now = performance.now();
  for (let i = 0; i < len; ++i) {
    obj[i];
  }
  console.log(`${sign}: ${performance.now() - now}`);
}

readTest(proxy, "Proxy");

readTest(target1, "defineproperty")
