import { AlertCircle } from "lucide-react";
import React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UploadErrorProps {
	message?: string;
}

const UploadError: React.FC<UploadErrorProps> = ({ message }) => {
	const defaultMessage = "No file detected, Please Upload or Write a Query a file to continue";
	return (
		<div>
			{" "}
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					{message || defaultMessage}
				</AlertDescription>
			</Alert>
		</div>
	);
};

export default UploadError;
