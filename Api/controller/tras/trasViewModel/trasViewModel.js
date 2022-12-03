const { PrismaClient } = require("@prisma/client");

const { TRAS } = new PrismaClient();

const jwt = require('jsonwebtoken');

const methods = require('../../../Tools/methods.js');

class trasViewModel {

    async getTrass (token) {
        var decoded = jwt.verify(token, process.env.JWT_Security);
        const districName =  decoded.distric;

        console.log(districName)

        const tras = await TRAS.findMany({
            where: {
                destrict: districName
            }
        }).catch(err => {
            return methods.showErrorMessage(err);
        });

        if (tras.status == '-1') {
            return tras;
        }
        else {
            const response = {
                status: 1,
                message: 'tras points',
                trass: tras.map (tag => {
                    const notes = tag.notes == " " ? "لا يوجد" : tag.notes
                    const images = [];
                    var imgs = [tag.pic1,tag.pic2,tag.pic3,tag.pic4];
                    
                    for (var i=0;i<imgs.length;i++) {
                        if (imgs[i] != " ") {
                            images.push(imgs[i]);
                        }
                    }

                    return {
                            info: {
                                id: tag.OBJECTID,
                                ownerName: tag.owner,
                                occupers: tag.occupers,
                                build_type: tag.build_type,
                                area: tag.area,
                                rows_no: tag.rows_no,
                            },
                            location: {
                                destrict: tag.destrict,
                                address: tag.address,
                                lati: tag.y,
                                long: tag.x
                            },
                            trasData: {
                                build_date: tag.build_date,
                                preview_date: tag.preview_date,
                                originqal_use: tag.originqal_use,
                                now_use: tag.now_use,
                                is_it_tras: tag.is_it_tras,
                                reasons: tag.reasons,
                                notes: notes,
                                infra_status: tag.infra_status
                            },
                            gallery: images
                    }
                })
            }

            return response;
        }
        
    }
}

module.exports = trasViewModel;