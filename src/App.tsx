import AdminPage from "./routes/admin";
import ExplorePage from "./routes/explore";
import HomePage from "./routes/index";
import ListPage from "./routes/list";

export default function App() {
  const rawPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const path = rawPath === "/index" || rawPath === "/index.html" ? "/" : rawPath;

  if (path === "/explore") return <ExplorePage />;
  if (path === "/list") return <ListPage />;
  if (path === "/admin") return <AdminPage />;
  return <HomePage />;
}
