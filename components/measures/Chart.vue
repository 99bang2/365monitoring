<template>
	<div>
		<ScCard>
			<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
				<div class="uk-flex-1">
					<slot><i class="mdi mdi-chart-timeline-variant"/>온도그래프</slot>
				</div>
			</ScCardHeader>
			<ScCardBody>
				<div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
					<BillboardChart
						v-if="appMounted"
						:options="formattedChartData"
						class="sc-chart"
						@created="measureChartLoaded = true"
					></BillboardChart>
					<div v-if="!measureChartLoaded" class="sc-chart">
						<div class="uk-flex uk-flex-middle uk-height-1-1 uk-flex-center">
							<div class="sc-spinner"></div>
						</div>
					</div>
				</div>
			</ScCardBody>
		</ScCard>
	</div>
</template>
<script>
import ScCard from "~/components/card/components/Card.vue";
import BillboardChart from "~/components/billboard-charts/Chart.vue";
import {scColors} from "assets/js/utils";
import moment from "moment";

export default {
	components: {BillboardChart, ScCard},
	data() {
		return {
			appMounted: false,
			measureChartLoaded: false,
			measureChartOptions: {
				data: {
					x: "x",
					columns: [],
					types: {
						temp: "spline"
					},
					colors: {
						temp: scColors.multi[0]
					}
				},
				point: {
					r:1.5,
				},
				axis: {
					x: {
						type: "timeseries",
						tick: {
							fit: true,
							format: "%Y-%m-%d %H:%M"
						}
					},
					y: {
						show: true, // 온도 값이 표시되도록 y축을 표시
						label: {
							text: "Temperature (°C)", // y축 레이블 추가
							position: "outer-middle"
						}
					}
				},
				grid: {
					x: {
						show: false
					},
					y: {
						show: true
					}
				},
				tooltip: {
					format: {
						title(x) {
							return moment(x).format('YYYY-MM-DD HH:mm:ss');
						},
						value(value, ratio, id) {
							let result = parseFloat(value.toFixed(2));
							return `${result}°C`; // 온도를 '숫자°C' 형식으로 표시
						}
					}
				},
				transition: {
					duration: 0
				},
				legend: {
					show: false
				}
			},
			rawData: null,
		}
	},
	computed: {
		formattedChartData() {
			const now = new Date();
			const oneHoursAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);

			// x축 값: 1분 간격으로 생성
			const xValues = [];
			for (let time = new Date(oneHoursAgo); time <= now; time.setMinutes(time.getMinutes() + 1)) {
				xValues.push(new Date(time)); // 1분 간격으로 값 추가
			}
			// x축 값에 맞는 y 데이터 매핑
			const moduleData = this.rawData.data.map(module => {
				const filteredValues = module.values.slice(-xValues.length); // x축에 맞는 데이터 필터링
				return {
					name: module.modulerName,
					values: filteredValues
				};
			});
			const columns = [
				['x', ...xValues],
				...moduleData.map(module => [module.name, ...module.values])
			];
			const colors = {};
			moduleData.forEach((module, index) => {
				colors[module.name] = scColors.multi[index % scColors.multi.length];
			});

			return {
				...this.measureChartOptions,
				data: {
					...this.measureChartOptions.data,
					columns,
					types: moduleData.reduce((acc, module) => {
						acc[module.name] = "spline"; // 각 모듈의 데이터는 spline 타입으로
						return acc;
					}, {}),
					colors
				},
				axis: {
					...this.measureChartOptions.axis,
					x: {
						type: "timeseries",
						tick: {
							fit: false,
							count: xValues.length, // x축 표시 간격
							format: "%H:%M" // 시간 형식
						}
					}
				}
			};
		}
	},
	async mounted() {
		await this.fetchData()
		setTimeout(() => {
			this.appMounted = true;
			console.log(this);
		}, 200);
	},
	methods: {
		async fetchData() {
			let res = await this.$axios.$get(this.config.apiUrl + '/measures/chart')
			this.rawData = {...res.data}
		}
	}
}
</script>


<style scoped lang="scss">

</style>
