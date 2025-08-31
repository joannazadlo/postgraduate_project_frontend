import { ReactNode } from 'react';
import styles from './AppLayout.module.css';
import Header from '../header/Header';
import { useLocation } from 'react-router-dom';

type AppLayoutProps = {
  children: ReactNode;
}

export default function AppLayout ({ children } : AppLayoutProps) {
  const location = useLocation();
  const hideHeader = location.pathname === '/auth';

  return (
    <div className={styles.appLayout}>
      {!hideHeader && <Header />}
      <main className={styles.mainContent}>
        <div className={styles.pageFrame}>{children}</div>
      </main>
    </div>
  );
};
