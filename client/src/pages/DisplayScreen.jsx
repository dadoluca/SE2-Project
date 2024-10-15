import React, { Suspense } from 'react';
import { defer, Await, useLoaderData } from 'react-router-dom';
import {getQueuesData} from '../api.jsx';
import styles from './DisplayScreen.module.css';

function DisplayScreen() {
    const { data } = useLoaderData();

    return (
        <div className={styles.displayScreen}>
            <Suspense fallback={<p>Loading...</p>}>
                <Await resolve={data}>
                    {(loadedData) => {
                        if (loadedData.error) {
                            return <p className={styles.error}>{loadedData.message}</p>;
                        } else {
                            return (
                                <div className={styles.serviceContainers}>
                                    {loadedData.services.map((service, index) => (
                                        <div key={index} className={styles.serviceBox}>
                                            <h2>{service.icon} {service.title}</h2>
                                            <p className={styles.servingText}>Serving: <span className={styles.servingCode}>{service.serving}</span></p>
                                            <div className={styles.queue}>
                                                <div className={styles.ququeHeader}>
                                                    <span>Next :</span>
                                                    <span>⏱</span>
                                                </div>
                                                <hr />  
                                                {service.queue.map((item, idx) => (
                                                    <div key={idx} className={styles.queueItem}>
                                                        <span>{item.number}</span>
                                                        <span>{item.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className={styles.footer}>
                                        <span>{loadedData.date}</span>
                                        <span>{loadedData.time}</span>
                                    </div>
                                </div>
                            );
                        }
                    }}
                </Await>
            </Suspense>
        </div>
    );
}

export default DisplayScreen;

const loadData = async () => {
    try {
        const data = await getQueuesData(); // Modifica questo metodo in base alla tua API
        return data;
    } catch (error) {
        return { error: true, message: 'Could not fetch data.. try again later' };
    }
};

export function loader() {
    return defer({
        data: loadData(),
    });
}
