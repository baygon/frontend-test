import "./App.css";
import "./components.css";
import BookDisplay from "./components/BookDisplay";
import BookSearch from "./components/BookSearch";

const DEFAULT_ISBN = "9783442236862";

function App() {
  return (
    <div className="App">
      <h1>Open Library API Demo</h1>

      <section>
        <h2>Single Book Display</h2>
        <BookDisplay isbn={DEFAULT_ISBN} />
      </section>

      <section>
        <h2>Search Books</h2>
        <BookSearch />
      </section>
    </div>
  );
}

export default App;
