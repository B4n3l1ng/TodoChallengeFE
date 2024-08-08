import { Button, Divider, Form, Input } from 'antd';
import { useContext } from 'react';

import { TaskContext } from '../contexts/taskContext';

function TaskForm() {
  const taskContext = useContext(TaskContext);

  if (!taskContext) {
    return <p>Loading...</p>;
  }

  const { createTask } = taskContext;

  return (
    <>
      <Divider>Add Task Form</Divider>
      <Form className="creation-form" onFinish={createTask}>
        <Form.Item
          label="Task description"
          name="description"
          rules={[{ required: true, message: 'Please input a description.' }]}
        >
          <Input type="text" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default TaskForm;
