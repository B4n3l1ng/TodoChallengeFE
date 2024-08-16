import TaskForm from '../components/CreationForm';
import TaskList from '../components/TaskList';

// home page component, rendered on path /
function HomePage() {
  return (
    <div className="wrapper">
      <TaskForm />

      <TaskList />
    </div>
  );
}

export default HomePage;
