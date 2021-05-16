import React from 'react'

function Ingredient({ recipeIngredient }) {    
    const {
        amount,
        ingredient
    } = recipeIngredient
    
    return (
        <>
            <span>{ingredient.name}</span>
            <span>{amount}</span>
        </>
    )
}

export default Ingredient