"use client";

import clsx from "clsx";
import {
	ArrowLeftToLine,
	ArrowRightFromLine,
	Minimize,
	MousePointerSquareDashed,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import { DisplayGraph } from "./graphDemo";

export default function Sidebar() {
	const [open, setOpen] = React.useState(false);
	const { theme: theme } = useTheme();
	console.log(theme);
	return (
		<div className="flex">
			<div
				className={clsx(
					"flex flex-col h-screen p-1 bg-gray-100 dark:bg-brand-sidebar text-brand-dark dark:text-white shadow z-10 transition-width transition-scale duration-300 ease-in-out",
					{
						"transform scale-x-0 w-0": open,
						"transform scale-x-100 w-60": !open,
					}
				)}
			>
				<div className="space-y-3 p-2">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold ">Dashboard</h2>
					</div>
					<div className="relative">
						<span className="absolute inset-y-0 left-0 flex items-center py-4">
							<button
								type="submit"
								className="p-2 focus:outline-none focus:ring"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
						</span>
						<input
							type="search"
							name="Search"
							placeholder="Search..."
							className="w-full py-2 pl-10 text-sm rounded-md focus:outline-none"
						/>
					</div>
					<div className="flex-1">
						<ul className="pt-2 pb-4 space-y-1 text-sm">
							<li className="rounded-sm">
								<Link
									href="/"
									className="flex items-center p-2 space-x-3 rounded-md"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6 "
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
										/>
									</svg>
									<span>Home</span>
								</Link>
							</li>
							<li className="rounded-sm">
								<Link
									href="/mails"
									className="flex items-center p-2 space-x-3 rounded-md"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6 "
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
										/>
									</svg>
									<span className="">Mails</span>
								</Link>
							</li>
							<li className="rounded-sm">
								<Link
									href="/products"
									className="flex items-center p-2 space-x-3 rounded-md"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6 "
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
										/>
									</svg>
									<span className="">Products</span>
								</Link>
							</li>
							<li className="rounded-sm">
								<Link
									href="/settings"
									className="flex items-center p-2 space-x-3 rounded-md"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6 "
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<span className="">Settings</span>
								</Link>
							</li>
							<li className="rounded-sm">
								<Link
									href="/logout"
									className="flex items-center p-2 space-x-3 rounded-md"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="w-6 h-6 "
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
										/>
									</svg>
									<span className="">Logout</span>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div>
				{/* <div className="relative h-screen z-30">
					<div className="absolute top-0 left-0 p-4 flex flex-col space-y-2 z-40">
						{" "}
						<Button
							onClick={() => setOpen(!open)}
							variant="ghost"
							size="sm"
							className="bg-brand-sidebarButtons"
						>
							{!open ? (
								<ArrowLeftToLine className="w-4 h-4" />
							) : (
								<ArrowRightFromLine className="w-4 h-4" />
							)}
						</Button>
						<Button onClick={() => setOpen(!open)} variant="ghost" size="sm">
							<MousePointerSquareDashed className="w-4 h-4" />
						</Button>
						<Button onClick={() => setOpen(!open)} variant="ghost" size="sm">
							<Minimize className="w-4 h-4" />
						</Button>
					</div>
					<div>
						<DisplayGraph />
					</div>
				</div> */}

				<div className="flex-1 relative">
					{" "}
					<div className="absolute top-0 left-0 p-4 flex flex-col space-y-2 z-40">
						<Button onClick={() => setOpen(!open)} variant="ghost" size="sm">
							{!open ? (
								<ArrowLeftToLine className="w-4 h-4" />
							) : (
								<ArrowRightFromLine className="w-4 h-4" />
							)}
						</Button>
						<Button onClick={() => setOpen(!open)} variant="ghost" size="sm">
							<MousePointerSquareDashed className="w-4 h-4" />
						</Button>
						<Button onClick={() => setOpen(!open)} variant="ghost" size="sm">
							<Minimize className="w-4 h-4" />
						</Button>
					</div>
					{/* Graph component */}
					<div className="absolute inset-0">
						<DisplayGraph />
					</div>
				</div>
			</div>
		</div>
	);
}
