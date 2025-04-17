<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-1-3@l">
					<List />
				</div>
				<div class="uk-width-1-3@l">
					<Form />
				</div>
				<div class="uk-width-1-3@l">
					<ModulerList/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import List from "@/components/device/List"
import Form from "@/components/device/Form"
import ModulerList from "@/components/device/ModulerList.vue";
export default {
	middleware: ['auth'],
	components: {
		ModulerList,
		List,
		Form,
	}
}
</script>
