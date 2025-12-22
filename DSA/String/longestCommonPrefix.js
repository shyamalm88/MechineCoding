const longestCommonPrefix = (strs) => {
  if (strs.length === 0) return "";
  let prefix = "";

  for (let i = 0; i < strs[0].length; i++) {
    let char = strs[0][i];
    if (strs.every((str) => str[i] === char)) {
      prefix += char;
    } else {
      break;
    }
  }
  return prefix;
};
