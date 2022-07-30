import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskDetails from './components/TaskDetails';

function App() {
  return (
    <div className="grid w-screen h-screen grid-cols-base gap-px bg-slate-500 text-slate-50">
      <TaskFilters />
      <TaskList />
      <TaskDetails />
    </div>
  );
}

export default App;
