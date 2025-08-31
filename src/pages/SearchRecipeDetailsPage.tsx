import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { IngredientPayload, Opinion, Recipe, RecipePayload, RecipeRating, RecipeSearchFilters } from '../types/types';
import { createRecipe, createRecipeWithImage, getMealDbRecipeById, getRecipeById, getTastyRecipeById } from '../services/recipeService';
import { Button, Container, Spinner } from 'react-bootstrap';
import { navigateToRecipesPage, navigateToSearchRecipesPage } from '../utils/navigateHelper';
import RecipeDisplay from '../components/recipes/details/recipe-display/RecipeDisplay';
import { parseFiltersFromLocation } from '../utils/filterHelper';
import FallbackMessage from '../components/ui/fallback-message/FallbackMessage';
import { deleteOpinion, getRecipeRating, saveOpinion } from '../services/opinionService';
import ToastMessage from '../components/ui/toast/ToastMessage';

export default function SearchRecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [ratingData, setRatingData] = useState<RecipeRating | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = location.state?.currentPage || 1;
  const source = location.state?.source ?? 'Internal';
  const recipesOnCurrentPage = location.state?.recipesOnCurrentPage || null;

  const queryString = location.state?.filters || new URLSearchParams(location.search).toString();
  const filters: RecipeSearchFilters = parseFiltersFromLocation(queryString);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleGoBack = () => {
    navigateToSearchRecipesPage(navigate, currentPage, filters, {
      extraState: {
        recipesOnCurrentPage
      }
    });
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        try {
          let data: Recipe | null;

          if (source === 'MealDb') {
            data = await getMealDbRecipeById(id);
          } else if (source === 'Tasty') {
            data = await getTastyRecipeById(id);
          } else {
            data = await getRecipeById(id);
          }

          setRecipe(data);

          if (data) {
            const rating = await getRecipeRating(source, id);
            setRatingData(rating);
          }
        } catch {
          setError("Error fetching recipe")
        } finally {
          setLoading(false);
        }
      };
    }
    fetchRecipe();
  }, [id, source]);

  const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    return new File([buffer], filename, { type: mimeType });
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;

    const payloadIngredients: IngredientPayload[] = recipe.ingredients.map(({ name, quantity }) => ({ name, quantity }));

    try {
      const newRecipe: RecipePayload = {
        title: recipe.title,
        ingredients: payloadIngredients,
        steps: recipe.steps,
        dietaryPreferences: recipe.dietaryPreferences,
        cuisine: recipe.cuisine,
        cookingTime: recipe.cookingTime,
        isPublic: false
      };

      if (recipe.imageSource) {
        let imageFile: File | undefined;
        if (recipe.imageSource.startsWith('http')) {
          imageFile = await urlToFile(recipe.imageSource, 'recipe-image.jpg', 'image/jpeg');
        } else {
          const fullUrl = `${baseUrl}${recipe.imageSource}`;
          imageFile = await urlToFile(fullUrl, 'recipe-image.jpg', 'image/jpeg');
        }
        await createRecipeWithImage(newRecipe, imageFile);
      } else {
        await createRecipe(newRecipe);
      }

      setShowToast(true);

      navigateToRecipesPage(navigate, 1, undefined, {
        message: 'Recipe added successfully',
        type: 'success'
      });
    } catch {
      setToastMessage('Failed to save recipe');
      setShowToast(true);
      setToastType('danger');
    }
  }

  async function handleOpinionChange(opinion: 'like' | 'dislike' | 'neutral' | null) {
    if (!recipe) return;

    try {
      let updatedRating;

      if (opinion === null) {
        updatedRating = await deleteOpinion({ recipeSource: source, recipeId: recipe.id });
      } else {
        const newOpinion: Opinion = {
          userOpinion: opinion
        };

        updatedRating = await saveOpinion({ recipeSource: source, recipeId: recipe.id, opinion: newOpinion});
      }
      setRatingData(updatedRating);
    } catch (error) {
      console.error('Failed to save opinion', error);
      setToastMessage('Failed to save your opinion. Please try again.');
      setToastType('danger');
      setShowToast(true);
    }
  }

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
            isInternal={false}
            ratingData={ratingData}
            onOpinionChange={handleOpinionChange}
            onSave={handleSaveRecipe}
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
