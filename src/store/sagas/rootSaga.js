// Root saga combining all sagas

import { fork } from "redux-saga/effects";
import { watchTaskSagas } from "./taskSagas";

export default function* rootSaga() {
  yield fork(watchTaskSagas);
}
