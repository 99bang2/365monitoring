import Vue from 'vue'
import naver from 'vue-naver-maps';

Vue.use(naver, {
	clientID: '7yrt63cf83',
	useGovAPI: false, //공공 클라우드 API 사용 (선택)
	subModules:'' // 서브모듈 (선택)
  });
