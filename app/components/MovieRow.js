import MovieCard from './MovieCard';

export default function MovieRow({ title, movies }) {
  return (
    <div className="my-5">
      <h2 className="text-xl font-semibold px-4 mb-2">{title}</h2>
      <div className="overflow-x-auto px-4">
        <div className="flex gap-4 whitespace-nowrap">
          {movies.map((movie, index) => (
            <MovieCard
              key={index}
              title={movie.title}
              posterUrl={movie.posterWUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}