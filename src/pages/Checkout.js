import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Redirect, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import CartCard from "../components/CartCard";
import UserContext from "../UserContext";

export default function Checkout() {
	const { getCartQuantity } = useContext(UserContext);
	const location = useLocation();
	const history = useHistory();
	const { cart, total } = location.state;

	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [zip, setZip] = useState(0);
	const [country, setCountry] = useState("");
	const [shippingFee, setShippingFee] = useState(100);
	const [totalOrder, setTotalOrder] = useState(total + 100);
	const [isDisabled, setIsDisabled] = useState(true);

	const Checkout = (e) => {
		e.preventDefault();

		let shippingAddress = {
			street: street,
			city: city,
			zip: zip,
			country: country,
		};

		fetch(`${process.env.REACT_APP_API_URL}/api/users/checkout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
				shippingAddress: shippingAddress,
				shippingFee: shippingFee,
				discount: 0,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res) {
					Swal.fire({
						title: "Checkout Successful!",
						icon: "success",
						text: "Thank you for shopping with us.",
					});
					getCartQuantity();
					history.push("/");
				} else {
					Swal.fire({
						title: "Something went wrong!",
						icon: "error",
						text: "Please try again.",
					});
				}
			});
	};

	function OrderContent() {
		return (
			<Card className="d-flex flex-row flex-wrap p-3">
				{cart.map((product) => {
					return (
						<CartCard
							productProp={product.productId}
							quantity={product.quantity}
							type={"order"}
							key={product.productId._id}
						/>
					);
				})}
			</Card>
		);
	}

	useEffect(() => {
		if (street !== "" && city !== "" && zip !== "" && country !== "") {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [street, city, zip, country]);

	return (
		<Container className="my-5">
			<Form className="p-3" onSubmit={(e) => Checkout(e)}>
				<Row className="justify-content-center my-4">
					<Col lg={8}>
						<h3>Orders</h3>
						<OrderContent />
					</Col>
				</Row>

				<Row className="justify-content-center my-4">
					<Col lg={8}>
						<h3>Shipping Address</h3>
						<Card>
							<Container className="my-5">
								<Row className="justify-content-center">
									<Col>
										<Form.Group
											className="mb-3"
											controlId="street"
										>
											<Form.Label>Street</Form.Label>
											<Form.Control
												required
												type="text"
												placeholder="Enter Street"
												value={street}
												onChange={(e) => {
													setStreet(e.target.value);
												}}
											/>
										</Form.Group>

										<Form.Group
											className="mb-3"
											controlId="city"
										>
											<Form.Label>City</Form.Label>
											<Form.Control
												required
												type="text"
												placeholder="Enter City"
												value={city}
												onChange={(e) => {
													setCity(e.target.value);
												}}
											/>
										</Form.Group>

										<Form.Group
											className="mb-3"
											controlId="zip"
										>
											<Form.Label>ZIP Code</Form.Label>
											<Form.Control
												required
												type="number"
												placeholder="Enter ZIP Code"
												value={zip}
												onChange={(e) => {
													setZip(e.target.value);
												}}
											/>
										</Form.Group>

										<Form.Group
											className="mb-3"
											controlId="country"
										>
											<Form.Label>Country</Form.Label>
											<Form.Control
												required
												type="text"
												placeholder="Enter Country"
												value={country}
												onChange={(e) => {
													setCountry(e.target.value);
												}}
											/>
										</Form.Group>
									</Col>
								</Row>
							</Container>
						</Card>
					</Col>
				</Row>
				<Row className="justify-content-center my-4">
					<Col lg={8}>
						<h3>Mode of Payment</h3>
						<Card>
							<Container className="my-5">
								<Row className="justify-content-center">
									<Col>
										<h4>Cash on Delivery</h4>
									</Col>
								</Row>
							</Container>
						</Card>
					</Col>
				</Row>

				<Row className="justify-content-center my-4">
					<Col lg={8}>
						<h3>Shipping Fee</h3>
						<Card>
							<Container className="my-5">
								<Row className="justify-content-center">
									<Col>
										<h4>Php {shippingFee}</h4>
									</Col>
								</Row>
							</Container>
						</Card>
					</Col>
				</Row>

				<Row className="justify-content-center my-4">
					<Col lg={8}>
						<h3>Grand Total</h3>
						<Card>
							<Container className="my-5">
								<Row className="justify-content-center">
									<Col>
										<h2
											className="text-primary"
											style={{ fontWeight: "bold" }}
										>
											Php {totalOrder}
										</h2>
									</Col>
								</Row>
							</Container>
						</Card>
					</Col>
				</Row>

				<Row className="justify-content-center my-4">
					<Col lg={8}>
						<Button
							disabled={isDisabled}
							className="w-100 mb-5"
							variant="primary"
							type="submit"
						>
							<h2 className="text-white m-auto">Checkout</h2>
						</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
}
