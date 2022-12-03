const userViewModel = require('../user viewmodel/userViewModel');
const methods = require('../../../Tools/methods.js')

const userviemodel = new userViewModel();


exports.login = async (req,res) => {
    if (typeof req.query.Email !== 'undefined' && typeof req.query.Password !== 'undefined') {
        const email = req.query.Email;
        const password = req.query.Password;
       
        const result = await userviemodel.login(email,password);

        methods.printResult(res,result);
    }
    else {
        const result = {
            status: -1,
            message: 'غير موجود'
        }

        methods.printResult(res,result);
    }
}

exports.createUser = async (req,res) => {
    const data  =  {
        FName: req.body.FName,
        LName: req.body.LName,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        distcno: parseInt(req.body.distcno)
    };

    const result = await userviemodel.CreateUser(data);

    methods.printResult(res,result);
}

exports.updatePassword = async (req,res) => {
    const id = req.params.Id;
    const password = req.body.password;

    const result = await userviemodel.updatePassword(id,password);

    methods.printResult(res,result);
}