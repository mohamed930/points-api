exports.printResult = (res,result) => {
/* if (typeof result !== 'undefined')  {
    
    }
    else {
        res.status(404).json({
            message: 'unkown',
            result: result
        });
    }*/

    if (result.status == '-1') {
        res.status(500).json(result)
    }
    else if (result.status == '1') {
        res.status(200).json(result)
    }
};

exports.showErrorMessage = (err) => {
    return {
        status: -1,
        message: err.message
    }
}