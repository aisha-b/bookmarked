import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Container, Row } from "react-bootstrap";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

export default function ProductCard(props) {
	const { user, getCartQuantity } = useContext(UserContext);
	const { _id, name, imageURL, price, specifications } = props.productProp;
	const setWishlist = props.setWishlist;
	const setActiveProducts = props.setActiveProducts;
	const author = specifications[0]["value"];
	const [isInWishlist, setIsInWishlist] = useState(false);
	const [wishBtnVariant, setWishBtnVariant] = useState("outline-danger");
	const [isInCart, setIsInCart] = useState(false);
	const [cartBtnVariant, setCartBtnVariant] = useState("outline-info");

	const getWishlist = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/wishlist/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.wishlist) {
					setWishlist(res.wishlist);
				}
			});
	};

	const checkIfInWishlist = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/wishlist/${id}/check`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res) {
					setIsInWishlist(true);
				} else {
					setIsInWishlist(false);
				}
			});
	};

	const checkIfInCart = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/cart/${id}/check`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res) {
					setIsInCart(true);
				} else {
					setIsInCart(false);
				}
			});
	};

	const addToWishlist = (id) => {
		if (user.id === null) {
			Swal.fire({
				title: "You need to login first.",
				icon: "error",
			});
		} else if (isInWishlist) {
			fetch(
				`${process.env.REACT_APP_API_URL}/api/wishlist/${id}/remove`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			)
				.then((res) => res.json())
				.then((res) => {
					if (res) {
						setIsInWishlist(false);
						getWishlist();
					}
				});
		} else {
			fetch(`${process.env.REACT_APP_API_URL}/api/wishlist/${id}/add`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					if (res) {
						setIsInWishlist(true);
						getWishlist();
					}
				});
		}
	};

	const addToCart = (id) => {
		if (user.id === null) {
			Swal.fire({
				title: "You need to login first.",
				icon: "error",
			});
		} else if (isInCart) {
			fetch(`${process.env.REACT_APP_API_URL}/api/cart/${id}/remove`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					if (res) {
						getCartQuantity();
						setIsInCart(false);
					}
				});
		} else {
			fetch(`${process.env.REACT_APP_API_URL}/api/cart/${id}/add`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					if (res) {
						getCartQuantity();
						setIsInCart(true);
					}
				});
		}
	};

	useEffect(() => {
		checkIfInWishlist(_id);
		checkIfInCart(_id);

		if (isInWishlist) {
			setWishBtnVariant("danger");
		} else {
			setWishBtnVariant("outline-danger");
		}
		if (isInCart) {
			setCartBtnVariant("info");
		} else {
			setCartBtnVariant("outline-info");
		}
	}, [isInCart, isInWishlist]);

	return (
		<Card className="product-card m-2">
			<NavLink
				to={{
					pathname: `/product/${_id}`,
				}}
			>
				<Card.Img variant="top" className="card-img" src={imageURL} />
			</NavLink>

			<Card.Body className="d-flex flex-column justify-content-between">
				<Card.Title>{name}</Card.Title>
				<Card.Text>({author})</Card.Text>
				<Card.Subtitle>Php {price}</Card.Subtitle>
				<Row>
					<Button
						className="col m-1"
						variant={cartBtnVariant}
						onClick={(e) => addToCart(_id)}
					>
						<FontAwesomeIcon icon={faShoppingCart} />
					</Button>
					<Button
						className="col m-1"
						variant={wishBtnVariant}
						onClick={(e) => addToWishlist(_id)}
					>
						<FontAwesomeIcon icon={faHeart} />
					</Button>
				</Row>
			</Card.Body>
		</Card>
	);
}
