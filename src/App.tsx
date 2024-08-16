import { Route, Routes } from 'react-router-dom';

import NavBar from './components/NavBar';
import PrivateComponent from './components/PrivateComponent';
import TaskContextProvider from './contexts/tasks/taskContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfileEditPage from './pages/ProfileEditPage';
import RegistrationPage from './pages/RegistrationPage';

function App() {
  return (
    <>
      <NavBar /> {/* Renders the navbar component on all pages */}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateComponent>
              <TaskContextProvider>
                <HomePage />
                {/* Home page is private, hence wrapped in the privateComponent and requires task information, so also wrapped by the TaskContext */}
              </TaskContextProvider>
            </PrivateComponent>
          }
        />

        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <PrivateComponent>
              <ProfileEditPage />
              {/* Profile page is private as it needs the user information */}
            </PrivateComponent>
          }
        />
      </Routes>
    </>
  );
}

export default App;
