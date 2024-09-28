import './App.css';
import ProfileClient from './(client)/pages/profile';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './auth/signup';
import SignIn from './auth/signin';
import { useAuth } from './AuthContext';
import ProtectedRoute from './protectedRoute';
import FreelancerProfile from './(freelancer)/pages/profile';
import WelcomeScreen from './welcomescreen';
import ClientJobs from './(client)/pages/postJobs';
import ProfileSetup from './(client)/pages/profileSetup';

function App() {
  const getProfileRoute = () => {
    const userRole = localStorage.getItem('userRole'); // Get role from storage
    if (userRole === 'client') return '/client-profile';
    if (userRole === 'freelancer') return '/freelancer-profile';
    return '/welcome'; // If role is not selected, go to the welcoming screen
  };
  const getJobsRoute=()=>{
    const userRole = localStorage.getItem('userRole'); // Get role from storage
    if (userRole === 'client') return '/client-jobs';
    if (userRole === 'freelancer') return '/freelancer-jobs';
    return '/welcome'; 
  }
  const { currentUser } = useAuth();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Navigate to="/profile" /> : <Navigate to="/signin" />}
        />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Navigate to={getProfileRoute()} />} />
        <Route path="/client-profile" element={
          <ProtectedRoute><ProfileClient /></ProtectedRoute>} />
        <Route path="/freelancer-profile" element={<ProtectedRoute><FreelancerProfile /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Navigate to={getJobsRoute()}/></ProtectedRoute>}/>
        <Route path='/client-jobs' element={
          <ProtectedRoute><ClientJobs/></ProtectedRoute>}/>
        <Route path='profile-setup' element={<ProtectedRoute>
          <ProfileSetup/>
        </ProtectedRoute>}/>
        <Route path='/freelancer-jobs' element={
          <ProtectedRoute><ClientJobs/></ProtectedRoute>}/>


        <Route path="/welcome" element={<WelcomeScreen/>}/>
      </Routes>
    </Router>
  );
}

export default App;
