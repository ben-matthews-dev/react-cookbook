import React from 'react'
import { useDispatch } from 'react-redux';

import { saveNewRecipe } from './recipeSlice';
import BaseRecipeForm from './BaseRecipeForm';


function AddRecipeForm({ handleRecipeSelect }) {  
    const dispatch = useDispatch()

    const initialValues = {
        name: '',
        servings: 0,
        cookTimeInMinutes: 0,
        instructions: '',
        recipeIngredients: []
    };
    
    const onSubmit = (values, actions) => {        
        const payload = {
            ...values,
            recipeIngredients: values.recipeIngredients.map((recipeIngredient) => ({
                amount: recipeIngredient.amount,
                id: recipeIngredient.id,
                ingredient: { id: recipeIngredient.ingredient.value, name: recipeIngredient.ingredient.label },
            }))
        }

        dispatch(saveNewRecipe(payload));
        handleRecipeSelect(undefined)
        
        // display form field values on success
        //alert('SUCCESS! \n\n' + JSON.stringify(payload, null, 4));
    }

    return (
        <BaseRecipeForm initialValues={initialValues} onSubmit={onSubmit} handleRecipeSelect={handleRecipeSelect} />
    )
}


export default AddRecipeForm;