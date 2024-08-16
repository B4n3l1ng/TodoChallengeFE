import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

// simple Spinner to show while app is loading

function Loader() {
  return <Spin indicator={<LoadingOutlined spin />} size="large" />;
}

export default Loader;
