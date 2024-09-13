type DeepPartial<T> = T extends object
  ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T;

function isObject(item: unknown): item is object {
  return !!item && typeof item === "object" && !Array.isArray(item);
}

export function deepMerge<T>(target: T, ...sources: DeepPartial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key as keyof T]) Object.assign(target, { [key]: {} });
        // Any is ok in this situation because the target and sources are already validated when
        // deepMerge is first called
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deepMerge(target[key as keyof T], source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
}
