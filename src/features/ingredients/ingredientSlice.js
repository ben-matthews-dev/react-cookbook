import { createSelector } from "reselect"

// TODO: update to use react toolkit
const initialState = {
    entities: {}
}

function ingredientsReducer(state = initialState, action) {
    switch (action.type)
    {
        case "ingredients/ingredientsLoaded": {
            const newEntities = {}
            action.payload.forEach(ingredient => {
                newEntities[ingredient.id] = ingredient
            });
            return {
                ...state,
                entities: newEntities
            }
        }
        default: {
            return state
        }
    }
}

// Actions
export const ingredientsLoaded = (ingredients) => {
    return {
        type: 'ingredients/ingredientsLoaded',
        payload: ingredients
    }
}

// Thunk functions
export async function fetchIngredients(dispatch, getState) {
    fetch("/api/ingredients")
    .then((res) => res.json())
    .then((json) => {
        dispatch(ingredientsLoaded(json.ingredients))
    })
};

// Selectors
export const selectIngredientEntities = state => state.ingredients.entities
export const selectIngredients = createSelector(selectIngredientEntities, entities => Object.values(entities))
export const selectIngredientById = (state, ingredientId) => selectIngredientEntities(state)[ingredientId]

export default ingredientsReducer