import React from 'react'
import { useSelector } from 'react-redux'

import IngredientList from '../ingredients/IngredientList'
import { selectRecipeById } from './recipeSlice'

function Recipe({ id, handleRecipeSelect, handleRecipeDelete }) {
    const recipe = useSelector((state) => selectRecipeById(state, id))
    const { 
        name, 
        cookTimeInMinutes, 
        servings,
        instructions,
        recipeIngredients
    } = recipe


    return (    
        <div className="recipe">    
            <div className="recipe__header">
                <h3 className="recipe__title">{name}</h3>
                <div>
                    <button 
                        className="btn btn--primary mr-1"
                        data-testid="edit-recipe"
                        onClick={() => {
                            handleRecipeSelect(id)
                        }}
                    >
                    Edit
                    </button>
                    <button 
                        className="btn btn--danger"
                        data-testid="delete-recipe"
                        onClick={() => { 
                            handleRecipeDelete(id)
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <div className="recipe__row">
                <span className="recipe__label">Cook Time In Minutes: </span>
                <span className="recipe__value">{cookTimeInMinutes}</span>
            </div>
            <div className="recipe__row">
                <span className="recipe__label">Servings: </span>
                <span className="recipe__value">{servings}</span>
            </div>
            <div className="recipe__row">
                <span className="recipe__label">Instructions:</span>
                <div className="recipe__value recipe__instructions recipe__value--indented">{instructions}</div>
            </div>
            <div className="recipe__row">
                <span className="recipe__label">Ingredients: </span>
                <div className="recipe__value recipe__value--indented"> 
                    <IngredientList recipeIngredients={recipeIngredients} />
                </div>
            </div>
        </div>
    );
}

export default Recipe;