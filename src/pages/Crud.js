import {react, useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import Cookies from 'universal-cookie';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

export default function Crud(){
    const baseUrl = "http://localhost:4040"
    const [movies, setMovies] = useState([])
    const cookies = new Cookies();
    const [modal,setModal] = useState(false);
    const [modalEdit,setModalEdit] = useState(false);
    const MySwal = withReactContent(Swal)
    const emptyMovie = {
        _id: '',
        title: '',
        poster: '',
        overview:'',
        video:'',
        actors: '',
        director: '',
        rate: '',
        year: '',
        backdrop_path:'',
    }
    const openModalEdit=(movie)=>{
        if(movie){
            setSelectedMovie(movie)
        }
        setModalEdit(!modalEdit);
        console.log(modalEdit)
    }
    const openModal=()=>{
        setModal(!modal);
        console.log(modal)
    }
    const handleChange=(e)=>{
        const {name,value} = e.target;
        console.log(name, value)
        setSelectedMovie({
            ...selectedMovie,
            [name]:value
        })
    }
    const isEmpty = (movie) =>{
        if(movie.title == "" || movie.overview =="" || movie.poster ==""||movie.trailer==""||movie.director==""||movie.actors==""||movie.rate==""||movie.year==""||movie.backdrop_path==""){
            return true
        }
    }
    const Post=async ()=>{
        console.log(selectedMovie)
        if(!isEmpty(selectedMovie)){
            delete selectedMovie._id;
            await axios.post(baseUrl+'/movie/new/',selectedMovie).then((response)=>{
                console.log(response)
                setMovies(movies.concat(response.data))
                openModal();
                MySwal.fire({
                    title:'Insertado satisfactoriamente!',
                    icon:'success',
                    button:'Ok'
                    })
            }).catch(err=>{
                MySwal.fire({
                    title:'Error de Servidor',
                    icon:'error',
                    text:err,
                    button:'Ok'
                    })  
            })
        }
        
    }

    const Update=async ()=>{
        console.log(selectedMovie)
        debugger;
        await axios.post(baseUrl+'/movie/update/'+selectedMovie._id,selectedMovie).then((response)=>{
            console.log(response)
            setMovies(response.data)
            openModalEdit();
            MySwal.fire({
                title:'Actualizado satisfactoriamente!',
                icon:'success',
                button:'Ok'
                })
        }).catch(err=>{
            MySwal.fire({
                title:'Error de Servidor',
                icon:'error',
                text:err,
                button:'Ok'
                })
        })
    }

    const Delete= async (id)=>{
        await axios.get(baseUrl+'/movie/delete/'+id).then((response)=>{
            console.log(response)
            setMovies(response.data)
            MySwal.fire({
                title:'Eliminado satisfactoriamente!',
                icon:'success',
                button:'Ok'
                })
        }).catch(err=>{
            MySwal.fire({
                title:'Error de Servidor',
                icon:'error',
                text:err,
                button:'Ok'
                })
        })
    }
    const [selectedMovie, setSelectedMovie] = useState({
        _id: '',
        title: '',
        poster: '',
        overview:'',
        video:'',
        actors: '',
        director: '',
        rate: '',
        year: '',
        backdrop_path:'',
    });
    const user = cookies.get('user')
    const Logout = () => {
        cookies.remove('user',{path: "/"})
        window.location.href='./'
    }
    useEffect(()=>{
        if(!cookies.get('user')){
            window.location.href="./login"
        }
        Get()
    },[])

    const Get = async () =>{
        axios.get(baseUrl).then(response=>{
            console.log(response.data)
            setMovies(response.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
     <div class="page">   
    <nav class="navbar navbar-expand-sm nav-crud text-white header navbar-dark navbar-crud"> <button class="navbar-toggler" type="button" data-target="#navigation"> <span class="navbar-toggler-icon"></span> </button>
    <span className="brand">ProyectoTrailersApp</span>
    <div class="">
        <ul class="navbar-nav ">
        <li class="nav-item"> <a href="./" class="nav-link"> <i class="fa fa-home"></i> Home</a> </li>
            <li class="nav-item"> <span className="nav-link"><i class="fa-solid fa-circle-user"></i> {user}</span></li>
            <li class="nav-item"> <a href="#" onClick={Logout} class="nav-link"> Logout  <i class="fa-solid fa-right-from-bracket"></i></a> </li>
        </ul>
    </div>
</nav>
    <div class="container">      
    <div class="row">
    <br/>
    <div class="card datatable bg-dark">
    <div class="card-header table-header">
     <div class="row">
     <div class="col-sm-11 text-white">     
    <h3 class="text-white">Movies</h3>
    </div>
    <div class="col-sm-1"><a href="#" onClick={openModal} class="btn btn-danger">New {"  "}<i class="fa fa-plus" aria-hidden="true"></i></a></div>
    </div>
    </div>
      <table id="table" class="table table-dark">
        <thead>
        <tr>
            <th>Title</th>
            <th >Poster</th>
            <th>Overview</th>
            <th>Director</th>
            <th>Actors</th>
            <th>Year</th>
            <th>Trailer</th>
            <th>Options</th>
        </tr>
        </thead>
        {movies && movies.map(movie=>{
            return(
            <tr>
                <td width="table-title">{movie.title}</td> 
                <td width=""><img class="movie-poster" src={movie.poster} width="100"/></td>
                <td width="350px" class="overview">{movie.overview}</td>
                <td>{movie.director}</td>
                <td>{movie.actors}</td>
                <td><span className="badge bg-success">{movie.year}</span></td>
                <td width="160px">
                <div class="actions">
                <a target="_blank" class="btn btn-danger" href={movie.video}>Go To Trailer <i class="fa fa-play" aria-hidden="true"></i></a>
                </div>
                </td>
                <td width="120px">
                <div class="actions">
                <button class="btn btn-success" onClick={()=> openModalEdit(movie)}><i class="fa fa-edit" aria-hidden="true"></i> </button>{"  "}
                <button class="btn btn-danger" onClick={()=> Delete(movie._id)}><i class="fa fa-trash" aria-hidden="true"></i></button>
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
      <form>
      <ModalBody>
      <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" class="form-control" id="title" onChange={handleChange} name="title" required/>
        </div>
        <div class="form-group">
            <label for="overview">Overview:</label>
            <textarea type="text" class="form-control" id="overview" onChange={handleChange} name="overview" required></textarea>
        </div>
        <div class="form-group">
            <label for="poster">Póster:</label>
            <input type="text" class="form-control" id="poster" onChange={handleChange} name="poster" required/>
        </div>
        <div class="form-group">
            <label for="video">Trailer:</label>
            <input type="text" class="form-control" id="video" onChange={handleChange} name="video" required/>
        </div>
        <div class="form-group">
            <label for="director">Director:</label>
            <input type="text" class="form-control" id="director" onChange={handleChange} name="director" required/>
        </div>
        <div class="form-group">
            <label for="actors">Actores:</label>
            <input type="text" class="form-control" id="actors" onChange={handleChange} name="actors" required/>
        </div>
        <div class="form-group">
            <label for="rate">Valoración:</label>
            <input type="number" min="1" max="10" class="form-control" id="rate" onChange={handleChange} name="rate" required/>
        </div>
        <div class="form-group">
            <label for="year">Año:</label>
            <input type="text" class="form-control" id="year" onChange={handleChange} name="year" required/>
        </div>
        <div class="form-group">
            <label for="backdrop_path">Imagen de fondo:</label>
            <input type="text" class="form-control" id="backdrop_path" onChange={handleChange} name="backdrop_path" required/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-dark"onClick={()=>Post()}>Insertar</button>{" "}
        <button className="btn btn-danger" onClick={()=>openModal()}>Cancelar</button>
      </ModalFooter>
      </form>
    </Modal>
    <Modal isOpen = {modalEdit} >
      <ModalHeader>Actualizar película</ModalHeader>
      <ModalBody>
      <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" class="form-control" id="title" value={selectedMovie.title} onChange={handleChange} name="title"/>
        </div>
        <div class="form-group">
            <label for="overview">Overview:</label>
            <textarea type="text" class="form-control" id="overview" value={selectedMovie.overview} onChange={handleChange} name="overview"></textarea>
        </div>
        <div class="form-group">
            <label for="poster">Póster:</label>
            <input type="text" class="form-control" id="poster" value={selectedMovie.poster} onChange={handleChange} name="poster"/>
        </div>
        <div class="form-group">
            <label for="video">Trailer:</label>
            <input type="text" class="form-control" id="video" value={selectedMovie.video} onChange={handleChange} name="video"/>
        </div>
        <div class="form-group">
            <label for="director">Director:</label>
            <input type="text" class="form-control" id="director" value={selectedMovie.director} onChange={handleChange} name="director"/>
        </div>
        <div class="form-group">
            <label for="actors">Actores:</label>
            <input type="text" class="form-control" id="actors" value={selectedMovie.actors} onChange={handleChange} name="actors"/>
        </div>
        <div class="form-group">
            <label for="rate">Valoración:</label>
            <input type="number" min="1" max="10" class="form-control" id="rate" value={selectedMovie.rate} onChange={handleChange} name="rate"/>
        </div>
        <div class="form-group">
            <label for="year">Año:</label>
            <input type="text" class="form-control" id="year" value={selectedMovie.year} onChange={handleChange} name="year"/>
        </div>
        <div class="form-group">
            <label for="backdrop_path">Imagen de fondo:</label>
            <input type="text" class="form-control" id="backdrop_path" value={selectedMovie.backdrop_path} onChange={handleChange} name="backdrop_path"/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-dark"onClick={()=>Update()}>Actualizar</button>{" "}
        <button className="btn btn-danger" onClick={()=>openModalEdit()}>Cancelar</button>
      </ModalFooter>
    </Modal>
</div>

    )
}