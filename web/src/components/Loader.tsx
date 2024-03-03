// external imports
import { Oval } from "react-loader-spinner";

// internal imports
import { useApp } from "context/useApp";

const Loader = () => {
  const { loading } = useApp();

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "100vw",
          background: "rgba(0,0,0,.25)",
          zIndex: 1005,
        }}
        className="d-flex justify-content-center align-items-center"
      >
        <Oval
          visible={true}
          height="50"
          width="50"
          color="#011a1e"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  } else {
    return null;
  }
};

export default Loader;
