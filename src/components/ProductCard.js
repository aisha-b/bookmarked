import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Container, Row } from "react-bootstrap";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { useContext } from "react";
import UserContext from "../UserContext";

export default function ProductCard(props) {
	const {getCartQuantity} = useContext(UserContext);
	const { _id, name, imageURL, price, specifications } = props.productProp;
	const getAllActiveProducts = props.getAllActiveProducts;
	const author = specifications[0]["value"];


	const addToWishlist = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/wishlist/${id}/add`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
			});
	};

	const addToCart = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/cart/${id}/add`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if(res){
					getCartQuantity();
				}
				
			});
	};

	return (
		<Card className="product-card m-2">
			<NavLink
				to={{
					pathname: "/product",
					state: { productId: _id },
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
						variant="primary"
						onClick={(e) => addToCart(_id)}
					>
						<FontAwesomeIcon icon={faShoppingCart} />
					</Button>
					<Button
						className="col m-1"
						variant="primary"
						onClick={(e) => addToWishlist(_id)}
					>
						<FontAwesomeIcon icon={faHeart} />
					</Button>
				</Row>
			</Card.Body>
		</Card>
	);
}
