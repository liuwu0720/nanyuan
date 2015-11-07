var db = require('./db.js');
var redis = require('./redisDB.js');
var DomainDao=require('./domainDao.js');
var domainDao=new DomainDao();

var CacheDao = function () {

}
/*
CacheDao.prototype.getDomainScoreHistory = function (domainId,cb){
    var domainKey="domain_scorehis_"+domainId;
    redis.get(domainKey,function(err,value){
        cb(err,value);
    });
}

CacheDao.prototype.addDomainScoreHistory = function (domainId,message){
    var domainKey="domain_scorehis_"+domainId;
    redis.lpush(domainKey,message,function(err,value){
        redis.ltrim(domainKey,0,10,function(err,value){
        });
    });
}
*/
CacheDao.prototype.getDomainMessages = function (domainId,cb){
    var domainKey="domain_message_"+domainId;
    redis.lrange(domainKey,0,9,function(err,value){
        cb(err,value);
    });
}

CacheDao.prototype.addDomainMessage = function (domainId,message,cb){
    var domainKey="domain_message_"+domainId;
    redis.lpush(domainKey,message,function(err,value){
        cb(err,value);
    });
}

CacheDao.prototype.updateDomainMessage = function (domainId,index,message,cb){
    var domainKey="domain_message_"+domainId;
    redis.lset(domainKey,index,message,function(err,value){
        cb(err,value);
    });
}

CacheDao.prototype.deleteDomainMessage = function (domainId,message,cb){
    var domainKey="domain_message_"+domainId;
    redis.lrem(domainKey,0,message,function(err,value){
        cb(err,value);
    });
}

CacheDao.prototype.getRankById = function (domainInfo,rankId){
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

CacheDao.prototype.getDomain = function (domainId,cb){
    var domainKey="domain_"+domainId;
    redis.hgetall(domainKey,function(err,value){
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
                    redis.hmset(domainKey,domainInfo,function(){
                        console.log(domainInfo);
                    });
                }
            });
        }
    });
};

CacheDao.prototype.updateDomain = function (domainId,data,cb){
    var domainKey="domain_"+domainId;
    redis.hmset(domainKey,data,cb);
}

CacheDao.prototype.clearDomain = function (domainId,cb){
    var domainKey="domain_"+domainId;
    redis.del(domainKey,cb);
}

CacheDao.prototype.getDomainInitRank = function (domainId,cb){
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

CacheDao.prototype.getDomainActivities = function (domainId,cb){
    var _this=this;
    var domainKey="domain_act_"+domainId;
    redis.get(domainKey,function(err,value){
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
                        redis.set(domainKey,str,function(){
                            console.log(str);
                        });
                    }
                });
            });
        }
    });
};

CacheDao.prototype.clearDomainActivities = function (domainId,cb){
    var domainKey="domain_act_"+domainId;
    redis.del(domainKey,cb);
}

module.exports = CacheDao;

