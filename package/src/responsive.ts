const targetMap = new WeakMap<object, DepsMap>();

let activeEffect: Effect | null = null;

function track(target: object, key: PropertyKey) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      depsMap = new Map();
      targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
      dep = new Set();
      depsMap.set(key, dep);
    }
    dep.add(activeEffect);
  }
}

function trigger(target: object, key: PropertyKey) {
  const depsMap = targetMap.get(target);
  if (depsMap) {
    const dep = depsMap.get(key);
    if (dep) {
      dep.forEach((effect) => effect());
    }
  }
}

export function effect(fn: Effect) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

export function reactive<T extends object>(target: T): T {
  const handler = {
    get(target: T, key: PropertyKey, receiver: any) {
      track(target, key);
      const result = Reflect.get(target, key, receiver);
      return result;
    },
    set(target: T, key: PropertyKey, value: any, receiver: any) {
      const oldValue = Reflect.get(target, key, receiver);
      const result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        trigger(target, key);
      }
      return result;
    },
  };
  return new Proxy(target, handler);
}

export function ref<T>(initialValue: T) {
  const r = {
    value: initialValue,
  };

  return reactive(r);
}
