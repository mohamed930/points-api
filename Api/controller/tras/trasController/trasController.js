const trasViewModel = require('../trasViewModel/trasViewModel');

const trasviewmodel = new trasViewModel();

const methods = require('../../../Tools/methods');

exports.GetTrass = async (req,res) => { 
    const token = req.headers.authorization.split(" ")[1];
    
    const points = await trasviewmodel.getTrass(token);

    methods.printResult(res,points);
};