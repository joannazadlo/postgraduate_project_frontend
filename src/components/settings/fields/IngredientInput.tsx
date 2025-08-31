import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from './IngredientInput.module.css';

type IngredientInputProps = {
  ingredients: string[];
  setIngredients: (updated: string[]) => void;
}

export default function IngredientInput({ ingredients, setIngredients }: IngredientInputProps) {
  const [inputIngredient, setInputIngredient] = useState('');

  const addIngredient = () => {
    const trimmed = inputIngredient.trim();
    if (trimmed && ingredients.length < 3 && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  return (
    <Form.Group className="mb-4">
      <Form.Label className="fw-semibold mb-1">Select up to 3 preferred ingredients</Form.Label>
      <div className={styles.inputWrapper}>
        <Form.Control
          type="text"
          placeholder="Add ingredient"
          value={inputIngredient}
          disabled={ingredients.length >= 3}
          onChange={(e) => setInputIngredient(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
        />
        <Button
          variant="primary"
          disabled={inputIngredient.trim() === '' || ingredients.length >= 3}
          onClick={addIngredient}
        >
          Add
        </Button>
      </div>
      <div className="mt-2 d-flex flex-wrap gap-2">
        {ingredients.map((item) => (
          <Button
            key={item}
            title="Click to add ingredient"
            variant="outline-primary"
            className={`rounded-pill shadow-sm d-flex align-items-center ${styles.customButton}`}
            onClick={() => removeIngredient(item)}
          >
            {item} x
          </Button>
        ))}
      </div>
    </Form.Group>
  )
}
