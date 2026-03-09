import "../../styles/Loader.css";

const Loader = ({ overlay = false }) => {
  return (
    <div className={overlay ? "loader-overlay" : "loader-container"}>
      <div className="dots"></div>
    </div>
  );
};

export default Loader;
