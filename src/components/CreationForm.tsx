import { Button, Divider, Form, Input } from 'antd';
import { useContext } from 'react';

import { TaskContext } from '../contexts/tasks/taskContext';

function TaskForm() {
  const { createTask, state } = useContext(TaskContext);
  const [form] = Form.useForm(); // useForm hook from antd

  const handleFinish = async (values: { description: string }) => {
    await createTask(values);
    form.resetFields(); // reset the fields to the initial value
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

        <Button type="primary" htmlType="submit" loading={state.isLoading}>
          Submit
        </Button>
      </Form>
    </>
  );
}

export default TaskForm;
