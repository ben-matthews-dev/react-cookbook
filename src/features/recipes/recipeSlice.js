import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const recipesAdapter = createEntityAdapter()
const initialState = recipesAdapter.getInitialState({
    status: 'idle'
})

export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', async () => {
    let response = await fetch('/api/recipes')
    .then((res) => res.json())

    return response.recipes
})

export const deleteRecipe = createAsyncThunk('recipes/deleteRecipe', async (id) => {
    await fetch(`/api/recipes/${id}`, { method: "DELETE" })
    return id
})

export const updateRecipe = createAsyncThunk('recipes/upateRecipe', async (recipe) => {
    let response = await fetch(`/api/recipes/${recipe.id}`, { 
        method: "POST",
        body: JSON.stringify({
            recipe
        })
    })
    .then((res) => res.json())

    return response.recipe
})

export const saveNewRecipe = createAsyncThunk('recipes/saveNewRecipe', async (recipe) => {
    let response = await fetch("/api/recipes", {
        method: 'POST',
        body: JSON.stringify({
            recipe
        })
    })
    .then((res) => res.json())

    return response.recipe
})

const recipeSlice = createSlice({
    name: 'recipes',
    initialState,
    reducers: {
        recipeAdded(state, action) {
            const recipe = action.payload
            recipesAdapter.addOne(state, recipe)
        },
    },
    extraReducers: builder => {
        builder
        .addCase(fetchRecipes.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchRecipes.fulfilled, (state, action) => {
            recipesAdapter.setAll(state, action.payload)
            state.status = 'idle'
        })
        .addCase(deleteRecipe.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(deleteRecipe.fulfilled, (state, action) => {
            recipesAdapter.removeOne(state, action.payload)
            state.status = 'idle'
        })
        .addCase(updateRecipe.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(updateRecipe.fulfilled, (state, action) => {
            const recipe = action.payload
            state.entities[recipe.id] = recipe
            state.status = 'idle'
        })
        .addCase(saveNewRecipe.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(saveNewRecipe.fulfilled, (state, action) => {
            const recipe = action.payload
            recipesAdapter.addOne(state, recipe)
            state.status = 'idle'
        })
    }

})

export const {
    recipeAdded
} = recipeSlice.actions

export default recipeSlice.reducer

// Selectors
export const selectRecipeEntities = state => state.recipes.entities 
export const selectRecipes = createSelector(selectRecipeEntities, entities => Object.values(entities))

export const selectRecipeIds = state => selectRecipes(state).map(recipe => recipe.id);
export const selectRecipeById = (state, recipeId) => {
    return selectRecipeEntities(state)[recipeId];
}

export const selectRecipesStatus = (state) => {
    const recipesStatus = state.recipes.status;
    return recipesStatus
}