import {react, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import Cookies from 'universal-cookie';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

export default function Crud(){
    const baseUrl = "http://localhost:4040"
    const imgUrl = ""
    const [movies, setMovies] = useState([])
    const cookies = new Cookies();
    const [modal,setModal] = useState(false);
    const openModal=()=>{
        setModal(!modal);
        console.log(modal)

    }
    const handleChange=(e)=>{
        const {name,value} = e.target;
        setSelectedMovie({
            ...selectedMovie,
            [name]:value
        })
    }
    const Post=async ()=>{
        delete selectedMovie._id;
        await axios.post(baseUrl+'/movie/new/', {params: {...selectedMovie}}).then((response)=>{
            console.log(response)
            openModal();
        }).catch(err=>console.log(err))
    }
    const [selectedMovie, setSelectedMovie] = useState({
        _id: '',
        title: '',
        poster: '',
        overview:'',
        video:'',
    });
    const user = cookies.get('user')
    const Logout = () => {
        cookies.remove('user',{path: "/"})
        window.location.href='./'
    }
    useEffect(()=>{
        if(!cookies.get('user')){
            window.location.href="./"
        }
        axios.get(baseUrl).then(response=>{
            console.log(response.data)
            setMovies(response.data)
        }).catch(err=>{
            console.log(err)
        })
    },[])
    return(
     <div class="page">   
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark"> <button class="navbar-toggler" type="button" data-target="#navigation"> <span class="navbar-toggler-icon"></span> </button>
    <div class="collapse navbar-collapse">
        <ul class="navbar-nav">
        <li class="nav-item"> <a href="./" class="nav-link"> Home  <i class="fa fa-home"></i></a> </li>
            <li class="nav-item"> <span className="nav-link"><i class="fa-solid fa-circle-user"></i> {user}</span></li>
            <li class="nav-item"> <a href="#" onClick={Logout} class="nav-link"> Logout  <i class="fa-solid fa-right-from-bracket"></i></a> </li>
        </ul>
    </div>
</nav>
    <div class="container">      
    <div class="row">
    <br/>
    <div class="card datatable">
    <div class="card-header table-header">
     <div class="row">
     <div class="col-sm-11">     
    <h3>Movies</h3>
    </div>
    <div class="col-sm-1"><a href="#" onClick={openModal} class="btn btn-primary">New {"  "}<i class="fa fa-plus" aria-hidden="true"></i></a></div>
    </div>
    </div>
      <table id="table" class="table table-card">
        <thead>
        <tr>
            <th>Title</th>
            <th >Overview</th>
            <th>Poster</th>
            <th>Trailer</th>
            <th>Options</th>
        </tr>
        </thead>
        {movies && movies.map(movie=>{
            return(
            <tr>
                <td width="200px">{movie.title}</td> 
                <td width="125px"><img class="img-thumbnail" src={movie.poster} width="100"/></td>
                <td width="350px" class="overview">{movie.overview}</td>
                <td width="160px">
                <div class="actions">
                <a target="_blank" class="btn btn-danger" href={movie.video}>Go To Trailer <i class="fa fa-play" aria-hidden="true"></i></a>
                </div>
                </td>
                <td width="120px">
                <div class="actions">
                <button class="btn btn-success" onClick={()=> openModal()}><i class="fa fa-edit" aria-hidden="true"></i> </button>{"  "}
                <button class="btn btn-danger"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </div>
                </td> 
            </tr>        
            )
        })}
      </table>
      </div>
    </div>
</div>
<Modal isOpen = {modal} >
      <ModalHeader>Insertar nuevo producto</ModalHeader>
      <ModalBody>
      <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" class="form-control" id="title" onchange={handleChange} name="title"/>
        </div>
        <div class="form-group">
            <label for="overview">Overview:</label>
            <textarea type="text" class="form-control" id="overview" onchange={handleChange} name="overview"></textarea>
        </div>
        <div class="form-group">
            <label for="poster">Póster:</label>
            <input type="text" class="form-control" id="poster" onchange={handleChange} name="poster"/>
        </div>
        <div class="form-group">
            <label for="video">Trailer:</label>
            <input type="text" class="form-control" id="video" onchange={handleChange} name="video"/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-dark"onClick={()=>Post()}>Insertar</button>{" "}
        <button className="btn btn-danger" onClick={()=>openModal()}>Cancelar</button>
      </ModalFooter>
    </Modal>
</div>

    )
}