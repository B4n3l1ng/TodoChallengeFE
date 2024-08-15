import { Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar';
import PrivateComponent from './components/PrivateComponent';
import TaskContextProvider from './contexts/tasks/taskContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <TaskContextProvider>
              <PrivateComponent>
                <HomePage />
              </PrivateComponent>
            </TaskContextProvider>
          }
        />

        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
