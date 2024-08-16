import { Button, Divider, Form, Input } from 'antd';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../contexts/auth/authContext';

// login page component, rendered on /login

function LoginPage() {
  const { loginHandler, state } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <>
      <Divider>Login Form</Divider>
      <Form
        name="login"
        initialValues={{ email: '', password: '' }} // sets the initial values for the 2 inputs
        className="creation-form column"
        onFinish={loginHandler} // triggers the loginHandler on submit of the form
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            // triggers messages according to the rules
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
            // triggers messages according to the rules
            { required: true, message: 'Please input a valid password.' },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={state.isLoading}>
          Login
        </Button>
        <br />
        <Button
          type="link"
          onClick={() => {
            navigate('/signup');
          }}
        >
          Don&apos;t have an account? Signup here
        </Button>
      </Form>
    </>
  );
}

export default LoginPage;
