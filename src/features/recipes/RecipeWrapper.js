
import React, { useState } from 'react'

import RecipeList from './RecipeList'
import AddRecipeForm from './AddRecipeForm'
import EditRecipeForm from './EditRecipeForm'

function RecipeWrapper() {
    const [selectedRecipeId, setSelectedRecipeId] = useState()

    const handleRecipeSelect = (id) => {
        setSelectedRecipeId(id)
    }

    return (
        <section>
            <div className="parent flex-parent">
                <div className="child flex-child recipe-list ">
                    <RecipeList handleRecipeSelect={handleRecipeSelect} selectedRecipeId={selectedRecipeId} />
                </div>
                <div className="child flex-child">
                    {selectedRecipeId 
                        ? <EditRecipeForm id={selectedRecipeId} handleRecipeSelect={handleRecipeSelect} /> 
                        : <AddRecipeForm handleRecipeSelect={handleRecipeSelect} />
                    }
                </div>
            </div>
        </section>
    )
}

export default RecipeWrapper;