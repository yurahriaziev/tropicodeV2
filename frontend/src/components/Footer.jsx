export default function Footer() {
    return (
        <footer className="bg-gray-700 py-8 border-t">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-200">
              © {new Date().getFullYear()} Tropicode. All rights reserved.
            </p>
            <ul className="flex gap-6 text-sm text-gray-400">
              <li><a href="#courses" className="hover:text-purple-600">Courses</a></li>
              <li><a href="#about" className="hover:text-purple-600">About</a></li>
              <li><a href="#contact" className="hover:text-purple-600">Contact</a></li>
            </ul>
          </div>
        </footer>
      )
}