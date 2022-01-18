import { useContext, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import UserContext from "../UserContext";

export default function Account() {
	const history = useHistory();
	const { unsetUser } = useContext(UserContext);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNum, setMobileNum] = useState("");
	const [email, setEmail] = useState("");
	const [orders, setOrders] = useState([]);
	const [isDisabled, setIsDisabled] = useState(true);

	const Logout = () => {
		unsetUser();
		history.push("/");
	};

	function getUserDetails() {
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
				setOrders(data.orders)
			});
	}

	function UserDetails() {
		getUserDetails();

		return (
			<Form className="border p-3" onSubmit={(e) => UpdateDetails(e)}>
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
						disabled={isDisabled}
						type="email"
						placeholder="Enter email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
				</Form.Group>

				<Button className="w-100" variant="primary" type="submit">
					Update
				</Button>
			</Form>
		);
	}

	function OrderHistory(){
		return(
			<>
			{
				orders.map((order) => {
					<Card>
						<Card>
							{
								// order.items.map((product) => {
								// 	return (
								// 		<CartCard
								// 			productProp={product.productId}
								// 			quantity={product.quantity}
								// 			setCart={setCart}
								// 			type={"cart"}
								// 			key={product.productId._id}
								// 		/>
								// 	);
								// })
							}
						</Card>
					</Card>
				})
			}
			</>
		)
	}

	return (
		<Container className="my-5">
			<Row className="justify-content-center">
				<Col lg={8}>
					<Row className="justify-content-between">
						<Col xs={10}>
							<h1 className="text-primary">
								{firstName} {lastName}
							</h1>
						</Col>
						<Col xs={2}>
							<Button className="w-100" onClick={() => Logout()}>
								Logout
							</Button>
						</Col>
					</Row>

					<h2>Details</h2>
					<Card>
						<UserDetails />
					</Card>

					<h2>Order History</h2>
					<Card>
						<OrderHistory />
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
