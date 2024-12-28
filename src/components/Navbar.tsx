import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/RockPaperScissors">Play Game</Link>
        </nav>
    );
};

export default Navbar; 