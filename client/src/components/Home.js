import '../App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import useAuth from "../hooks/useAuth";

const Home = () => {
    const {setAuth} = useAuth();

    return (
        <div>
            <AppNavbar />
            <header className="header home-header">
                <h1>Supermarket Zlahoda</h1>
            </header>

            <Container className="home-container">
                <div className="home-button-container">
                    {localStorage.getItem("token") ?
                        <Button color="secondary" size="lg" className="home-button">
                            <Link to="/login" className="home-button-text"
                                  onClick={() => {
                                      localStorage.removeItem("token");
                                      setAuth({});
                                      alert("You have been logged out successfully!");
                                  }}>
                                Logout
                            </Link>
                        </Button>
                        :
                        <div>
                            <Button color="secondary" size="lg" className="home-button">
                                <Link to="/login" className="home-button-text"
                                      onClick={() => localStorage.removeItem("lastPath")}>
                                    Login
                                </Link>
                            </Button>
                            <Button color="secondary" size="lg" className="home-button">
                                <Link to="/register" className="home-button-text">Register</Link>
                            </Button>
                        </div>
                    }
                </div>
            </Container>
        </div>
    );
};

export default Home;