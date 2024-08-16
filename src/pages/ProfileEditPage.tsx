import { Button, Divider, Form, Input } from 'antd';
import { useContext } from 'react';

import { AuthContext } from '../contexts/auth/authContext';

// profile edit page, rendered on path /profile
function ProfileEditPage() {
  const { state, editHandler } = useContext(AuthContext);

  return (
    <>
      <Divider>Profile Page</Divider>
      <h3>Would you like to edit your profile?</h3>
      <Form
        name="edit-profile"
        initialValues={{
          // sets the initial values according to the logged in user
          newName: state.user?.name,
          newEmail: state.user?.email,
          newPassword: null,
          currentPassword: '',
        }}
        className="creation-form column"
        onFinish={editHandler} // trigers editHandler function on submit of the form
      >
        <Form.Item
          name="newName"
          label="Name"
          // triggers messages according to the rules
          rules={[{ required: true, message: 'Please input your name.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="newEmail"
          label="E-mail"
          // triggers messages according to the rules
          rules={[{ required: true, message: 'Please input your email.' }]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item name="newPassword" label="New Password">
          <Input type="password" />
        </Form.Item>
        <Form.Item
          name="currentPassword"
          label="Current Password"
          // triggers messages according to the rules
          rules={[
            { required: true, message: 'Please input your current password.' },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Button htmlType="submit" type="primary" loading={state.isLoading}>
          Save
        </Button>
      </Form>
    </>
  );
}

export default ProfileEditPage;
