export default {
  input: 'lib/cat-vuex-decorator.js',
  output: {
    file: 'lib/cat-vuex-decorator.umd.js',
    format: 'umd',
    name: 'CatVuexDecorator',
    globals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-class-component': 'VueClassComponent',
    },
    exports: 'named',
  },
  external: ['vue', 'vuex', 'vue-class-component'],
}