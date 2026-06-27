import AdminPage from "./routes/admin";
import ExplorePage from "./routes/explore";
import HomePage from "./routes/index";
import ListPage from "./routes/list";

export default function App() {
  const rawPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const cleanPath = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;
  const path = cleanPath === "/index" || cleanPath === "/index.html" ? "/" : cleanPath;

  if (path === "/explore") return <ExplorePage />;
  if (path === "/list") return <ListPage />;
  if (path === "/admin") return <AdminPage />;
  return <HomePage />;
}
