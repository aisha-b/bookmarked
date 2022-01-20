import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { NavLink, Redirect } from "react-router-dom";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import Swal from "sweetalert2";
import CartCard from "../components/CartCard";
import UserContext from "../UserContext";

export default function Cart() {
	const { user } = useContext(UserContext);
	const { productId } = useParams();

	const [cart, setCart] = useState([]);
	const [total, setTotal] = useState(0);
	const [isDisabled, setIsDisabled] = useState(false);

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

	const getSum = () => {
		let sum = 0;

		cart.map((product) => {
			let price = product.productId.price;
			let quantity = product.quantity;

			sum = sum + price * quantity;
		});

		setTotal(sum);
	};

	useEffect(() => {
		getSum();
		cart.map((product) => {
			if (product.productId.isActive === false) {
				setIsDisabled(true);
			}
		});
	}, [cart]);

	useEffect(() => {
		getCart();
	}, []);

	function CartContent() {
		if (user.id === null) {
			return <Redirect to="/login" />;
		} else {
			return (
				<Card className="d-flex flex-row flex-wrap p-3 text-center">
					{cart.length > 0 ? (
						<>
							{cart.map((product) => {
								if (product.productId.isActive) {
									return (
										<CartCard
											productProp={product.productId}
											quantity={product.quantity}
											setCart={setCart}
											type={"cart"}
											key={product.productId._id}
										/>
									);
								} else {
									return (
										<>
											<Container className="inactive">
												<CartCard
													productProp={
														product.productId
													}
													quantity={product.quantity}
													setCart={setCart}
													type={"cart"}
													key={product.productId._id}
												/>
											</Container>

											<p className="m-auto text-secondary mb-3">
												This item is unavailable. Please
												remove from cart.
											</p>
										</>
									);
								}
							})}
						</>
					) : (
						<h4 className="w-100">
							Your cart is empty.{" "}
							<NavLink
								style={{ textDecoration: "none" }}
								to="/shop"
							>
								Shop now.
							</NavLink>
						</h4>
					)}
					<Container>
						{cart.length > 0 ? (
							<Row className="my-3">
								<h3>TOTAL: PHP {total}</h3>
							</Row>
						) : null}

						<Row className="justify-content-center">
							{cart.length > 0 && isDisabled === false? (
								<Col lg={10}>
									<Button
										className="m-2 p-2"
										as={NavLink}
										to={{
											pathname: "/checkout",
											state: {
												cart: cart,
												total: total,
											},
										}}
									>
										<h3 className="m-auto px-2">
											{" "}
											Proceed to Checkout
										</h3>
									</Button>
								</Col>
							) : null}
						</Row>
					</Container>
				</Card>
			);
		}
	}

	return (
		<Container className="my-5">
			<Row className="justify-content-center">
				<Col lg={8}>
					<h1>Cart</h1>
					<CartContent />
				</Col>
			</Row>
		</Container>
	);
}
