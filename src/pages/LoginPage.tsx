import { Button, Divider, Form, Input } from 'antd';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../contexts/auth/authContext';

function LoginPage() {
  const { loginHandler } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <>
      <Divider>Login Form</Divider>
      <Form
        name="login"
        initialValues={{ email: '', password: '' }}
        className="creation-form column"
        onFinish={loginHandler}
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
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input a valid password.' },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
        <br />
        <Button
          type="link"
          onClick={() => {
            navigate('/login');
          }}
        >
          Don&apos;t have an account? Signup here
        </Button>
      </Form>
    </>
  );
}

export default LoginPage;
