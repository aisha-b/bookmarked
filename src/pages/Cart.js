import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { NavLink, Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import CartCard from "../components/CartCard";
import UserContext from "../UserContext";

export default function Cart() {
	const { user } = useContext(UserContext);

	const [cart, setCart] = useState([]);
	const [total, setTotal] = useState(0);

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
	}, [cart]);

	useEffect(() => {
		getCart();
	}, []);

	function CartContent() {
		if (user.id === null) {
			Swal.fire({
				title: "You need to login first",
			});
			return <Redirect to="/login" />;
		} else {
			return (
				<Card className="d-flex flex-row flex-wrap p-3">
					{cart.map((product) => {
						return (
							<CartCard
								productProp={product.productId}
								quantity={product.quantity}
								setCart={setCart}
								type={"cart"}
								key={product.productId._id}
							/>
						);
					})}
					<Container>
						<Row className="">
							<h3>TOTAL</h3>

							<h3>Php {total}</h3>
						</Row>
						<Row className="w-50 justify-content-center m-auto">
							<Button
								classsName="m-2 w-50"
								as={NavLink}
								to={{
									pathname: "/checkout",
									state: {
										cart: cart,
										total: total
									},
								}}
							>
								<h3 className="m-auto"> Proceed to Checkout</h3>
							</Button>
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
