import { useState, useEffect, useRef } from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import { Recipe, RecipeSearchFilters } from '../types/types';
import { getRecipes } from '../services/recipeService';
import { getFilteredRecipesForUser } from '../services/filterService';
import RecipeList from '../components/recipes/list/RecipeList';
import { useLocation, useNavigate } from 'react-router-dom';
import ToastMessage from '../components/ui/toast/ToastMessage';
import PaginationComponent from '../components/ui/pagination/PaginationComponent';
import { navigateToRecipesPage } from '../utils/navigateHelper';
import CreateRecipeForm from '../components/recipes/form/forms/CreateRecipeForm';
import RecipeFinder from '../components/filter/RecipeFinder';
import { CSSTransition } from 'react-transition-group';
import { parseFiltersFromLocation } from '../utils/filterHelper';
import UserIngredients from '../components/ingredients/UserIngredients';
import PageControls from '../components/layout/page-controls/PageControls';
import { SortOption, sortRecipes } from '../utils/sortingHelper';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');
  const [showFilter, setShowFilter] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('date-oldest');
  const [noResultsFound, setNoResultsFound] = useState<boolean>(false);
  const [userPerformedSearch, setUserPerformedSearch] = useState(false);
  const filterRef = useRef(null);
  const [activeFilters, setActiveFilters] = useState<RecipeSearchFilters>({});
  const shouldShowEmptyState =
    recipes.length === 0 && !noResultsFound && !userPerformedSearch && !error;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 60;
  const [ingredientsModal, setIngredientsModal] = useState<boolean>(false);
  const recipesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page');
    if (page) {
      setCurrentPage(parseInt(page, 10));
    } else {
      setCurrentPage(1);
    }
  }, [location]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigateToRecipesPage(navigate, page, activeFilters);
  };

  const sortedRecipes = sortRecipes(recipes, sortOption);

  const getRecipesForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return sortedRecipes.slice(startIndex, endIndex);
  };

  const currentRecipes = getRecipesForCurrentPage();

  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToastMessage(location.state.toastMessage);
      setToastType(location.state.toastType || 'success');
      setShowToast(true);

      navigate(location.pathname + location.search, { replace: true });
    }
  }, [location.state, navigate, location.pathname, location.search]);

  const triggerToast = (message: string, type: 'success' | 'danger' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleNewRecipe = (newRecipe: Recipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  const handleSearch = async (filters: RecipeSearchFilters) => {
    setActiveFilters(filters);
    navigateToRecipesPage(navigate, 1, filters);
  };

  useEffect(() => {
    const filters = parseFiltersFromLocation(location.search);
    setActiveFilters(filters);

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const hasAnyFilter =
          (filters.ingredients && filters.ingredients.length > 0) ||
          filters.cuisine ||
          (filters.dietaryPreferences && filters.dietaryPreferences.length > 0) ||
          filters.isPublic !== undefined

        if (!hasAnyFilter) {
          const data = await getRecipes();
          setRecipes(data);
          setUserPerformedSearch(false);
          setNoResultsFound(false);
        } else {
          const data = await getFilteredRecipesForUser(filters);
          setRecipes(data);
          setUserPerformedSearch(true);
          setShowFilter(true);
          setNoResultsFound(data.length === 0);
        }
      } catch {
        setError('Error fetching recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  useEffect(() => {
    if (recipes.length > 0 && recipesRef.current) {
      recipesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [recipes]);

  return (
    <Container fluid className="py-1">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center align-items-sm-start mb-2">
        <h3 className="display-6 small-display mb-0 ms-2 text-center text-sm-start text-nowrap">My Recipes</h3>

        <PageControls
          showControls={recipes.length > 0 || userPerformedSearch}
          toggleFilter={() => setShowFilter(!showFilter)}
          sortOption={sortOption}
          setSortOption={setSortOption}
          alwaysShowManageIngredients={shouldShowEmptyState}
          onAddRecipeClick={() => setShowModal(true)}
          onManageIngredientsClick={() => setIngredientsModal(true)}
        />
      </div>

      <CSSTransition
        unmountOnExit
        in={showFilter}
        timeout={300}
        classNames="fade-slide"
        nodeRef={filterRef}
      >
        <div ref={filterRef}>
          <RecipeFinder
            filters={activeFilters}
            showVisibilityFilter={true}
            searching={loading}
            onSearch={handleSearch}
          />
        </div>
      </CSSTransition>

      {error && <div className="text-danger text-center py-3">{error}</div>}

      <ToastMessage
        toastType={toastType}
        toastMessage={toastMessage}
        showToast={showToast}
        onClose={() => setShowToast(false)}
      />

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : shouldShowEmptyState ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <h3>No Recipes Available</h3>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add recipe
            </Button>
          </div>
        </div>
      ) : noResultsFound && userPerformedSearch ? (
        <div className="text-center py-1">
          <h6>No recipes found for your search criteria.</h6>
        </div>
      ) : (
        <div ref={recipesRef}>
          <RecipeList recipes={currentRecipes} currentPage={currentPage} />
          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}

      <CreateRecipeForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        triggerToast={triggerToast}
        onNewRecipe={handleNewRecipe}
      />

      <UserIngredients
        show={ingredientsModal}
        onClose={() => setIngredientsModal(false)}
      />
    </Container >
  );
};
