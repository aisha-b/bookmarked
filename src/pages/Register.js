import { useContext, useEffect, useState } from "react";
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function Register() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [mobileNum, setMobileNum] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [cPassword, setCPassword] = useState("");
	const [isDisabled, setIsDisabled] = useState(true);

	const { user } = useContext(UserContext);
	let history = useHistory();

	useEffect(() => {
		if (
			firstName !== "" &&
			lastName !== "" &&
			mobileNum.length >= 11 &&
			email !== "" &&
			password !== "" &&
			cPassword !== "" &&
			password === cPassword
		) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [firstName, lastName, mobileNum, email, password, cPassword]);

	function Register(e) {
		e.preventDefault();
		console.log(process.env.REACT_APP_API_URL);

		fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
				mobileNum: mobileNum,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res === true) {
					Swal.fire({
						title: "Registration Successful",
						icon: "success",
						text: "Please login to proceed",
					});

					history.push("/login");
				} else if (res.message) {
					Swal.fire({
						title: "Email already exists",
						icon: "error",
						text: "Please enter another email",
					});
				} else {
					Swal.fire({
						title: "Error",
						icon: "error",
						text: "Something went wrong. Please try again",
					});
				}
			});
	}

	if (user.id == null) {
		return (
			<Container className="my-5">
				<Row className="justify-content-center">
					<Col lg={5}>
						<Form
							className="border p-3"
							onSubmit={(e) => Register(e)}
						>
							<Form.Group className="mb-3" controlId="firstName">
								<Form.Label>First Name</Form.Label>
								<Form.Control
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
									type="email"
									placeholder="Enter email"
									value={email}
									onChange={(e) => {
										setEmail(e.target.value);
									}}
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="password">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
									}}
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="cpassword">
								<Form.Label>Confirm Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Confirm Password"
									value={cPassword}
									onChange={(e) => {
										setCPassword(e.target.value);
									}}
								/>
							</Form.Group>

							<Button
								className="w-100"
								variant="primary"
								type="submit"
								disabled={isDisabled}
							>
								Register
							</Button>
						</Form>
						<p>
							Already have an account?{" "}
							<NavLink to="/login">Login</NavLink>
						</p>
					</Col>
				</Row>
			</Container>
		);
	} else {
		return <Redirect to="/shop" />;
	}
}
