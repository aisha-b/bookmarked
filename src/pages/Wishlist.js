import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import ProductCard from "../components/ProductCard";
import UserContext from "../UserContext";

export default function Wishlist() {
	const { user } = useContext(UserContext);

	const [wishlist, setWishlist] = useState([]);

	const getWishlist = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/wishlist/`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.wishlist) {
					setWishlist(res.wishlist);
				}
			});
	};

	useEffect(() => {
		getWishlist();
	}, []);

	function WishlistContent() {
		if (user.id === null) {
			return <Redirect to="/login" />;
		} else {
			return (
				<Container className="my-5">
					<Row className="justify-content-center">
						<Col lg={10}>
							<h1>Wishlist</h1>
							<Card className="d-flex flex-row flex-wrap justify-content-center justify-content-lg-start">
								{wishlist.map((product) => {
									return (
										<ProductCard
											productProp={product}
											setWishlist={setWishlist}
											key={product._id}
										/>
									);
								})}
							</Card>
						</Col>
					</Row>
				</Container>
			);
		}
	}

	return <WishlistContent />;
}
