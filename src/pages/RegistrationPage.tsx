import { Button, Divider, Form, Input } from 'antd';
import { useContext } from 'react';

import { AuthContext } from '../contexts/auth/authContext';

function RegistrationPage() {
  const { registrationHandler } = useContext(AuthContext);
  return (
    <>
      <Divider />
      <Form
        name="register"
        initialValues={{ name: '', email: '', password: '' }}
        className="creation-form column"
        onFinish={registrationHandler}
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { type: 'email', message: 'The input is not a valid E-mail!' },
            { required: true, message: 'Please input your E-mail!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input a valid password.' },
          ]}
        >
          <Input type="password" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Create
        </Button>
      </Form>
    </>
  );
}

export default RegistrationPage;
