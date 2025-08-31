import { useState } from 'react';
import { Offcanvas, Form, Button, InputGroup } from 'react-bootstrap';
import styles from "../styles/ModalBase.module.css"
import ingredientsStyles from "./UserIngredients.module.css"
import { useUserIngredientsContext } from '../../context/UserIngredientsContext';

type UserIngredientsProps = {
  show: boolean;
  onClose: () => void;
}

export default function UserIngredients({ show, onClose }: UserIngredientsProps) {
  const { userIngredients, addUserIngredient, deleteUserIngredient } = useUserIngredientsContext();

  const [newIngredient, setNewIngredient] = useState<string>('');

  const handleAdd = async () => {
    const trimmed = newIngredient.trim();
    if (!trimmed) return;

    try {
      await addUserIngredient({ ingredient: trimmed });
      setNewIngredient('');
    } catch (error) {
      console.log("Error adding ingredient " + error);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteUserIngredient(id);
    } catch (error) {
      console.log("Error deleting user ingredient" + error);
    }
  };

  return (
    <Offcanvas
      show={show}
      placement="end"
      className={ingredientsStyles.sidebarResponsive}
      onHide={onClose}
    >
      <Offcanvas.Header closeButton className={styles.modalHeaderCustom}>
        <Offcanvas.Title className={styles.modalTitleCustom}>My Ingredients</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className={styles.modalBodyFlex}>
        <div className={styles.modalContentCard}>
          <Form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">New Ingredient</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="e.g. Tomato"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>

          <div className={ingredientsStyles.ingredientList}>
            {userIngredients.map((ingredientObj) => (
              <div key={ingredientObj.id} className={ingredientsStyles.ingredientItem}>
                <span className={ingredientsStyles.ingredientText}>{ingredientObj.ingredient}</span>
                <button
                  type="button"
                  className={ingredientsStyles.removeBtn}
                  aria-label={`Remove ${ingredientObj.id}`}
                  onClick={() => handleRemove(ingredientObj.id)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
