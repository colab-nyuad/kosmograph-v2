import React from "react";

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
	return <main className="h-screen">{children}</main>;
};

export default HomePageLayout;
