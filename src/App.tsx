import { House, Person, BoxArrowInRight, Pencil } from 'react-bootstrap-icons';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Profile from './pages/logged-in/profile.tsx';
import Home from './pages/home.tsx';
import Blog from './pages/blog.tsx';
import Login from './pages/logged-out/login.tsx';
import Register from './pages/logged-out/register.tsx';
import My_Blogs from './pages/logged-in/my_blogs.tsx';
import Logout from './pages/logged-in/logout.tsx';
import AuthLogin from './pages/logged-out/authenticate/authlogin.tsx';
import Blog_Editor from './pages/logged-in/blog_editor.tsx';
import './style.css';

const user_id_str: string | null = sessionStorage.getItem('currentUserId');
const user_id: number = user_id_str ? parseInt(user_id_str, 10) : 0;

const App: React.FC = () => {

  const location = useLocation();
  const currentPath = location.pathname;

  if (currentPath === '/logout') {
    sessionStorage.removeItem('currentUserId');
    window.location.href = '/';
  }

  if (currentPath !== '/Blog' && sessionStorage.getItem('viewBlogId')) {
    sessionStorage.removeItem('viewBlogId');
  }

  if (currentPath !== '/blogeditor' && sessionStorage.getItem('editBlogId')) {
    sessionStorage.removeItem('editBlogId');
    sessionStorage.removeItem('editBlogHeader');
    sessionStorage.removeItem('editBlogBody');
  }

  if (user_id === 0 || user_id_str === null || user_id_str === '0') {
    console.log("No user logged in");
  }

  return (
    <div className="App">
      <nav className="topnav">
        <h1>BLOGGED IN</h1>
        <Link className="navitem" to="/"><House /> Home</Link>
        {user_id === 0 || user_id_str === null || user_id_str === '0' ? (
          <>
            <Link className="login_button" to="/login"><Person /> Login</Link>
            <Link className="register_button" to="/register"><BoxArrowInRight /> Register</Link>
          </>
        ) : (
          <>
            <Link className="navitem" to="/profile"><Person /> Profile</Link>
            <Link className="navitem" to="/myblogs"><Pencil /> My Blogs</Link>
            <Link className="logout_button" to="/logout">Logout</Link>
            <Link className="new_blog_button" to="/blogeditor"><Pencil /> New Blog</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Blog" element={<Blog />} />
        <Route path="/blogeditor" element={<Blog_Editor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myblogs" element={<My_Blogs />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/authLogin" element={<AuthLogin />} />
      </Routes>
    </div>
  );
}

export default App