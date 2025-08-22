const AiLoader = () => {
  return (
    <div
      style={{
        display: "grid",
        placeContent: "center",
        background: "#202020",
        minHeight: "100vh", // Add this to ensure full height
        width: "100%", // Add this to ensure full width
      }}
    >
      <div className="glow-card">Hello AI</div>
    </div>
  );
};

export default AiLoader;
