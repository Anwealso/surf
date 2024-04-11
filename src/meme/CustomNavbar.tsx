import './CustomNavbar.css'
// import { Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
// import headLogo from '/images/blue-triangle.svg';

function CustomNavbar() {
  return (
    <>
      <div className="navbar-container">

        {/* <Navbar expand="lg" className="navbar-dark">
          <Container>
            <Navbar.Brand href="#home">
              <img src={headLogo} className="logo" alt="Head logo" style={{width:'50px', height:'50px'}} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar> */}
      
        <div className='about-link'>
          <a href='/about'>
            About
          </a>
        </div>

      </div>
    </>
  );
}

export default CustomNavbar;