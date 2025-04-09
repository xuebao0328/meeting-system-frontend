const state = {
    currentPage: null,
    pageElements: [],
    pageConfig: {
        width: 1200,
        height: 800,
        backgroundColor: "#ffffff",
        showGrid: true,
        gridSize: 20,
        gridColor: "rgba(0,0,0,0.1)",
        title: "",
        url: "",
        showWebsiteNavigation: false,
        showWebFooter: false,
    },
    selectedElement: null,
    pageList: [],
    navigatorId: "",
    footerId: "",
};

const mutations = {
    SET_NAVIGATION_ID(state, id) {
        state.navigationId = id;
    },
    SET_FOOTER_ID(state, id) {
        state.footerId = id;
    },
    SET_CURRENT_PAGE(state, page) {
        if (page) {
            state.currentPage = {
                id: page.id,
                title: page.title,
                pageContext: page.pageContext,
                pageHtml: page.pageHtml,
                webId: page.webId,
                url: page.url,
            };
        } else {
            state.currentPage = null;
        }
    },
    SET_PAGE_ELEMENTS(state, elements) {
        console.debug(elements)
        state.pageElements = elements;
    },
    SET_PAGE_CONFIG(state, config) {
        state.pageConfig = config;
    },
    SET_SELECTED_ELEMENT(state, element) {
        state.selectedElement = element;
    },
    SET_PAGE_LIST(state, list) {
        state.pageList = list;
    },
};

const actions = {
    setFooterId({ commit }, value) {
        commit('SET_FOOTER_ID', value)
    },
    setNavigationId({ commit }, value) {
        commit('SET_NAVIGATION_ID', value)
    },
    setCurrentPage({ commit }, page) {
        console.debug("setCurrentPage", page);
        commit("SET_CURRENT_PAGE", page);
    },
    setPageElements({ commit }, elements) {
        console.debug('setPageElements', elements)
        commit("SET_PAGE_ELEMENTS", elements);
    },
    setPageConfig({ commit }, config) {
        console.debug("setPageConfig", config);
        commit("SET_PAGE_CONFIG", config);
    },
    setSelectedElement({ commit }, element) {
        console.debug("setSelectedElement", element);
        commit("SET_SELECTED_ELEMENT", element);
    },
    setPageList({ commit }, list) {
        console.debug("setPageList", list);
        commit("SET_PAGE_LIST", list);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};