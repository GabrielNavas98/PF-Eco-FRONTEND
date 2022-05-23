import React,{useEffect, useState} from "react"
import activeValidations from "./validators/activeValidations"
import submitValidations from "./validators/submitValidations"
import {useDispatch, useSelector} from 'react-redux'
import {getCategories} from "../../../redux/actions/categories"
import style from './CategoryAdmin.module.css'
import FlashModal from '../AdminModals/FlashModal'
import axios from "axios"
import SERVER from "../../../server"

export default function CategoryForm({category,setModalB,setCategory}){
    const dispatch = useDispatch()
    
    const categoriesDb = useSelector((state)=>state.products.categoriesDb)
    
    const [keyword,setKeyword] = useState("")
    const [isOpen,setIsOpen] =useState(false)
    
    const [errors,setErrors]=useState({})
    const [input,setInput] = useState({
        name: "",
    })
    
    function handleInputChange(i){  
        setErrors(activeValidations(category,{...input,[i.target.name]:i.target.value},categoriesDb))
        setInput({...input,[i.target.name]:i.target.value})            
    }
    
    function handleClose(e){
        e.preventDefault()
        setIsOpen(false)
        setModalB(false)
        setCategory("")
    }

    async function handleSubmit(event){
        event.preventDefault()
        const data = {
        name: input.name || "",
        }
        setErrors(submitValidations(category,data,categoriesDb))
        if(Object.keys(errors).length === 0
        && input.name !== ""
        ){
        let response = null
            try {
            category?
                (response = await fetch(`${SERVER}/categories/${category.id}`,
                {method:"PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
                })):
                (response = await fetch(`${SERVER}/categories`,
                {method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
                }))
        const result = await response.json()

        setKeyword(result.msg)
        
        if(!isOpen && result){
            setIsOpen(true)
        if(result.msg === "Category created"){
            dispatch(getCategories())
            setInput({
                name:""
            })
            }else if(result.msg === "Category updated"){
            dispatch(getCategories())
            setInput({
                name:""
            })               
            }
        } 
            } catch (error) {
                console.log(error)
            }
        }
    }

    async function handleDelete(event){
        event.preventDefault()
        try {
        let response = null
        response = await axios.delete(`http://localhost:3001/categories/${category.id}`)
        const result = response.data
       
        setKeyword(result.msg)
        
        if(!isOpen && result){
            setIsOpen(state => !state);
        if(result.msg === "Category deleted"){
            dispatch(getCategories())
            setInput({
                name:""
            })}}
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(!category){
            setInput({
                name: ""
            })
        }
        if(category){
            setInput({
                name: category.name
            })
        }
    },[category])

    return (
        <div className={style.container}>
                <form onSubmit={handleSubmit} className={style.containerForm}>
                    <div className={style.categoryForm}>
                        <div>
                            <h3>Add or Edit</h3>
                            <p>Name:</p>
                            {category? <p>Previus name: {category.name}</p>:<></>}
                            <input className={errors?.name ? style.inputError:style.input} type='text' placeholder="Add a name..." name='name' value={input.name} onChange={handleInputChange}/>
                        </div>
                        {
                            errors.name && (<p className={style.errors}>{errors.name}</p>)
                        }
                    </div>
                    <div className={style.btnContainer}>
                        <div>
                            {
                                Object.keys(errors).length === 0 && Object.keys(input).length > 0 && 
                                <input type='submit' value= {category? "Edit" : "Add"} onClick={handleSubmit} className={style.mybtn}/>   
                            }   
                        </div>
                    <div>
                        {category ? <button onClick={handleDelete} className={style.mybtn2}>Delete</button> :<></>}
                    </div>
                    </div>
                </form>
                <FlashModal isOpen={isOpen} setIsOpen={setIsOpen} closePrev={setModalB} resetData={setCategory}>
                    { keyword.length ? (
                        <>
                        <h2>{keyword}</h2>
                        {keyword === "Category created" || keyword === "Category updated" || keyword === "Category deleted" ? 
                            <>
                            <button onClick={handleClose} className={style.mybtn}> 
                                Close All
                            </button>
                            </>
                        : 
                            <>
                            <button className={style.mybtn}onClick={()=> setIsOpen(false)}>Ok</button>
                            </>
                        
                    }
                        </>
                    ):(
                        <h2>Invalid Data</h2>
                    )}
                </FlashModal>
            </div>
    )
}