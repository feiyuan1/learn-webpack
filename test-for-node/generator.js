/**
 * 使用说明：
 * 测试用例包含在函数中，这类函数以 TestCases 为结尾命名；
 * 执行测试用例 =>> 搜索 TestCases 找到对应的测试用例所在函数并执行
 */

/**
 * generator 初始使用示例
 */
// 生成器函数
const generatorExam = function () {
  function* test() {
    yield 1;
    yield 2;
    yield 3;
  }

  // 返回的是生成器
  const gen = test();

  console.log("value: ", gen.next());
  console.log("value: ", gen.next());
  console.log("value: ", gen.next());
};

/**
 * 用 generator 模拟实现 async await，具体场景为：隔 1000ms 2000ms 3000ms 打印一次日志
 */
const delay = function (interval) {
  return new Promise((res) => {
    setTimeout(() => {
      res(`delay ${interval}`);
    }, interval);
  });
};

function* test() {
  const step1 = yield delay(1000);
  console.log("step1: ", step1);
  const step2 = yield delay(2000);
  console.log("step2: ", step2);
  const step3 = yield delay(3000);
  console.log("step3: ", step3);
  // return "asyncTest";
}

// async & await 使用样例
const asyncExample = function () {
  async function asyncTest() {
    const step1 = await delay(1000);
    console.log("step1: ", step1);
    await delay(2000);
    console.log("step2: ", step3);
    await delay(3000);
    console.log("step3: ", step3);

    return "asyncTest";
  }

  asyncTest().then(console.log); // asyncTest
};

function asyncGenerator(generator) {
  return function () {
    return new Promise((resolve, reject) => {
      try {
        const gen = generator(...arguments);

        function step(type, res) {
          const { value, done } = gen[type](res);
          Promise.resolve(value)
            .then((result) => {
              if (!done) {
                step("next", result);
              }
              if (done) {
                resolve(result);
              }
            })
            .catch((err) => step("throw", err));
        }

        step("next");
      } catch (error) {
        reject(error);
      }
    });
  };
}

const testAsyncGenerator = function () {
  asyncGenerator(test)().then((result) =>
    console.log("final-result: ", result)
  );
};

const generatorTestCases = function () {
  console.log("-----start generator");
  // generatorExam()
  // asyncExample()
  testAsyncGenerator();
  console.log("-----generator end");
};

// generatorTestCases();

/**
 * express middleware
 */
const myExpress = function () {
  const middlewares = [];

  const compose = function (middlewares) {
    return function (ctx) {
      const dispatch = function (index) {
        const middleware = middlewares[index];
        middleware(ctx, () => {
          return dispatch(index + 1);
        });
      };
      return dispatch(0);
    };
  };

  const use = function (m) {
    if (typeof m !== "function") {
      throw "m should be a fun";
    }
    middlewares.push(m);
  };

  const start = function () {
    const ctx = {};
    const result = compose(middlewares);
    return result(ctx);
  };

  return {
    use,
    start,
  };
};

const testExpress = function () {
  const app = myExpress();

  app.use(function (ctx, next) {
    console.log("1-start");
    next();
    // throw "error1";
    console.log("1-end");
  });

  app.use(function (ctx, next) {
    console.log("2-start");
    next();
    console.log("2-end");
  });

  app.use(function (ctx, next) {
    console.log("3-start");
    next();
    console.log("3-end");
  });

  app.use(function (ctx, next) {
    console.log("4-start");
    console.log("4-end");
  });

  app.start();
};

/**
 * koa middleware
 */
function koaWithPromise() {
  const middlewares = [];

  const use = function (m) {
    if (typeof m !== "function") {
      throw "m should be a fun";
    }
    middlewares.push(m);
  };

  const compose = function (middlewares) {
    return function (ctx) {
      const dispatch = function (index) {
        if (index >= middlewares.length) {
          return;
        }

        const middleware = middlewares[index];
        // 异步中间件同步化
        // 注意：这里没有处理中间件的异常
        Promise.resolve(
          middleware(ctx, () => {
            return dispatch(index + 1);
          })
        );
      };
      return dispatch(0);
    };
  };

  const start = function () {
    compose(middlewares)({});
  };

  return { use, start };
}

function koaWithAsync() {
  const middlewares = [];
  const use = function (m) {
    if (typeof m !== "function") {
      throw "m should be a fun";
    }
    middlewares.push(m);
  };

  const compose = async function (middlewares) {
    return async function (ctx) {
      const dispatch = async function (i) {
        const next = async function () {
          await dispatch(i + 1);
        };

        if (i >= middlewares.length) {
          return;
        }
        const m = middlewares[i];
        await m(ctx, next);
      };

      dispatch(0);
    };
  };

  const start = async function () {
    const run = await compose(middlewares);
    run({});
  };

  return { use, start };
}

function koaWithGen() {
  const middlewares = [];

  const use = function (m) {
    if (typeof m !== "function") {
      throw "m should be a fun";
    }
    middlewares.push(m);
  };

  const compose = function (middlewares) {
    return function (ctx) {
      const dispatch = function* (i) {
        const next = function* () {
          yield asyncGenerator(dispatch)(i + 1);
        };

        if (i >= middlewares.length) {
          return;
        }
        const m = middlewares[i];
        yield m(ctx, asyncGenerator(next));
      };
      asyncGenerator(dispatch)(0);
    };
  };

  const start = function () {
    compose(middlewares)({});
  };

  return { use, start };
}

const testKoa = function () {
  const app = koaWithGen();
  // const app = koaWithAsync();
  // const app = koaWithPromise();
  app.use(async function (ctx, next) {
    console.log("m1");
    await next();
    // throw "koa mid error";
    console.log("m1-after");
  });
  app.use(async function (ctx, next) {
    console.log("m2");
    await next();
    await new Promise((resolve) => {
      resolve(2);
    });
    console.log("m2-after");
  });
  app.use(async function (ctx, next) {
    console.log("m3");
    await next();
    console.log("m3-after");
  });
  app.start();
};

const nodeMiddlwareTestCases = function () {
  console.log("-----koa&express start");
  // testExpress();
  testKoa();
  console.log("-----koa&express end");
};

nodeMiddlwareTestCases();
