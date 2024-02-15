import Link from "next/link";
import React from "react";

const Header = () => {
	return (
		<Link href="/">
			<div className="absolute top-0 left-0 font-bold text-3xl m-3">
				Kosmograph
			</div>
		</Link>
	);
};

export default Header;
