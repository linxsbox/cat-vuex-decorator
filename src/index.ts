import { mapGetters, mapMutations, mapActions } from 'vuex';
import { createDecorator } from 'vue-class-component';

enum typeEnum {
  computed = 'computed',
  methods = 'methods',
  array = 'array',
  object = 'object',
}

// Parameter analysis of decorator.
const fnKeysType = (fnKeys: string | string[] | { [key: string]: string }) => {
  if (!fnKeys) {
    console.error('Decorator function expected 1-2 arguments, but got 0.');
    return false;
  }

  if (typeof fnKeys === 'string') { return { data: [fnKeys], type: typeEnum.array }; }

  else if (Array.isArray(fnKeys)) { return { data: fnKeys, type: typeEnum.array }; }

  else if (Object.keys(fnKeys).length > 0) { return { data: fnKeys, type: typeEnum.object }; }

  else { return false; }
};

// Create a binding function for Vuex.
function createBindingFnVuex (bindType: string, vMapFn: any) {
  // fnKeys = Vuex function key name
  // n = namespace
  return function makeDecorator (fnKeys: string | string[] | { [key: string]: string }, n?: string) {
    const tempFnKeys = fnKeysType(fnKeys);
    if (!tempFnKeys) { return createDecorator(_ => {/* null object */ }); }

    const paramData = tempFnKeys.data;
    const paramType = tempFnKeys.type;

    return createDecorator((options: any, key: string) => {
      if (!options[bindType]) { options[bindType] = {}; }
      const bindMapFn = n ? vMapFn(n, paramData) : vMapFn(paramData);

      const mapObject: Map<string, string> = new Map<string, string>();
      let singleBind: boolean = false;
      // Handle the array data type.
      if (paramType === typeEnum.array) {
        const tempArr = paramData as string[];
        tempArr.forEach(item => {
          let tempLabel: string = item;
          if (tempArr.length === 1) {
            options[bindType][key] = bindMapFn[item];
            singleBind = true;
          }
          else if (bindMapFn[item].name === 'mappedMutation') { tempLabel = '_m' + item; }
          else if (bindMapFn[item].name === 'mappedAction') { tempLabel = '_a' + item; }
          options[bindType][tempLabel] = bindMapFn[item];
          mapObject.set(tempLabel, item);
        });
      }

      // Handle the object data type.
      if (paramType === typeEnum.object) {
        const tempObj = paramData as { [key: string]: string };
        for (const k in tempObj) {
          if (tempObj.hasOwnProperty(k)) {
            options[bindType][k] = bindMapFn[k];
            mapObject.set(k, tempObj[k]);
          }
        }
      }

      // Non-single parameter processing.
      if (!singleBind) {
        options[bindType][key] = () => { /** Init decorator binding function. */ };
        // Injection function callback processing.
        options[bindType][key] = function wrapperMethod () {
          const bindThis: { [key: string]: any } = {};
          mapObject.forEach((vkey, label) => {
            const tempKey = paramType === typeEnum.array ? vkey : label;
            bindThis[tempKey] = this[label];
          });
          return bindThis;
        };
      }
    });
  };
}

const Getters = createBindingFnVuex(typeEnum.computed, mapGetters);
const Commits = createBindingFnVuex(typeEnum.methods, mapMutations);
const Actions = createBindingFnVuex(typeEnum.methods, mapActions);

const _default = {
  Getters,
  Commits,
  Actions,
};

export default _default ;

// type params = string | string[] | { [key: string]: string };
// export default class VuexDecorator {
//   static Getters: (options: params, namespace?: string) => any;
//   static Commits: (options: params, namespace?: string) => any;
//   static Actions: (options: params, namespace?: string) => any;
// }
