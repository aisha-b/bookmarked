import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import CartCard from "../components/CartCard";

export default function Orders() {
	const [orders, setOrders] = useState([]);

	const getAllOrders = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/orders/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				setOrders(res.orders);
			});
	};

	const confirmOrder = (id) => {
		fetch(
			`${process.env.REACT_APP_API_URL}/api/orders/${id}/change-status`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					status: "confirmed",
				}),
			}
		)
			.then((res) => res.json())
			.then((res) => {
                console.log(localStorage.getItem("token"))
                console.log(res)
				if (res) {
					getAllOrders();
				}
			});
	};

	useEffect(() => {
		getAllOrders();
	}, []);

	function OrderDetails(props) {
		const { street, city, zip, country } =
			props.orderDetails.shippingAddress;
		const {
			_id,
			userId,
			status,
			shippingFee,
			modeOfPayment,
			totalOrderPrice,
			purchasedOn,
		} = props.orderDetails;

		return (
			<Container className="my-4">
				<h5 className="mt-2">Order ID</h5>
				<Form.Group className="mb-3">
					<Form.Control disabled required type="text" value={_id} />
				</Form.Group>

				<h5 className="mt-2">User ID</h5>
				<Form.Group className="mb-3">
					<Form.Control
						disabled
						required
						type="text"
						value={userId._id}
					/>
				</Form.Group>

				<h5 className="mt-2">User Name</h5>
				<Form.Group className="mb-3">
					<Form.Control
						disabled
						required
						type="text"
						value={userId.firstName + " " + userId.lastName}
					/>
				</Form.Group>

				<h5 className="mt-2">Contact Number</h5>
				<Form.Group className="mb-3">
					<Form.Control
						disabled
						required
						type="text"
						value={userId.mobileNum}
					/>
				</Form.Group>

				<h5 className="mt-2">Shipping Address</h5>
				<Row className="justify-content-center">
					<Col>
						<Form.Group className="mb-3" controlId="street">
							<Form.Label>Street</Form.Label>
							<Form.Control
								disabled
								required
								type="text"
								value={street}
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="city">
							<Form.Label>City</Form.Label>
							<Form.Control
								disabled
								required
								type="text"
								value={city}
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="zip">
							<Form.Label>ZIP Code</Form.Label>
							<Form.Control
								disabled
								required
								type="number"
								value={zip}
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="country">
							<Form.Label>Country</Form.Label>
							<Form.Control
								disabled
								required
								type="text"
								value={country}
							/>
						</Form.Group>

						<h5 className="mt-2">Mode Of Payment</h5>

						<Form.Group className="mb-3">
							<Form.Control
								disabled
								required
								type="text"
								value={modeOfPayment}
							/>
						</Form.Group>

						<h5 className="mt-2">Shipping Fee</h5>
						<Form.Group className="mb-3">
							<Form.Control
								disabled
								required
								type="text"
								value={"Php " + shippingFee}
							/>
						</Form.Group>

						<h5 className="mt-2">Date Purchased</h5>
						<Form.Group className="mb-3">
							<Form.Control
								disabled
								required
								type="text"
								value={purchasedOn.slice(0, 10)}
							/>
						</Form.Group>

						<h5 className="mt-2">Total</h5>
						<Form.Group className="mb-3">
							<Form.Control
								disabled
								required
								type="text"
								value={"Php " + totalOrderPrice}
							/>
						</Form.Group>

						<h5 className="mt-2">Status</h5>
						<Form.Group className="mb-3">
							<Form.Control
								disabled
								required
								type="text"
								value={status}
							/>
						</Form.Group>

						<Button
							disabled={status == "confirmed"}
							className="w-100"
							variant="success"
							onClick={() => confirmOrder(_id)}
						>
							Confirm
						</Button>
					</Col>
				</Row>
			</Container>
		);
	}

	return (
		<Container>
			<h1 className="text-center">Shop Orders</h1>
			<Row className="justify-content-center">
				{orders.map((order, index) => {
					return (
						<Col lg={8} key={index}>
							<Card className="mb-5">
								<Container className="mt-3">
									{order.items.map((product) => {
										return (
											<CartCard
												productProp={product.productId}
												type={"order"}
												quantity={product.quantity}
												key={product.productId._id}
											/>
										);
									})}
								</Container>
								<OrderDetails orderDetails={order} />
							</Card>
						</Col>
					);
				})}
			</Row>
		</Container>
	);
}
