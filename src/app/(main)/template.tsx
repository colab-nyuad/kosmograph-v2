import { ModeToggle } from "@/components/global/mode-toggle";
import React from "react";

const HomePageLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="h-screen">
			<ModeToggle />
			{children}
		</main>
	);
};

export default HomePageLayout;
