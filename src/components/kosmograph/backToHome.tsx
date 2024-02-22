import Link from "next/link";
import React from "react";

const BackToHome = () => {
	return (
		<Link
			href="/kosmograph"
			className="text-sm opacity-80 dark:text-muted hover:opacity-90"
		>
			{"<-back to home"}
		</Link>
	);
};

export default BackToHome;
