export default async function ({ route, redirect, app }) {
	let modals = document.getElementsByClassName('uk-modal')
	if(modals.length > 0) {
		for(let modal of modals){
			modal.parentNode.removeChild(modal)
		}
	}
}
