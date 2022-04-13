import React from 'react';

const Movie = ({movie, selectMovie}) => {
    return (
        <div onClick={() => selectMovie(movie)} className={"movie"}>
            <div className="movie-title">
                {movie.poster &&
                <img src={movie.poster} alt={movie.title}/>
                }
                <div className={"flex between movie-infos"}>
                    <h5 className={"movie-title"}>{movie.title}</h5>
                    {movie.rate ? <div className={"movie-voting"}><span>{movie.rate}</span></div> : null}
                </div>
            </div>
        </div>
    );
};


export default Movie;