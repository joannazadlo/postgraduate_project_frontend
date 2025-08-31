import styles from './PromoSection.module.css';
import { Col } from 'react-bootstrap';

export default function PromoSection() {
  return (
    <Col md={6} className={styles.promo}>
      <div className={styles.promoContent} />
      <h1 className="mb-4 text-primary">Welcome to RecipeDash</h1>
      <p className="fs-5">
        Discover, create, and share your favorite recipes <br /> with a vibrant community of food lovers.
      </p>
      <div className={styles.promoImage}>
        <img src="/assets/cooking.png" alt="Cooking Community" className="img-fluid mb-4" />
      </div>
    </Col>
  )
}
