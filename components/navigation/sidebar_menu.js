import { scHelpers } from "~/assets/js/utils";
const { uniqueID } = scHelpers;

export const menuEntries = [
	{
		id: uniqueID(),
		title: "Devices",
		icon: "mdi mdi-devices",
		page: "/devices",
	},
	{
		id: uniqueID(),
		title: "Groups",
		icon: "mdi mdi-account-group",
		page: "/groups",
	},
	{
		id: uniqueID(),
		title: "Recipients",
		icon: "mdi mdi-comment-account",
		page: "/recipients",
	},
	{
		id: uniqueID(),
		title: "Measures",
		icon: "mdi mdi-chart-timeline-variant",
		page: "/measures"
	}
];
