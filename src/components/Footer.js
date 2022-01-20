import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "react-bootstrap";

export default function Footer() {
	return (
		<>
			<div className="footer">
				<Container fluid className="third-banner"></Container>
				<Container
					fluid
					className="bg-primary text-center text-light p-3"
				>
					<FontAwesomeIcon icon={faBookmark} /> BOOKMARKED © 2022
				</Container>
			</div>
		</>
	);
}
