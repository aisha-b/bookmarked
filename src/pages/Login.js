import { useContext, useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { NavLink, Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function Login() {
	const { user, setUser } = useContext(UserContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isDisabled, setIsDisabled] = useState(true);

	useEffect(() => {
		if (email !== "" && password !== "") {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [email, password]);

	const Login = (e) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.access) {
					localStorage.setItem("token", res.access);
					getUserDetails(res.access);

					Swal.fire({
						title: "Login successful",
						icon: "success",
						text: "Welcome to Bookmarked",
					});

					setEmail("");
					setPassword("");
				} else if (res.message) {
					Swal.fire({
						title: "Authentication failed",
						icon: "error",
						text: res.message,
					});
				}
			});

		function getUserDetails(token) {
			fetch(`${process.env.REACT_APP_API_URL}/api/users/user-details`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					let data = res.userDetails;

					setUser({
						id: data._id,
						isAdmin: data.isAdmin,
					});
				});
		}
	};

	return user.id !== null ? (
		<Redirect to="/shop" />
	) : (
		<Container className="my-5">
			<Row className="justify-content-center">
				<Col lg={5}>
					<Form className="border p-3" onSubmit={(e) => Login(e)}>
						<Form.Group className="mb-3" controlId="email">
							<Form.Label>Email address</Form.Label>
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

						<Button
							className="w-100"
							variant="primary"
							type="submit"
							disabled={isDisabled}
						>
							Login
						</Button>
					</Form>
					<p>
						Don't have an account yet?{" "}
						<NavLink to="/register">Register</NavLink>
					</p>
				</Col>
			</Row>
		</Container>
	);
}
