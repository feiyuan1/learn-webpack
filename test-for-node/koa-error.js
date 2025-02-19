/**
 * 实现 koa 中错误捕获的逻辑；
 */
function koaWithAsync() {
  const middlewares = [];
  const errorMids = [];
  const use = function (m) {
    if (typeof m !== "function") {
      throw "m should be a fun";
    }
    middlewares.push(m);
  };

  const error = function (err, ctx) {
    console.log("errMids called");
    errorMids.forEach((middleware) => middleware(err, ctx));
  };

  const compose = async function (middlewares) {
    const ctx = {};
    const dispatch = middlewares
      .slice()
      .reverse()
      .reduce(
        (dispatch, middleware) => async () => await middleware(ctx, dispatch),
        () => {}
      );
    return async () => {
      try {
        await dispatch();
      } catch (err) {
        error(err, ctx);
      }
    };
  };

  const start = async function () {
    const run = await compose(middlewares);
    run({});
  };

  const addErrorMids = function (mid) {
    if (typeof mid !== "function") {
      throw new Error("middleware should be a function");
    }
    errorMids.push(mid);
  };

  addErrorMids(() => {
    console.log("default error middleware supported by koa");
  });

  return { use, start, error, addErrorMids };
}

const app = koaWithAsync();
const map = {};
const customBind = function (key, handler) {
  map[key] = map[key] ? map[key].concat(handler) : [handler];
};

app.addErrorMids((error) => {
  if (!error.from) {
    return;
  }
  const handlers = map[error.from];
  if (error.from && !handlers?.length) {
    console.log("forgot to customBind for your middleware?");
    return;
  }
  if (!handlers) {
    return;
  }
  handlers.forEach((handler) => {
    handler(error);
  });
});

customBind("m1", (error) => {
  console.log("there is an error when process middleware-m1");
});

customBind("m2", (error) => {
  console.log("there is an error when process middleware-m2");
});

customBind("m3", (error) => {
  console.log("there is an error when process middleware-m3");
});

app.use(async function (ctx, next) {
  console.log("m1");
  await next();
  const error = new Error("m1 error");
  error.from = "m1";
  // throw error;
  console.log("m1-after");
});

app.use(async function (ctx, next) {
  console.log("m2");
  await next();
  const result = await new Promise((resolve, reject) => {
    resolve(2);
    // reject({ message: "m2 error", from: "m2" });
  });
  console.log("m2-result", result);
  console.log("m2-after");
});

app.use(async function (ctx, next) {
  console.log("m3");
  await next();
  const error = new Error("m3 error");
  error.from = "m3";
  throw error;
  console.log("m3-after");
});

app.start();
