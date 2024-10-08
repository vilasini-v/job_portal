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
import ProfileSetupClients from './(client)/pages/profileSetup';
import FreelancerJobs from './(freelancer)/pages/freelancerJobs';
import ProfileSetupFreelancers from './(freelancer)/pages/profileSetup';

function App() {
 const userRole = localStorage.getItem('userRole'); // Get role from storage once

 const getProfileRoute = () => {
  if (userRole === 'client') return '/client-profile';
  if (userRole === 'freelancer') return '/freelancer-profile';
  return '/welcome'; 
 };

 const getJobsRoute = () => {
  if (userRole === 'client') return '/client-jobs';
  if (userRole === 'freelancer') return '/freelancer-jobs';
  return '/welcome'; 
 };

 const getProfileSetup = () => {
  if (userRole === 'client') return '/client-profile-setup';
  if (userRole === 'freelancer') return '/freelancer-profile-setup';
  return '/welcome'; 
 };

 const { currentUser } = useAuth();

 return (
  <Router>
   <Routes>
    <Route path="/" element={<Navigate to={currentUser ? getProfileRoute() : '/signin'} />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/profile" element={<Navigate to={getProfileRoute()} />} />
    <Route path="/client-profile" element={<ProtectedRoute><ProfileClient /></ProtectedRoute>} />
    <Route path="/freelancer-profile" element={<ProtectedRoute><FreelancerProfile /></ProtectedRoute>} />
    <Route path="/jobs" element={<ProtectedRoute><Navigate to={getJobsRoute()} /></ProtectedRoute>} />
    <Route path='/client-jobs' element={<ProtectedRoute><ClientJobs /></ProtectedRoute>} />
    <Route path='/profile-setup' element={<Navigate to={getProfileSetup()} />} />
    <Route path='/freelancer-jobs' element={<ProtectedRoute><FreelancerJobs /></ProtectedRoute>} />
    <Route path='/freelancer-profile-setup' element={<ProtectedRoute><ProfileSetupFreelancers /></ProtectedRoute>} />
    <Route path='/client-profile-setup' element={<ProtectedRoute><ProfileSetupClients /></ProtectedRoute>} />
    <Route path="/welcome" element={<WelcomeScreen />} />
   </Routes>
  </Router>
 );
}

export default App;
