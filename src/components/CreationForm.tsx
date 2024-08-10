import { Button, Divider, Form, Input } from 'antd';
import { useContext } from 'react';

import { TaskContext } from '../contexts/tasks/taskContext';
import Loader from './Loader';

function TaskForm() {
  const taskContext = useContext(TaskContext);
  const [form] = Form.useForm();

  if (!taskContext) {
    return <Loader />;
  }

  const { createTask } = taskContext;

  const handleFinish = async (values: { description: string }) => {
    await createTask(values);
    form.resetFields();
  };

  return (
    <>
      <Divider>Add Task Form</Divider>
      <Form className="creation-form" form={form} onFinish={handleFinish}>
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
