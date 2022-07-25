import './scss/app.scss';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';

function App() {
  return (
    <div className="App">
      <TaskFilters />
      <TaskList />
      <TaskDetails />
    </div>
  );
}

export default App;
