import { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import UserContext from "../UserContext";

export default function Logout() {
	const { unsetUser } = useContext(UserContext);

	useEffect(() => {
		unsetUser();
	}, []);

	return <Redirect to="/login" />;
}