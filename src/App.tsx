import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import { ComponentPage } from './pages/ComponentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="component/:name" element={<ComponentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
