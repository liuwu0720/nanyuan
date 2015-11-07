var db = require('./db.js');
var domainDao=require('./domainDao.js');

exports.getDomainMessages = function (domainId,cb){
    var domainKey="domain_message_"+domainId;
    redis_cli.lrange(domainKey,0,9,function(err,value){
        cb(err,value);
    });
}

exports.addDomainMessage = function (domainId,message,cb){
    var domainKey="domain_message_"+domainId;
    redis_cli.lpush(domainKey,message,function(err,value){
        cb(err,value);
    });
}

exports.updateDomainMessage = function (domainId,index,message,cb){
    var domainKey="domain_message_"+domainId;
    redis_cli.lset(domainKey,index,message,function(err,value){
        cb(err,value);
    });
}

exports.deleteDomainMessage = function (domainId,message,cb){
    var domainKey="domain_message_"+domainId;
    redis_cli.lrem(domainKey,0,message,function(err,value){
        cb(err,value);
    });
}

exports.getRankById = function (domainInfo,rankId){
    var ranks=domainInfo.ranks;
    var rank=null;
    for(var i=0;i<ranks.length;i++){
        if(ranks[i].rid==rankId){
            rank=ranks[i];
            break;
        }
    }
    return rank;
}

exports.getDomain = function (domainId,cb){
    var domainKey="domain_"+domainId;
    redis_cli.hgetall(domainKey,function(err,value){
        if(value){
            if(value.ranks){
                value.ranks=JSON.parse(value.ranks);
            }
            cb(value);
        }else{
            domainDao.getAppInfoById(domainId,function(err,domainInfo){
                if(err){
                    cb(null);
                }else{
                    cb(domainInfo);
                    if(domainInfo.ranks){
                        domainInfo.ranks=JSON.stringify(domainInfo.ranks);
                    }
                    redis_cli.hmset(domainKey,domainInfo,function(){
                        console.log(domainInfo);
                    });
                }
            });
        }
    });
};

exports.updateDomain = function (domainId,data,cb){
    var domainKey="domain_"+domainId;
    redis_cli.hmset(domainKey,data,cb);
}

exports.clearDomain = function (domainId,cb){
    var domainKey="domain_"+domainId;
    redis_cli.del(domainKey,cb);
}

exports.getDomainInitRank = function (domainId,cb){
    this.getDomain(domainId,function(domainInfo){
        var initRank=null;
        var initRankOrder=0;
        for(var i=0;i<domainInfo.ranks.length;i++){
            var rank=domainInfo.ranks[i];
            if(parseInt(rank.rankOrder)>initRankOrder){
                initRankOrder=parseInt(rank.rankOrder);
                initRank=rank;
            }
        }
        cb(initRank);
    });
}

exports.getDomainActivities = function (domainId,cb){
    var _this=this;
    var domainKey="domain_act_"+domainId;
    redis_cli.get(domainKey,function(err,value){
        if(value){
            var data=JSON.parse(value);
            cb(data);
        }else{
            _this.getDomain(domainId,function(domainInfo){
                domainDao.getActivities(domainId,domainInfo,function(err,rows){
                    if(err){
                        cb(null);
                    }else{
                        var str=JSON.stringify(rows);
                        cb(rows);
                        redis_cli.set(domainKey,str,function(){
                            console.log(str);
                        });
                    }
                });
            });
        }
    });
};

exports.clearDomainActivities = function (domainId,cb){
    var domainKey="domain_act_"+domainId;
    redis_cli.del(domainKey,cb);
}


