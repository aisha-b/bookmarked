import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function ShopNavBar(props) {
    const sortByGenre = props.sortByGenre;
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
                    <NavDropdown title="Shop by Genre" id="genre-dropdown">
                        <NavDropdown.Item onClick={()=> sortByGenre("fiction")}>
                            Fiction
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=> sortByGenre("historical")}>
                            Historical
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=> sortByGenre("romance")}>
                            Romance
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=> sortByGenre("thriller")}>
                            Thriller
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={()=> sortByGenre("nonfiction")}>
                            Nonfiction
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
	);
}
