import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Word Cloud</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload a text file to generate a word cloud!</p>
        </div>
        <nav className="flex gap-4 pb-0.5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium pb-0.5 border-b-2 transition-colors ${
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `text-sm font-medium pb-0.5 border-b-2 transition-colors ${
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`
            }
          >
            History
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
