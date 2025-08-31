import { useEffect, useState, useRef } from 'react';
import RecipeList from '../components/recipes/list/RecipeList';
import { Recipe, RecipeSearchFilters } from '../types/types';
import { getRecipesFromAllSources } from '../services/filterService';
import { Spinner, Container } from 'react-bootstrap';
import RecipeFinder from '../components/filter/RecipeFinder';
import { parseFiltersFromLocation } from '../utils/filterHelper';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigateToSearchRecipesPage } from '../utils/navigateHelper';

export default function SearchRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [noResultsFound, setNoResultsFound] = useState<boolean>(false);
  const [userPerformedSearch, setUserPerformedSearch] = useState(false);
  const [activeFilters, setActiveFilters] = useState<RecipeSearchFilters>({});

  const location = useLocation();
  const navigate = useNavigate();
  const recipesRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (filters: RecipeSearchFilters) => {
    setActiveFilters(filters);
    navigateToSearchRecipesPage(navigate, 1, filters);
  };

  useEffect(() => {
    const filters = parseFiltersFromLocation(location.search);
    setActiveFilters(filters);

    const recipesFromState = location.state?.recipesOnCurrentPage;

    const fetchData = async () => {
      if (recipesFromState) {
        setRecipes(recipesFromState);
        setNoResultsFound(recipesFromState.length === 0);
        setUserPerformedSearch(true);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const hasAnyFilter =
          (filters.ingredients && filters.ingredients.length > 0) ||
          filters.cuisine ||
          (filters.dietaryPreferences && filters.dietaryPreferences.length > 0) ||
          filters.source ||
          filters.excludeDisliked === true;

        if (!hasAnyFilter) {
          setRecipes([]);
          setNoResultsFound(false);
          setUserPerformedSearch(false);
        } else {
          const data = await getRecipesFromAllSources(filters);
          setRecipes(data);
          setNoResultsFound(data.length === 0);
          setUserPerformedSearch(true);
        }
      } catch {
        setError('Error fetching recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search, location.state]);

  useEffect(() => {
    if (recipes.length > 0 && recipesRef.current) {
      recipesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [recipes]);

  return (
    <Container fluid className="py-1">
      <div>
        <h3 className="display-6 small-display mb-0 ms-2">Search Recipes</h3>
        <RecipeFinder
          filters={activeFilters}
          showSourceAndDislikedFilter={true}
          searching={loading}
          onSearch={handleSearch}
        />

        {error && <div className="text-danger text-center py-3">{error}</div>}

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <>
            {noResultsFound && userPerformedSearch && (
              <div className="text-center py-1">
                <h6>No recipes found for your search criteria.</h6>
              </div>
            )}

            {recipes.length > 0 && (
              <div ref={recipesRef}>
                <RecipeList
                  recipes={recipes}
                  currentPage={1}
                  fromSearchPage={true}
                />
              </div>
            )}
          </>

        )}
      </div>
    </Container>
  );
}
