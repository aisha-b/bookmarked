import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function ErrorPage() {
	return (
		<Container fluid>
			<Row className="text-center">
				<Col xs={12} className="p-5">
					<h1>Error 404</h1>
					<h3>Page not found</h3>
					<p>
						Go to <NavLink to="/">homepage.</NavLink>
					</p>
				</Col>
			</Row>
		</Container>
	);
}
