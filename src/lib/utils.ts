import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function getColorBetween(scale: number, total: number): string {
	// Ensure scale is within the expected range [1, total]
	total = total / 3;
	scale = Math.min(Math.max(scale, 1), total);

	// Start and end colors in RGB
	const startColor = { r: 0x54, g: 0x6c, b: 0xb5 };
	const endColor = { r: 0xee, g: 0x68, b: 0xb4 };

	// Calculate the ratio (0 for startColor, 1 for endColor)
	const ratio = scale / total; // Adjust ratio calculation based on total

	// Linearly interpolate between the start and end colors
	const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
	const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
	const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);

	// Convert RGB to Hex, keeping alpha as CC
	const hexColor = `#${r.toString(16).padStart(2, "0")}${g
		.toString(16)
		.padStart(2, "0")}${b.toString(16).padStart(2, "0")}CC`;

	return hexColor;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
