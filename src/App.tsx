import "./App.css";
import IndexRouter from "./routes/IndexRouter";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <IndexRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
