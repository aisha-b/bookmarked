import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserContext from "../UserContext";

export default function CartCard(props) {
	const {getCartQuantity} = useContext(UserContext);
	const { _id, name, imageURL, price } = props.productProp;
	const quantity = props.quantity;
	const setCart = props.setCart;

	const [itemQuantity, setItemQuantity] = useState();
	const [isMinusBtnDisabled, setIsMinusBtnDisabled] = useState(false);

	useEffect(() => {
		setItemQuantity(quantity);
	}, []);

	useEffect(() => {
		if (itemQuantity == 1) {
			setIsMinusBtnDisabled(true);
		} else {
			setIsMinusBtnDisabled(false);
		}
	}, [itemQuantity]);

	const getCart = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/cart/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.cart) {
					setCart(res.cart);
				}
			});
	};

	const increaseQuantity = (id) => {
		fetch(
			`${process.env.REACT_APP_API_URL}/api/cart/${id}/change-quantity`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					quantity: itemQuantity + 1,
				}),
			}
		)
			.then((res) => res.json())
			.then((res) => {
				if (res) {
					setItemQuantity(itemQuantity + 1);
				}
			});
	};

	const decreaseQuantity = (id) => {
		fetch(
			`${process.env.REACT_APP_API_URL}/api/cart/${id}/change-quantity`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					quantity: itemQuantity - 1,
				}),
			}
		)
			.then((res) => res.json())
			.then((res) => {
				if (res) {
					setItemQuantity(itemQuantity - 1);
				}
			});
	};

	const removeItem = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/cart/${id}/remove`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res) {
					getCart();
					getCartQuantity();
				}
			});
	};

	return (
		<Card className="m-2 w-100 py-2">
			<Container>
				<Row className="align-items-center justify-content-between">
					<Col xs={2}>
						<NavLink
							to={{
								pathname: "/product",
								state: { productId: _id },
							}}
						>
							<img
								className="img-hover"
								src={imageURL}
								style={{ height: "70px" }}
							/>
						</NavLink>
					</Col>
					<Col xs={4}>
						<Row>
							<h3>{name}</h3>
						</Row>
						<Row>
							<h5>Php {price}</h5>
						</Row>
					</Col>

					<Col xs={3} className="d-flex flex-row ">
						{props.type === "cart" ? (
							<Button
								onClick={() => decreaseQuantity(_id)}
								disabled={isMinusBtnDisabled}
							>
								-
							</Button>
						) : null}

						<Form.Group className="mx-1">
							<Form.Control
								className="text-center"
								type="text"
								value={itemQuantity}
								disabled
							/>
						</Form.Group>

						{props.type === "cart" ? (
							<>
								<Button onClick={() => increaseQuantity(_id)}>
									+
								</Button>
								<Button
									className="mx-2"
									variant="danger"
									onClick={() => removeItem(_id)}
								>
									<FontAwesomeIcon icon={faTrashAlt} />
								</Button>
							</>
						) : null}
					</Col>

					<Col xs={3} className="text-center">
						<h4>Php {price * quantity}</h4>
					</Col>
				</Row>
			</Container>
		</Card>
	);
}
