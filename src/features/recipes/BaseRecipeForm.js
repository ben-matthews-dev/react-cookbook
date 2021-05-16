import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage, FieldArray, useField } from 'formik'
import * as Yup from 'yup'
import AsyncCreatableSelect from "react-select/async-creatable";

import { fetchIngredients, selectIngredients } from '../ingredients/ingredientSlice'

function BaseRecipeForm( {initialValues, onSubmit, handleRecipeSelect} ) {

    const dispatch = useDispatch();

    const ingredients = useSelector(selectIngredients)

    useEffect(() => {
        dispatch(fetchIngredients)
    }, [dispatch])

    const MyTextArea = ({label, ...props}) => {
        // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
        // which we can spread on <input> and alse replace ErrorMessage entirely.
        const [field, meta] = useField(props);
        return (
            <>
                <label htmlFor={props.id || props.name} className="recipe-edit__label">{label}</label>
                <textarea className="recipe-edit__input" {...field} {...props} />
                {meta.touched && meta.error ? (
                    <div className="recipe-edit__error">{meta.error}</div>
                ) : null}
            </>
        );
    }; 

    const MyTextInput = ({ label, ...props }) => {
        const [field, meta] = useField(props);
        return (
            <>
                <label htmlFor={props.id || props.name} className="recipe-edit__label">{label}</label>
                <input className="recipe-edit__input" {...field} {...props}/>
                {meta.touched && meta.error ? (
                    <div className="recipe-edit__error">{meta.error}</div>
                ) : null} 
            </>
        );
    };

    const MyReactSelectCreatable = ({ name }) => {
        function SelectField(props) {
            const promiseOptions = async (inputValue) => {
                return ingredients.map((ingredient) => ({
                    value: ingredient.id,
                    label: ingredient.name,
                }));
            };
        
            const customStyles = {
                control: (provided, state) => ({
                    // react-select's styles are passed into <Control />
                    ...provided,
                    border: '1px solid black',
                    borderRadius: 0,
                    fontSize: 'inherit',
                    margin: 0,
                    padding: 0,
                    outline: 'none',
                    width: '100%',
                    height: 35,
                    minHeight: 35
                }),
            }

            return (
                <AsyncCreatableSelect
                styles={customStyles}
                {...props.field}
                name={name}
                isClearable
                cacheOptions
                defaultOptions
                loadOptions={promiseOptions}
                onChange={(opt, action) => {
                    props.form.setFieldValue(name, opt);
                    if (action.action === "clear") {
                        props.form.setFieldValue(name, "");
                    }
                }}    
                />
            );
        }

        return (
            <div data-testid="recipe-ingredient-ingredient"> 
                <Field name={name} component={SelectField}/>
                <ErrorMessage name={name} component="div" className="recipe-edit__error" /> 
            </div>
        );
    }

    const validationSchema = () => Yup.object().shape({
        name: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
        servings: Yup.number()
            .min(1, "Must be equal or greater than 1")
            .required("Required"),
        cookTimeInMinutes: Yup.number()
            .min(1, "Must be equal or greater than 1")
            .required("Required"),
        instructions: Yup.string()
            .max(255, "Must be 255 characters or less")
            .required("Required"),  
        recipeIngredients: Yup.array()
            .min(1, "Pick at least 1 ingredient")
            .of(
                Yup.object().shape({
                    amount: Yup.string()
                        .required("Amount is required"),
                    ingredient: Yup.object()
                        .required("Ingredient is required")
                        .nullable()
                })
            )
    })

    return (
        <div className="recipe-edit">
            <div className="recipe-edit__remove-button-container">
                <button 
                    className="btn recipe-edit__remove_button"
                    onClick={() => handleRecipeSelect(undefined)}
                >
                &times;
                </button>
            </div>
            <Formik 
                initialValues={initialValues} 
                validationSchema={validationSchema} 
                onSubmit={onSubmit} 
                enableReinitialize // Important: the form will not refresh without this.
            >
            {({ errors, values, touched, setValues, dirty }) => (
                <Form>
                    <MyTextInput
                        label="Name"
                        name="name"
                        data-testid="recipe-name"
                    />

                    <MyTextInput
                        label="Servings"
                        name="servings"      
                        type="number"      
                        min="0"   
                        data-testid="recipe-servings"         
                    />

                    <MyTextInput
                        label="Cook Time In Minutes"
                        name="cookTimeInMinutes"      
                        type="number"
                        min="0"     
                        data-testid="recipe-cookTimeInMinutes"             
                    />

                    <MyTextArea
                        label="Instructions"
                        name="instructions"
                        rows="6"
                        data-testid="recipe-instructions"
                    />

                    <p className="recipe-edit__label">Ingredients</p>
                    <FieldArray
                        name="recipeIngredients"
                        render={arrayHelpers => (
                            <div>
                                {values.recipeIngredients.map((recipeIngredient, index) => (
                                    <div key={index} className="recipe-edit__ingredient-grid list-group list-group-flush">
                                        {/* <div className="list-group-item"> */}
                                            <div className="form-row">
                                                <div className="col-5">
                                                    <MyTextInput
                                                        className="recipe-edit__input"
                                                        name={`recipeIngredients.${index}.amount`}
                                                        type="text"
                                                        placeholder="Amount"
                                                        data-testid="recipe-ingredient-amount"
                                                    />
                                                </div>

                                                <div className="col-5">
                                                    <MyReactSelectCreatable 
                                                        name={`recipeIngredients[${index}].ingredient`}                                                         
                                                    />
                                                </div>
                        
                                                <div className="col-2">
                                                    <button type="button" 
                                                        onClick={() => arrayHelpers.remove(index)}
                                                        className="btn btn--danger"
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            </div>
                                        {/* </div> */}
                                    </div>
                                ))}

                                {
                                    errors && 
                                    (errors.recipeIngredients && typeof errors.recipeIngredients.valueOf() === "string") &&
                                    touched &&
                                    Array.isArray(touched.recipeIngredients) && (
                                        <div className="recipe-edit__error">{errors.recipeIngredients}</div>
                                    )
                                }
                                
                                <button
                                    type="button"
                                    className="btn btn--primary mr-1"
                                    onClick={() => arrayHelpers.push({ amount: '', ingredient: [] })}
                                    data-testid="add-recipe-ingredient"
                                >
                                    +
                                </button>                   
                            </div>
                        )}
                    />
                               <button type="submit" 
                                    className="btn btn--primary mt-1" 
                                    data-testid="recipe-save">
                                        Save
                                </button>   
                </Form>
            )}
            </Formik>
        </div>
    )
}
export default BaseRecipeForm;