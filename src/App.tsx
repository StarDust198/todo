import TaskFilters from './components/TaskFilters';
import TaskListCompoent from './components/TaskListComponent';
import TaskDetails from './components/TaskDetails';

import 'react-datepicker/dist/react-datepicker.css';
import './style/DatePicker.css';

function App() {
  return (
    <div className="grid w-screen min-h-screen grid-cols-base gap-px bg-slate-500 text-slate-50">
      <TaskFilters />
      <TaskListCompoent />
      <TaskDetails />
    </div>
  );
}

export default App;
