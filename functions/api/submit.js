const setRSVP = (key, data) => context.env.CF_FORMDATA.put(key,data);

/**
 * POST /api/submit
 */
 export async function onRequestPost({ request }) {
	let pk;
	let pretty;
	// try {
	let input = await request.formData();

	// Convert FormData to JSON
	// NOTE: Allows multiple values per key
	let tmp, output = {};
	for (let [key, value] of input) {
		tmp = output[key];
		if (tmp === undefined) {
			output[key] = value;
		} else {
			output[key] = [].concat(tmp, value);
		}
		tmp = output["email"];
		if (tmp != undefined) {
			pk = tmp
		}
	}

	if (pk === undefined) {
		// TODO error handling
		pk = "noemail";
	}

	pretty = JSON.stringify(output, null, 2);

	//} catch (err) {
	//	return new Response('Error parsing JSON content', { status: 400 });
	//}

	try {
		await setRSVP(pk,output);
	} catch (err) {
		return new Response('Error writing submission' + err, {status: 400});
	}

	return new Response(pretty, {
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		}
	});
}