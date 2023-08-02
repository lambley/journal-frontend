import { Routes, Route, Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { HomePage } from './Pages/HomePage';
import { NotFoundPage } from './Pages/NotFoundPage';
// import { AboutPage } from './Pages/AboutPage';
import { LabelPage } from './Pages/LabelPage';
import { LoginPage} from './Pages/LoginPage';
import { Container, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCommentDots } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setLoggedInUser();
  }, []);

  const setLoggedInUser = () => {
    const jwtToken = localStorage.getItem('jwtToken');
    const decodedToken = jwtToken ? JSON.parse(atob(jwtToken.split('.')[1])) : null;
    const loggedInUser = decodedToken ? decodedToken.username : null;
    setUsername(loggedInUser);
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUsername(null);
  };

  return (
    <>
      <Navbar className="sticky-top navbar-custom" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="nav-link" aria-label='home'>
            <FontAwesomeIcon icon={faHouse} />
          </Navbar.Brand>
          <Navbar.Brand className="navbar-title ">
            <h1 className='text-center'>WiseWords <FontAwesomeIcon icon={faCommentDots} /></h1>
          </Navbar.Brand>
          <div className="ml-auto">
            { username
            ? (
                <div>
                  <Navbar.Brand className="nav-link">
                    Hello, {username.charAt(0).toUpperCase() + username.slice(1)}!
                  </Navbar.Brand>
                  <Navbar.Brand
                    as={Link} to=""
                    className="nav-link"
                    onClick={handleLogout}
                    aria-label='logout'
                  >
                    Logout
                  </Navbar.Brand>
                </div>
              )
            : (
                <Navbar.Brand
                  as={Link}
                  to="/login"
                  className="nav-link"
                  aria-label='login'
                >
                  Login
                </Navbar.Brand>
              )
            }
          </div>
        </Container>
      </Navbar>
      <br />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLoginStatusChange={setLoggedInUser}/>} />
          {/* <Route path="/about" element={<AboutPage />} /> */}
          <Route path="label/:label" element={<LabelPage/>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
