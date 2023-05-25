import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { AuthProvider, useFirebaseApp } from 'reactfire';
import { getAuth } from 'firebase/auth';
import Login from './pages/Login';
import AppLayout from './components/AppLayout/AppLayout';

function App() {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  return (
    <AuthProvider sdk={auth}>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route
          path='/'
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route path='/applications' element={<AppLayout>tables</AppLayout>} />
        <Route path='/add-application' element={<AppLayout>form</AppLayout>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
