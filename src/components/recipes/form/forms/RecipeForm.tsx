import {
  TitleInput,
  VisibilitySwitch,
  DietaryPreferences,
  CookingTime,
  IngredientInput,
  StepsText,
  ImageUpload
} from '../fields';

import CuisineSelect from '../../../shared/fields/cuisine-select/CuisineSelect';
import { CUISINE_OPTIONS } from '../../../../constants/preferences';
import { Ingredient } from '../../../../types/types';

type RecipeFormProps = {
  title: string,
  setTitle: (title: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  dietaryPreferences: string[];
  setDietaryPreferences: (preferences: string[]) => void;
  cuisine: string;
  setCuisine: (cuisine: string) => void;
  cookingTime: string;
  setCookingTime: (time: string) => void;
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
  validated: boolean;
  steps: string;
  handleStepsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  image: File | string | null;
  onImageValidated: (image: File | null, error: string | null, invalidFile: File | null) => void;
  handleRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imageError: string | null;
  invalidFile: File | null;
  handleRemoveInvalidFile: () => void;
}

export default function RecipeForm({
  title,
  setTitle,
  isPublic,
  setIsPublic,
  dietaryPreferences,
  setDietaryPreferences,
  cookingTime,
  setCookingTime,
  cuisine,
  setCuisine,
  ingredients,
  setIngredients,
  validated,
  steps,
  handleStepsChange,
  image,
  onImageValidated,
  handleRemoveImage,
  fileInputRef,
  imageError,
  invalidFile,
  handleRemoveInvalidFile
}: RecipeFormProps) {
  return (
    <>
      <TitleInput title={title} validated={validated} onChange={setTitle} />
      <VisibilitySwitch isPublic={isPublic} onToggle={setIsPublic} />

      <DietaryPreferences
        selected={dietaryPreferences}
        onChange={setDietaryPreferences}
      />

      <CuisineSelect
        options={CUISINE_OPTIONS}
        value={cuisine}
        label="Cuisine"
        onChange={setCuisine}
      />

      <CookingTime selected={cookingTime} onChange={setCookingTime} />

      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
        validated={validated}
      />

      <StepsText steps={steps} onChange={handleStepsChange} />

      <ImageUpload
        image={image}
        invalidFile={invalidFile}
        handleRemoveInvalidFile={handleRemoveInvalidFile}
        handleRemoveImage={handleRemoveImage}
        fileInputRef={fileInputRef}
        imageError={imageError}
        onImageValidated={onImageValidated}
      />
    </>
  );
}
