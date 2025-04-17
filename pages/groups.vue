<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-2-3@l">
					<List />
				</div>
				<div class="uk-width-1-3@l">
					<Form />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import List from "@/components/group/List"
import Form from "@/components/group/Form"
export default {
	middleware: ['auth'],
	components: {
		List,
		Form,
	}
}
</script>
