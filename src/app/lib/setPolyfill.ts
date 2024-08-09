function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA, ...setB]);
}

function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter((x) => setB.has(x)));
}

function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter((x) => !setB.has(x)));
}

function addUnique<T>(set: Set<T>, item: T): Set<T> {
  for (const elem of set) {
    if (JSON.stringify(elem) === JSON.stringify(item)) {
      return  set// Item is already in the set
    }
  }
  set.add(item);
  return set;
}

export { union, intersection, difference, addUnique };
