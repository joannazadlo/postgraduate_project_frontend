import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Recipe, RecipeSearchFilters } from '../types/types';
import { deleteRecipe, getRecipeById } from '../services/recipeService';
import { Button, Container, Spinner } from 'react-bootstrap';
import DeleteConfirmationModal from '../components/confirmation-modals/DeleteConfirmationModal';
import { navigateToAllUsersRecipesPage, navigateToRecipesPage } from '../utils/navigateHelper';
import RecipeDisplay from '../components/recipes/details/recipe-display/RecipeDisplay';
import EditRecipeForm from '../components/recipes/form/forms/EditRecipeForm';
import { parseFiltersFromLocation } from '../utils/filterHelper';
import FallbackMessage from '../components/ui/fallback-message/FallbackMessage';
import ToastMessage from '../components/ui/toast/ToastMessage';

export default function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.state?.currentPage || 1;

  const fromAdminRecipes = location.state?.fromAdminRecipes;

  const queryString = location.state?.filters || new URLSearchParams(location.search).toString();
  const filters: RecipeSearchFilters = parseFiltersFromLocation(queryString);

  const handleGoBack = () => {
    if (!fromAdminRecipes) {
      navigateToRecipesPage(navigate, currentPage, filters);
    } else {
      navigateToAllUsersRecipesPage(navigate, currentPage, filters);
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        try {
          const data = await getRecipeById(id);
          setRecipe(data);
          setLoading(false);
        } catch {
          setError("Error fetching recipe")
          setLoading(false);
        }
      };
    }
    fetchRecipe();
  }, [id]);

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setRecipe(updatedRecipe);
    setShowModal(false);
  };

  const handleDeleteRecipe = async () => {
    if (recipe) {
      try {
        await deleteRecipe(recipe.id);

        const recipesOnCurrentPage = location.state?.recipesOnCurrentPage || [];

        let page = currentPage;

        const updatedRecipes = recipesOnCurrentPage.filter((r: Recipe) => r.id !== recipe.id);

        if (updatedRecipes.length === 0) {
          if (currentPage === 1) {
            page = 1;
          } else {
            page = currentPage - 1;
          }
        }

        if (!fromAdminRecipes) {
          navigateToRecipesPage(navigate, page, filters, {
            message: 'Recipe deleted successfully',
            type: 'success'
          });
        } else {
          navigateToAllUsersRecipesPage(navigate, page, filters, {
            message: 'Recipe deleted successfully',
            type: 'success'
          });
        }
      } catch {
        setToastMessage('Error deleting recipe');
        setToastType('danger');
        setShowToast(true);
      }
    }
  }

  const triggerToast = (message: string, type: 'success' | 'danger' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <Container fluid>
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={handleGoBack}
      >
        Go Back
      </Button>
      {error ? (
        <FallbackMessage
          title="Oops!"
          message="We couldn't fetch the recipe. Please try again later."
          variant="danger"
        />
      ) : !recipe ? (
        <FallbackMessage
          title="Recipe not found"
          message="The recipe you’re looking for may have been deleted or does not exist."
        />
      ) : (
        <>
          <RecipeDisplay
            recipe={recipe}
            isInternal={true}
            onEdit={() => setShowModal(true)}
            onDelete={() => setShowDeleteModal(true)}
          />

          <EditRecipeForm
            recipe={recipe}
            show={showModal}
            handleClose={() => setShowModal(false)}
            triggerToast={triggerToast}
            onUpdateRecipe={handleRecipeUpdated}
          />

          <DeleteConfirmationModal
            showModal={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onDelete={handleDeleteRecipe}
          />

          <ToastMessage
            toastType={toastType}
            toastMessage={toastMessage}
            showToast={showToast}
            onClose={() => setShowToast(false)}
          />
        </>
      )}
    </Container>
  )
}
