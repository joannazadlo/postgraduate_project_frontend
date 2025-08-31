import { useState, useRef } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { createRecipe, createRecipeWithImage } from '../../../../services/recipeService';
import { Recipe, RecipePayload, IngredientPayload, Ingredient } from '../../../../types/types';
import RecipeForm from './RecipeForm';
import CloseConfirmationModal from '../../../confirmation-modals/CloseConfirmationModal';
import styles from "../../../styles/ModalBase.module.css"

type CreateRecipeFormProps = {
  show: boolean;
  handleClose: () => void;
  onNewRecipe: (recipe: Recipe) => void;
  triggerToast: (message: string, type?: 'success' | 'danger') => void;
}

export default function CreateRecipeForm({ show, handleClose, onNewRecipe, triggerToast }: CreateRecipeFormProps) {
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
  const [imageError, setImageError] = useState<string | null>(null);
  const [invalidFile, setInvalidFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setIngredients([{ id: uuidv4(), name: '', quantity: '' }]);
    setSteps('');
    setImage(null);
    setDietaryPreferences([]);
    setCuisine('');
    setCookingTime('');
    setIsPublic(false);
    setValidated(false);
    setImageError(null);
    setInvalidFile(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isTitleValid = title.trim() !== '';
    const allIngredientsValid = ingredients.every(ing => ing.name.trim() !== '');

    if (!isTitleValid || !allIngredientsValid) {
      setValidated(true);
      return;
    }

    if (imageError) {
      setValidated(true);
      return;
    }

    const payloadIngredients: IngredientPayload[] = ingredients.map(({ name, quantity }) => ({ name, quantity }));

    const newRecipe: RecipePayload = {
      title: title,
      ingredients: payloadIngredients,
      steps: steps.split('\n'),
      dietaryPreferences: dietaryPreferences,
      cuisine: cuisine,
      cookingTime: cookingTime,
      isPublic: isPublic
    };

    try {
      let created;
      if (image instanceof File) {
        created = await createRecipeWithImage(newRecipe, image);
      } else {
        created = await createRecipe(newRecipe);
      }

      onNewRecipe(created);
      triggerToast('Recipe added successfully', 'success');
      resetForm();
      handleClose();
    } catch {
      triggerToast('Error adding recipe', 'danger');
    }
  };

  const checkIfFormIsDirty = () => {
    if (
      title.trim() !== '' ||
      steps.trim() !== '' ||
      image !== null ||
      dietaryPreferences.length > 0 ||
      cuisine !== '' ||
      cookingTime !== '' ||
      isPublic !== false ||
      ingredients.some((ingredient) => ingredient.name.trim() !== '' || ingredient.quantity.trim() !== '')
    ) {
      return true;
    }
    return false;
  };

  const handleCloseModal = () => {
    if (checkIfFormIsDirty()) {
      setShowConfirmation(true);
    } else {
      setValidated(false);
      resetForm();
      handleClose();
    }
  };

  const handleConfirmClose = () => {
    resetForm();
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
  };

  const handleRemoveImage = () => {
    setImage(null);

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
            Create Recipe
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
            <Button variant="primary" type="submit" className="px-4 py-2">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal >

      <CloseConfirmationModal
        show={showConfirmation}
        onClose={handleCancelClose}
        onDiscard={handleConfirmClose}
      />
    </>
  );
}
