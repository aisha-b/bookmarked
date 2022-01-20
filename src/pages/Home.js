import {
	faBook,
	faCoins,
	faShippingFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Card, Button, Col, Container, NavLink, Row } from "react-bootstrap";

export default function Home() {
	const [activeProducts, setActiveProducts] = useState([]);
	const [latestProducts, setLatestProducts] = useState([]);

	const getAllActiveProducts = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/active`)
			.then((res) => res.json())
			.then((res) => {
				setActiveProducts(res.activeProducts);
			});
	};

	useEffect(() => {
		getAllActiveProducts();
		setLatestProducts(
			activeProducts.slice(
				activeProducts.length - 7,
				activeProducts.length - 1
			)
		);
	}, [activeProducts]);

	return (
		<>
			<Container fluid className="banner text-center">
				<h1 className="text-center headline">
					Get good reads from us!
				</h1>
				<Button variant="outline-light" className="px-3" href="/shop">
					<h3>Shop Now</h3>
				</Button>
			</Container>

			<Container fluid>
				<Row className="justify-content-center p-5">
					<Col md={10}>
						<h2>LATEST</h2>
						<Card>
							<Row className="justify-content-center align-items-center">
								{latestProducts.map((product) => {
									return (
										<Col
											xs={4}
											lg={2}
											key={product._id}
											className="text-center"
										>
											<NavLink
												className="img-hover"
												to={{
													pathname: `/product/${product._id}`,
												}}
											>
												<img
													className="latest-img"
													src={product.imageURL}
												/>
											</NavLink>
										</Col>
									);
								})}
							</Row>
						</Card>

						<Row className="my-5">
							<div className="second-banner my-5 p-5">
								<h2 className="text-light text-center">
									It's time to fill your bookshelf.
								</h2>
							</div>
						</Row>

						<Row className="my-5 justify-content-center">
							<Col md={4}>
								<Card className="p-5 text-center m-4 text-primary">
									<h2>Low Cost</h2>
									<h3>
										{" "}
										<FontAwesomeIcon
											icon={faCoins}
											className="w-100"
										/>
									</h3>
								</Card>
							</Col>
							<Col md={4}>
								<Card className="p-5 text-center m-4 text-primary">
									<h2>Fast Delivery</h2>
									<h3>
										<FontAwesomeIcon
											icon={faShippingFast}
											className="w-100"
										/>
									</h3>
								</Card>
							</Col>
							<Col md={4}>
								<Card className="p-5 text-center m-4 text-primary">
									<h2>Good Reads</h2>
									<h3>
										<FontAwesomeIcon
											icon={faBook}
											className="w-100"
										/>
									</h3>
								</Card>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</>
	);
}
