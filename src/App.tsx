import TaskForm from './components/CreationForm';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="wrapper">
      <TaskForm />

      <TaskList />
    </div>
  );
}

export default App;
