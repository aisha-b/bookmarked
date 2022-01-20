import { Button, Container, ListGroup, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBookmark,
	faHeart,
	faShoppingCart,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import UserContext from "../UserContext";

export default function AppNavBar() {
	const { user, cartQuantity } = useContext(UserContext);

	function AdminOrderSection() {
		if (user.isAdmin == true) {
			return (
				<Nav.Link as={NavLink} to="/shop-orders">
					ORDERS
				</Nav.Link>
			);
		} else {
			return null;
		}
	}

	function LeftNavSection() {
		if (user.id !== null && user.isAdmin == false) {
			return (
				<>
					<Button
						variant="primary"
						className="mx-1"
						as={NavLink}
						to="/account"
					>
						<FontAwesomeIcon icon={faUser} />
					</Button>
					<Button
						variant="primary"
						className="mx-1"
						as={NavLink}
						to="/wishlist"
					>
						<FontAwesomeIcon icon={faHeart} />
					</Button>
					<Button
						variant="primary"
						className="mx-1"
						as={NavLink}
						to="/cart"
					>
						<FontAwesomeIcon
							icon={faShoppingCart}
						></FontAwesomeIcon>
						{user.id !== null ? (
							<span class="cart-badge">{cartQuantity}</span>
						) : null}
					</Button>
				</>
			);
		} else if (user.id !== null && user.isAdmin == true) {
			return (
				<Nav.Link as={NavLink} to="/account">
					<FontAwesomeIcon icon={faUser} />
				</Nav.Link>
			);
		} else if (user.id === null) {
			return (
				<>
					<Button
						variant="primary"
						className="mx-1"
						as={NavLink}
						to="/login"
					>
						Login
					</Button>
					<Button
						variant="primary"
						className="mx-1"
						as={NavLink}
						to="/register"
					>
						Register
					</Button>
					<Button
						variant="primary"
						className="mx-1"
						as={NavLink}
						to="/wishlist"
					>
						<FontAwesomeIcon icon={faHeart} />
					</Button>
					<Button
						variant="primary"
						className="mx-1"
						as={NavLink}
						to="/cart"
					>
						<FontAwesomeIcon
							icon={faShoppingCart}
						></FontAwesomeIcon>
						{user.id !== null ? (
							<span class="cart-badge">{cartQuantity}</span>
						) : null}
					</Button>
				</>
			);
		}
	}

	return (
		<>
			<Navbar
				fixed="top"
				bg="primary"
				variant="dark"
				expand="sm"
				className="p-3"
				style={{zIndex:"100"}}
			>
				<div className="container-lg">
					<Navbar.Brand href="/">
						<FontAwesomeIcon icon={faBookmark} /> BOOKMARKED
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-navr">
						<Nav className="me-auto text-center">
							<Nav.Link className="mx-2" as={NavLink} to="/">
								HOME
							</Nav.Link>
							<Nav.Link className="mx-2" as={NavLink} to="/shop">
								SHOP
							</Nav.Link>
							<AdminOrderSection />
						</Nav>
						<Nav className="text-center">
							<LeftNavSection />
						</Nav>
					</Navbar.Collapse>
				</div>
			</Navbar>
			<div className="my-5">break</div>
		</>
	);
}
