import MovieCard from "./MovieCard";

export default function MovieList({ title, movies, onMovieClick }) {
  return (
    <div>
        {movies.length !=0 ? (
            <div className="my-5">
                <h2 className="text-xl font-semibold px-4 mb-2">{title.toUpperCase()}</h2>
                <div className="px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"> {/* Changed here */}
                    {movies.map((movie, index) => (
                    <MovieCard
                        key={index}
                        title={movie.title}
                        posterUrl={movie?.posterWUrl || `https://wsrv.nl/?url=https://simkl.in/posters/${movie.poster}_m.jpg`}
                        movie={movie}
                        onMovieClick={onMovieClick}
                    />
                    ))}
                </div>
                </div>
            </div>
        ) : (
            <h2 className="text-xl font-semibold px-4 mb-2 mt-2"> No movie in {title}</h2>
        )}
    </div>
  );
}
