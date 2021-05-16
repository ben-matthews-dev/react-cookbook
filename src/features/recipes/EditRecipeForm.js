import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { selectRecipeById, updateRecipe } from './recipeSlice';
import BaseRecipeForm from './BaseRecipeForm';

function EditRecipeForm({ id, handleRecipeSelect }) {  
    const recipe = useSelector(state => selectRecipeById(state, id))
    const dispatch = useDispatch()

    const initialValues = {
        ...recipe,     
        recipeIngredients: recipe.recipeIngredients.map((recipeIngredient) => {
            return {
                ...recipeIngredient,
                ingredient: {
                    value: recipeIngredient.ingredient.id,
                    label: recipeIngredient.ingredient.name, 
                }
            }  
        })
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

        dispatch(updateRecipe(payload));
        handleRecipeSelect(undefined)
        // display form field values on success
        // alert('SUCCESS! \n\n' + JSON.stringify(payload, null, 4));
    }

    return (
        <BaseRecipeForm initialValues={initialValues} onSubmit={onSubmit} handleRecipeSelect={handleRecipeSelect} />
    )
}

export default EditRecipeForm;