# cat-vuex-decorator
**cat-vuex-decorator** 是一个针对于使用 TypeScript 来编写 Vue 的 Vuex 封装实现。

**在不改变 Vuex 定义和使用基础的情况下**，以装饰器模式来实现 Vuex 的使用。

额外使用的 package
- [vuex](https://github.com/vuejs/vuex)
- [vue-class-component](https://github.com/vuejs/vue-class-component)

[版本说明](https://github.com/linxsbox/cat-vuex-decorator/blob/dev/README-Version.md)

## install

```bash
npm i -D cat-vuex-decorator
```

**index.vue**
```typescript
<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import { Getters, Commits, Actions } from 'cat-vuex-decorator';

@Component
export default class Test extends Vue {
  @Getters('getter') g: any;
  @Commits('mutations') c: any;
  @Actions('action') a: any;

  // 注意：如果使用 TSlint、ESLint 并且启用了 strictPropertyInitialization: true
  // 为了保证能代码规范和顺利编译，那么请将装饰变量的定义类型新增 undefined
  @Getters('getTitle') getTitle: string | undefined; // ✔
  @Getters('getTitle') getTitle: string; // ❌
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
    <p>{{ title }}</p>
    <p>{{ g3.subtitle }}</p>
    <p>{{ g4.t1 }}</p>
  <div>
<template>
<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import { Getters, Commits, Actions } from 'cat-vuex-decorator';

@Component
export default class Test extends Vue {

  @Getters('title') g: any;
  @Getters(['title']) g2: any;
  @Getters(['title', 'subtitle']) g3: any;
  @Getters({t1: 'title'}) g4: any;
  @Getters({t2: 'title', t3: 'subtitle'}) g5: any;

  mounted () {
    this.g; // => store.getters.title
    this.g2; // => store.getters.title
    this.g3; // => store.getters
    this.g3.title; // => store.getters.title
    this.g3.subtitle; // => store.getters.subtitle
    this.g4.t1 // return t1 => store.getters.title -> 别名定义
    this.g4.title // "TypeError: .title is not a function"
    this.g5.t2 // 同 g4 别名定义
    this.g5.t3 // 同 g4 别名定义
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

  @Commits('setTitle') c: any;
  @Commits(['setTitle', 'setSubTitle']) c2: any;
  @Commits(t2: 'setTitle', t3: 'setSubTitle') c3: any;

  mounted () {
    this.c('这是标题！'); // => store.commit('setTitle', '这是标题！')

    this.c2().setTitle('这是标题！'); // => store.commit('setTitle', '这是标题！')
    this.c2().setSubTitle('这是小标题！'); // => store.commit('setSubTitle', '这是小标题！')

    this.c3().t2('这是标题！'); // return t2 => store.commit('title', '这是标题！') -> 别名定义
    this.c3().t3('这是小标题！'); // 同上 别名定义
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

  @Actions('setTitle') a: any;
  @Actions(['title', 'subtitle']) a2: any;
  @Actions(t2: 'title', t3: 'subtitle') a3: any;

  mounted () {
    this.a('标题！'); // => store.dispatch('setTitle', '这是标题！')

    this.a2().title('标题！'); // => store.dispatch('setTitle', '这是标题！')
    this.a2().subtitle('小标题！'); // => store.dispatch('subtitle', '这是标题！')

    this.a3().t2('标题！'); // return t2 => store.dispatch('title', '这是标题！') -> 别名定义
    this.a3().t3('小标题！'); // 同上 别名定义
  }

  // ----- Action Promise -----
  const actions = { // 假设 store 定义的 actions
    setPromise: ({commit}, params) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('setTitle', params);
          resolve('设置完成！');
        }, 1000);
      });
    },
  }

  @Actions('setPromise') ap: any;

  mounted () {
    this.ap('Promise 设置标题！')
    .then(data => {
      console.log(data); // '设置完成！'; 
    })
  }
}
</script>
```
