import { AlertCircle } from "lucide-react";
import React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UploadError = () => {
	return (
		<div>
			{" "}
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					No file detected, Please Upload or Write a Query a file to continue
				</AlertDescription>
			</Alert>
		</div>
	);
};

export default UploadError;
