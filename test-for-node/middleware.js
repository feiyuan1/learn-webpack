/**
 * redux-middleware
 */
console.log("----start-redux-middleware-----");

const middleware1 = (storeApi) => (next) => (action) => {
  console.log("redux-1-start");
  next(action);
  console.log("redux-1-end");
};

const middleware2 = (storeApi) => (next) => (action) => {
  console.log("redux-2-start", action);
  next(action);
  console.log("redux-2-end");
};

const reduxThunkMiddleware = (storeApi) => (next) => (action) => {
  console.log("thunk-start: ", action);
  if (typeof action === "function") {
    action(next);
    return;
  }
  next(action);
  console.log("thunk-end");
};

let applyMiddleware;

const getData = (params) => (dispatch, state) => {
  new Promise((resovle) => {
    setTimeout(resovle, 1000);
  }).then((data) => {
    dispatch({
      type: "update",
      payload: data,
    });
  });
};

const testCases = () => {
  const { dispatch } = applyMiddleware([
    reduxThunkMiddleware,
    middleware1,
    middleware2,
  ]);

  // async logic
  dispatch(getData({}));
  // sync logic
  // dispatch();
};

const testApplyMiddlewareWithScope = () => {
  const applyMiddlewareWithReduce = (middlewares) => {
    const storeApi = { dispatch: function () {} };

    const dispatch = middlewares
      .slice()
      .reverse()
      .reduce((dispatch, middleware) => {
        dispatch = middleware(storeApi)(dispatch);
      }, storeApi.dispatch);

    return { dispatch };
  };
  applyMiddleware = applyMiddlewareWithReduce;
  testCases();
};

const testApplyMiddlewareWithReduce = () => {
  const applyMiddlewareWithScope = (middlewares) => {
    const storeApi = { dispatch: function () {} };
    let dispatch = storeApi.dispatch;

    middlewares
      .slice()
      .reverse()
      .forEach((middleware) => {
        dispatch = middleware(storeApi)(dispatch);
      });

    return { dispatch };
  };
  applyMiddleware = applyMiddlewareWithScope;
  testCases();
};

// testApplyMiddlewareWithScope();
testApplyMiddlewareWithReduce();
