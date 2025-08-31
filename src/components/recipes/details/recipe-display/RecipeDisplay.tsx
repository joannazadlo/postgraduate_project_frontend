import { Button, Col, Container, Row } from "react-bootstrap"
import { Recipe } from "../../../../types/types";
import styles from './RecipeDisplay.module.css';
import { Image } from 'react-bootstrap';
import {
  FaClock,
  FaGlobe,
  FaLeaf
} from 'react-icons/fa';

import { RecipeRating } from '../../../../types/types';
import OpinionPanel from "../opinion-panel/OpinionPanel";
import OpinionSummary from "../opinion-summary/OpinionSummary";

type RecipeDisplayProps = {
  recipe: Recipe;
  isInternal?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  ratingData?: RecipeRating | null;
  onOpinionChange?: (opinion: 'like' | 'dislike' | 'neutral' | null) => void;
}

export default function RecipeDisplay({
  recipe,
  isInternal,
  onEdit,
  onDelete,
  onSave,
  ratingData,
  onOpinionChange }: RecipeDisplayProps) {
  const defaultImage = '/assets/defaultImage.jpg';
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <Container fluid>
      <Row className={`g-0 ${styles.recipeRow}`}>
        <Col
          xs={12}
          sm={12}
          md={5}
          lg={5}
          className={styles.imageCol + " p-0"}
        >
          <div className={styles.imageWrapper}>
            <Image
              roundedCircle
              src={recipe.imageSource
                ? recipe.imageSource.startsWith("http")
                  ? recipe.imageSource
                  : `${baseUrl}${recipe.imageSource}`
                : defaultImage}
              alt="Recipe Image"
              className={styles.recipeImage}
            />
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={7}
          lg={7}
          className={styles.contentCol}
        >
          <div className={`${styles.sectionBox} mb-3`}>
            <div className="d-flex align-items-center mb-3">
              <h3 className="display-6 mb-0 me-3">{recipe.title}</h3>

              {isInternal && (
                <span
                  className={`ms-3 ${styles.visibilityBadge} ${recipe.isPublic ? styles.public : styles.private}`}
                >
                  {recipe.isPublic ? 'Public' : 'Private'}
                </span>
              )}

              {!isInternal && (
                <OpinionSummary
                  ratingData={ratingData}
                />
              )}

            </div>
          </div>

          <div className={`${styles.gridLayout} mb-3`}>
            <div className={styles.badgesWrapper}>
              {recipe.cuisine && (
                <span className={`${styles.badgeCuisine} ${styles.largeBadge}`}>
                  <FaGlobe /> {recipe.cuisine}
                </span>
              )}
              {recipe.cookingTime && (
                <span className={`${styles.badgeTime} ${styles.largeBadge}`}>
                  <FaClock /> {recipe.cookingTime}
                </span>
              )}
              {recipe.dietaryPreferences?.map((pref, idx) => (
                <span key={idx} className={`${styles.badgeDiet} ${styles.largeBadge}`}>
                  <FaLeaf /> {pref}
                </span>
              ))}
            </div>

            {!isInternal && (
              <OpinionPanel
                ratingData={ratingData}
                onOpinionChange={onOpinionChange}
              />
            )}
          </div>

          {isInternal && (
            <div className="d-flex gap-3 mb-3 flex-wrap">
              <Button
                variant="outline-primary"
                className={styles.actionButton}
                onClick={onEdit}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                className={styles.actionButton}
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          )}

          {!isInternal && (
            <div className="mb-3">
              <Button
                variant="primary"
                className={styles.actionButton}
                onClick={onSave}
              >
                Save Recipe to My Recipes
              </Button>
            </div>
          )}

          <Row className="mt-3 me-3">
            <Col xs={12} md={12} lg={5} className="mb-3">
              <h2 className={styles.recipeDetails}>Ingredients</h2>
              <ul className={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className={styles.ingredientItem}>
                    <strong>{ingredient.name}</strong>: {ingredient.quantity}
                  </li>
                ))}
              </ul>
            </Col>
            <Col xs={12} md={12} lg={7}>
              <h2 className={styles.recipeDetails}>Steps</h2>
              <ol className={styles.stepsList}>
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container >
  )
}
