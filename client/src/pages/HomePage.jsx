import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

function HomePage() {
    const navigate = useNavigate();

    const handleCustomerMainboardClick = () => {
      navigate('/customer-mainboard');
    };

    const handleOfficerClick = () => {
      navigate('/officer');
    };

    const handleDisplayScreenClick = () => {
      navigate('/display-screen');
    };

    return (
        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Home Page</h1>
            <div className={styles.buttonContainer}>
                <button onClick={handleCustomerMainboardClick}>Customer Mainboard</button>
                <button onClick={handleOfficerClick}>Officer</button>
                <button onClick={handleDisplayScreenClick}>Display Screen</button>
            </div>
        </div>
    );
}

export default HomePage;
