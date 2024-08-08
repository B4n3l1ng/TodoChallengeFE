import { Button, Checkbox, Input, List, Typography } from 'antd';
import { useContext, useState } from 'react';

import { TaskContext } from '../contexts/taskContext';
import { Task } from '../interfaces/interfaces';

interface props {
  item: Task;
}

function TaskItem({ item }: props) {
  const taskContext = useContext(TaskContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState(item.description);

  if (!taskContext) {
    return <p>Loading...</p>;
  }

  return (
    <List.Item>
      <div className="list-item-left">
        <Checkbox checked={item.state === 'COMPLETE'} />
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
        {isEditing && <Button type="primary">Save</Button>}
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
          <Button type="primary" danger>
            Delete
          </Button>
        )}
      </div>
    </List.Item>
  );
}

export default TaskItem;
