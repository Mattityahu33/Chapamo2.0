import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Jobs from './pages/jobs/Jobs';
import PostJob from './pages/jobs/postjob/PostJob';
import JobDetails from './pages/jobs/JobDetails';
import News from './pages/news/News';
import NewsDetails from './pages/news/NewsDetails';
import PortFolios from './pages/portfolios/PortFolios';
import PortFolioDetails from './pages/portfolios/PortFolioDetails';
import CreatePortFolio from './pages/portfolios/CreatePortFolio';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import SearchResults from './components/SearchResults';
import SearchForm from './components/SearchForm';
import AdminDashboard from './pages/protected/admin/AdminDashboard';
import AdminLayout from './pages/protected/admin/AdminLayout';
import PostsManagement from './pages/protected/admin/PostsManagement';
import UserManagement from './pages/protected/admin/UserManagement';
import ProjectDoc from './pages/protected/admin/doc/ProjectDoc';
import SavedJobs from './pages/protected/users/SavedJobs';
import UserDashboard from './pages/protected/users/UserDashboard';
import UserProfile from './pages/protected/users/UserProfile';
import Login from './pages/auth/login/Login';
import Register from './pages/auth/register/Register';
import Apply from './pages/jobs/Apply';

const Layout = ({ children }) => {
  const location = useLocation();

  // Routes where Navbar and Footer should be hidden
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="page-wrapper">
      {!hideLayout && <Navbar />}

      <main className="content">
        {children}
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetails />} />
      <Route path="/jobs/:id/apply" element={<Apply />} />
      <Route path="/postJob" element={<PostJob />} />
      <Route path="/portfolios" element={<PortFolios />} />
      <Route path="/portfolios/:id" element={<PortFolioDetails />} />
      <Route path="/create" element={<CreatePortFolio />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/search-results" element={<SearchResults />} />
      <Route path="/search" element={<SearchForm />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/posts-management" element={<PostsManagement />} />
      <Route path="/admin/user-management" element={<UserManagement />} />
      <Route path="/admin/layout" element={<AdminLayout />} />
      <Route path="/admin/documentation" element={<ProjectDoc />} />
      <Route path="/user" element={<UserDashboard />} />
      <Route path="/user/SavedJobs" element={<SavedJobs />} />
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Layout>
);

export default App;