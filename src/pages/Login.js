import {React, useState, useEffect} from 'react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import '../login.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Login(){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = values => ValidateUser(values.username, values.password);
    const baseUrl = "http://localhost:4040/login/"
    const cookies = new Cookies();
    const user = cookies.get('user')
    const MySwal = withReactContent(Swal)

    useEffect(()=>{
      if(user){
          window.location.href = '/admin'
      }
    }, [])
    const ValidateUser = (username, password) => {
        console.log(username, password)
        axios.get(baseUrl, {params: {username, password}}).then(response=>{
            const exist = response.data.exist;
            console.log(response.data)
            if(exist){
                cookies.set('user', username, {path: "/"})
                window.location.href = '/admin'
            } else {
              MySwal.fire({
                title:'Error de Autenticación',
                icon:'warning',
                text:'Usuario o contraseña incorrectos',
                button:'Ok'
                })
            }    
        }).catch(err=>{
            console.log(err)
        })
    };
    return (
<div className="container-fluid ps-md-0">
  <div className="row g-0">
    <div className="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
    <div className="col-md-8 col-lg-6">
      <div className="login d-flex align-items-center py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-9 col-lg-8 mx-auto">
              <center>
              <h2 className="login-heading mb-4">Iniciar Sesión</h2>
              </center>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-floating mb-3">
                  <input type="text" {...register("username", {
                      required: {
                          value: true,
                          message: "El campo es requerido"
                      }   
                  })} className="form-control" id="floatingInput" placeholder="name@example.com" />
                  <label for="floatingInput">Nombre de Usuario</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" {...register("password", {
                      required: {
                          value: true,
                          message: "El campo es requerido"
                      },
                      minLength: {
                          value: 4,
                          message: "La contraseña debe tener al menos 4 caracteres",
                      }   
                  })} className="form-control" id="floatingPassword" placeholder="Password" />
                  <label for="floatingPassword">Contraseña</label>
                </div>

                <div className="d-grid">
                  <button className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2" type="submit">Sign in</button>

                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
}