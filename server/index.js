const screenshot = require('screenshot-desktop')
const fs = require('fs');
const sharp = require('sharp');
const tesseract = require('node-tesseract-ocr')
var randomstring = require("randomstring");
const open = require('open');
let countDown = 3;
let cropWidth = 90;
let cropHeight = 50;
var token = 'SBak__ZJWg:APA91bHAhhnVec_W_UxTuN9o_AOFV3XhTWlip2G0OnQwgDN4HSGyoB6HAnvxgaIYxeUxeOGkyH34qHhXU1X1b04lTmBMj0bIjM9lhOOCtYTOLh4EKwh63L9fieYHB7upILwykTc8zoh4';

var FCM = require('fcm-push');

var serverKey = 'AAAA4ErItao:APA91bHYKmm5PvYVZCqrTrKPdkJlsz_PMbDlDuQCSYDv_EJ-kSEiFstYYkRo31OESVdWxmijZ0j4RZEp2VlD8eopQuIyMJBlRdAiTyFZmya1auDBe1ZzCzt2pVz6FCBVgsIcNwuIC1Hc';
var fcm = new FCM(serverKey);
// setTimeout(() => {
//     setTimeout(() => {
//         setTimeout(() => {

//             console.log(1)
//         }, 1000)
//         console.log(2)
//     }, 1000)
//     console.log(3)
// }, 1000)




// function setCountDown(nm, cb) {
//     let num = nm;
//     var timer = setInterval(() => {
//         console.log(num)
//         if (num <= 1) {
//             clearInterval(timer);
//             cb()
//         }
//         num--;
//     }, 1000)
// }

let oldOne = null;

const config = {
    lang: 'eng',
    oem: 1,
    psm: 3
}

function AI() {
    let rnstr = randomstring.generate();
    fs.unlink('./croppedtest.png', (err) => {
        screenshot().then((img) => {
            fs.writeFile("./" + rnstr + " .png", img, function (err) {
                if (err) throw err;
                sharp('./' + rnstr + ' .png').extract({ width: cropWidth, height: cropHeight, left: 560, top: 730 }).toFile('./croppedtest.png')
                    .then(function (new_file_info) {
                        ///console.log("Image cropped and saved");
                        // (async () => {
                        //     await open('./croppedtest.png', { wait: true })
                        // })()
                        tesseract
                            .recognize('./croppedtest.png', config)
                            .then(text => {
                                console.log(text)
                                if (oldOne !== text) {
                                    if (!text.includes('ag')) {
                                        sendFcm()
                                        oldOne = text;
                                    }
                                }
                                oldOne = text;

                                fs.unlink('./' + rnstr + ' .png', (err) => {
                                })
                            })
                            .catch(err => {
                                console.log('error:', err)
                            })
                    })
                    .catch(function (err) {
                        console.log(err);
                    });


            })
        }).catch((err) => {

        })
    });
}

setInterval(() => AI(), 5000)






function sendFcm() {

    var message = {
        to: token, // required fill with device token or topics
        collapse_key: 'your_collapse_key',
        data: {
            your_custom_data_key: 'your_custom_data_value'
        },
        notification: {
            title: '<3 is active now',
            body: 'you know what to do'
        }
    };

    //callback style
    fcm.send(message, function (err, response) {
        if (err) {
            //           console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
            //fcm-push
            console.log("notification was sent")
        }
    });

}



