const Convert = {}

Convert.convertJson = function (json, type) {
	let dataArray = []
	Object.entries(json).map(function (obj) {
		let data = {}
		if(type=== "group"){
			data.id = obj[1].uid
			data.text= obj[1].name
		}else  {
			data.value = obj[0]
			data.name = obj[1]
		}
		dataArray.push(data)
	})
	return dataArray
}

export default Convert
