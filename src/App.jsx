import { Router } from './router/Router';
import { AuthProvider } from './firebase/authContext';
import './styles/global.css'

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;