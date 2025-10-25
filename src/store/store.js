// Redux store configuration with saga middleware

import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import { tasksReducer } from "./reducer/tasksReducer";
import { entitiesReducer } from "./reducer/entitiesReducer";
import { uiReducer } from "./reducer/uiReducer";
import rootSaga from "./sagas/rootSaga";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  entities: entitiesReducer,
  ui: uiReducer,
});

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
  collapsed: true,
  diff: true,
  duration: true,
  timestamp: true,
  level: "info",
  logErrors: true,
  predicate: (getState, action) => {
    return process.env.NODE_ENV === "development";
  },
});

const composeEnhancers =
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
      })
    : compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware, logger))
);

sagaMiddleware.run(rootSaga);

export default store;
