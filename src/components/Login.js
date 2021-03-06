import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LogInschema from './LoginSchema'
import * as yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    parent: {
        display: 'flex',
        width: '31%',
        flexWrap: 'wrap',
    },
    errors1:{
        marginLeft: '13%',
        color: 'red',
    },
    errors2:{
        marginLeft: '15%',
        color: 'red',

    }
})

const initialFormValues = {
    name: '',
    password: ''
}

const initialFormErrors = {
    name: '',
    password: ''
}

const initialDisabled = true
const initialLogin = []

export default function LogIn() {
const [credentials, setCredentials] = useState(initialLogin)
const [formValues, setFormValues] = useState(initialFormValues)
const [errors, setErrors] = useState(initialFormErrors)
const [disabled, setDisabled] = useState(initialDisabled)

const onSubmit = (evt) => {
evt.preventDefault()
formSubmit()
}

const onChange = (evt) => {
const { name, value } = evt.target
formUpdate(name, value)
}

const formUpdate = (name, value) => {
yup
    .reach(LogInschema, name)
    .validate(value)
    .then(() => {
        setErrors({
            ...errors, [name]: '',
        })
    })
    .catch(err => {
        setErrors({
            ...errors, [name]: err.errors[0],
        })
    })
    setFormValues({
        ...formValues, [name]: value,
            })
}

const postLogin = () => {
    axios
        .post('https://pintereach-app-api.herokuapp.com/login', credentials)
        .then(res => {
            setCredentials(res.data)
        })
        .catch(err => {
            console.log('POST ERR -->', err)
        })
        .finally(() => {
            setFormValues(initialFormValues)
        })
}


const formSubmit = () => {
    const credentials = {
        name: formValues.name.trim(),
        password: formValues.password.trim(),
    }
    postLogin(credentials)
}

useEffect(() => {
    LogInschema.isValid(formValues).then((valid) => {
        setDisabled(!valid)
    })
}, [formValues])

const classes = useStyles();

return (    
    <div className={classes.parent}>

        <div className={classes.errors1}>
            {errors.name}
        </div>
        <div className={classes.errors2}>
            {errors.password}
        </div>

        <form onSubmit={onSubmit}>
        
        
        <div>
        <label> Username: 
        <input
        name='name'
        type='text'
        value={formValues.name}
        onChange={onChange}
        />
        </label>



        
        <label> Password: 
        <input
        name='password'
        type='password'
        value={formValues.password}
        onChange={onChange}
        />
        </label>



            <button disabled={disabled}>Log In!</button>
        </div>

        </form>
    </div>

    )
}