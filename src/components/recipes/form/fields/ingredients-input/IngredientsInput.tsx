import { InputGroup, Form, Button, ListGroup } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import styles from './IngredientsInput.module.css';
import { Ingredient } from '../../../../../types/types';

type IngredientsInputProps = {
  ingredients: Ingredient[];
  setIngredients: (ingredients: Ingredient[]) => void;
  validated: boolean;
}

export default function IngredientsInput({ ingredients, setIngredients, validated }: IngredientsInputProps) {
  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: uuidv4(), name: '', quantity: '' },
    ]);
  };

  const removeIngredient = (id: string | number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    id: string | number
  ) => {
    const { name, value } = e.target;
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [name]: value } : ingredient
      )
    );
  };

  return (
    <>
      <Form.Label className="fw-semibold mb-1">Ingredients</Form.Label>
      <ListGroup>
        {ingredients.map((ingredient) => (
          <ListGroup.Item
            key={ingredient.id}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="w-100">
              <div className={`${styles.ingredientRow}`}>
                <InputGroup className={`me-2 ${styles.inputGroup}`}>
                  <InputGroup.Text className={styles.inputText}>Ingredient</InputGroup.Text>
                  <Form.Control
                    required
                    aria-label="Ingredient Name"
                    placeholder="Enter ingredient name"
                    name="name"
                    value={ingredient.name}
                    isInvalid={validated && !ingredient.name.trim()}
                    className={styles.formControl}
                    onChange={(e) => handleChange(e, ingredient.id)}
                  />

                  <Form.Control.Feedback type="invalid">
                    {ingredients.length === 1 ? (
                      "Please enter an ingredient name."
                    ) : (

                      "Please enter an ingredient name or remove it."
                    )}
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className={`${styles.inputGroup} ${styles.formControl}`}>
                  <InputGroup.Text className={styles.inputText}>Quantity</InputGroup.Text>
                  <Form.Control
                    aria-label="Ingredient Quantity"
                    placeholder="Enter quantity (e.g. 1 cup)"
                    name="quantity"
                    value={ingredient.quantity}
                    className={styles.formControl}
                    onChange={(e) => handleChange(e, ingredient.id)}
                  />
                </InputGroup>
              </div>
            </div>

            {ingredients.length > 1 && (
              <div className={`ms-2 ${styles.removeButtonWrapper}`}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  aria-label="Remove ingredient"
                  onClick={() => removeIngredient(ingredient.id)}
                >
                  &times;
                </Button>
              </div>
            )}
          </ListGroup.Item>
        ))}
        <InputGroup className="mb-3">
          <Button variant="outline-primary" className="ms-auto" onClick={addIngredient}>
            Add Ingredient
          </Button>
        </InputGroup>
      </ListGroup>
    </>
  );
}
