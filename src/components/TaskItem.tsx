import { Button, Checkbox, Input, Typography } from 'antd';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';

import { TaskContext } from '../contexts/tasks/taskContext';
import { Task } from '../interfaces/interfaces';
import Loader from './Loader';

interface props {
  item: Task;
}

function TaskItem({ item }: props) {
  const taskContext = useContext(TaskContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState(item.description);

  if (!taskContext) {
    return <Loader />;
  }

  const { changeTaskState, editTask, deleteTask } = taskContext;

  const onClickCheckbox = () => {
    changeTaskState(item.id, {
      state: item.state === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE',
    });
  };

  const onSave = async (id: string, state: 'COMPLETE' | 'INCOMPLETE') => {
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
    <motion.li
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 1 }}
      className="list-item"
    >
      <div className="list-item-left">
        <Checkbox
          checked={item.state === 'COMPLETE'}
          onChange={onClickCheckbox}
        />
        {!isEditing ? (
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
        {isEditing && (
          <Button
            type="primary"
            onClick={() => {
              onSave(item.id, item.state);
            }}
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
        {!isEditing && (
          <Button type="primary" danger onClick={() => deleteTask(item.id)}>
            Delete
          </Button>
        )}
      </div>
    </motion.li>
  );
}

export default TaskItem;
