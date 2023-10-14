// 和文章相关的api
import request from "@/utils/request.js";

// 按需导出一个方法getArticleListAPI 
export const getAllTags = function() {
    return request.get("/randomtags");
}


export const getAllPath = function(pic) {
    console.log("picture=====>" + pic);
    var path = '';
    request.post("/getpath", {
        picture: pic
    }).then((res) => {
        path = res.data;
        console.log("oath!!" + path);
        return path;
    });
    // const { data: res } = await request({
    //     method: "POST",
    //     url: "/getpath",
    // // });
    // return res.data;
}