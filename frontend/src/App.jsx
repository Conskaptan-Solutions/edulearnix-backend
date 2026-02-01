import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';
import ScrollToTop from './components/common/ScrollToTop';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SuperAdminRoute from './components/auth/SuperAdminRoute';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import MockTests from './pages/MockTests';
import MockTestDetails from './pages/MockTestDetails';
import DigiLearnix from './pages/DigiLearnix';
import About from './pages/About';
import Contact from './pages/Contact';

// Policy Pages
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import PendingApproval from './pages/auth/PendingApproval';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyPosts from './pages/dashboard/MyPosts';
import Profile from './pages/dashboard/Profile';
import CreateJob from './pages/dashboard/CreateJob';
import CreateResource from './pages/dashboard/CreateResource';
import CreateBlog from './pages/dashboard/CreateBlog';
import CreateProduct from './pages/dashboard/CreateProduct';

// Old Super Admin Pages (legacy)
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import PendingApprovals from './pages/admin/PendingApprovals';

// New Super Admin Pages with Sidebar Layout
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import ContributorManagement from './pages/superadmin/ContributorManagement';
import JobManagement from './pages/superadmin/JobManagement';
import ResourceManagement from './pages/superadmin/ResourceManagement';
import BlogManagement from './pages/superadmin/BlogManagement';
import CourseManagement from './pages/superadmin/CourseManagement';
import DigitalProductManagement from './pages/superadmin/DigitalProductManagement';
import MockTestManagement from './pages/superadmin/MockTestManagement';
import SuperAdminProfile from './pages/superadmin/SuperAdminProfile';
import ClaimsManagement from './pages/superadmin/ClaimsManagement';

// Contributor Pages with Sidebar Layout
import ContributorLayout from './pages/contributor/ContributorLayout';
import ContributorDashboard from './pages/contributor/ContributorDashboard';
import ContributorMyPosts from './pages/contributor/ContributorMyPosts';
import ContributorProfile from './pages/contributor/ContributorProfile';
import ContributorRewards from './pages/contributor/ContributorRewards';

// 404 Page
import NotFound from './pages/NotFound';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-dark-300">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-300 flex flex-col">
      <ScrollToTop />
      <Routes>
        {/* Routes with their own layout (no global Navbar/Footer) */}
        <Route path="/super-admin/*" element={
          <SuperAdminRoute>
            <SuperAdminLayout />
          </SuperAdminRoute>
        }>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="contributors" element={<ContributorManagement />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="resources" element={<ResourceManagement />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="products" element={<DigitalProductManagement />} />
          <Route path="mock-tests" element={<MockTestManagement />} />
          <Route path="claims" element={<ClaimsManagement />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>

        {/* Contributor Routes with own layout */}
        <Route path="/contributor/*" element={
          <ProtectedRoute>
            <ContributorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ContributorDashboard />} />
          <Route path="my-posts" element={<ContributorMyPosts />} />
          <Route path="rewards" element={<ContributorRewards />} />
          <Route path="profile" element={<ContributorProfile />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="create-resource" element={<CreateResource />} />
          <Route path="create-blog" element={<CreateBlog />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>

        {/* Routes with global Navbar and Footer */}
        <Route path="*" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetails />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:slug" element={<CourseDetails />} />
                <Route path="/mock-test" element={<MockTests />} />
                <Route path="/mock-test/:slug" element={<MockTestDetails />} />
                <Route path="/digilearnix" element={<DigiLearnix />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Policy Routes */}
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/pending-approval" element={<PendingApproval />} />
                
                {/* Old Dashboard Routes (for approved admins) */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
                <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/dashboard/create-job" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
                <Route path="/dashboard/create-resource" element={<ProtectedRoute><CreateResource /></ProtectedRoute>} />
                <Route path="/dashboard/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
                <Route path="/dashboard/create-product" element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} />
                
                {/* Old Super Admin Routes (legacy) */}
                <Route path="/admin" element={<SuperAdminRoute><AdminDashboard /></SuperAdminRoute>} />
                <Route path="/admin/users" element={<SuperAdminRoute><ManageUsers /></SuperAdminRoute>} />
                <Route path="/admin/pending" element={<SuperAdminRoute><PendingApprovals /></SuperAdminRoute>} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
