import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom'
import Login from './components/login/Login';
import Register from './components/register/Register';
import Home from './components/home/Home';
import { useSelector } from 'react-redux';

function App() {
  const {user} = useSelector((state) => state.auth)

  return (
    <div>
     <Routes>
      <Route path='/' element={user ? <Home /> : <Navigate to='/login' />} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
      <Route path='/register' element={!user ? <Register /> : <Navigate to='/' />} />
     </Routes>
    </div>
  );
}

export default App;
