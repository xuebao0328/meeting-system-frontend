import request from '@/utils/request'

export function deleteMeeting(ids) {
    return request({
        url: `/api/co/meeting/${ids}`,
        method: "DELETE",
    });
}

export function updateMeeting(data) {
    return request({
        url: "/api/co/meeting",
        method: "PUT",
        data,
    });
}

export function getMeeting(id) {
    return request({
        url: `/api/co/meeting/${id}`,
        method: "GET",
    });
}

export function addNavigation(data) {
    return request({
        url: "/api/web/navigation",
        method: "POST",
        data,
    });
}

export function updateNavigation(data) {
    return request({
        url: "/api/web/navigation",
        method: "PUT",
        data,
    });
}

export function getDictType(dictId) {
    return request({
        url: `/api/system/dict/data/type/${dictId}`,
        method: "GET",
    });
}

export function getNavigationList(webId) {
    return request({
        url: `/api/web/navigation/list/${webId}`,
        method: "GET",
    });
}
export function getUserList(params) {
    return request({
        url: "/api/system/user/list/m",
        method: "GET",
        params,
    });
}
export function exportUserList() {
    return request({
        url: "/api/system/user/export/m",
        method: "POST",
    });
}
export function addMeeting(data) {
    return request({
        url: "/api/co/meeting",
        method: "POST",
        data,
    });
}
export function deletePage(ids) {
    return request({
        url: `/api/web/page/${ids}`,
        method: "DELETE",
    });
}

export function getWebPageList(webId, params) {
    return request({
        url: `/api/web/page/list/${webId}`,
        method: "GET",
        params,
    });
}

export function getMeetingList(params) {
    return request({
        url: "/api/co/meeting/list",
        method: "GET",
        params,
    });
}

export const login = (data) => {
    return request({
        url: "/api/login",
        method: "POST",
        data,
    });
};

export function getCodeImg() {
    return request({
        url: "/api/captchaImage",
        method: "GET",
    });
}

export function getUserInfo() {
    return request({
        url: "/api/getInfo",
        method: "GET",
    });
}

export function uploadFile(data) {
    return request({
        url: "/api/file/upload",
        method: "POST",
        data,
    });
}

export function getFileList(params) {
    return request({
        url: "/api/file/list",
        method: "GET",
        params,
    });
}

export function addWebPage(data) {
    return request({
        url: `/api/web/page`,
        method: "POST",
        data,
    });
}

export function updateWebPage(data) {
    return request({
        url: `/api/web/page`,
        method: "PUT",
        data,
    });
}

export function getUrl() {
    return request({
        url: `/api/web/uri`,
        method: "GET",
    });
}

export function getPageList(webId) {
    return request({
        url: `/api/web/page/list/${webId}`,
        method: "GET",
    });
}

export function getWebPage(id) {
    return request({
        url: `/api/web/page/${id}`,
        method: "GET",
    });
}

export function updateCommon(data) {
    return request({
        url: `/api/co/common`,
        method: "PUT",
        data,
    });
}
export function addCommon(data) {
    return request({
        url: `/api/co/common`,
        method: "POST",
        data,
    });
}
export function getCommonList(webId) {
    return request({
        url: `/api/co/common/list/${webId}`,
        method: "GET",
    });
}

export function deleteCommon(ids) {
    return request({
        url: `/api/co/common/${ids}`,
        method: "DELETE",
    });
}

export function getCommon(id) {
    return request({
        url: `/api/co/common/${id}`,
        method: "GET",
    });
}

export function getGlobalCommon(webid, type) {
    return request({
        url: `/api/co/common`,
        method: "GET",
        params: {
            webId: webid,
            type
        }
    });
}

export function saveOrUpdate(data) {
    return request({
        url: `/api/co/common/saveOrUpdate`,
        method: "POST",
        data,
    });
}

export function deleteFile(ids) {
    return request({
        url: `/api/file/${ids}`,
        method: "DELETE",
    });
}

export function copyMeeting(id) {
    return request({
        url: `/api/co/meeting/copy/${id}`,
        method: "GET",
    });
}