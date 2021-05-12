module.exports = async (req, res) => {
    let { page, rows, query } = req.body;
    const cases = global.dbHelper.getModel('case');
    let v = await utils.pageQuery(cases, query, page, rows,null, (data) => {
        console.log(data);
        res.send(data)
    });
}