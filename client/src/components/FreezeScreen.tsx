import { Link } from 'react-router-dom';

const FreezeScreen = () => {
  return (
    <div
      className="
    fixed bg-[var(--t-red)] left-0 z-50 flex items-start justify-center text-center opacity-80 w-full h-screen top-0"
    >
      <div className="bg-[var(--blood)] shadow-lg shadow-pink-900/50 text-white font-bold text-2xl mt-10 p-4">
        <h2>You has been removed.</h2>
        <Link
          to="/"
          className="font-normal text-rose-300 px-2 hover:underline hover:cursor-pointer"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
};

export default FreezeScreen;
