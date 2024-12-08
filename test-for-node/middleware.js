console.log("----start-redux-middleware-----");

// redux-middleware
const middleware1 = (storeApi) => (next) => (action) => {
  console.log("redux-1-start");
  next(action);
  console.log("redux-1-end");
};

const middleware2 = (storeApi) => (next) => (action) => {
  console.log("redux-2-start");
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

const applyMiddleware = (middlewares) => {
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

const { dispatch } = applyMiddleware([
  reduxThunkMiddleware,
  middleware1,
  middleware2,
]);

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

// async logic
dispatch(getData({}));
// sync logic
dispatch();
