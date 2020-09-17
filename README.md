# cat-vuex-decorator
**cat-vuex-decorator** 是一个针对于使用 TypeScript 来编写 Vue 的 Vuex 封装实现。

`注: 只针对于 Vue 2.x TypeScript 项目，因 Vue 3.0 以及其支持库 CompositionAPI 将 Provide/Inject 提升至基础层能力了。`

**在不改变 Vuex 定义和使用基础的情况下**，以装饰器模式来实现 Vuex 的使用。

额外使用的 package
- [vuex](https://github.com/vuejs/vuex)
- [vue-class-component](https://github.com/vuejs/vue-class-component)

[版本说明](https://github.com/linxsbox/cat-vuex-decorator/blob/dev/README-Version.md)

## install

```bash
npm i -D cat-vuex-decorator
```

不改变 Vuex store 定义和使用基础的情况下
**store/index.ts**
```typescript
// store/index.ts
const getters = {
  getText: (state: any) => {
    return state.text;
  }
};
const mutations = {
  'SET_TEXT': (state: any, param: any) => {
    state.text = param;
  }
};
const actions = {
  setText: ({ commit }: any, params: any) => {
    setTimeout(() => {
      commit('SET_TEXT');
    }, 1000);
  }
};

export default {
  getters,
  mutations,
  actions,
};
```

**index.vue**
```typescript
<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import { Getters, Commits, Actions } from 'cat-vuex-decorator';

@Component
export default class Test extends Vue {
  // 注意：如果使用 TSlint、ESLint 并且启用了 strictPropertyInitialization: true
  // 为了保证能代码规范和顺利编译，那么请将装饰变量的定义类型支持 undefined 或者 !: 保证其有值
  @Getters('getText') getText: string | undefined; // ✔
  // or
  @Getters('getText') getText!: string // ✔

  // error
  @Getters('getText') getText: string; // ❌
}
</script>
```

---

## Usage
**function**
- [Getters](#Getters)
- [Commits](#Commits)
- [Actions](#Actions)

```ts
// 实现 createDecorator
// createDecorator 来自 vue-class-component
createBindingFnVuex implements createDecorator { ... }

// 参数类型定义
type params: string | string[] | {[key: string]: string;
type namespace?: string;
// module: { namespace: true } 时使用，可空
// 参考：https://vuex.vuejs.org/zh/guide/modules.html#带命名空间的绑定函数

const Getters = createBindingFnVuex(bindType, vMapFn)
const Commits = createBindingFnVuex(bindType, vMapFn)
const Actions = createBindingFnVuex(bindType, vMapFn)
```

---

## See also

### <a id="Getters"></a> @Getters( params, namespace )

```typescript
<template>
  <div>
    <p>{{ getText }}</p>
    <p>{{ gtxt }}</p>
    <p>{{ get1.title }}</p>
  <div>
<template>
<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import { Getters, Commits, Actions } from 'cat-vuex-decorator';

@Component
export default class Test extends Vue {

  @Getters('getText') getText!: any;
  @Getters(['getText']) gtxt!: any;        // 可设变量别名 getText -> gtxt
  @Getters({title: 'getText'}) get1: any;  // 可设属性别名 getText -> title

  mounted () {
    console.log(this.getText);       // => store.getters.getText
    console.log(this.gtxt);          // => store.getters.getText
    console.log(this.get1.title);    // => store.getters.getText
  }
}
</script>
```

### <a id="Commits"></a> @Commits( params, namespace ) c: any;

```typescript
<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import { Getters, Commits, Actions } from 'cat-vuex-decorator';

@Component
export default class Test extends Vue {

  @Commits('SET_TEXT') setText: any;
  @Commits(['SET_TEXT']) stxt: any;        // 可设变量别名 SET_TEXT -> stxt
  @Commits({title: 'SET_TEXT'}) set1: any; // 可设属性别名 SET_TEXT -> title

  mounted () {
    this.setText('这是标题！');      // => store.commit('SET_TEXT', '这是标题！')
    this.stxt('这是标题！');         // => store.commit('SET_TEXT', '这是标题！')
    this.set1().title('这是标题！'); // => store.commit('SET_TEXT', '这是标题！')
  }
</script>
```

### <a id="Actions"></a> @Actions( params, namespace ) a: any;

```typescript
<template>
  <div><div>
<template>
<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import { Getters, Commits, Actions } from 'cat-vuex-decorator';

@Component
export default class Test extends Vue {

  @Actions('setText') setTextAction: any;
  @Actions(['setText']) sTextAction: any;  // 可设变量别名 setText -> sTextAction
  @Actions({title: 'setText'}) setA1: any; // 可设属性别名 setText -> title

  mounted () {
    this.setTextAction('这是标题！'); // => store.dispatch('setText', '这是标题！')
    this.sTextAction('这是标题！');   // => store.dispatch('setText', '这是标题！')
    this.setA1().title('这是标题！'); // => store.dispatch('setText', '这是标题！')
  }
}
</script>
```

**e.g.**
```typescript
// store/index.ts
// ----- Action Promise -----
const actions = { // 假设 store 定义的 actions
  setPromise: ({commit}, params) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('SET_TEXT', params);
        resolve('设置完成！');
      }, 1000);
    });
  },
}

// index.vue
export default class Test extends Vue {
  @Actions('setPromise') setPromise: any;

  mounted () {
    this.setPromise('Promise 设置标题！')
    .then(data => {
      console.log(data); // '设置完成！'; 
    })
  }
}
```
