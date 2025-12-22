const encode = (arr) => {
  if (arr.length === 0) return "";
  return arr.map((item) => `${item.length}#${item}`.join());
};

const decode = (str) => {
  while (i < s.length) {
    // 1. Find the delimiter to get the length
    let j = i;
    while (s[j] !== "#") {
      j++;
    }

    // 2. Extract the length (the number before '#')
    let length = parseInt(s.substring(i, j));

    // 3. Move pointer to the start of the actual string
    i = j + 1;

    // 4. Extract exactly 'length' characters
    res.push(s.substring(i, i + length));

    // 5. Move pointer to the start of the next encoded block
    i += length;
  }

  return res;
};
