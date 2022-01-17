// Thanks to https://stackoverflow.com/a/1349426/9826177
export function makeId(length: number) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

// https://gist.github.com/codeguy/6684588#gistcomment-2759673
export function makeSlug(str: string) {
	str = str.trim();
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
	const to = "aaaaaaeeeeiiiioooouuuunc------";

	for (let i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
	}

	return str
		.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
		.replace(/\s+/g, "-") // collapse whitespace and replace by -
		.replace(/-+/g, "-") // collapse dashes
		.replace(/^-+/, "") // trim - from start of text
		.replace(/-+$/, "") // trim - from end of text
		.replace(/-/g, "_"); // Reddit uses the _ as a seperator
}
