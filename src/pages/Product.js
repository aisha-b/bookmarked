import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../UserContext";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function Product() {
	const { getCartQuantity, user } = useContext(UserContext);

	const location = useLocation();
	const { productId } = useParams();

	const [product, setProduct] = useState({});
	const [author, setAuthor] = useState("");
	const [genre, setGenre] = useState("");

	const [isInWishlist, setIsInWishlist] = useState(false);
	const [wishBtnVariant, setWishBtnVariant] = useState("outline-danger");
	const [isInCart, setIsInCart] = useState(false);
	const [cartBtnVariant, setCartBtnVariant] = useState("outline-info");

	const getProductDetails = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/${productId}/get`)
			.then((res) => res.json())
			.then((res) => {
				setProduct(res.product);
				setAuthor(res.product.specifications[0]["value"].toString());
				setGenre(res.product.specifications[1]["value"].toString());
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

	const addToWishlist = (id) => {
		if (user.id === null) {
			Swal.fire({
				title: "You need to login first",
				icon: "error",
			});
		} else {
			if (isInWishlist) {
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
						}
					});
			} else {
				fetch(
					`${process.env.REACT_APP_API_URL}/api/wishlist/${id}/add`,
					{
						method: "PUT",
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
							setIsInWishlist(true);
						}
					});
			}
		}
	};

	const addToCart = (id) => {
		if (user.id === null) {
			Swal.fire({
				title: "You need to login first",
				icon: "error",
			});
		} else {
			if (isInCart) {
				fetch(
					`${process.env.REACT_APP_API_URL}/api/cart/${id}/remove`,
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
							setIsInCart(false);
							getCartQuantity();
						}
					});
			} else {
				fetch(`${process.env.REACT_APP_API_URL}/api/cart/${id}/add`, {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				})
					.then((res) => res.json())
					.then((res) => {
						if (res) {
							setIsInCart(true);
							getCartQuantity();
						}
					});
			}
		}
	};

	useEffect(() => {
		getProductDetails();
		checkIfInWishlist(productId);
		checkIfInCart(productId);

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
		<Container className="my-5">
			<Row className="justify-content-center">
				<Col lg={4} className="mb-3">
					<img className="w-100" src={product.imageURL}></img>
				</Col>
				<Col lg={6}>
					<Card className="w-100 p-3">
						<h2>{product.name}</h2>
						<Card.Subtitle>
							Author: {author} | Genre: {genre}
						</Card.Subtitle>
						<hr />
						<Card.Subtitle>OVERVIEW</Card.Subtitle>
						<Card.Text>{product.description}</Card.Text>
						<hr />
						<h3 className="text-primary">Php {product.price}</h3>
						<hr />
						<Row>
							<Button
								className="col m-1"
								variant={cartBtnVariant}
								onClick={(e) => addToCart(productId)}
							>
								<FontAwesomeIcon icon={faShoppingCart} />
							</Button>
							<Button
								className="col m-1"
								variant={wishBtnVariant}
								onClick={(e) => addToWishlist(productId)}
							>
								<FontAwesomeIcon icon={faHeart} />
							</Button>
						</Row>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
