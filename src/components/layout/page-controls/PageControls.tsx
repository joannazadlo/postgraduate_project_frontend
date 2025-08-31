import { Button } from 'react-bootstrap';
import FilterToggleButton from '../menu/FilterToggleButton';
import SortDropdown from '../menu/SortDropdown';
import { SortOption } from '../../../utils/sortingHelper';

type PageControlsProps = {
  showControls: boolean;
  toggleFilter: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  onAddRecipeClick?: () => void;
  onManageIngredientsClick?: () => void;
  alwaysShowManageIngredients?: boolean;
}

export default function PageControls({
  showControls,
  toggleFilter,
  sortOption,
  setSortOption,
  onAddRecipeClick,
  onManageIngredientsClick,
  alwaysShowManageIngredients
} : PageControlsProps) {
  return (
    <div className="position-relative w-100 mt-4 mt-sm-0">
      {(showControls || alwaysShowManageIngredients) && (
        <>
          <div className="d-flex justify-content-between mb-2 d-sm-none">
            {showControls && (
              <>
                <FilterToggleButton onClick={toggleFilter} />
                <SortDropdown sortOption={sortOption} onSortChange={setSortOption} />
              </>
            )}
          </div>
          <div className="d-flex justify-content-between mb-2 d-sm-none">
            {onAddRecipeClick && showControls && (
              <Button variant="primary" onClick={onAddRecipeClick}>
                Add recipe
              </Button>
            )}
            {(onManageIngredientsClick && (showControls || alwaysShowManageIngredients)) && (
              <Button variant="outline-primary" onClick={onManageIngredientsClick}>
                Manage ingredients
              </Button>
            )}
          </div>

          <div className="d-none d-sm-flex align-items-center gap-3 justify-content-end">
            {showControls && (
              <>
                <FilterToggleButton onClick={toggleFilter} />
                <SortDropdown sortOption={sortOption} onSortChange={setSortOption} />
              </>
            )}
            {onAddRecipeClick && showControls && (
              <Button variant="primary" className="flex-shrink-0" onClick={onAddRecipeClick}>
                Add recipe
              </Button>
            )}
            {(onManageIngredientsClick && (showControls || alwaysShowManageIngredients)) && (
              <Button variant="outline-primary" className="flex-shrink-0" onClick={onManageIngredientsClick}>
                Manage ingredients
              </Button>
            )}

          </div>
        </>
      )}
    </div>
  );
};
