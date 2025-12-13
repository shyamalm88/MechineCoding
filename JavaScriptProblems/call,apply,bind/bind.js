Function.prototype.myBind = function (context, ...args) {
  const fn = this;

  return function (...newArgs) {
    // Merge outer args (from bind) and inner args (from call)
    return fn.apply(context, [...args, ...newArgs]);
  };
};
