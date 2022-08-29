import TaskFilters from './components/TaskFilters';
import TaskListCompoent from './components/TaskListComponent';
import TaskDetails from './components/TaskDetails';

function App() {
  return (
    <div className="grid w-screen h-screen grid-cols-base gap-px bg-slate-500 text-slate-50">
      <TaskFilters />
      <TaskListCompoent />
      <TaskDetails />
    </div>
  );
}

export default App;
