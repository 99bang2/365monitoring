<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-3-5@l">
					<Chart />
				</div>
				<div class="uk-width-2-5@l">
					<List />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Chart from "@/components/measures/Chart"
import List from "@/components/measures/List"
export default {
	middleware: ['auth'],
	components: {
		List,
		Chart
	}
}
</script>



<style scoped lang="scss">

</style>
