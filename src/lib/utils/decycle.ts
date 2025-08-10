
export function decycle(obj: any, seen = new WeakSet()): any {
  if (obj && typeof obj === "object") {
    if (seen.has(obj)) return undefined; // 去掉循环引用
    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map(item => decycle(item, seen));
    }

    const newObj: any = {};
    for (const key in obj) {
      if (typeof obj[key] === "function") continue; // 不存方法
      if (key === "owner" && obj[key]?._id) {
        // 对于 owner 直接用 ID
        newObj.ownerId = obj[key]._id;
      } else {
        newObj[key] = decycle(obj[key], seen);
      }
    }
    return newObj;
  }
  return obj;
}
