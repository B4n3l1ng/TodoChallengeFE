import { Button, Checkbox, Input, Typography } from 'antd';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';

import { TaskContext } from '../contexts/tasks/taskContext';
import { Task } from '../interfaces/interfaces';

interface props {
  item: Task;
}

function TaskItem({ item }: props) {
  const {
    changeTaskState,
    editTask,
    deleteTask,
    state: contextState,
  } = useContext(TaskContext);
  const [isEditing, setIsEditing] = useState<boolean>(false); // state for conditional rendering of the buttons
  const [newDescription, setNewDescription] = useState(item.description); // state for the edit input control

  const onClickCheckbox = () => {
    // handler to change the state of a task from Complete to Incomplete and vice-versa
    changeTaskState(item.id, {
      state: item.state === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE',
    });
  };

  const onSave = async (id: string, state: 'COMPLETE' | 'INCOMPLETE') => {
    // handler for the save button, editing the task according to it's id, state and description
    try {
      await editTask(id, {
        state,
        description: newDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      setIsEditing(false);
    }
  };

  return (
    <motion.li // settings for the animation
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 1 }}
      className="list-item"
    >
      <div className="list-item-left">
        <Checkbox
          checked={item.state === 'COMPLETE'} // change the state of the checkbox according to the item state
          onChange={onClickCheckbox}
        />
        {!isEditing ? ( // conditionally render normal text with the description, or the input to edit the task
          <Typography className="list-item-description">
            {item.description}
          </Typography>
        ) : (
          <Input
            value={newDescription}
            type="text"
            onChange={(e) => setNewDescription(e.target.value)}
            className="description-input"
          />
        )}
      </div>

      <div className="btn-group">
        {isEditing && ( // Conditionally render the Save button
          <Button
            type="primary"
            onClick={() => {
              onSave(item.id, item.state);
            }}
            loading={contextState.isLoading}
          >
            Save
          </Button>
        )}
        <Button
          type="primary"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
          danger={isEditing}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        {!isEditing && ( // conditionally render the delete buton
          <Button
            type="primary"
            danger
            onClick={() => deleteTask(item.id)}
            loading={contextState.isLoading}
          >
            Delete
          </Button>
        )}
      </div>
    </motion.li>
  );
}

export default TaskItem;
