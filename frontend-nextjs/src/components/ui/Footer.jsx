export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 mt-auto text-center text-xs text-gray-500 font-medium">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-4">
        <p>© {currentYear} DzArtisan. Tous droits réservés.</p>
        <div className="flex gap-4 md:gap-6">
          <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
          <a href="#" className="hover:text-primary transition-colors">Conditions d&apos;utilisation</a>
          <a href="#" className="hover:text-primary transition-colors">À propos</a>
          <a href="#" className="hover:text-primary transition-colors">FAQ</a>
        </div>
      </div>
    </footer>
  );
}
