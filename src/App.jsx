import { Provider } from "react-redux";
import { store } from "./store";
import "./App.css";
import { TaskDashboard } from "./components/TaskDashboard";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <TaskDashboard />
      </div>
    </Provider>
  );
}

export default App;
