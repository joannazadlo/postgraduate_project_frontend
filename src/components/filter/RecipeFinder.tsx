import { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import styles from './RecipeFinder.module.css';
import { RecipeSearchFilters } from '../../types/types';
import { useUserPreferencesContext } from '../../context/UserPreferencesContext';
import { useUserIngredientsContext } from '../../context/UserIngredientsContext';
import { CUISINE_OPTIONS, DIET_OPTIONS, POPULAR_INGREDIENTS, VISIBILITY_OPTIONS, SOURCE_OPTIONS } from '../../constants/preferences';
import IngredientFilter from './fields/IngredientFilter';
import CuisineSelect from '../shared/fields/cuisine-select/CuisineSelect';
import DietPreferencesSelect from '../shared/fields/diet-preferences-select/DietPreferencesSelect';
import VisibilityFilter from './fields/VisibilityFilter';
import SourceFilter from './fields/SourceFilter';
import DislikedRecipesCheckbox from '../shared/fields/disliked-recipes-checkbox/DislikedRecipesCheckbox';

type RecipeFinderProps = {
  onSearch: (filters: RecipeSearchFilters) => void;
  filters: RecipeSearchFilters;
  showSourceAndDislikedFilter?: boolean;
  showVisibilityFilter?: boolean;
  searching?: boolean;
};

export default function RecipeFinder({ onSearch, filters, showSourceAndDislikedFilter, showVisibilityFilter, searching }: RecipeFinderProps) {
  const [ingredients, setIngredients] = useState<string[]>(
    filters.ingredients || []
  );
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>(filters.cuisine || '');
  const [selectedDiets, setSelectedDiets] = useState<string[]>(filters.dietaryPreferences || []);
  const [visibility, setVisibility] = useState<boolean | ''>(
    filters.isPublic === undefined ? '' : filters.isPublic
  );
  const [source, setSource] = useState<string>(filters.source || '');
  const [excludeDisliked, setExcludeDisliked] = useState<boolean>(filters.excludeDisliked || false);
  const [filtersClearedManually, setFiltersClearedManually] = useState<boolean>(false);

  const anyOtherFilterActive =
    ingredients.length > 0 || selectedCuisine !== '' || selectedDiets.length > 0;

  const { preferences } = useUserPreferencesContext();
  const { userIngredients } = useUserIngredientsContext();

  const buildCurrentFilters = (overrides?: Partial<RecipeSearchFilters>): RecipeSearchFilters => ({
    ingredients,
    cuisine: selectedCuisine,
    dietaryPreferences: selectedDiets,
    isPublic: visibility === '' ? undefined : visibility,
    source: source || undefined,
    excludeDisliked,
    ...overrides,
  });

  useEffect(() => {
    const noFiltersApplied =
      (!filters.ingredients || filters.ingredients.length === 0) &&
      !filters.cuisine &&
      (!filters.dietaryPreferences || filters.dietaryPreferences.length === 0) &&
      filters.isPublic === undefined &&
      !filters.source &&
      (filters.excludeDisliked === undefined || filters.excludeDisliked === false);

    if (preferences && noFiltersApplied && !filtersClearedManually) {
      setSelectedCuisine(preferences.cuisine || '');
      setSelectedDiets(preferences.dietaryPreferences || []);
      setExcludeDisliked(preferences.excludeDisliked || false);
    } else {
      setIngredients(filters.ingredients || []);
      setSelectedCuisine(filters.cuisine || '');
      setSelectedDiets(filters.dietaryPreferences || []);
      setVisibility(filters.isPublic === undefined ? '' : filters.isPublic);
      setSource(filters.source || '');
      setExcludeDisliked(filters.excludeDisliked || false);
    }
  }, [preferences, filters, filtersClearedManually]);

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInputValue('');
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient(inputValue);
    }
  };

  const handleIngredientChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const removeIngredient = (ingredient: string) => {
    const newIngredients = ingredients.filter((i) => i !== ingredient);
    setIngredients(newIngredients);

    const updatedFilters = buildCurrentFilters({ ingredients: newIngredients });

    if (showSourceAndDislikedFilter) {
      autoClearSourceAndDislikedIfNeeded(updatedFilters);
    }

    autoClearFiltersIfEmpty(updatedFilters);
  }

  const handleCuisineChange = (newCuisine: string) => {
    setSelectedCuisine(newCuisine);

    const updatedFilters = buildCurrentFilters({ cuisine: newCuisine });

    if (showSourceAndDislikedFilter) {
      autoClearSourceAndDislikedIfNeeded(updatedFilters);
    }

    autoClearFiltersIfEmpty(updatedFilters);
  }

  const handleDietaryPreferencesChange = (newDiets: string[]) => {
    setSelectedDiets(newDiets);

    const updatedFilters = buildCurrentFilters({ dietaryPreferences: newDiets });

    if (showSourceAndDislikedFilter) {
      autoClearSourceAndDislikedIfNeeded(updatedFilters);
    }

    autoClearFiltersIfEmpty(updatedFilters);
  }

  const handleVisibilityChange = (newVisibility: boolean | '') => {
    setVisibility(newVisibility);

    const updatedFilters = buildCurrentFilters({ isPublic: newVisibility === '' ? undefined : newVisibility });

    autoClearFiltersIfEmpty(updatedFilters);
  }

  const handleSourceChange = (newSource: string) => {
    setSource(newSource);

    const updatedFilters = buildCurrentFilters({ source: newSource });

    autoClearFiltersIfEmpty(updatedFilters);
  }

  const handleSearch = (e?: React.FormEvent
  ) => {
    if (e) e.preventDefault();

    onSearch({
      ingredients: ingredients,
      cuisine: selectedCuisine,
      dietaryPreferences: selectedDiets,
      isPublic: visibility === '' ? undefined : visibility,
      source: source || undefined,
      excludeDisliked
    });
  };

  const clearIngredients = () => {
    setIngredients([]);

    const updatedFilters = buildCurrentFilters({ ingredients: [] });
    autoClearFiltersIfEmpty(updatedFilters);
  };

  const addAllUserIngredients = () => {
    if (!userIngredients) return;

    const userIngs = userIngredients.map((ui) => ui.ingredient);

    const combined = Array.from(new Set([...ingredients, ...userIngs]));
    setIngredients(combined);
  }

  const allUserIngredientsAdded: boolean = !!userIngredients && userIngredients.every((ui) =>
    ingredients.includes(ui.ingredient)
  );

  const clearAllFilters = () => {
    setIngredients([]);
    setSelectedCuisine('');
    setSelectedDiets([]);
    setInputValue('');
    setVisibility('');
    setSource('');
    setExcludeDisliked(false);
    setFiltersClearedManually(true);

    onSearch({
      ingredients: [],
      cuisine: '',
      dietaryPreferences: [],
      isPublic: undefined,
      source: '',
      excludeDisliked: false
    });
  };

  const areAllFiltersEmpty = (filters: RecipeSearchFilters) => {
    return (
      (!filters.ingredients || filters.ingredients.length === 0) &&
      !filters.cuisine &&
      (!filters.dietaryPreferences || filters.dietaryPreferences.length === 0) &&
      filters.isPublic === undefined &&
      !filters.source &&
      filters.excludeDisliked === false
    )
  }

  const autoClearFiltersIfEmpty = (filters: RecipeSearchFilters) => {
    if (areAllFiltersEmpty(filters)) {
      onSearch({
        ingredients: [],
        cuisine: '',
        dietaryPreferences: [],
        isPublic: undefined,
        source: undefined,
        excludeDisliked: false
      });
    }
  }

  const autoClearSourceAndDislikedIfNeeded = (filters: RecipeSearchFilters) => {
    const shouldClear =
      (!filters.ingredients || filters.ingredients.length === 0) &&
      !filters.cuisine &&
      (!filters.dietaryPreferences || filters.dietaryPreferences.length === 0);

    if (shouldClear) {
      if (filters.source !== '') setSource('');
      setExcludeDisliked(preferences?.excludeDisliked ?? false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start p-3">
      <div className={styles.responsiveContainer}>
        <div className="p-4 border rounded shadow-sm bg-white">
          <div className="p-3 border rounded bg-light-subtle">
            <IngredientFilter
              ingredients={ingredients}
              inputValue={inputValue}
              userIngredients={userIngredients}
              preferences={preferences}
              popularIngredients={POPULAR_INGREDIENTS}
              addAllUserIngredients={addAllUserIngredients}
              allUserIngredientsAdded={allUserIngredientsAdded}
              clearIngredients={clearIngredients}
              handleChange={handleIngredientChange}
              handleInputKeyDown={handleInputKeyDown}
              addIngredient={addIngredient}
              removeIngredient={removeIngredient}
            />
          </div>

          <div className="p-3 border rounded bg-light-subtle mt-3">
            <Row>
              <Form.Label className="fw-semibold mb-2">
                Any special cuisine or diet?
              </Form.Label>
              <Col xs={12} sm={6} md={5}>
                <CuisineSelect
                  options={CUISINE_OPTIONS}
                  value={selectedCuisine}
                  className=''
                  onChange={handleCuisineChange}
                />
              </Col>

              <Col xs={12} sm={6} md={7}>
                <div className={styles.innerDivider}>
                  <DietPreferencesSelect
                    options={DIET_OPTIONS}
                    selected={selectedDiets}
                    className=''
                    onChange={handleDietaryPreferencesChange}
                  />
                </div>
              </Col>
            </Row>
          </div>

          {showVisibilityFilter && (
            <div className="p-3 border rounded bg-light-subtle mt-3">
              <VisibilityFilter
                options={VISIBILITY_OPTIONS}
                value={visibility}
                onChange={handleVisibilityChange}
              />
            </div>
          )}

          {showSourceAndDislikedFilter && anyOtherFilterActive && (
            <div className="p-3 border rounded bg-light-subtle mt-3" style={{ borderLeft: '4px solid #6c757d' }}>
              <Row className="align-items-center">
                <Col xs={12} md={6} className="d-flex align-items-center">
                  <SourceFilter
                    options={SOURCE_OPTIONS}
                    value={source}
                    onChange={handleSourceChange}
                  />
                </Col>
                <Col xs={12} md={6} className="d-flex align-items-center mt-3 mt-md-0 justify-content-md-end">
                  <DislikedRecipesCheckbox
                    excludeDisliked={excludeDisliked}
                    onChange={setExcludeDisliked}
                  />
                </Col>
              </Row>
            </div>
          )}

          <div className="d-flex justify-content-end mt-3">
            {(ingredients.length > 0 ||
              selectedCuisine !== '' ||
              selectedDiets.length > 0 ||
              visibility !== '' ||
              source !== '' ||
              excludeDisliked === true) && (
                <Button
                  variant="link"
                  className="ms-3 me-3 p-0 text-decoration-underline"
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>)}

            <Button
              variant="primary"
              disabled={ingredients.length === 0 &&
                selectedCuisine === '' &&
                selectedDiets.length === 0 &&
                visibility === '' &&
                source === '' &&
                excludeDisliked === false
              }
              type="button"
              onClick={handleSearch}
            >
              {searching ? 'Searching...' : 'Search Recipes'}
            </Button>
          </div>
        </div>
      </div>
    </div >

  );
};
