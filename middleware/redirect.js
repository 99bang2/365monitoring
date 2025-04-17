export default function ({ route, redirect, app }) {
	if (route.path === '/') {
		if(app.$auth.user) {
			redirect('/devices')
		}else {
			redirect('/login')
		}
	}
}
