import Header from "@/components/kosmograph/header";
import React from "react";

const QueryLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<Header />
			{children}
		</div>
	);
};

export default QueryLayout;
