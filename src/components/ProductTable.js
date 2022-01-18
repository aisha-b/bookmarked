import { useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ProductTable(props) {
	const {
		_id,
		name,
		imageURL,
		price,
		description,
		isActive,
		specifications,
	} = props.productProp;
	const getAllProducts = props.getAllProducts;
	const author = specifications[0]["value"];

	const [newName, setNewName] = useState(name);
	const [newDescription, setNewDescription] = useState(description);
	const [newPrice, setNewPrice] = useState(price);
	const [newImageURL, setNewImageURL] = useState(imageURL);
	const [newAuthor, setNewAuthor] = useState(author);

	const [showAdd, setShowAdd] = useState(false);

	const openAdd = () => setShowAdd(true);
	const closeAdd = () => setShowAdd(false);

	const archiveProduct = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}/archive`, {
			method: "PUT",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				if (res) {
					getAllProducts();
				}
			});
	};

	const unarchiveProduct = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}/unarchive`, {
			method: "PUT",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
			});
	};

	const deleteProduct = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}/delete`, {
			method: "DELETE",
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
			});
	};

    const updateProduct = (e, id) => {
        e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}/update`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `$Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
				name: newName,
				imageURL: newImageURL,
				description: newDescription,
				price: newPrice,
                specifications: [{key: "Author", value: [newAuthor]}]
			}),
		})
			.then((res) => res.json())
			.then((res) => {
                console.log(res)
				if (res) {
					closeAdd();

					Swal.fire({
						title: "Product successfully updated",
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

	return (
		<>
			<tr>
				<td>
					<Image
						src={imageURL}
						style={{
							width: "90px",
							height: "150px",
							objectFit: "cover",
						}}
					/>
				</td>
				<td>{name}</td>
				<td>{author}</td>
				<td>{description}</td>
				<td>Php {price}</td>
				<td>{isActive ? "Available" : "Unavailable"}</td>
				<td>
					{isActive ? (
						<Button
							className="my-1"
							variant="secondary"
							style={{ width: "100px" }}
							onClick={() => archiveProduct(_id)}
						>
							Archive
						</Button>
					) : (
						<Button
							className="my-1"
							variant="success"
							style={{ width: "100px" }}
							onClick={() => unarchiveProduct(_id)}
						>
							Unarchive
						</Button>
					)}

					<Button
						className="my-1"
						variant="primary"
						style={{ width: "100px" }}
						onClick={openAdd}
					>
						Update
					</Button>
					<Button
						className="my-1"
						variant="danger"
						style={{ width: "100px" }}
						onClick={() => deleteProduct(_id)}
					>
						Delete
					</Button>
				</td>
			</tr>

			<Modal show={showAdd} onHide={closeAdd}>
				<Modal.Header closeButton>
					<Modal.Title>Add Course</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={(e) => updateProduct(e, _id)}>
						<Form.Group controlId="productName">
							<Form.Label>Product Name</Form.Label>
							<Form.Control
								type="text"
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="productAuthor">
							<Form.Label>Author</Form.Label>
							<Form.Control
								type="text"
								value={newAuthor}
								onChange={(e) => setNewAuthor(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="courseDescription">
							<Form.Label>Description:</Form.Label>
							<Form.Control
								type="text"
								value={newDescription}
								onChange={(e) => setNewDescription(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="imageURL">
							<Form.Label>Image URL:</Form.Label>
							<Form.Control
								type="text"
								value={newImageURL}
								onChange={(e) => setNewImageURL(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="productPrice">
							<Form.Label>Price:</Form.Label>
							<Form.Control
								type="number"
								value={newPrice}
								onChange={(e) => setNewPrice(e.target.value)}
							/>
						</Form.Group>

						<Button
							className="my-2"
							variant="primary"
							type="submit"
							style={{ width: "100%" }}
						>
							Update
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}
