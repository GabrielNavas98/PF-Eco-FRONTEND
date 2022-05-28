import React from "react"
import { filterByCategory } from "../../redux/actions/products";
import { useDispatch } from "react-redux"

import style from './Categories.module.css'

export default function Categories({categories, paginado}){
    const dispatch = useDispatch();

    function handleChangeCategories (e){
        e.preventDefault();
        dispatch(filterByCategory(e.target.value));
        paginado(1)
    }
    return(
        <select defaultValue="all" onChange={e => handleChangeCategories(e)} className={style.select_categories}>
            <option value="all" disabled>Filter Brand</option>
            {
                categories?.map(cat => {
                        return(
                            <option name= 'categories' key={cat.name} value={cat.name}>{cat.name}</option>
                        )
                    })
            }
        </select>
    )
}