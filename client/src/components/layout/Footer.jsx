function Footer() {
  return (
    <footer
      className="text-center py-3"
      style={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        color: "#94a3b8",
        fontSize: "0.82rem",
      }}
    >
      &copy; {new Date().getFullYear()} CampusConnect — One Platform for Students, Faculty &amp; Campus Life
    </footer>
  );
}

export default Footer;