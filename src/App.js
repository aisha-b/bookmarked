import React from "react";
import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import { Container } from "react-bootstrap";
import { UserProvider } from "./UserContext";
import "./App.css";
import "bootswatch/dist/yeti/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import AppNavBar from "./components/AppNavBar";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Product from "./pages/Product";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";

function App() {
	const [user, setUser] = useState({
		id: null,
		isAdmin: null,
	});

	const [cartQuantity, setCartQuantity] = useState(0);

	const unsetUser = () => {
		setUser({
			id: null,
			isAdmin: null,
		});

		localStorage.clear();
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
				if (data !== undefined) {
					setUser({
						id: data._id,
						isAdmin: data.isAdmin,
					});
				}
			});
	};

	const getCartQuantity = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/cart/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.cart) {
					setCartQuantity(res.cart.length);
				}
			});
	};

	useEffect(() => {
		getUserDetails();
		getCartQuantity();
	}, []);

	return (
		<UserProvider
			value={{ user, setUser, unsetUser, cartQuantity, getCartQuantity }}
		>
			<BrowserRouter>
				<AppNavBar />
				<div className="body-container">
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/shop" component={Shop} />
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
						<Route exact path="/logout" component={Logout} />
						<Route exact path="/account" component={Account} />
						<Route exact path="/cart" component={Cart} />
						<Route exact path="/wishlist" component={Wishlist} />
						<Route exact path="/checkout" component={Checkout} />
						<Route exact path="/shop-orders" component={Orders} />
						<Route
							exact
							path="/product/:productId"
							component={Product}
						/>
						<Route exact path="*" component={ErrorPage} />
					</Switch>
				</div>

				<Footer />
			</BrowserRouter>
		</UserProvider>
	);
}

export default App;
