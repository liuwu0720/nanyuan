var express = require('express');
var router = express.Router();
var ipService=require('../util/ipService.js');
var ClientDao = require('../model/clientDao.js');
var clientDao = new ClientDao();

router.get('/convertGpsToBaidu', function(req, res, next) {
    var lan = req.param("lan");
    var lat = req.param("lat");
    ipService.convertGpsToBaidu(lan,lat,function(err,data){
        if(err){
            res.send({code:1});
        }else{
            res.send({code:0,data:data});
        }
    });
});

router.get('/getGeoFromAddress', function(req, res, next) {
    var address = req.param("address");
    ipService.getBaiduPositionFromAddress(address,function(result){
        res.send(result);
    });
});

router.get('/traceLocationInfo', function(req, res, next) {
    var position = req.param("position");
    var clientId=req.session.passport.user.rid;
    var result={code:0};
    ipService.convertGpsToBaidu(position.longitude,position.latitude,function(err,data){
        var traceLocation={clientId:clientId,lng:position.longitude,lat:position.latitude,blng:data.result[0].x,blat:data.result[0].y,creDate:new Date()};
        ipService.getAddressFromGeo(traceLocation.blat,traceLocation.blng,function(err,data){
            traceLocation.address=data.result.addressComponent.district+data.result.addressComponent.street+data.result.addressComponent.street_number;
            clientDao.addTraceLocation(traceLocation,function(){
            });
            result.address=traceLocation.address;
            res.send(result);
        });
    });
});

module.exports = router;

