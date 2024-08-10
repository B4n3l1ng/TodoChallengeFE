import { Checkbox, CheckboxProps, Divider } from 'antd';
import { AnimatePresence } from 'framer-motion';
import { useContext, useState } from 'react';

import { TaskContext } from '../contexts/tasks/taskContext';
import Loader from './Loader';
import TaskItem from './TaskItem';

function TaskList() {
  const taskContext = useContext(TaskContext);
  const [checkboxState, setCheckboxState] = useState<boolean>();

  if (!taskContext || taskContext.state.isLoading) {
    return <Loader />;
  }

  const { state, sortTasks, setQueryState, dispatch } = taskContext;

  const onChange: CheckboxProps['onChange'] = (e) => {
    setCheckboxState(e.target.checked);
    setQueryState({ filter: e.target.checked ? 'INCOMPLETE' : 'ALL' });
    dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      sortTasks();
    }
  };

  return (
    <>
      <Divider orientation="left">
        <div
          onClick={sortTasks}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Sort tasks"
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
