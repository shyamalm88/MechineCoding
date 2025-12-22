const groupAnagram = (strs) => {
  let map = new Map();
  for (let str of strs) {
    const freq = new Array(26).fill(0);

    for (let ch of str) {
      freq[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    const key = freq.join("#");
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(str);
  }

  return Array.from(map.values());
};
