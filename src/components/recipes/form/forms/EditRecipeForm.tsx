import { useState, useRef, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { Ingredient, IngredientPayload, Recipe, RecipePayload } from '../../../../types/types';
import RecipeForm from './RecipeForm';
import CloseConfirmationModal from '../../../confirmation-modals/CloseConfirmationModal';
import { updateRecipe, updateRecipeWithImage } from '../../../../services/recipeService';
import styles from "../../../styles/ModalBase.module.css"

type EditRecipeFormProps = {
  show: boolean;
  handleClose: () => void;
  onUpdateRecipe: (updatedRecipe: Recipe) => void;
  recipe: Recipe;
  triggerToast: (message: string, type: 'success' | 'danger') => void;
}

export default function EditRecipeForm({ show, handleClose, recipe, onUpdateRecipe, triggerToast }: EditRecipeFormProps) {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: uuidv4(), name: '', quantity: '' }]);
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState<File | string | null>(null);
  const [validated, setValidated] = useState(false);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [initialFormState, setInitialFormState] = useState<Recipe | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [invalidFile, setInvalidFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!show) return;

    setImageError(null);
    setInvalidFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setInitialFormState({
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      imageSource: recipe.imageSource || null,
      isPublic: recipe.isPublic || false,
      dietaryPreferences: recipe.dietaryPreferences || [],
      cuisine: recipe.cuisine || '',
      cookingTime: recipe.cookingTime || '',
      source: '',
      createdAt: recipe.createdAt
    });

    setTitle(recipe.title);
    setIngredients(
      recipe.ingredients
    );
    setSteps(recipe.steps.join("\n"));
    setImage(recipe.imageSource || null);
    setImageRemoved(false);
    setIsPublic(recipe.isPublic || false);
    setDietaryPreferences(recipe.dietaryPreferences || []);
    setCuisine(recipe.cuisine || '');
    setCookingTime(recipe.cookingTime || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  function toIngredientPayload(ingredients: Ingredient[]): IngredientPayload[] {
    return ingredients.map(({ id, name, quantity }) => {
      return typeof id === 'number' ? { id, name, quantity } : { name, quantity };
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    const newRecipe: RecipePayload = {
      title: title,
      ingredients: toIngredientPayload(ingredients),
      steps: steps.split('\n'),
      dietaryPreferences: dietaryPreferences,
      cuisine: cuisine,
      cookingTime: cookingTime,
      isPublic: isPublic
    };

    try {
      let updatedRecipe: Recipe;

      if (image instanceof File) {
        updatedRecipe = await updateRecipeWithImage(recipe.id, newRecipe, image);
      } else if (imageRemoved) {
        updatedRecipe = await updateRecipeWithImage(recipe.id, newRecipe, undefined, imageRemoved);
      } else {
        updatedRecipe = await updateRecipe(recipe.id, newRecipe);
      }

      onUpdateRecipe(updatedRecipe);
      setInitialFormState(updatedRecipe);
      triggerToast('Recipe updated successfully', 'success');
      handleClose();
    } catch (error) {
      console.error('Error saving recipe:', error);
      triggerToast('An error occurred while saving the recipe. Please try again', 'danger');
    }
  };

  const isFormValid = () => {
    const isTitleValid = title.trim() !== '';
    const allIngredientsValid = ingredients.every(ing => ing.name.trim() !== '');

    if (!isTitleValid || !allIngredientsValid) {
      setValidated(true);
      return false;
    }

    if (imageError) {
      setValidated(true);
      return false;
    }

    return true;
  }

  const checkIfFormIsDirty = () => {
    if (!initialFormState) return false;

    const normalizeSteps = (steps: string) => {
      return steps
        .split("\n")
        .map(step => step.trim())
        .filter(step => step.length > 0);
    };

    const currentStepsArray = normalizeSteps(steps);
    const initialStepsArray = normalizeSteps(initialFormState.steps.join("\n"));

    let isImageDirty = false;

    if (image instanceof File) {
      isImageDirty = true;
    } else if (!image && initialFormState.imageSource) {
      isImageDirty = true;
    }

    const isTitleDirty = title !== initialFormState.title;

    const areIngredientsDirty = ingredients.some((ingredient, index) => {
      const initialIngredient = initialFormState.ingredients[index];

      if (ingredient.name.trim() === '' && ingredient.quantity.trim() === '') {
        return false;
      }

      return (
        ingredient.name !== initialIngredient?.name ||
        ingredient.quantity !== initialIngredient?.quantity
      );
    });

    const areStepsDirty = !arraysEqual(currentStepsArray, initialStepsArray);

    const isVisibilityDirty = isPublic !== initialFormState.isPublic;
    const isCuisineDirty = cuisine !== initialFormState.cuisine;
    const isTimeDirty = cookingTime !== initialFormState.cookingTime;
    const arePreferencesDirty = !arraysEqual(dietaryPreferences, initialFormState.dietaryPreferences || []);

    return (
      isTitleDirty ||
      areIngredientsDirty ||
      areStepsDirty ||
      isImageDirty ||
      isVisibilityDirty ||
      isCuisineDirty ||
      isTimeDirty ||
      arePreferencesDirty
    );
  };

  const arraysEqual = (arr1: string[], arr2: string[]) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };

  const handleCloseModal = () => {
    if (checkIfFormIsDirty()) {
      setShowConfirmation(true);
    } else {
      setValidated(false);
      handleClose();
    }
  };

  const handleConfirmClose = () => {
    handleClose();
    setShowConfirmation(false);
  }

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };

  const handleImageValidated = (image: File | null, error: string | null, invalidFile: File | null) => {
    setImage(image);
    setImageError(error);
    setInvalidFile(invalidFile);
    setImageRemoved(false);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageRemoved(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveInvalidFile = () => {
    setInvalidFile(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Modal show={show} dialogClassName={styles.customModalDialog} onHide={handleCloseModal}>
        <Modal.Header closeButton className={styles.modalHeaderCustom}>
          <Modal.Title className={styles.modalTitleCustom}>
            Edit Recipe
          </Modal.Title>
        </Modal.Header>
        <Form noValidate onSubmit={handleSubmit}>
          <Modal.Body className="p-0">
            <div className={styles.modalBodyFlex}>
              <div className={styles.modalContentCard}>
                <RecipeForm
                  title={title}
                  setTitle={setTitle}
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  validated={validated}
                  steps={steps}
                  handleStepsChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSteps(e.target.value)}
                  image={image}
                  invalidFile={invalidFile}
                  handleRemoveInvalidFile={handleRemoveInvalidFile}
                  handleRemoveImage={handleRemoveImage}
                  fileInputRef={fileInputRef}
                  imageError={imageError}
                  dietaryPreferences={dietaryPreferences}
                  setDietaryPreferences={setDietaryPreferences}
                  cuisine={cuisine}
                  setCuisine={setCuisine}
                  cookingTime={cookingTime}
                  setCookingTime={setCookingTime}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  onImageValidated={handleImageValidated}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooterCustom}>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <CloseConfirmationModal
        show={showConfirmation}
        onClose={handleCancelClose}
        onDiscard={handleConfirmClose}
      />
    </>
  );
}
