import React from 'react'

import Ingredient from './Ingredient';

const IngredientList = ({ recipeIngredients }) => {
    // TODO: look at shallowEqual and why it's required from the redux tutorial.
    // TODO: get the recipeId and then load all the recipeIngredientIds  

    const ingredientElements = recipeIngredients.map(recipeIngredient => {
        return (
            <Ingredient 
                key={recipeIngredient.id}
                recipeIngredient={recipeIngredient} />
        )
    })

    return (
        <div className="ingredient-grid">
            {ingredientElements}
        </div>
    )
}

export default IngredientList;