import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function ShopNavBar(props) {
    const sortByGenre = props.sortByGenre;
    const [genre, setGenre] = useState("All");
	return (
		<Navbar

			fixed="top"
			bg="secondary"
			variant="light"
			expand="lg"
			className="p-3"
            style={{marginTop: "70px"}}
		>
            <Container>
                <Nav className="me-auto">
                    <Nav.Link className="text-primary">{genre}</Nav.Link>
                    <NavDropdown title="Shop by Genre" id="genre-dropdown">
                        <NavDropdown.Item onClick={()=> {sortByGenre("fiction"); setGenre("Fiction")}}>
                            Fiction
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=> {sortByGenre("historical"); setGenre("Historical")}}>
                            Historical
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=> {sortByGenre("romance"); setGenre("Romance")}}>
                            Romance
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=> {sortByGenre("thriller"); setGenre("Thriller")}}>
                            Thriller
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=> {sortByGenre("nonfiction"); setGenre("Nonfiction")}}>
                            Nonfiction
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=> {sortByGenre("all"); setGenre("All")}}>
                            All
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
	);
}
