import React, { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import Recipe from './Recipe'
import { fetchRecipes, selectRecipeIds, selectRecipesStatus, deleteRecipe } from './recipeSlice'

function RecipeList({ handleRecipeSelect, selectedRecipeId }) {
    const recipeIds = useSelector(selectRecipeIds, shallowEqual)
    const loadingStatus = useSelector(selectRecipesStatus)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchRecipes())
    }, [dispatch]);
    

    if (loadingStatus === 'loading') {
        console.log(loadingStatus)
        return (
          <div className="loader-wrapper">
            <div className="loader">Loading...</div>
          </div>
        )
    }

        // move to recipe level - going to need a context 
    const handleRecipeDelete = (id) => {
        if (selectedRecipeId !== null && id === selectedRecipeId) {
            handleRecipeSelect(undefined)
        }
        dispatch(deleteRecipe(id))
    }

    return (
        <div>
            {recipeIds.map(recipeId => {
                return (
                    <Recipe 
                        key={recipeId}
                        id={recipeId}
                        handleRecipeSelect={handleRecipeSelect}
                        handleRecipeDelete={handleRecipeDelete}
                    />
                ) 
            })} 
        </div>
    );
}

export default RecipeList;
