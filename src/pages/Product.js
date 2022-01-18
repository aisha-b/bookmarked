import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export default function Product() {
	const location = useLocation();
	const { productId } = location.state;

	return <h1>{productId}</h1>;
}
