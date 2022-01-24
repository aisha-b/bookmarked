import { useEffect, useState } from "react";
import { Button, Card, Form, Image, Modal } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
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
	const author = specifications[0]["value"].toString();
	const genre = specifications[1]["value"].toString();

	const [newName, setNewName] = useState(name);
	const [newDescription, setNewDescription] = useState(description);
	const [newPrice, setNewPrice] = useState(price);
	const [newImageURL, setNewImageURL] = useState(imageURL);
	const [newAuthor, setNewAuthor] = useState(author.split(","));
	const [newGenre, setNewGenre] = useState(genre.split(","));
	const [showUpdate, setShowUpdate] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const openUpdate = () => setShowUpdate(true);
	const closeUpdate = () => setShowUpdate(false);
	const isLargeScreen = useMediaQuery({ query: "(min-width: 1000px)" });

	const archiveProduct = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}/archive`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
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
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				getAllProducts();
			});
	};

	const deleteProduct = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}/delete`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		})
			.then((res) => res.json())
			.then((res) => {
				getAllProducts();
			});
	};

	const updateProduct = (e, id) => {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}/update`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
				name: newName,
				imageURL: newImageURL,
				description: newDescription,
				price: newPrice,
				specifications: [
					{ key: "Author", value: newAuthor },
					{ key: "Genre", value: newGenre },
				],
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				console.log(localStorage.getItem("token"));
				if (res) {
					closeUpdate();

					Swal.fire({
						title: "Product successfully updated",
						icon: "success",
					});

					getAllProducts();
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
		if (
			newName !== "" &&
			newPrice > 0 &&
			newDescription !== "" &&
			newImageURL !== "" &&
			newAuthor !== "" &&
			newGenre !== ""
		) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [newName, newPrice, newDescription, newImageURL, newAuthor, newGenre]);

	return (
		<>
			{isLargeScreen ? (
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
					<td>{genre}</td>
					<td>{description}</td>
					<td>Php {price}</td>
					<td>{isActive ? "Available" : "Unavailable"}</td>
					<td>
						{isActive ? (
							<Button
								className="my-1"
								variant="danger"
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
							onClick={openUpdate}
						>
							Update
						</Button>
						{/* <Button
							className="my-1"
							variant="danger"
							style={{ width: "100px" }}
							onClick={() => deleteProduct(_id)}
						>
							Delete
						</Button> */}
					</td>
				</tr>
			) : (
				<Card className="p-3 my-4">
					<Image
						src={imageURL}
						style={{
							margin: "auto",
							width: "100px",
							height: "160px",
							objectFit: "cover",
						}}
					/>
					<Card.Text className="my-3">
						<h2>Name: {name}</h2>
					</Card.Text>
					<Card.Text>Author: {author}</Card.Text>
					<Card.Text>Genre: {genre}</Card.Text>
					<Card.Text>Description: {description}</Card.Text>
					<Card.Text>Price: Php {price}</Card.Text>
					<Card.Text>
						Availability: {isActive ? "Available" : "Unavailable"}
					</Card.Text>
					<div className="d-flex justify-content-center">
						{isActive ? (
							<Button
								className="my-1 mx-2"
								variant="danger"
								style={{ width: "100px" }}
								onClick={() => archiveProduct(_id)}
							>
								Archive
							</Button>
						) : (
							<Button
								className="my-1 mx-2"
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
							onClick={openUpdate}
						>
							Update
						</Button>
					</div>
				</Card>
			)}

			<Modal show={showUpdate} onHide={closeUpdate}>
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
							<Form.Text>
								{" "}
								(For multiple authors, please separate with
								comma)
							</Form.Text>
							<Form.Control
								type="text"
								value={newAuthor}
								onChange={(e) => setNewAuthor(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="productAuthor">
							<Form.Label>Author</Form.Label>
							<Form.Text>
								{" "}
								(For multiple genres, please separate with
								comma)
							</Form.Text>
							<Form.Control
								type="text"
								value={newGenre}
								onChange={(e) => setNewGenre(e.target.value)}
							/>
						</Form.Group>
						<Form.Group controlId="courseDescription">
							<Form.Label>Description:</Form.Label>
							<Form.Control
								type="text"
								value={newDescription}
								onChange={(e) =>
									setNewDescription(e.target.value)
								}
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
							disabled={isDisabled}
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
