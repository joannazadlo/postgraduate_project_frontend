import { Row, Col, Form, Button, InputGroup, Badge } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { ChangeEvent, KeyboardEvent } from 'react';
import styles from '../RecipeFinder.module.css';
import { UserIngredient } from '../../../types/types';

type IngredientFilterProps = {
  ingredients: string[];
  inputValue: string;
  userIngredients: UserIngredient[] | null;
  preferences: { preferredIngredients?: string[] } | null;
  popularIngredients: string[];
  addAllUserIngredients: () => void;
  allUserIngredientsAdded: boolean;
  clearIngredients: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  addIngredient: (val: string) => void;
  removeIngredient: (val: string) => void;
};

export default function IngredientFilter({
  ingredients,
  inputValue,
  userIngredients,
  preferences,
  popularIngredients,
  addAllUserIngredients,
  allUserIngredientsAdded,
  clearIngredients,
  handleChange,
  handleInputKeyDown,
  addIngredient,
  removeIngredient
}: IngredientFilterProps) {
  return (
    <Row>
      <Col xs={12} sm={6} md={5}>
        <Form.Label className="fw-semibold mb-2">
          Type in ingredients you’d like to use
        </Form.Label>
        <div className="mb-2">
          <InputGroup>
            <Form.Control
              placeholder="Enter ingredient"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
            />
            <Button variant="outline-secondary" onClick={() => addIngredient(inputValue)}>
              <FaSearch />
            </Button>
            <span className="visually-hidden">Add</span>
          </InputGroup>
        </div>

        {userIngredients && userIngredients.length > 0 && (
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="outline-primary"
              size="sm"
              title="Add all your saved ingredients"
              disabled={allUserIngredientsAdded}
              onClick={addAllUserIngredients}
            >
              + Add My Ingredients
            </Button>
          </div>
        )}

        <hr />

        <Form.Label className="fw-semibold mb-2">
          {preferences?.preferredIngredients?.length ? 'Your preferred ingredients' : 'Popular ingredients'}
        </Form.Label>
        <div className="d-flex flex-wrap gap-2">
          {(preferences?.preferredIngredients?.length ? preferences.preferredIngredients : popularIngredients).map((item) => (
            <Button
              key={item}
              disabled={ingredients.includes(item)}
              title="Click to add ingredient"
              variant="outline-primary"
              className={`rounded-pill shadow-sm d-flex align-items-center ${styles.popularIngredient}`}
              onClick={() => addIngredient(item)}
            >
              + {item}
            </Button>
          ))}
        </div>

      </Col>
      <Col xs={12} sm={6} md={7}>
        <div className={styles.innerDivider}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="fw-semibold mb-2">
              Your ingredients
            </Form.Label>
            {ingredients.length > 0 && (
              <Button
                variant="link"
                className="ms-3 me-3 p-0 text-decoration-underline"
                onClick={clearIngredients}
              >
                Clear Ingredients
              </Button>
            )}

          </div>
          {ingredients.length === 0 ? (
            <p>No ingredients added.</p>
          ) : (
            <>
              {ingredients.map((item) => (
                <Badge
                  key={item}
                  bg="secondary"
                  className={`bg-light text-dark border d-inline-flex align-items-center px-3 py-2 rounded-pill shadow-sm ${styles['badge']}`}
                >
                  {item}
                  <Button
                    variant="link"
                    size="sm"
                    className={`ms-2 p-0 text-black ${styles.badgeRemoveBtn}`}
                    aria-label={`Remove ${item}`}
                    onClick={() => removeIngredient(item)}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </>
          )}
        </div>
      </Col>
    </Row>
  )
}
