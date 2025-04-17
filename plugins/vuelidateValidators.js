import {helpers} from 'vuelidate/lib/validators'

const customValidators = {}

customValidators.minCheck = (min) => helpers.withParams(
	{type: 'minCheck', min: min},
	(value) => !helpers.req(value) || value.length >= min
)
customValidators.maxCheck = (max) => helpers.withParams(
	{type: 'maxCheck', max: max},
	(value) => !helpers.req(value) || value.length <= max
)
customValidators.minMaxCheck = (min, max) => helpers.withParams(
	{type: 'minMaxCheck', min: min, max: max},
	(value) => !helpers.req(value) || (min <= value.length && value.length <= max)
)
customValidators.minMaxCheck = (min, max) => helpers.withParams(
	{type: 'minMaxCheck', min: min, max: max},
	(value) => !helpers.req(value) || (min <= value.length && value.length <= max)
)
customValidators.idFormatCheck = () => helpers.regex(
	'idFormatCheck',
	/^[a-z0-9_-]{3,20}$/i
)
customValidators.passwordFormatCheck = () => helpers.regex(
	'passwordFormatCheck',
	/^[a-zA-Z0-9@$!%*#?&+_]{4,20}$/i
)
customValidators.phoneFormatCheck = () => helpers.regex(
	'phoneFormatCheck',
	/^[0-9|\*]+$/i
)
export default customValidators
