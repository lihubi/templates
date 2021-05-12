module.exports = async (req, res) => {
    let {_id} = req.body;
    const cases = global.dbHelper.getModel('case');
    let v = await new utils.DbOperate(cases, {_id}).delete();
    if (v.code == 200) {
        res.json(v)
    } else {
        console.log(`${common.timestampToTime(Date.parse(new Date()))}, 删除失败`);
        res.json({
            msg: '服务异常',
            code: 500
        })
    }
}