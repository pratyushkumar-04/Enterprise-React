import "../../styles/Navbar.css";

const Navbar = () => {
  const role = localStorage.getItem("role");

  return (
    <header className="navbar">
      <span>Welcome, {role}</span>
    </header>
  );
};

export default Navbar;
