import {useEffect, useState} from "react"
import '../App.css'
import axios from 'axios'
import Movie from "../components/Movie"
import Youtube from 'react-youtube'

function Index() {
    const baseApi = 'http://localhost:4040'
    const MOVIE_API = "http://api.themoviedb.org/3/"
    const SEARCH_API = MOVIE_API + "search/movie"
    const DISCOVER_API = MOVIE_API + "discover/movie"
    const API_KEY = "36b6e3ed1ea38d3e3f3962a18cb28aed"
    const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280"

    const [playing, setPlaying] = useState(false)
    const [trailer, setTrailer] = useState(null)
    const [movies, setMovies] = useState([])
    const [searchKey, setSearchKey] = useState("")
    const [movie, setMovie] = useState({
        title: "Loading Movies",
        actors: '',
        director: ''
    })

    useEffect(() => {
        fetchMovies()
    }, [])

    const fetchMovies = async () => {

        const {data} = await axios.get(`${baseApi}`)
        console.log(data)
        setMovies(data)
        setMovie(data[0])
        fetchMovie(data[0]._id)

    }

    const filterSearch=(search)=>{
        return function(x){
            return (x.title.toString().toLowerCase().includes(search.toLowerCase()) || !search)
        }
    }

    const fetchMovie = async (id) => {
        const {data} = await axios.get(`${baseApi}/movie/${id}`)

        if (data.video) {
            const trailer = data.video
            const trailerID = trailer.split("https://youtu.be/")[1]
            setTrailer(trailerID)
        }
        setMovie(data)
    }


    const selectMovie = (movie) => {
        fetchMovie(movie._id)
        setPlaying(false)
        setMovie(movie)
        window.scrollTo(0, 0)
    }

    const renderMovies = () => (
        movies.filter(filterSearch(searchKey)).map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie._id}
                movie={movie}
            />
        ))
    )

    return (
        <div className="app">
            <nav class="navbar navbar-expand-sm nav-crud text-white header navbar-dark navbar-crud"> <button class="navbar-toggler" type="button" data-target="#navigation"> <span class="navbar-toggler-icon"></span> </button>
    <span className="brand">ProyectoTrailersApp</span>
    <div class="">
        <ul class="navbar-nav ">
        <li class="nav-item"> <a href="./" class="nav-link"> <i class="fa fa-home"></i> Home</a> </li>
            <li class="nav-item"> <a href="./admin" className="nav-link"><i class="fa fa-right-from-bracket"></i> PANEL</a></li>
            <div className="form" onSubmit={fetchMovies}>
                    <input className="search" type="text" id="search"
                           onChange={(event) => setSearchKey(event.target.value)}/>
                    <span className="submit-search"><i className="fa fa-search"></i></span>
                </div>
        </ul>
    </div>
</nav>
            {movies.length ?
                <main>
                    {movie ?
                        <div className="poster"
                             style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${movie.backdrop_path})`}}>
                            {playing ?
                                <>
                                    <Youtube
                                        videoId={trailer}
                                        className={"youtube amru"}
                                        containerClassName={"youtube-container amru"}
                                        opts={
                                            {
                                                width: '100%',
                                                height: '100%',
                                                playerVars: {
                                                    autoplay: 1,
                                                    controls: 0,
                                                    cc_load_policy: 0,
                                                    fs: 0,
                                                    iv_load_policy: 0,
                                                    modestbranding: 0,
                                                    rel: 0,
                                                    showinfo: 0,
                                                },
                                            }
                                        }
                                    />
                                    <button onClick={() => setPlaying(false)} className={"button close-video"}>Close
                                    </button>
                                </> :
                                <div className="center-max-size">
                                    <div className="poster-content">
                                        <h1>{movie.title}</h1>
                                        <br/>
                                        <p className="description">{movie.overview}</p>
                                        <div className="actors">
                                        {movie.director.split(",").map(dir=>{
                                                return(
                                                    <span className="badge bg-danger actor" >{dir}</span>
                                                )
                                            })}
                                        {movie.actors.split(",").map(actor=>{
                                                return(
                                                    <span className="badge bg-dark actor" >{actor}</span>
                                                )
                                            })}    
                                        </div>
                                        {trailer ?
                                            <button className={"button play-video"} onClick={() => setPlaying(true)}
                                                    type="button">Reproducir
                                                Trailer <i className="fa fa-play"></i></button>
                                            : 'Lo sentimos, no hay trailers disponibles'}
                                    </div>
                                </div>
                            }
                        </div>
                        : null}

                    <div className={"center-max-size container-movies"}>
                        {renderMovies()}
                    </div>
                </main>
                : 'Ha ocurrido un error: no movies found'}
        </div>
    );
}

export default Index;