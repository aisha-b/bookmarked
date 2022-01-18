import { useContext, useEffect, useState } from "react";
import {
	Button,
	Col,
	Container,
	Form,
	Modal,
	Row,
	Table,
} from "react-bootstrap";
import Swal from "sweetalert2";
import ProductCard from "../components/ProductCard";
import ProductTable from "../components/ProductTable";
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

	const [showAdd, setShowAdd] = useState(false);

	const openAdd = () => setShowAdd(true);
	const closeAdd = () => setShowAdd(false);

	const getAllActiveProducts = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/active`)
			.then((res) => res.json())
			.then((res) => {
				setActiveProducts(res.activeProducts);
			});
	};

	const getAllProducts = () => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/`)
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				setProducts(res.products);
			});
	};

	const addProduct = (e) => {
        e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/api/products/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `$Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
				name: name,
				imageURL: imageURL,
				description: description,
				price: price,
                specifications: [{key: "Author", value:[author]}]
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
				} else {
					Swal.fire({
						title: "Failed",
						icon: "error",
						text: "Something went wrong. Please try again",
					});
				}
			});
	};

	useEffect(() => {
		getAllProducts();
		getAllActiveProducts();
	}, []);

	function CustomerView() {
		return (
			<Container className="d-flex flex-wrap justify-content-center">
				{activeProducts.map((product) => {
					return (
						<ProductCard productProp={product} key={product._id} />
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
							<th>Description</th>
							<th>Price</th>
							<th>Availability</th>
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
									onChange={(e) => setName(e.target.value)}
								/>
							</Form.Group>
                            <Form.Group controlId="productAuthor">
								<Form.Label>Author</Form.Label>
								<Form.Control
									type="text"
									value={author}
									onChange={(e) => setAuthor(e.target.value)}
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
									onChange={(e) => setPrice(e.target.value)}
								/>
							</Form.Group>

							<Button
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
			</Container>
		);
	}

	function ShopView() {
		if (user.isAdmin) {
			return <AdminView />;
		} else {
			return <CustomerView />;
		}
	}

	return <ShopView />;
}
