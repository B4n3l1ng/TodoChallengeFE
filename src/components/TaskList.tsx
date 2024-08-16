import { Checkbox, CheckboxProps, Divider } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { useContext, useState } from 'react';

import { TaskContext } from '../contexts/tasks/taskContext';
import Loader from './Loader';
import TaskItem from './TaskItem';

function TaskList() {
  const { state, sortTasks, setQueryState, dispatch } = useContext(TaskContext);
  const [checkboxState, setCheckboxState] = useState<boolean>();

  if (state.isLoading) {
    return <Loader />;
  }

  const onChange: CheckboxProps['onChange'] = (e) => {
    // Changes the request made according to the hide complete checkbox
    setCheckboxState(e.target.checked);
    setQueryState({ filter: e.target.checked ? 'INCOMPLETE' : 'ALL' });
    dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // key down event for accessibility purposes
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      sortTasks();
    }
  };

  return (
    <>
      <Divider orientation="left">
        <div
          onClick={sortTasks} // sorts the tasks on click, cycling through created date, alphabetical and reverse alphabetical orders
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Sort tasks"
          className="sorter"
        >
          Tasks
        </div>
      </Divider>
      <ul>
        <AnimatePresence>
          {state.tasks.map((task) => (
            <TaskItem item={task} key={task.id} />
          ))}
        </AnimatePresence>
      </ul>
      <Divider />
      <div className="hd-complete-check-wrapper">
        <Checkbox checked={checkboxState} onChange={onChange}>
          Hide complete
        </Checkbox>
      </div>
    </>
  );
}

export default TaskList;
