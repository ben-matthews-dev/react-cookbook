import { configureStore } from '@reduxjs/toolkit'

import recipesReducer from './features/recipes/recipeSlice'
import ingredientsReducer from './features/ingredients/ingredientSlice'

const store = configureStore({
    reducer: {
        recipes: recipesReducer,
        ingredients: ingredientsReducer
    }
})

export default store