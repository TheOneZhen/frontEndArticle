## package and module

- `package`可能是一个文件或者一个文件夹，但是必须有`package.json`文件来描述这个包。
- `module`可能是一些js文件，或者是一个文件夹，但这个文件夹中必须包含`package.json`文件，且`package.json`中包含`main`字段。`module`必须放在项目`node_modules`目录下，且可以通过CJM或者ESM的方式导入。


