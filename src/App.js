import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { AuthProvider, FirestoreProvider, useFirebaseApp } from 'reactfire';
import { getAuth } from 'firebase/auth';
import Login from './pages/Login';
import AppLayout from './components/AppLayout';
import { getFirestore } from 'firebase/firestore';
import Insight from './pages/Insight';

function App() {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const fireStore = getFirestore(app);
  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={fireStore}>
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
          <Route
            path='/insight'
            element={
              <AppLayout>
                <Insight />
              </AppLayout>
            }
          />
        </Routes>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;
