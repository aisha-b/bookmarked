import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Modal,
	Row,
} from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Swal from "sweetalert2";
import CartCard from "../components/CartCard";
import UserContext from "../UserContext";

export default function Account() {
	const history = useHistory();
	const { user, unsetUser } = useContext(UserContext);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNum, setMobileNum] = useState("");
	const [email, setEmail] = useState("");
	const [orders, setOrders] = useState([]);
	const [isDisabled, setIsDisabled] = useState(true);
	const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
	const [editText, setEditText] = useState("Edit");
	const [fullName, setFullName] = useState("");

	const Logout = () => {
		unsetUser();
		history.push("/login");
	};

	const updateUserDetails = (e) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/api/users/change-details`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				mobileNum: mobileNum,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res) {
					Swal.fire({
						title: "Update Success!",
						icon: "success",
					});

					setIsDisabled(!isDisabled);
					setEditText(editText === "Edit" ? "Cancel" : "Edit");
					getUserDetails();
				} else {
					Swal.fire({
						title: "Update failed",
						icon: "error",
						text: "Something went wrong. Please try again.",
					});
				}
			});
	};

	const getUserDetails = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/users/user-details`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				let data = res.userDetails;

				setFirstName(data.firstName);
				setLastName(data.lastName);
				setMobileNum(data.mobileNum);
				setEmail(data.email);
				setFullName(`${data.firstName} ${data.lastName}`);
			});
	};

	const getUserOrders = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/orders/user-orders`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				let userOrders = res.userOrders;

				setOrders(userOrders);
			});
	};

	useEffect(() => {
		getUserDetails();
		getUserOrders();
	}, [isDisabled]);

	useEffect(() => {
		if (firstName !== "" && lastName !== "" && mobileNum.length >= 11) {
			setIsSubmitDisabled(false);
		} else {
			setIsSubmitDisabled(true);
		}
	}, [firstName, lastName, mobileNum]);

	function OrderDetails(props) {
		const { street, city, zip, country } =
			props.orderDetails.shippingAddress;
		const {
			_id,
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
					</Col>
				</Row>
			</Container>
		);
	}

	function OrderHistory() {
		return (
			<>
				{orders.map((order, index) => {
					return (
						<Card className="mb-5" key={index}>
							<Container className="mt-3">
								{order.orderId.items.map((product) => {
									return (
										<CartCard
											className="col"
											productProp={product.productId}
											type={"order"}
											quantity={product.quantity}
											key={product.productId._id}
										/>
									);
								})}
							</Container>
							<OrderDetails orderDetails={order.orderId} />
						</Card>
					);
				})}
			</>
		);
	}

	return (
		<Container className="my-5">
			<Row className="justify-content-center">
				<Col lg={8}>
					<Row className="justify-content-between">
						<Col xs={9}>
							<h1 className="text-primary">{fullName}</h1>
						</Col>
						<Col xs={3}>
							<Button className="w-100" onClick={() => Logout()}>
								Logout
							</Button>
						</Col>
					</Row>

					<h2 className="mt-4">Details</h2>
					<Card>
						<Form
							className="border p-3"
							onSubmit={(e) => updateUserDetails(e)}
						>
							<Form.Group className="mb-3" controlId="firstName">
								<Form.Label>First Name</Form.Label>
								<Form.Control
									disabled={isDisabled}
									type="text"
									placeholder="Enter first name"
									value={firstName}
									onChange={(e) => {
										setFirstName(e.target.value);
									}}
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="lastName">
								<Form.Label>Last Name</Form.Label>
								<Form.Control
									disabled={isDisabled}
									type="text"
									placeholder="Enter last name"
									value={lastName}
									onChange={(e) => {
										setLastName(e.target.value);
									}}
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="mobileNum">
								<Form.Label>Mobile Number</Form.Label>
								<Form.Control
									disabled={isDisabled}
									type="text"
									placeholder="Enter mobile number"
									value={mobileNum}
									onChange={(e) => {
										setMobileNum(e.target.value);
									}}
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="email">
								<Form.Label>Email Address</Form.Label>
								<Form.Control
									disabled
									type="email"
									placeholder="Enter email"
									value={email}
								/>
							</Form.Group>

							<Row className="justify-content-center">
								<Col>
									<Button
										className="w-100"
										variant="outline-primary"
										onClick={() => {
											setIsDisabled(!isDisabled);
											setEditText(
												editText === "Edit"
													? "Cancel"
													: "Edit"
											);
										}}
									>
										{editText}
									</Button>
								</Col>

								<Col>
									<Button
										className="w-100"
										variant="primary"
										type="submit"
										disabled={isSubmitDisabled}
									>
										Update
									</Button>
								</Col>
							</Row>
						</Form>
					</Card>
					{user.isAdmin ? null : (
						<>
							<h2 className="mt-5">Order History</h2>{" "}
							<OrderHistory />
						</>
					)}
				</Col>
			</Row>
		</Container>
	);
}
