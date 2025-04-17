import Vue from "vue"
export default Vue.extend({
    data: function () {
        return {
			hubInfo: null,
			driverInfo: null,
			truckInfo: null,
        }
    },
    mounted() {
		if(this.params.data) {
			this.hubInfo = this.params.data.hub ? this.params.data.hub.name : '허브 미지정'
			this.truckInfo = this.params.data.truck ? `${this.params.data.truck.name}(${this.params.data.truck.phone})` : '간선기사 미지정'
			this.driverInfo = this.params.data.driver ? `${this.params.data.driver.name}(${this.params.data.driver.phone})` : '배송기사 미지정'
		}
    },
	methods: {
		openHubForm() {
			this.params.context.componentParent.openHubForm(this.params.data)
		}
	},
	template: `
		<div>
			<u style="color:cornflowerblue;cursor: pointer" v-if="hubInfo" @click="openHubForm">
				{{ hubInfo }}
				<br/>
				{{ truckInfo }}
				<br/>
				{{ driverInfo }}
			</u>
		</div>
	`,
})




