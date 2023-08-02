import { Routes, Route, Link } from 'react-router-dom'
import { HomePage } from './Pages/HomePage';
import { NotFoundPage } from './Pages/NotFoundPage';
import { AboutPage } from './Pages/AboutPage';
import { LabelPage } from './Pages/LabelPage';
import { Container, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCommentDots } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <>
      <Navbar className="sticky-top navbar-custom" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="nav-link" aria-label='home'>
            <FontAwesomeIcon icon={faHouse} />
          </Navbar.Brand>
          <Navbar.Brand className="navbar-title ">
            <h1>WiseWords <FontAwesomeIcon icon={faCommentDots} /></h1>
          </Navbar.Brand>
          <Navbar.Brand as={Link} to="/about" className="nav-link">
            About
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="label/:label" element={<LabelPage/>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
