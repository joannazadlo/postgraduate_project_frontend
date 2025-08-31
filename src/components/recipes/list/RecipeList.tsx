import { Card } from 'react-bootstrap';
import styles from './RecipeList.module.css';
import { FaEye, FaCalendarAlt } from 'react-icons/fa';
import { AdminRecipe, Recipe } from '../../../types/types';
import { Link, useLocation } from 'react-router-dom';

type RecipeListProps = {
  recipes: (Recipe | AdminRecipe)[];
  currentPage: number;
  fromSearchPage?: boolean;
}

export default function RecipeList({ recipes, currentPage, fromSearchPage } : RecipeListProps) {
  const defaultImage = '/assets/defaultImage.jpg';
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const safeRecipes = Array.isArray(recipes) ? recipes : [];

  const location = useLocation();

  function isAdminRecipe(recipe: Recipe | AdminRecipe): recipe is AdminRecipe {
    return 'userEmail' in recipe;
  }

  const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="container-fluid py-5">
        <div className={styles.cardGrid}>
          {safeRecipes.map((recipe) => (
            <div key={recipe.id} className={styles.cardWrapper}>
              <Link
                to={fromSearchPage ? `/search-recipe/${recipe.id}` : `/recipe/${recipe.id}`}
                state={{
                  source: recipe.source,
                  currentPage,
                  recipesOnCurrentPage: safeRecipes,
                  fromAdminRecipes: location.pathname.includes('/admin-recipes'),
                  filters: location.state?.filters || new URLSearchParams(location.search).toString(),
                }}
                className={styles.cardLinkWrapper}
              >
                <Card
                  className={`${styles.customCard} ${isAdminRecipe(recipe) ? styles.adminCard : styles.standardCard}`}
                >
                  <div className={styles.imageContainer}>
                    <Card.Img variant="top"
                      src={recipe.imageSource ?
                        (recipe.imageSource.startsWith("http") ? recipe.imageSource : `${baseUrl}${recipe.imageSource}`)
                        : defaultImage}
                      alt={recipe.title} />

                    <div className={styles.badgesContainer}>
                      <div className={styles.additionalInfo}>
                        <FaEye />
                        {!fromSearchPage ? (
                          <span>{recipe.isPublic ? 'Public' : 'Private'}</span>
                        ) : (
                          <span>{recipe.source}</span>
                        )}
                      </div>

                      {!fromSearchPage && (
                        <div
                          className={styles.timeBadge}
                          title={`Created at: ${new Date(recipe.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })}`}
                        >
                          <FaCalendarAlt style={{ marginRight: '4px' }} />
                          {formatDateShort(recipe.createdAt)}
                        </div>
                      )}
                    </div>
                  </div>

                  <Card.Body className={styles.cardBody}>
                    <Card.Title className={styles.cardTitle}>{recipe.title}</Card.Title>
                  </Card.Body>
                  {isAdminRecipe(recipe) && (
                    <Card.Footer className={styles.cardFooter}>
                      <div className="text-start">
                        <small className="text-muted">
                          By: {recipe.userEmail}
                        </small>
                      </div>
                    </Card.Footer>
                  )}
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};
