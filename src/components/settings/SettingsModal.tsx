import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from "../styles/ModalBase.module.css"
import settingsStyles from "./SettingsModal.module.css";
import { useUserPreferencesContext } from '../../context/UserPreferencesContext';
import CuisineSelect from '../shared/fields/cuisine-select/CuisineSelect';
import { CUISINE_OPTIONS, DIET_OPTIONS } from '../../constants/preferences';
import DietPreferencesSelect from '../shared/fields/diet-preferences-select/DietPreferencesSelect';
import IngredientInput from './fields/IngredientInput';
import DislikedRecipesCheckbox from '../shared/fields/disliked-recipes-checkbox/DislikedRecipesCheckbox';

type SettingsModalProps = {
  show: boolean;
  onHide: () => void;
};

type PreferencesPayload = {
  preferredIngredients: string[];
  cuisine: string;
  dietaryPreferences: string[];
  excludeDisliked: boolean;
};

export default function SettingsModal({
  show,
  onHide
}: SettingsModalProps) {
  const { preferences, updatePreferences } = useUserPreferencesContext();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [excludeDisliked, setExcludeDisliked] = useState<boolean>(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preferences) {
      setIngredients(preferences.preferredIngredients || []);
      setSelectedCuisine(preferences.cuisine || '');
      setSelectedDiets(preferences.dietaryPreferences || []);
      setExcludeDisliked(preferences.excludeDisliked || false);
    }
  }, [preferences]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated: PreferencesPayload = {
        preferredIngredients: ingredients,
        cuisine: selectedCuisine,
        dietaryPreferences: selectedDiets,
        excludeDisliked: excludeDisliked
      }

      await updatePreferences(updated);
      onHide();
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton className={styles.modalHeaderCustom} >
        <Modal.Title className={styles.modalTitleCustom}>User Preferences</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBodyFlex}>
        <div className={styles.modalContentCard}>
          <Form.Group className="mb-1">
            <p className={settingsStyles.infoNote}>
              These selections customize your recipe search filters.
            </p>
          </Form.Group>

          <IngredientInput
            ingredients={ingredients}
            setIngredients={setIngredients}
          />

          <CuisineSelect
            options={CUISINE_OPTIONS}
            value={selectedCuisine}
            label="Choose your preferred cuisines"
            onChange={setSelectedCuisine}
          />

          <DietPreferencesSelect
            options={DIET_OPTIONS}
            selected={selectedDiets}
            label="Choose dietary preferences"
            layoutClassName="justify-content-evenly gap-2 mt-2 flex-nowrap"
            onChange={setSelectedDiets}
          />

          <DislikedRecipesCheckbox
            excludeDisliked={excludeDisliked}
            label="Recipe exclusions"
            layoutClassName="mt-2"
            onChange={setExcludeDisliked}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" disabled={saving} onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" disabled={saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
