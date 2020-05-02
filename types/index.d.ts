import { VueDecorator } from 'vue-class-component';
type params = string | string[] | { [key: string]: string };

/**
 * Getters 函数，实现了 store.getters 和 mapGetters
 * @param options string | string[] | {[key: string]: string}
 * @param namespace modules namespace
 */
export declare function Getters(options: params, namespace?: string): VueDecorator;

/**
 * Commits 函数，实现了 store.commit 和 mapMutations
 * @param options string | string[] | {[key: string]: string}
 * @param namespace modules namespace
 */
export declare function Commits(options: params, namespace?: string): VueDecorator;

/**
 * Actions 函数，实现了 store.dispatch 和 mapActions
 * @param options string | string[] | {[key: string]: string}
 * @param namespace modules namespace
 */
export declare function Actions(options: params, namespace?: string): VueDecorator;

declare module 'cat-vuex-decorator';
