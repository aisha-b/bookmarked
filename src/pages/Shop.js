import { useContext, useEffect, useState } from "react";
import {
	Button,
	Col,
	Container,
	Dropdown,
	DropdownButton,
	Form,
	Modal,
	NavDropdown,
	Row,
	Table,
} from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import Swal from "sweetalert2";
import ProductCard from "../components/ProductCard";
import ProductTable from "../components/ProductTable";
import ShopNavBar from "../components/ShopNavBar";
import UserContext from "../UserContext";

export default function Shop() {
	const { user } = useContext(UserContext);
	const [products, setProducts] = useState([]);
	const [activeProducts, setActiveProducts] = useState([]);

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [imageURL, setImageURL] = useState("");
	const [author, setAuthor] = useState("");
	const [genre, setGenre] = useState("");

	const [showAdd, setShowAdd] = useState(false);
	const [isDisabled, setIsDisabled] = useState(true);

	const openAdd = () => setShowAdd(true);
	const closeAdd = () => setShowAdd(false);

	const getAllActiveProducts = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/active`)
			.then((res) => res.json())
			.then((res) => {
				setActiveProducts(res.activeProducts);
				setUnsortedProducts(res.activeProducts);
			});
	};

	const getAllProducts = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/`)
			.then((res) => res.json())
			.then((res) => {
				setProducts(res.products);
			});
	};

	const addProduct = (e) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/api/products/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
				name: name,
				imageURL: imageURL,
				description: description,
				price: price,
				specifications: [
					{ key: "Author", value: author.split(",") },
					{ key: "Genre", value: genre.split(",") },
				],
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res) {
					closeAdd();

					Swal.fire({
						title: "Product successfully added",
						icon: "success",
					});

					getAllProducts();
					setName("");
					setPrice(0);
					setDescription("");
					setImageURL("");
					setAuthor("");
					setGenre("");
				} else {
					Swal.fire({
						title: "Failed",
						icon: "error",
						text: "Something went wrong. Please try again",
					});
				}
			});
	};

	const sortByGenre = (genre) => {
		let productsByGenre = [];

		if (genre === "all") {
			getAllActiveProducts();
		} else {
			fetch(`${process.env.REACT_APP_API_URL}/api/products/active`)
				.then((res) => res.json())
				.then((res) => {
					res.activeProducts.map((product) => {
						return product.specifications[1]["value"].map(
							(prod) => {
								if (
									prod.toLowerCase() === genre.toLowerCase()
								) {
									productsByGenre.push(product);
								}
							}
						);
					});
					setActiveProducts(productsByGenre);
				});
		}
	};

	const sortByAvailability = (availability) => {
		let productsByAvailability = [];

		if (availability === "all") {
			getAllProducts();
		} else {
			fetch(`${process.env.REACT_APP_API_URL}/api/products/`)
				.then((res) => res.json())
				.then((res) => {
					res.products.map((product) => {
						if (product.isActive === availability) {
							productsByAvailability.push(product);
						}
					});
					setProducts(productsByAvailability);
				});
		}
	};

	useEffect(() => {
		getAllProducts();
		getAllActiveProducts();
	}, []);

	useEffect(() => {
		if (
			name !== "" &&
			price > 0 &&
			description !== "" &&
			imageURL !== "" &&
			author !== "" &&
			genre !== ""
		) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [name, price, description, imageURL, author, genre]);

	function CustomerView() {
		return (
			<Container
				className="d-flex flex-wrap justify-content-center"
				style={{ marginTop: "120px" }}
			>
				{activeProducts.map((product) => {
					return (
						<ProductCard
							productProp={product}
							setActiveProducts={setActiveProducts}
							key={product._id}
						/>
					);
				})}
			</Container>
		);
	}

	function AdminView() {
		return (
			<Container className="text-center">
				<h1>Admin Dashboard</h1>
				<Button variant="success" className="my-2" onClick={openAdd}>
					Add Product
				</Button>
				<Table bordered>
					<thead>
						<tr>
							<th>Image</th>
							<th>Name</th>
							<th>Author</th>
							<th>Genre</th>
							<th>Description</th>
							<th>Price</th>
							<th>
								<NavDropdown
									id="availability-dropdown"
									title="Availability"
								>
									<Dropdown.Item
										onClick={() => {
											sortByAvailability(true);
										}}
									>
										Available
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() => {
											sortByAvailability(false);
										}}
									>
										Unavailable
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() => {
											sortByAvailability("all");
										}}
									>
										All
									</Dropdown.Item>
								</NavDropdown>
							</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => {
							return (
								<ProductTable
									productProp={product}
									getAllProducts={getAllProducts}
									key={product._id}
								/>
							);
						})}
					</tbody>
				</Table>
			</Container>
		);
	}

	return (
		<>
			{user.isAdmin ? (
				<>
					<AdminView />

					<Modal show={showAdd} onHide={closeAdd}>
						<Modal.Header closeButton>
							<Modal.Title>Add Course</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={(e) => addProduct(e)}>
								<Form.Group controlId="productName">
									<Form.Label>Product Name</Form.Label>
									<Form.Control
										type="text"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group controlId="productAuthor">
									<Form.Label>Author</Form.Label>
									<Form.Text>
										{" "}
										(For multiple authors, please separate
										with comma)
									</Form.Text>
									<Form.Control
										type="text"
										value={author}
										onChange={(e) =>
											setAuthor(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group controlId="productGenre">
									<Form.Label>Genre</Form.Label>
									<Form.Text>
										{" "}
										(For multiple genres, please separate
										with comma)
									</Form.Text>
									<Form.Control
										type="text"
										value={genre}
										onChange={(e) =>
											setGenre(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group controlId="courseDescription">
									<Form.Label>Description:</Form.Label>
									<Form.Control
										type="text"
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group controlId="imageURL">
									<Form.Label>Image URL:</Form.Label>
									<Form.Control
										type="text"
										value={imageURL}
										onChange={(e) =>
											setImageURL(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group controlId="productPrice">
									<Form.Label>Price:</Form.Label>
									<Form.Control
										type="number"
										value={price}
										onChange={(e) =>
											setPrice(e.target.value)
										}
									/>
								</Form.Group>

								<Button
									disabled={isDisabled}
									className="my-2"
									variant="primary"
									type="submit"
									style={{ width: "100%" }}
								>
									Add
								</Button>
							</Form>
						</Modal.Body>
					</Modal>
				</>
			) : (
				<>
					<ShopNavBar sortByGenre={sortByGenre} />
					<CustomerView />
				</>
			)}
		</>
	);
}
