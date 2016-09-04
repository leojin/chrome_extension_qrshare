var qrcode = new QRCode(document.getElementById('qrcontainer'), {
    width : 200,
    height : 200
});

utils.getCurrentTabUrl(function(url) {
    qrcode.makeCode(url);
});
