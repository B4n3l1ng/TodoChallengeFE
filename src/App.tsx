import { Route, Routes } from 'react-router-dom';

import ContextWrapper from './contexts/tasks/contextWrapper';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';

function App() {
  return (
    <ContextWrapper>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/signup" element={<RegistrationPage />} />
      </Routes>
    </ContextWrapper>
  );
}

export default App;
