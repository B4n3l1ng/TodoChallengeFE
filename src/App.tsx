import { ConfigProvider, Space, theme } from 'antd';

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Space>
        <h1>A test</h1>
      </Space>
    </ConfigProvider>
  );
}

export default App;
