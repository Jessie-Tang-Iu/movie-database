import MovieCard from './MovieCard';

export default function MovieRow({ title, movies }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold px-4 mb-2">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 px-4 scrollbar-hide">
        {movies.map((movie, i) => (
          <MovieCard key={i} posterUrl={movie.posterUrl} title={movie.title} />
        ))}
      </div>
    </div>
  );
}