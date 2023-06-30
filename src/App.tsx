import { QueryClientProvider, QueryClient } from "react-query";
import { Router, Link, ReactLocation, Outlet, useMatch } from "react-location";
import { PokemonProvider, usePokemon } from "./store";

const queryClient = new QueryClient();

const location = new ReactLocation();

const SearchBox = () => {
  const { search, setSearch } = usePokemon();

  return (
    <input
      className="mt-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-300 sm:text-lg p-2 focus:outline-none"
      placeholder="Search Pokemon"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

const PokemonList = () => {
  const { pokemon } = usePokemon();
  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-3">
        {pokemon.map((p) => (
          <Link key={p.id} to={`/pokemon/${p.id}`}>
            <li className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
              <div className="flex-1 flex flex-col p-8 gap-4">
                <img
                  className="w-32 h-32 flex-shrink-0 mx-auto bg-black rounded-full"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.id}.png`}
                  alt=""
                />
                <h3 className=" text-indigo-950 font-medium">{p.name}</h3>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

const PokemonDetail = () => {
  const {
    params: { id },
  } = useMatch();

  const { pokemon } = usePokemon();
  const pokemonData = pokemon.find((p) => p.id === +id);

  if (!pokemonData) {
    return (
      <div className="min-h-screen flex justify-center items-center gap-10 flex-col">
        <h1 className="text-4xl font-bold text-indigo-950 text-center">
          Sorry, no pokemon found :(
        </h1>
        <Link to="/">
          <div className="font-semibold text-slate-50 rounded-lg mb-10 bg-indigo-500 py-2 px-4">
            Back to Home
          </div>
        </Link>
      </div>
    );
  }
  return (
    <div className="mt-3 flex flex-col justify-center items-center min-h-screen gap-8">
      <div className="grid grid-cols-2 gap-8">
        <img
          className="w-96 h-96 flex-shrink-0 mx-auto bg-black rounded-xl"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`}
          alt=""
        />
        <div className="ml-3">
          <h2 className="text-2xl font-bold bg-indigo-300 p-3 text-center text-indigo-950">
            {pokemonData.name}
          </h2>
          <div className="mt-3">
            <ul className="mt-3">
              {[
                "hp",
                "attack",
                "defense",
                "special_attack",
                "special_defense",
                "speed",
              ].map((stat) => (
                <li
                  key={stat}
                  className="grid grid-cols-2 justify-items-stretch border-b border-indigo-300 p-3"
                >
                  <span className="font-bold text-indigo-950">{stat}</span>
                  <span className="text-right">
                    {pokemonData[stat as keyof typeof pokemonData]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        <Link to="/">
          <div className="font-semibold text-slate-50 rounded-lg mb-10 bg-indigo-500 py-2 px-4">
            Back to Home
          </div>
        </Link>
        <div className="flex justify-center gap-4 items-center">
          <Link to={`/pokemon/${pokemonData.id - 1}`}>
            <div className="font-semibold text-slate-50 rounded-lg mb-10 bg-indigo-500 py-2 px-4">
              Previous
            </div>
          </Link>
          <Link to={`/pokemon/${pokemonData.id + 1}`}>
            <div className="font-semibold text-slate-50 rounded-lg mb-10 bg-indigo-500 py-2 px-4">
              Next
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const routes = [
  {
    path: "/",
    element: (
      <>
        <SearchBox />
        <PokemonList />
      </>
    ),
  },
  {
    path: "/pokemon/:id",
    element: (
      <>
        <PokemonDetail />
      </>
    ),
  },
];
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PokemonProvider>
        <Router location={location} routes={routes}>
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        </Router>
      </PokemonProvider>
    </QueryClientProvider>
  );
}

export default App;
