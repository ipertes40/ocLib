// 和文章相关的api
import request from "@/utils/request.js";

// 按需导出一个方法getArticleListAPI 
// square的list
export const submitInvitation = function(newInvitation) {
    return request.post("/oc/" + _page + "/" + _limit);
}