import "../pages/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <p className="footer-message">Ti si vredna, osećaj se posebnom!</p>
      </div>
      <div className="footer-center">
        © {new Date().getFullYear()} Vows&Veils. Sva prava zadržana.
      </div>
    </footer>
  );
};

export default Footer;
