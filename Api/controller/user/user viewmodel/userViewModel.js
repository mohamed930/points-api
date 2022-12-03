const { PrismaClient } = require("@prisma/client");

const { users } = new PrismaClient();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const methods = require('../../../Tools/methods.js');

class userViewModel {

    async login(username,password) {
        const flag = this._validateEmail(username);

        if (flag) {
            // login with email.
           const result = await this._loginOperation({email: username},password);
           return result;
        }
        else {
            // login with username
            const result = await this._loginOperation({username: username},password);
            return result;
        }
    }

    async CreateUser(data) {
        const falg = await this._validateUser(data);

        if (falg) {
            const response = {
                status: -1,
                message: 'اسم المستخدم او البريد الالكترونى مستخدم بالفعل'
            }

            return response;
        }
        else {
            const result = await this._CreateUserOperation(data);

            return result;
        }
    }

    async updatePassword(id,password) {

        const hashed = bcrypt.hashSync(password,10);

        const response = await users.update({
            data: {
                password: hashed
            },
            where: {
                id: parseInt(id) 
            }
        }).catch(err => {
            return methods.showErrorMessage(err);
        });

        if (response.status == '-1') {
            return response;
        }
        else {
            const result = {
                status: '1',
                message: 'تم تعديل كلمة المرور بنجاح'
            }

            return result;
        }
    }

    _validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    async _validateUser(data) {
        const condition = await users.findMany({
            where: {
                OR: [
                    {
                        email: data["email"]
                    },
                    {
                        username: data["username"]
                    }
                ]
            }
        }).catch (err => {
            return methods.showErrorMessage(err);
        });

        if (condition.status == '-1') {
            return true
        }
        else {
            if (condition.length >= 1) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    async _loginOperation(condition,password) {
        const user = await users.findMany({
            select: {
                id: true,
                Fname: true,
                Lname: true,
                username: true,
                email: true,
                password: true,
                distric: {
                    select: {
                        name: true
                    }
                }
            },
            where: condition

        }).catch(err => {
            return methods.showErrorMessage(err);
        });

        if (user.status == '-1') {
            return user;
        }   
        else {
            if (user.length == 1) {
                const result = await bcrypt.compare(password, user[0].password);
    
                if (result) {
                    const tocken = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0].id,
                            name: user[0].Fname + user[0].Lname,
                            distric: user[0].distric.name
                        },
                        process.env.JWT_Security,
                        {
                            expiresIn: "3h"
                        }
                    );
    
                    // message.
                    const message = {
                        status: '1',
                        message: 'تم تسجيل دخول النجاح',
                        user: {
                            infromation: {
                                FName: user[0].Fname,
                                LName: user[0].Lname,
                                email: user[0].email,
                                disctricName: user[0].distric.name
                            },
                            loginInfromation: {
                                username: user[0].username,
                                token: tocken
                            }
                        }
                    };
    
                    return message;
                }
                else {
                    return {
                        status: '-1',
                        message: 'اسم المستخدم او الرقم السرى ليسوا صحيحين'
                    }
                }
            }
            else {
                return {
                    status: '-1',
                    message: 'اسم المستخدم او الرقم السرى ليسوا صحيحين'
                }
            }
        }    
        
    }

    async _CreateUserOperation(data) {

        const hash = bcrypt.hashSync(data["password"], 10);

        const u = await users.create({
            data: {
                Fname: data["FName"],
                Lname: data["LName"],
                username: data["username"],
                email: data["email"],
                password: hash,
                districeName: data["distcno"]
            }
        }).catch(err => {
            return  methods.showErrorMessage(err);
        });

        if (u.status  == "-1") {
            return u;
        }
        else {
            const result = {
                status: '1',
                message: "تم انشاء المستخدم بنجاح"
            };

            return result;
        }
    }
}

module.exports = userViewModel;