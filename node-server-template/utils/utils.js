
/*  @des mongodb 数据库curd 封装
 *  @params collection 集合，即所用查询的表名，
 *  @params params  参数,
 *  @params updateData  更新方法中要更新的数据,
 *  @params num  查询数据的数量,
 *  @method query  不分页查询
 *  @method create 新增
 *  @method delete 删除
 *  @method doErr 统一处理错误信息
 *  @method doSuccess 统一处理成功信息
 *  @return 
*/

class DbOperate {
    constructor(collection, params, updateData, num, sort) {
        this.collection = collection;
        this.params = params;
        this.updateData = updateData;
        this.num = num;
        this.sort = sort;
    }

    doErr(err) {
        let errMsg = {
            code: 500,
            msg: "服务异常",
            result: err
        }

        return errMsg;
    }

    doSuccess(successMsg, res) {
        let sucMsg = {
            code: 200,
            msg: successMsg,
            result: res
        }

        return sucMsg;
    }

    async query() {
        let result = await this.collection.find(this.params).limit(this.num).sort(this.sort);


        try {
            return this.doSuccess("查询成功", result);
        }
        catch (err) {
            return this.doErr(err);
        }
    }

    async create() {
        let result = await this.collection.create(this.params);

        try {
            return this.doSuccess("创建成功", result);
        }
        catch (err) {
            return this.doErr(err);
        }
    }

    async delete() {
        let result = await this.collection.remove(this.params);
        try {
            return this.doSuccess("删除成功", result);
        }
        catch (err) {
            return this.doErr(err);
        }
    }

    async update() {
        let result = await this.collection.update(this.params, this.updateData);

        try {
            return this.doSuccess("更新成功", result);
        }
        catch (err) {
            return this.doErr(err);
        }
    }
}



/*  @des ：mongodb 数据库分页 封装
 *  @params: parameter[0] 集合，即所用查询的表名，  parameter[1] 参数   parameter[2] 第几页    
 *  @params: parameter[3] 一页多少条 parameter[4] 排序条件 parameter[5] 回调
 *  @return   
*/


async function pageQuery(...parameter) {

    var collection = parameter[0],

        params = parameter[1],

        index = parameter[2],

        rows = parameter[3],

        sort = parameter[4],

        callback = parameter[5];

    let pagesize;

    var callback = callback || function () { };

    //参数不存在，即赋值{}，查询所有
    var params = !params ? {} : params;


    await collection.countDocuments(params, (err, doc) => {
        pagesize = doc;
    })

    await collection.find(params, (err, doc) => {
        if (err) {
            var data = {
                code: 500,
                msg: "查询失败",
                result: err
            }
        } else {
            let n = Math.ceil(pagesize / rows);  //总共多少页
            var data = {
                code: 200,
                msg: "查询成功",
                totalItem: pagesize, //总条数
                totalPage: n, //总共多少页
                rows: rows, //每页显示多少条
                index: index,//当前页数
                result: doc
            }
        }

        callback({
            result: data
        });

    }).sort(sort).skip((index - 1) * rows).limit(rows);
}


module.exports = {
    DbOperate: DbOperate,
    pageQuery: pageQuery,
}


//调用方式  mongodb

/*
  不分页查询

 */
 //例如 utils.DbOperate(collection, {id:1}).query().then((v)=>{})

/*
  删除
 */

 //例如 utils.DbOperate(collection, {id:1} ).delete().then((v)=>{})


/*
  新增
 */

//例如 utils.DbOperate(collection, {title : 1}).create().then((v)=>{})


/*
  更新
 */
//例如 utils.DbOperate(collection, {id:1} , {title : 1}).update().then((v)=>{})



/*
   分页查询
 */
//例如 utils.pageQuery(enforcementDetail,null ,{index : 1 , rows : 10}, {time: -1},(result)=>{}) false 代表查询所有