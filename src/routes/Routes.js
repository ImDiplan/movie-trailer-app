import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Crud from '../pages/Crud';
import Index from '../pages/Index';
import Login from '../pages/Login';

export default function Routes(){
    return(
        <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Index}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/admin" component={Crud} />
        </Switch>
        </BrowserRouter>
    )
}