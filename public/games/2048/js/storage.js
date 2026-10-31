/* Session-only storage adapter: no cookies, localStorage, or server requests. */
function MemoryStorageManager(){this.best=0;this.state=null;}
MemoryStorageManager.prototype.getBestScore=function(){return this.best;};
MemoryStorageManager.prototype.setBestScore=function(score){this.best=score;};
MemoryStorageManager.prototype.getGameState=function(){return this.state;};
MemoryStorageManager.prototype.setGameState=function(state){this.state=state;};
MemoryStorageManager.prototype.clearGameState=function(){this.state=null;};
