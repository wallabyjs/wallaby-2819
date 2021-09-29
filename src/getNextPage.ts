const fetch = require("node-fetch");

export async function getNextPage(nextPageUrl) {
	const headers = {
		Authorization: process.env.BEARER_TOKEN || ""
	};
	if (!nextPageUrl) {
		throw new Error("Missing page Url");
	}
	console.log("1️⃣ fetching: ", nextPageUrl);	

	let resp;
	try {
		resp= await fetch(nextPageUrl, {
			headers: headers
		});
	} catch (err) {
		console.log("🚀 err", err);
		throw err;
	}
	if (resp) {
		const body = await resp.text();

		return body;
	}

	return resp;
}