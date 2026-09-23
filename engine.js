/* FermentWatch engine - pure fermentation schedule math, shared by app.html and node tests. */
(function(root, factory){
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FermentWatchEngine = factory();
})(typeof self !== 'undefined' ? self : this, function(){

  var HOUR = 3600000;
  var BASE_TEMP = 24; /* deg C reference; yeast roughly doubles rate per +10C */

  var STAGES = [
    {name:'Feed the starter', hours:4, note:'Starter should dome and smell sweet, not sharp.'},
    {name:'Bulk ferment', hours:5, note:'Fold once an hour if you are around; look for a jiggly, risen dough.'},
    {name:'Shape & bench rest', hours:0.5, note:'Pre-shape, rest under a towel, then final shape.'},
    {name:'Final proof', hours:3, note:'Poke test: the dent should spring back slowly.'},
    {name:'Bake', hours:1, note:'Hot oven, lid on for the first half.'}
  ];

  /* duration multiplier for a kitchen temp: warmer = faster */
  function factor(tempC){
    return Math.pow(2, (BASE_TEMP - tempC) / 10);
  }

  function stageHours(stage, tempC){
    return stage.hours * factor(tempC);
  }

  /* schedule from a start time; returns [{name, note, startMs, endMs, hours}] */
  function schedule(startMs, tempC){
    var t = startMs;
    return STAGES.map(function(s){
      var h = stageHours(s, tempC);
      var row = {name:s.name, note:s.note, startMs:t, endMs:t + h * HOUR, hours:h};
      t = row.endMs;
      return row;
    });
  }

  /* index of active stage, or -1 if all done */
  function currentStage(nowMs, sched){
    for (var i = 0; i < sched.length; i++){
      if (nowMs < sched[i].endMs) return i;
    }
    return -1;
  }

  function progress(nowMs, sched){
    if (!sched.length) return 0;
    var total = sched[sched.length - 1].endMs - sched[0].startMs;
    var done = Math.min(Math.max(nowMs - sched[0].startMs, 0), total);
    return Math.round(done / total * 100);
  }

  function fmtClock(ms){
    return new Date(ms).toLocaleTimeString('en-US', {hour:'numeric', minute:'2-digit'});
  }

  function fmtDur(hours){
    if (hours < 1) return Math.round(hours * 60) + ' min';
    var h = Math.floor(hours), m = Math.round((hours - h) * 60);
    return h + 'h' + (m ? ' ' + m + 'm' : '');
  }

  return {HOUR:HOUR, BASE_TEMP:BASE_TEMP, STAGES:STAGES, factor:factor, stageHours:stageHours, schedule:schedule, currentStage:currentStage, progress:progress, fmtClock:fmtClock, fmtDur:fmtDur};
});
