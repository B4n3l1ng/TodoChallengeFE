import TaskForm from '../components/CreationForm';
import TaskList from '../components/TaskList';

function HomePage() {
  return (
    <div className="wrapper">
      <TaskForm />

      <TaskList />
    </div>
  );
}

export default HomePage;
