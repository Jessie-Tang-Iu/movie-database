import MovieRow from '../components/MovieRow';

const dummyMovies = [
  { title: 'Squid Game', posterUrl: 'wecrashed.jpg' },
  { title: 'KPOP', posterUrl: '' },
  { title: 'Blacklist', posterUrl: '' },
  { title: 'Squid Game', posterUrl: '' },
  { title: 'KPOP', posterUrl: '' },
  { title: 'Blacklist', posterUrl: '' },
  { title: 'Squid Game', posterUrl: '' },
  { title: 'KPOP', posterUrl: '' },
  { title: 'Blacklist', posterUrl: '' },
  { title: 'Squid Game', posterUrl: '' },
  { title: 'KPOP', posterUrl: '' },
  { title: 'Blacklist', posterUrl: '' },
  { title: 'Squid Game', posterUrl: '' },
  { title: 'KPOP', posterUrl: '' },
  { title: 'Blacklist', posterUrl: '' },
  { title: 'Squid Game', posterUrl: '' },
  { title: 'KPOP', posterUrl: '' },
  { title: 'Blacklist', posterUrl: '' },
];

export default function Page() {
  return (
    <div className="bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold px-4 pt-6">Movie Home</h1>
      <MovieRow title="Boredom Busters" movies={dummyMovies} />
      <MovieRow title="Anime" movies={dummyMovies} />
    </div>
  );
}