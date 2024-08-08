import { Checkbox, CheckboxProps, Divider, List } from 'antd';
import { useContext, useState } from 'react';

import { TaskContext } from '../contexts/taskContext';
import TaskItem from './TaskItem';

function TaskList() {
  const taskContext = useContext(TaskContext);
  const [checkboxState, setCheckboxState] = useState<boolean>();

  if (!taskContext || taskContext.state.isLoading) {
    return <div>Loading...</div>;
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
      <List
        bordered
        dataSource={state.tasks}
        renderItem={(item) => <TaskItem item={item} />}
      />
      <Checkbox
        style={{ textAlign: 'left' }}
        checked={checkboxState}
        onChange={onChange}
      >
        Hide complete
      </Checkbox>
    </>
  );
}

export default TaskList;
