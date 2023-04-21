import '../App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

const Home = () => {
    return (
        <div>
            <AppNavbar />
            <header className="header">
                <h1>Supermarket Zlagoda</h1>
            </header>

            <Container className="home-container">
                <div className="home-button-container">
                    <Button color="secondary" size="lg" className="home-button">
                        <Link to="/login" className="home-button-text">Login</Link>
                    </Button>
                    <Button color="secondary" size="lg" className="home-button">
                        <Link to="/register" className="home-button-text">Register</Link>
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default Home;