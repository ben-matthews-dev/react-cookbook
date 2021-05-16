import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <nav>
            <section>
                <h1>React Cookbook</h1>
                <div className="navContent">
                    <div className="navLinks">
                        <Link to="/">Recipes</Link>
                        <Link to="/about/">About</Link>
                    </div>
                </div>
            </section>
        </nav>
    )
}

export default Navbar;