import { 
    RestSerializer, 
    belongsTo, 
    createServer, 
    hasMany, 
    Model, 
} from 'miragejs'

export default function makeServer(environment = "development") {
    return createServer({
        environment,
        // timing: 2000,

        serializers: {
            recipe: RestSerializer.extend({
                include: ["recipeIngredients"],
                embed: true
            }),
            recipeIngredient: RestSerializer.extend({
                include: ["ingredient", "recipe"],
                embed: true
            })
        },

        models: {
            recipe : Model.extend({
                recipeIngredients: hasMany(),
            }),
            ingredient: Model,
            recipeIngredient: Model.extend({
                recipe: belongsTo(),
                ingredient: belongsTo()
            })
        },

        routes() {
            this.namespace = "api"

            this.get("/recipes", (schema, request) => {    
                return schema.recipes.all(); 
            })

            this.delete("/recipes/:id", (schema, request) => {
                let id = request.params.id

                return schema.recipes.find(id).destroy()
            })

            this.get("/ingredients", (schema, request) => {
                return schema.ingredients.all();
            })

            this.post("/recipes", (schema, request) => {              
                let attrs = JSON.parse(request.requestBody).recipe
                let recipeId = schema.recipes.create({...attrs, recipeIngredients: []}).id
                let recipeIngredients = setupRecipeIngredients(schema, attrs, recipeId)
                
                schema.db.recipes.update(recipeId, { 
                    name: attrs.name, 
                    servings: attrs.servings, 
                    cookTimeInMinutes: attrs.cookTimeInMinutes, 
                    instructions: attrs.instructions,
                    recipeIngredientIds: recipeIngredients.map(recipeIngredient => {
                        return recipeIngredient.id
                    })
                 })

                return schema.recipes.find(recipeId)
            }) 
            
            this.post("/recipes/:id", (schema, request) => {
                let recipeId = request.params.id
                let attrs = JSON.parse(request.requestBody).recipe
                let recipeIngredients = setupRecipeIngredients(schema, attrs, recipeId)
                
                schema.db.recipes.update(recipeId, { 
                    name: attrs.name, 
                    servings: attrs.servings, 
                    cookTimeInMinutes: attrs.cookTimeInMinutes, 
                    instructions: attrs.instructions,
                    recipeIngredientIds: recipeIngredients.map(recipeIngredient => {
                        return recipeIngredient.id
                    })
                 })

                return schema.recipes.find(recipeId)
            })
        },

        seeds(server) {
            // TODO: Use factory to seed data.
            var salt = server.create("ingredient", {
                name: "Salt",
            })

            var pork = server.create("ingredient", {
                name: "Pork",
            })

            var chicken = server.create("ingredient", {
                name: "Chicken",
            })

            var paprika = server.create("ingredient", {
                name: "Paprika",
            })

            server.create("recipe", { 
                name: "Plain pork",
                servings: 5,
                cookTimeInMinutes: 120,
                instructions:"1. Put paprika on pork\n2. Put pork in oven\n3. Eat pork",
             
                recipeIngredients: [
                    server.create("recipeIngredient", {
                        ingredient: pork,
                        amount: '1.4 kg',
                    }),
                    server.create("recipeIngredient", {
                        ingredient: paprika,
                        amount: '1 tsp',
                    }),
                ]
            })

            server.create("recipe", { 
                name: "Plain chicken",
                servings: 3,
                cookTimeInMinutes: 60,
                instructions:"1. Put salt on chicken\n2. Put pork in oven\n3. Eat pork",
             
                recipeIngredients: [
                    server.create("recipeIngredient", {
                        ingredient: chicken,
                        amount: '1.1 kg',
                    }),
                    server.create("recipeIngredient", {
                        ingredient: salt,
                        amount: '1/2 tsp',
                    }),
                ]
            })
        }     
    })
}

const setupRecipeIngredients = (schema, attrs, recipeId) => {
    let recipeIngredients = attrs.recipeIngredients.map(recipeIngredient => {

        // Create new ingredient if it doesn't exist
        let existingIngredient = schema.db.ingredients.findBy( { name: recipeIngredient.ingredient.name })
        if (!existingIngredient) {
            existingIngredient = schema.db.ingredients.insert({
                ...recipeIngredient.ingredient
            })
        }

        // Update existing recipe ingredient
        let existingRecipeIngredient = schema.db.recipes.find(recipeId).recipeIngredientIds?.includes(recipeIngredient.id)
        if (existingRecipeIngredient)
        {
            existingRecipeIngredient = schema.db.recipeIngredients.update(recipeIngredient.id, {
                ingredientId: existingIngredient.id,
                amount: recipeIngredient.amount,
                recipeId: recipeId
            })
            return existingRecipeIngredient
        }

        // Create new recipe ingredient
        let newRecipeIngredient = schema.db.recipeIngredients.insert({
            ...recipeIngredient,
            ingredient: schema.ingredients.find(existingIngredient.id),
            recipeId,
        })

        return newRecipeIngredient;
    })

    return recipeIngredients;
}