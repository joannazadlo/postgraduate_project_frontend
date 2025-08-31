import { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase/firebaseConfig';
import { useAuth } from '../../../context/AuthContext';
import {
  FaHome,
  FaUserCog,
  FaUsers,
  FaTools,
  FaSignOutAlt,
  FaSearch,
  FaCog,
} from 'react-icons/fa';
import styles from './Header.module.css';
import SettingsModal from '../../settings/SettingsModal';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);

  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const isAdminRoute = location.pathname.startsWith('/admin-recipes') || location.pathname.startsWith('/users');

  const handleSignOut = (): void => {
    signOut(auth)
      .then(() => {
        navigate('/auth');
      })
      .catch((error: unknown) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <Navbar
      expand="sm"
      className={`${styles.navbarCustom} shadow-sm`}
      sticky="top"
    >
      <Container fluid>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={`me-3 ${styles.iconAlign} ${isActive('/') ? styles.active : ''}`}>
              <FaHome className="me-1" /> Home
            </Nav.Link>
            <Nav.Link as={Link} to="/search-recipes" className={`me-3 ${styles.iconAlign} ${isActive('/search-recipes') ? styles.active : ''}`}>
              <FaSearch className="me-1" /> Search Recipes
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {currentUser?.role === 'ADMIN' && (
              <NavDropdown
                title={<span className={styles.iconAlign}><FaTools className="me-1" /> Admin Panel</span>}
                id="admin-dropdown"
                className={`me-3 ${isAdminRoute ? styles.activeDropdown : ''}`}
              >
                <NavDropdown.Item as={Link} to="/admin-recipes" className={`${styles.iconAlign} ${isActive('/admin-recipes') ? styles.active : ''}`}>
                  <FaUserCog className="me-1" /> Manage Users&apos; Recipes
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/users" className={`${styles.iconAlign} ${isActive('/users') ? styles.active : ''}`}>
                  <FaUsers className="me-1" /> Manage Users
                </NavDropdown.Item>
              </NavDropdown>
            )}

            <Nav.Link
              className={`me-3 ${styles.iconAlign}`}
              style={{ cursor: 'pointer' }}
              title="Settings"
              onClick={() => setShowSettings(true)}
            >
              <FaCog />
            </Nav.Link>

            <Nav.Link
              className={`me-3 ${styles.iconAlign}`}
              onClick={handleSignOut}
            >
              <FaSignOutAlt className="me-1" /> Sign Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {showSettings && (
        <SettingsModal
          show={showSettings}
          onHide={() => setShowSettings(false)}
        />
      )}
    </Navbar >
  );
};
