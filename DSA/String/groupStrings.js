const groupStrings = (strs) => {
  const map = new Map();

  for (let str of strs) {
    const diffs = [];

    for (let i = 1; i < str.length; i++) {
      let diff = str.charCodeAt(i) - str.charCodeAt(i - 1);
      if (diff < 0) diff += 26;
      diffs.push(diff);
    }

    const key = diffs.join(",");

    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }

  return Array.from(map.values());
};
