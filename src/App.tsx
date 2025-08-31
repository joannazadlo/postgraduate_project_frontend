import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import { Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import RecipesPage from "./pages/RecipesPage";
import SearchRecipesPage from './pages/SearchRecipesPage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import SearchRecipeDetailsPage from './pages/SearchRecipeDetailsPage';
import AllUsersRecipesPage from './pages/AllUsersRecipesPage';
import UsersPage from './pages/UsersPage';
import AppLayout from './components/layout/appLayout/AppLayout';
import AuthProvider from './context/AuthContext';
import UserPreferencesProvider from './context/UserPreferencesContext';
import UserIngredientsProvider from './context/UserIngredientsContext';
import PrivateRoute from './routes/PrivateRoute';

export default function App() {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <UserIngredientsProvider>
                  <AppLayout><RecipesPage /></AppLayout>
                </UserIngredientsProvider>
              </PrivateRoute>
            } />
          <Route
            path="/search-recipes"
            element={
              <PrivateRoute>
                <UserIngredientsProvider>
                  <AppLayout><SearchRecipesPage /></AppLayout>
                </UserIngredientsProvider>
              </PrivateRoute>
            } />
          <Route
            path="/recipe/:id"
            element={
              <PrivateRoute>
                <AppLayout><RecipeDetailsPage /></AppLayout>
              </PrivateRoute>
            } />
          <Route
            path="/search-recipe/:id"
            element={
              <PrivateRoute>
                <AppLayout><SearchRecipeDetailsPage /></AppLayout>
              </PrivateRoute>
            } />
          <Route
            path="/admin-recipes"
            element={
              <PrivateRoute>
                <UserIngredientsProvider>
                  <AppLayout><AllUsersRecipesPage /></AppLayout>
                </UserIngredientsProvider>
              </PrivateRoute>
            } />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <AppLayout><UsersPage /></AppLayout>
              </PrivateRoute>
            } />
        </Routes>
      </UserPreferencesProvider>
    </AuthProvider>
  );
};
