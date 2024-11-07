import './Loader.css';

export const Loader = () => {
  return (
    <div className="loader-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className="loader-svg"
        width="187px"
        height="187px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M5 50A45 45 0 0 0 95 50A45 47.7 0 0 1 5 50"
          className="loader-path"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.9900990099009901s"
            repeatCount="indefinite"
            keyTimes="0;1"
            values="0 50 51.35;360 50 51.35"
          ></animateTransform>
        </path>
      </svg>
    </div>
  );
};

export default Loader;
