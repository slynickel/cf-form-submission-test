/**
 * POST /api/submit
 */
 export async function onRequestPost({ request }) {
	let pk = "";
	try {
		let input = await request.formData();

		// Convert FormData to JSON
		// NOTE: Allows mutliple values per key
		let tmp, output, email = {};
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
			pk = "noemail"
		}

		let pretty = JSON.stringify(output, null, 2);

		try {
			await CF_FORMDATA.put(pk,output)
		} catch (err) {
			return new Response('Error writing submission', {status: 400});
		}

		return new Response(pretty, {
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			}
		});
	} catch (err) {
		return new Response('Error parsing JSON content', { status: 400 });
	}
}