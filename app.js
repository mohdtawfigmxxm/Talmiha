
firebase.initializeApp({
  apiKey:"AIzaSyB9mj2PkgVpX6M_BW1cUMaymY2VWA4pwqg",
  authDomain:"dogs-padel.firebaseapp.com",
  databaseURL:"https://dogs-padel-default-rtdb.firebaseio.com",
  projectId:"dogs-padel",
  storageBucket:"dogs-padel.firebasestorage.app",
  messagingSenderId:"989531067145",
  appId:"1:989531067145:web:2169954011b998bf8779d8"
});
const DB = firebase.database();

// ══ CONSTANTS ══
const ADMIN = 'محمد';
const BOTS = ['كليب','كلبون','كلباب','كلابا','أبوكلب','أبا كليبة'];
const isBot = n => BOTS.includes(n);
const CATS = ['معلومات عامة','دينية','جغرافيا','رياضة','رياضيات','فيزياء','دول','منوعة'];
const TIMES = [{l:'30 ث',v:30},{l:'60 ث',v:60},{l:'دقيقتان',v:120}];
const ROUNDS = [1,2,3,4,5,6,8,10,15,20,30];

// ══ BUILTIN Q BANK ══
const QB = [
  {id:'b1',term:'ابن خلدون',cat:'معلومات عامة',
   hints:['ولد في تونس عام 1332','أسّس علم الاجتماع قبل أوغست كونت بقرون','كتابه "المقدمة" من أعظم المؤلفات الفكرية','عمل قاضياً في مصر','شرح دورة الحضارات بمفهوم "العصبية"'],
   botAnswers:['ابن بطوطة','ابن رشد','الفارابي','ابن سينا']},
  {id:'b2',term:'ثقب أسود',cat:'فيزياء',
   hints:['جاذبيته تمنع حتى الضوء','تنبأ به أينشتاين في النسبية العامة','تُسمّى حدوده "أفق الحدث"','أول صورة له التُقطت 2019','كتلته مليارات أضعاف الشمس'],
   botAnswers:['نجم نيوتروني','مجرة درب التبانة','نجم عملاق','ثقب دودي']},
  {id:'b3',term:'جبل إيفرست',cat:'جغرافيا',
   hints:['يقع بين نيبال والصين','ارتفاعه 8848 متراً','سُمّي على اسم مساح بريطاني','تسلّقه هيلاري ونورغاي 1953','يزداد ارتفاعاً كل عام'],
   botAnswers:['جبل كيليمنجارو','جبل ماكنلي','جبل أكونكاغوا','جبل لوتسه']},
  {id:'b4',term:'غزوة الخندق',cat:'دينية',
   hints:['السنة الخامسة من الهجرة','اقترحها سلمان الفارسي','الأحزاب عشرة آلاف مقاتل','الحصار شهر بدون قتال','انتهت بريح وبرد شديدين'],
   botAnswers:['غزوة بدر','غزوة أحد','غزوة تبوك','فتح مكة']},
  {id:'b5',term:'غاز الهيليوم',cat:'فيزياء',
   hints:['العنصر الثاني في الجدول الدوري','أدنى درجة غليان بين العناصر','اكتُشف في الشمس أولاً','يُبرّد مغناطيسات الرنين المغناطيسي','يجعل الصوت حاداً'],
   botAnswers:['غاز الهيدروجين','غاز النيون','غاز الأرغون','غاز الزينون']},
  {id:'b6',term:'نهر الأمازون',cat:'جغرافيا',
   hints:['معظمه في البرازيل','أطول أو ثاني أطول نهر','يصبّ في المحيط الأطلسي','حوضه 40% من أمريكا الجنوبية','فيه أكثر من 3000 نوع سمك'],
   botAnswers:['نهر النيل','نهر المسيسيبي','نهر الكونغو','نهر الأورينوكو']},
  {id:'b7',term:'الكعبة المشرفة',cat:'دينية',
   hints:['قلب المسجد الحرام','شكل مكعب ارتفاعه 13 م','يتجه إليها المسلمون في الصلاة','تُكسى بالقماش الأسود المطرز','في ركنها الحجر الأسود'],
   botAnswers:['المسجد النبوي','المسجد الأقصى','قبة الصخرة','مسجد قباء']},
  {id:'b8',term:'الجاذبية',cat:'فيزياء',
   hints:['صاغ قانونها نيوتن بعد تفاحة','أضعف القوى الأساسية','تشوّه الزمكان وفق أينشتاين','غيابها يُسبّب انعدام الوزن','تُقدَّر كتل الكواكب بتأثيرها'],
   botAnswers:['الكهرومغناطيسية','القوة النووية','الطرد المركزي','قوة لورنتز']},
  {id:'b9',term:'المملكة العربية السعودية',cat:'دول',
   hints:['معظم شبه الجزيرة العربية','أكبر احتياطي نفطي مؤكد','تأسست عام 1932','لا يوجد فيها نهر دائم','تطلّ على البحر الأحمر وخليج عُمان'],
   botAnswers:['الإمارات','العراق','إيران','اليمن']},
  {id:'b10',term:'رونالدو',cat:'رياضة',
   hints:['من مواليد جزيرة ماديرا 1985','يلعب في نادي النصر السعودي','فاز بالكرة الذهبية 5 مرات','يحمل رقم قياسي في كأس العالم','اسمه من رئيس أمريكي'],
   botAnswers:['ميسي','نيمار','مبابي','بنزيمة']},
];

// ══ HELPERS ══
const $ = id => document.getElementById(id);
const hn = el => { if(el) el.classList.add('hidden'); };
const sh = el => { if(el) el.classList.remove('hidden'); };
const san = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuf = a => { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const ls = (k,v) => { try{ if(v===undefined) return localStorage.getItem(k); if(v===null) localStorage.removeItem(k); else localStorage.setItem(k, typeof v==='object'?JSON.stringify(v):v); }catch(e){} };
const lg = k => { try{ const v=localStorage.getItem(k); return v?JSON.parse(v):null; }catch(e){ return null; } };

function toast(msg, type, dur) {
  dur = dur || 2600;
  const c=$('tc'); if(!c) return;
  const el=document.createElement('div');
  el.className='toast'+(type?' '+type:'');
  el.textContent=msg; c.appendChild(el);
  setTimeout(()=>{ el.style.animation='tin .25s ease reverse'; setTimeout(()=>el.remove(),250); }, Math.max(dur,msg.length*55));
}

function confetti() {
  const cols=['#a855f7','#dc2626','#1d4ed8','#16a34a','#e89b10'];
  for(let i=0;i<38;i++) setTimeout(()=>{
    const el=document.createElement('div'); el.className='cp';
    el.style.cssText='left:'+(10+Math.random()*80)+'vw;top:'+(40+Math.random()*30)+'vh;background:'+cols[i%5]+';width:'+(6+Math.random()*7)+'px;height:'+(6+Math.random()*7)+'px;border-radius:'+(Math.random()>.5?'50%':'2px')+';animation-duration:'+(0.6+Math.random()*0.7)+'s;animation-delay:'+(Math.random()*0.4)+'s';
    document.body.appendChild(el); setTimeout(()=>el.remove(),1400);
  }, i*16);
}

function av(name, sz) {
  sz = sz || 36;
  const ph = PHOTOS[name];
  if(ph) return '<div class="av" style="width:'+sz+'px;height:'+sz+'px;min-width:'+sz+'px"><img src="'+ph+'" alt="'+san(name)+'"></div>';
  const cols=['#7e22ce','#1d4ed8','#dc2626','#16a34a','#d97706','#0369a1','#be185d','#15803d'];
  const ci = name ? name.charCodeAt(0)%cols.length : 0;
  return '<div class="av" style="width:'+sz+'px;height:'+sz+'px;min-width:'+sz+'px;font-size:'+(sz*0.4)+'px;background:'+cols[ci]+'">'+(name?name[0]:'?')+'</div>';
}

function allQ() {
  const banks = lg('tlm_banks') || [];
  const custom = [];
  banks.forEach(b => { (b.questions||[]).forEach(q => custom.push(q)); });
  return QB.concat(custom);
}

function pickQ(cats) {
  const pool = allQ().filter(q => !cats || !cats.length || cats.indexOf(q.cat)>=0);
  return pool.length ? pool[Math.floor(Math.random()*pool.length)] : QB[0];
}

function pickBotAns(q, used) {
  const usedSet = new Set(used.map(a=>a.toLowerCase().replace(/\s/g,'')));
  usedSet.add((q.term||'').toLowerCase().replace(/\s/g,''));
  const pool = q.botAnswers || [];
  const unused = pool.filter(a => !usedSet.has(a.toLowerCase().replace(/\s/g,'')));
  if(unused.length) return unused[Math.floor(Math.random()*unused.length)];
  if(pool.length) return pool[Math.floor(Math.random()*pool.length)];
  return 'إجابة مجهولة';
}

function encName(n) { return encodeURIComponent(n); }

// ══ STATE ══
var ME = {name:'', isAdmin:false, photo:''};
var PHOTOS = {};
var _room = null;
var _roomOff = null;
var _timer = null;
var _crImg = null, _crBase = 1, _crOX = 0, _crOY = 0, _crDrag = null;

// ══ PAGES ══
var PAGES = ['pLogin','pHome','pLobby','pGame','pLeader','pStats','pSettings'];
function showPage(id) {
  PAGES.forEach(function(p){ hn($(p)); });
  sh($(id));
}

// ══ CROP ══
function onFilePick(ev) {
  const f = ev.target.files[0]; if(!f) return;
  const rd = new FileReader();
  rd.onload = function(e) {
    _crImg = new Image();
    _crImg.onload = function() {
      const W=260, H=260;
      _crBase = Math.max(W/_crImg.width, H/_crImg.height);
      _crOX=0; _crOY=0;
      $('crZoom').value=1;
      sh($('crOv'));
      crDraw(); crInitDrag();
    };
    _crImg.src = e.target.result;
  };
  rd.readAsDataURL(f);
  ev.target.value = '';
}

function crDraw() {
  const cv=$('crCanvas'); if(!cv||!_crImg) return;
  const ctx=cv.getContext('2d');
  cv.width=260; cv.height=260; ctx.clearRect(0,0,260,260);
  const z=parseFloat($('crZoom').value)||1, sc=_crBase*z;
  const iw=_crImg.width*sc, ih=_crImg.height*sc;
  ctx.drawImage(_crImg,(260-iw)/2+_crOX,(260-ih)/2+_crOY,iw,ih);
}

function crInitDrag() {
  const wp=$('crWrap'); if(!wp) return;
  wp.onpointerdown = function(e) {
    e.preventDefault();
    _crDrag={x:e.clientX-_crOX, y:e.clientY-_crOY};
    wp.setPointerCapture(e.pointerId);
    wp.onpointermove = function(ev) { if(!_crDrag) return; _crOX=ev.clientX-_crDrag.x; _crOY=ev.clientY-_crDrag.y; crDraw(); };
    wp.onpointerup = function() { _crDrag=null; };
  };
}

function crConfirm() {
  const cv=$('crCanvas'); if(!cv) return;
  const out=document.createElement('canvas'); out.width=200; out.height=200;
  out.getContext('2d').drawImage(cv,0,0,260,260,0,0,200,200);
  const url=out.toDataURL('image/jpeg',0.82);
  ME.photo=url;
  $('photoPreview').innerHTML='<img src="'+url+'" class="photo-prev"><div style="font-size:.78rem;color:var(--grn);font-weight:700;margin-top:4px">✅ تم</div><div style="font-size:.7rem;color:var(--t3);margin-top:2px">اضغط لتغيير</div>';
  hn($('crOv'));
}

function crCancel() { hn($('crOv')); }

// ══ LOGIN ══
function goStep1() { sh($('lstep1')); hn($('lstep2')); }

function goStep2() {
  const nameEl=$('nameInp');
  const name=(nameEl&&nameEl.value.trim())||'';
  if(!name||name.length<2){ toast('اكتب اسمك (حرفان على الأقل)','err'); return; }
  // Show step 2 immediately
  sh($('lstep2')); hn($('lstep1'));
  // Then check Firebase in background for returning user
  DB.ref('tlm3_profiles/'+encName(name)).once('value').then(function(snap) {
    if(snap.exists() && snap.val().expires > Date.now()) {
      const p=snap.val();
      if(p.photo){ ME.photo=p.photo; PHOTOS[name]=p.photo;
        $('photoPreview').innerHTML='<img src="'+p.photo+'" class="photo-prev"><div style="font-size:.78rem;color:var(--grn);font-weight:700;margin-top:4px">✅ صورتك محفوظة — يمكنك تغييرها</div>';
      }
    }
  });
}

function doLogin() {
  const nameEl=$('nameInp');
  const name=(nameEl&&nameEl.value.trim())||'';
  if(!name||name.length<2){ toast('اكتب اسمك','err'); return; }
  ME.name=name; ME.isAdmin=(name===ADMIN);
  ls('tlm_name',name);
  if(ME.photo) PHOTOS[name]=ME.photo;
  // Save profile 24h
  var profile={name:name, ts:Date.now(), expires:Date.now()+24*60*60*1000};
  if(ME.photo) profile.photo=ME.photo;
  DB.ref('tlm3_profiles/'+encName(name)).set(profile);
  _startSession();
}

function _startSession() {
  const pk=encName(ME.name);
  // Presence
  var pref=DB.ref('tlm3_presence/'+pk);
  pref.set({name:ME.name, photo:ME.photo||'', ts:Date.now()});
  pref.onDisconnect().remove();
  // Listen presence count + sync photos
  DB.ref('tlm3_presence').on('value',function(snap){
    var cnt=snap.numChildren();
    var el=$('homeStatus'); if(el) el.textContent=cnt+' متصل الآن 🟢';
    snap.forEach(function(ch){ var d=ch.val(); if(d&&d.name&&d.photo) PHOTOS[d.name]=d.photo; });
  });
  // Sync banks from Firebase
  DB.ref('tlm3_banks').once('value').then(function(snap){
    if(snap.exists()){ var b=snap.val(); if(Array.isArray(b)) ls('tlm_banks',b); }
  });
  showHome(); listenRoom();
}

function doLogout() {
  clearInterval(_timer);
  if(_roomOff){ _roomOff(); _roomOff=null; }
  if(ME.name) DB.ref('tlm3_presence/'+encName(ME.name)).remove();
  ME={name:'',isAdmin:false,photo:''}; _room=null;
  ls('tlm_name',null);
  showPage('pLogin');
  goStep1();
  var nameEl=$('nameInp'); if(nameEl) nameEl.value='';
}

// ══ HOME ══
function showHome() {
  showPage('pHome');
  $('homeName').textContent=ME.name;
  $('topUser').innerHTML=av(ME.name,28)+'<span style="font-weight:700;color:var(--t2);margin-right:4px">'+san(ME.name)+'</span>'+(ME.isAdmin?'<span style="font-size:.55rem;background:var(--purp);color:#fff;padding:1px 6px;border-radius:6px">ADMIN</span>':'');
  if(ME.isAdmin) sh($('settBtn'));
}

// ══ NAV ══
function navHome() { clearInterval(_timer); showPage('pHome'); }
function navLobby() { showPage('pLobby'); renderLobby(); }

function navStats() {
  showPage('pStats');
  const el=$('statsContent'); if(!el) return;
  const st=lg('tlm_stats')||{};
  const keys=Object.keys(st).sort(function(a,b){ return (st[b].pts||0)-(st[a].pts||0); });
  if(!keys.length){ el.innerHTML='<div style="text-align:center;padding:40px;color:var(--t3)">لا توجد إحصاءات بعد</div>'; return; }
  var medals=['🥇','🥈','🥉'];
  var html='<div class="card">';
  keys.forEach(function(n,i){
    html+='<div class="scr'+(i===0?' top':'')+'">'+
      '<span style="font-size:1rem;min-width:26px">'+(medals[i]||'')+'</span>'+
      av(n,34)+
      '<div style="flex:1"><div style="font-size:.9rem;font-weight:700">'+san(n)+'</div>'+
      '<div style="font-size:.66rem;color:var(--t3)">'+(st[n].games||0)+' لعبة · '+(st[n].wins||0)+' فوز</div></div>'+
      '<div class="scp">'+(st[n].pts||0)+'</div></div>';
  });
  el.innerHTML=html+'</div>';
}

function navSettings() {
  if(!ME.isAdmin){ toast('الإعدادات للأدمن فقط','err'); return; }
  showPage('pSettings');
  renderSettings();
}

// ══ SETTINGS ══
function renderSettings() {
  const el=$('settingsContent'); if(!el) return;
  const banks=lg('tlm_banks')||[];
  var bhtml='';
  if(banks.length){
    banks.forEach(function(b,i){
      bhtml+='<div class="qbr">'+
        '<div style="flex:1"><div style="font-size:.88rem;font-weight:700">'+san(b.name||('بنك '+(i+1)))+'</div>'+
        '<div style="font-size:.68rem;color:var(--t3);margin-top:2px">'+((b.questions||[]).length)+' سؤال</div></div>'+
        '<button onclick="deleteBank('+i+')" style="background:#fee2e2;color:#b91c1c;padding:5px 12px;font-size:.74rem;border-radius:10px;border:none;cursor:pointer;font-family:inherit">🗑️</button>'+
        '</div>';
    });
  } else {
    bhtml='<div style="font-size:.82rem;color:var(--t3);text-align:center;padding:10px">لا توجد بنوك مستوردة</div>';
  }
  el.innerHTML=
    '<div class="card">'+
      '<div class="eyb">بنوك الأسئلة</div>'+
      '<div class="sht">استيراد أسئلة <em>📚</em></div>'+
      bhtml+
      '<div style="margin-top:14px">'+
        '<div style="font-size:.76rem;font-weight:700;color:var(--t2);margin-bottom:6px">اسم البنك</div>'+
        '<input class="inp" id="bankName" placeholder="مثال: أسئلة رياضة" style="margin-bottom:10px">'+
        '<div style="font-size:.76rem;font-weight:700;color:var(--t2);margin-bottom:6px">كود JSON</div>'+
        '<textarea id="bankJson" style="width:100%;padding:10px;border:1.5px solid var(--bd);border-radius:12px;font-family:monospace;font-size:.74rem;direction:ltr;text-align:left;min-height:90px;resize:vertical;outline:none" placeholder=\'[{"term":"...","cat":"...","hints":["..."],"botAnswers":["..."]}]\'></textarea>'+
        '<div id="bankStatus" style="font-size:.76rem;margin:6px 0"></div>'+
        '<button class="bp" onclick="importBank()" style="margin-top:4px">💾 استيراد</button>'+
      '</div>'+
      '<button onclick="copyTemplate()" style="width:100%;margin-top:10px;padding:11px;background:#f5f3ff;color:var(--purp);border:1.5px solid #c4b5fd;border-radius:14px;font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer">📋 نسخ قالب الأسئلة</button>'+
    '</div>'+
    '<div class="card">'+
      '<div class="eyb">إدارة</div>'+
      '<button onclick="if(confirm(\'مسح كل الإحصاءات؟\')){ls(\'tlm_stats\',{});toast(\'تم\',\'ok\')}" class="br" style="width:100%;padding:11px">🗑️ مسح كل الإحصاءات</button>'+
    '</div>';
}

function copyTemplate() {
  var t='[\n  {\n    "term": "اسم المصطلح",\n    "cat": "معلومات عامة",\n    "hints": [\n      "معلومة صعبة جداً",\n      "معلومة صعبة",\n      "معلومة متوسطة",\n      "معلومة متوسطة",\n      "معلومة أسهل نسبياً"\n    ],\n    "botAnswers": ["بديل 1","بديل 2","بديل 3","بديل 4"]\n  }\n]';
  if(navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(t).then(function(){ toast('تم نسخ القالب ✓','ok'); }).catch(function(){ fbCopy(t); });
  } else fbCopy(t);
}

function fbCopy(text) {
  try{
    var ta=document.createElement('textarea'); ta.value=text; ta.style.cssText='position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    toast('تم النسخ ✓','ok');
  }catch(e){ toast('فشل النسخ','err'); }
}

function importBank() {
  var nameEl=$('bankName'), jsonEl=$('bankJson'), status=$('bankStatus');
  var bname=(nameEl&&nameEl.value.trim())||'بنك جديد';
  var raw=(jsonEl&&jsonEl.value.trim())||'';
  if(!raw){ if(status) status.innerHTML='<span style="color:#dc2626">⚠️ أدخل JSON</span>'; return; }
  var arr;
  try{ arr=JSON.parse(raw); } catch(e){ if(status) status.innerHTML='<span style="color:#dc2626">❌ JSON غير صحيح</span>'; return; }
  if(!Array.isArray(arr)) arr=[arr];
  var valid=arr.filter(function(q){ return q.term&&Array.isArray(q.hints)&&q.hints.length>=3&&q.cat; });
  if(!valid.length){ if(status) status.innerHTML='<span style="color:#dc2626">❌ لا أسئلة صحيحة</span>'; return; }
  valid.forEach(function(q){ while(q.hints.length<5) q.hints.push(q.hints[q.hints.length-1]); q.hints=q.hints.slice(0,5); });
  var banks=lg('tlm_banks')||[];
  banks.push({name:bname, questions:valid, ts:Date.now()});
  ls('tlm_banks',banks);
  DB.ref('tlm3_banks').set(banks);
  if(jsonEl) jsonEl.value=''; if(nameEl) nameEl.value='';
  if(status) status.innerHTML='<span style="color:#16a34a">✅ تم استيراد '+valid.length+' سؤال</span>';
  renderSettings();
  toast('تم استيراد '+valid.length+' سؤال ✓','ok');
}

function deleteBank(i) {
  if(!confirm('حذف هذا البنك؟')) return;
  var banks=lg('tlm_banks')||[];
  banks.splice(i,1); ls('tlm_banks',banks);
  DB.ref('tlm3_banks').set(banks);
  renderSettings(); toast('تم الحذف','ok');
}

// ══ ROOM LISTENER ══
function listenRoom() {
  if(_roomOff){ _roomOff(); _roomOff=null; }
  var ref=DB.ref('tlm3_room');
  var handler=ref.on('value',function(snap){
    _room=snap.exists()?snap.val():null;
    var cur=_room?_room.phase:null;
    // update home status
    var hs=$('homeStatus');
    if(hs&&$('pHome')&&!$('pHome').classList.contains('hidden')){
      if(_room&&_room.phase==='lobby'){
        hs.textContent='غرفة مفتوحة — '+Object.keys(_room.players||{}).length+' لاعب 🎮';
      }
    }
    // Navigate if game active
    if(_room && cur && cur!=='lobby'){
      var onLobby=$('pLobby')&&!$('pLobby').classList.contains('hidden');
      var onHome=$('pHome')&&!$('pHome').classList.contains('hidden');
      if(onLobby||onHome){ showPage('pGame'); }
      var onGame=$('pGame')&&!$('pGame').classList.contains('hidden');
      if(onGame||onLobby||onHome){ renderGame(); }
    }
    // Re-render lobby if visible
    if($('pLobby')&&!$('pLobby').classList.contains('hidden')) renderLobby();
    // Room closed
    if(!_room){
      var onGame2=$('pGame')&&!$('pGame').classList.contains('hidden');
      var onLeader=$('pLeader')&&!$('pLeader').classList.contains('hidden');
      if(onGame2||onLeader){ navHome(); toast('انتهت اللعبة','ok'); }
    }
    // Sync presence to room
    if(_room && ME.name){
      DB.ref('tlm3_room/presence/'+encName(ME.name)).set(true);
      DB.ref('tlm3_room/presence/'+encName(ME.name)).onDisconnect().remove();
    }
  });
  _roomOff=function(){ ref.off('value',handler); };
}

// ══ LOBBY ══
function renderLobby() {
  var el=$('lobbyContent'); if(!el) return;
  if(!_room){
    if(ME.isAdmin){
      el.innerHTML=
        '<div class="card">'+
          '<div class="eyb">إنشاء غرفة جديدة</div>'+
          '<div class="sht">إعدادات اللعبة <em>🎮</em></div>'+
          '<div style="margin-bottom:12px"><div style="font-size:.76rem;font-weight:700;color:var(--t2);margin-bottom:7px">الفئات</div>'+
          '<div style="display:flex;flex-wrap:wrap;gap:7px" id="lCats">'+CATS.map(function(c){ return '<button class="tag on" onclick="this.classList.toggle(\'on\')">'+c+'</button>'; }).join('')+'</div></div>'+
          '<div style="margin-bottom:12px"><div style="font-size:.76rem;font-weight:700;color:var(--t2);margin-bottom:7px">وقت الإجابة</div>'+
          '<div style="display:flex;flex-wrap:wrap;gap:7px" id="lTime">'+TIMES.map(function(t,i){ return '<button class="tag'+(i===1?' on':'')+'" onclick="selOne(\'lTime\',this)">'+t.l+'</button>'; }).join('')+'</div></div>'+
          '<div style="margin-bottom:16px"><div style="font-size:.76rem;font-weight:700;color:var(--t2);margin-bottom:7px">جولات لكل لاعب</div>'+
          '<div style="display:flex;flex-wrap:wrap;gap:7px" id="lRounds">'+ROUNDS.map(function(r,i){ return '<button class="tag'+(i===1?' on':'')+'" onclick="selOne(\'lRounds\',this)">'+r+'</button>'; }).join('')+'</div></div>'+
          '<button class="bgn" onclick="createRoom()">✨ إنشاء الغرفة</button>'+
        '</div>';
    } else {
      el.innerHTML=
        '<div class="card" style="text-align:center;padding:30px">'+
          '<div style="font-size:2.5rem;margin-bottom:12px">⏳</div>'+
          '<div style="font-size:.9rem;font-weight:700;color:var(--t2)">لا توجد غرفة نشطة</div>'+
          '<div style="font-size:.76rem;color:var(--t3);margin-top:6px">انتظر حتى ينشئ المشرف غرفة</div>'+
          '<div style="font-size:.72rem;color:var(--purp);margin-top:10px;font-weight:700">الصفحة تتحدث تلقائياً 🔄</div>'+
        '</div>';
    }
    return;
  }
  if(_room.phase!=='lobby'){ showPage('pGame'); renderGame(); return; }

  var players=Object.values(_room.players||{});
  var pk=encName(ME.name);
  // Auto-join
  if(!ME.isAdmin && (!_room.players || !_room.players[pk])){
    DB.ref('tlm3_room/players/'+pk).set({name:ME.name, joinedAt:Date.now()});
  }

  var botHtml='';
  if(ME.isAdmin){
    botHtml='<div style="margin-bottom:12px"><div style="font-size:.76rem;font-weight:700;color:var(--t2);margin-bottom:7px">🤖 بوتات</div><div style="display:flex;flex-wrap:wrap;gap:7px">';
    BOTS.forEach(function(bn){
      var active=_room.players&&_room.players[encName(bn)];
      botHtml+='<button class="tag'+(active?' on':'')+'" onclick="toggleBot(\''+bn.replace(/'/g,"\\'")+'\')" style="font-size:.72rem">🤖 '+san(bn)+'</button>';
    });
    botHtml+='</div></div>';
  }

  var plHtml='';
  players.forEach(function(p){
    var isHost=p.name===_room.host, isBt=isBot(p.name);
    plHtml+='<div class="plr">'+av(p.name,36)+'<span style="flex:1;font-size:.9rem;font-weight:700">'+san(p.name)+'</span>'+
      '<span class="bdg '+(isHost?'bdg-h':isBt?'bdg-b':'bdg-r')+'">'+(isHost?'مضيف 👑':isBt?'بوت 🤖':'جاهز ✓')+'</span>'+
      (ME.isAdmin&&p.name!==ME.name?'<button onclick="kickP(\''+p.name.replace(/'/g,"\\'")+'\')" style="background:#fee2e2;color:#b91c1c;padding:3px 8px;font-size:.65rem;border-radius:8px;border:none;cursor:pointer;margin-right:4px">✕</button>':'')+
      '</div>';
  });

  var sets=_room.settings||{};
  el.innerHTML=
    '<div class="card">'+
      '<div class="eyb">غرفة اللعب</div>'+
      '<div class="sht">جاهزون للعب <em>🎮</em></div>'+
      '<div style="font-size:.72rem;color:var(--t3);margin-bottom:10px">'+
        'الفئات: '+(sets.cats&&sets.cats.length?sets.cats.join('، '):'الكل')+' · '+(sets.time||60)+'ث · '+(sets.rounds||2)+' جولات</div>'+
      plHtml+
      botHtml+
      (ME.isAdmin?'<button class="bgn" onclick="startGame()" '+(players.length<2?'disabled':'')+' style="margin-bottom:8px">🚀 ابدأ اللعبة ('+players.length+' لاعبين)</button>':'')+
      '<button class="bg" onclick="leaveRoom()" style="margin-top:4px;font-size:.82rem">🚪 مغادرة</button>'+
      (ME.isAdmin?'<button class="br" onclick="closeRoom()" style="width:100%;margin-top:6px;padding:9px;font-size:.78rem">🗑️ حذف الغرفة</button>':'')+
    '</div>';
}

function selOne(groupId, btn) {
  var grp=$(groupId); if(!grp) return;
  grp.querySelectorAll('.tag').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
}

function createRoom() {
  var cats=[];
  var catEl=$('lCats'); if(catEl) catEl.querySelectorAll('.tag.on').forEach(function(b){ cats.push(b.textContent); });
  var timeEl=$('lTime'); var timeBtn=timeEl&&timeEl.querySelector('.tag.on');
  var time=60; if(timeBtn){ var tf=TIMES.find(function(t){ return t.l===timeBtn.textContent; }); if(tf) time=tf.v; }
  var roundEl=$('lRounds'); var roundBtn=roundEl&&roundEl.querySelector('.tag.on');
  var rounds=parseInt(roundBtn&&roundBtn.textContent)||2;
  var pk=encName(ME.name);
  DB.ref('tlm3_room').set({
    host:ME.name, phase:'lobby',
    settings:{cats:cats, time:time, rounds:rounds},
    players:{[pk]:{name:ME.name, joinedAt:Date.now()}}
  }).then(function(){ toast('تم إنشاء الغرفة ✓','ok'); });
}

function closeRoom() {
  if(!confirm('حذف الغرفة؟')) return;
  DB.ref('tlm3_room').remove(); navHome();
}

function leaveRoom() {
  DB.ref('tlm3_room/players/'+encName(ME.name)).remove(); navHome();
}

function kickP(name) {
  DB.ref('tlm3_room/players/'+encName(name)).remove();
}

function toggleBot(bn) {
  if(!ME.isAdmin||!_room) return;
  var pk=encName(bn);
  if(_room.players&&_room.players[pk]) DB.ref('tlm3_room/players/'+pk).remove();
  else DB.ref('tlm3_room/players/'+pk).set({name:bn, joinedAt:Date.now(), isBot:true});
}

// ══ GAME ══
function startGame() {
  if(!ME.isAdmin||!_room) return;
  var players=Object.values(_room.players||{}).map(function(p){ return p.name; });
  if(players.length<2){ toast('يجب لاعبان على الأقل','err'); return; }
  var order=shuf(players);
  var scores={}; order.forEach(function(p){ scores[p]=0; });
  var s=_room.settings||{cats:[],time:60,rounds:2};
  var q=pickQ(s.cats);
  DB.ref('tlm3_room').update({
    phase:'pick_hint', turnOrder:order, currentTurn:0,
    totalTurns:order.length*s.rounds, scores:scores,
    currentQ:q, selectedHint:null, answers:null, votes:null
  });
}

function renderGame() {
  var el=$('gameContent'); if(!el||!_room) return;
  clearInterval(_timer);
  var sc=$('gameScore');
  if(sc&&_room.scores) sc.textContent=san(ME.name)+': '+(_room.scores[ME.name]||0)+' نقطة';
  try {
    switch(_room.phase){
      case 'pick_hint':    el.innerHTML=renderPickHint(); break;
      case 'answering':    el.innerHTML=renderAnswering(); startTimer(); break;
      case 'voting':       el.innerHTML=renderVoting(); break;
      case 'round_result': el.innerHTML=renderRoundResult(); break;
      case 'final':        el.innerHTML=renderFinal(); confetti(); break;
      default: el.innerHTML='<div style="padding:20px;text-align:center">في انتظار الأحداث...</div>';
    }
  } catch(e) {
    el.innerHTML='<div style="padding:20px;color:red;font-weight:bold;text-align:center">حدث خطأ داخلي: <br>'+san(e.message)+'<br>يرجى إبلاغ مطور النظام.</div>';
    console.error("renderGame error:", e);
  }
}

function playersBar() {
  if(!_room) return '';
  var order=_room.turnOrder||Object.values(_room.players||{}).map(function(p){ return p.name; });
  var presence=_room.presence||{};
  var html='<div class="pbar">';
  order.forEach(function(p){
    if(isBot(p)) return;
    var online=!!presence[encName(p)];
    html+='<div style="display:flex;flex-direction:column;align-items:center;gap:2px;opacity:'+(online?1:0.35)+'">'+av(p,26)+'<span style="font-size:.5rem;font-weight:700;color:var(--t2);max-width:36px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+san(p)+'</span></div>';
  });
  return html+'</div>';
}

function exitBtn() {
  if(ME.isAdmin) return '<button class="br" onclick="confirmExit()" style="width:100%;margin-top:10px;padding:9px;font-size:.8rem">🚪 إيقاف اللعبة</button>';
  return '<button class="bg" onclick="navHome()" style="width:100%;margin-top:10px;font-size:.8rem">🚪 خروج</button>';
}

function confirmExit() {
  if(!ME.isAdmin) return;
  if(confirm('إيقاف اللعبة وحذف الغرفة؟')){ DB.ref('tlm3_room').remove(); navHome(); }
}

// ── PICK HINT ──
function renderPickHint() {
  var q=_room.currentQ; if(!q) return '';
  var turn=_room.currentTurn||0;
  var order=_room.turnOrder||[];
  var tp=order[turn%order.length];
  var isMe=tp===ME.name, isBt=isBot(tp);
  // Bot auto-selects
  if(isBt&&ME.isAdmin){
    setTimeout(function(){
      if(_room&&_room.phase==='pick_hint'){
        DB.ref('tlm3_room').update({phase:'answering', selectedHint:Math.floor(Math.random()*5), answers:null, votes:null, answerStart:Date.now()});
      }
    }, 700);
  }
  var catInfo='<div style="background:var(--s2);border:1px solid var(--bd);border-radius:14px;padding:14px;text-align:center;margin-bottom:12px"><div style="font-size:.78rem;font-weight:700;color:var(--t2)">الفئة: <strong>'+san(q.cat)+'</strong></div></div>';
  var html=playersBar()+
    '<div class="tbanner">'+av(tp,38)+'<div><div class="tbn">'+san(tp)+(isBt?' 🤖':'')+'</div><div class="tbs">'+(isMe?'دورك':'يختار المعلومة...')+'</div></div>'+(isMe?'<span class="mybdg">دورك ✨</span>':'')+'</div>';
  if(isMe){
    html+='<div class="tbox">'+san(q.term)+'<div class="tcat">'+san(q.cat)+'</div></div>';
    html+='<div style="font-size:.82rem;color:var(--t2);text-align:center;margin-bottom:12px;font-weight:600">اختر معلومة واحدة للعرض</div>';
    q.hints.forEach(function(h,i){
      html+='<div class="hcard" onclick="selectHint('+i+')"><div class="hnum">'+(i+1)+'</div><div style="font-size:.86rem;line-height:1.65">'+san(h)+'</div></div>';
    });
  } else {
    html+=catInfo+'<div class="wbox"><span class="spin"></span> '+san(tp)+' يختار المعلومة...</div>';
  }
  html+=exitBtn();
  return html;
}

function selectHint(idx) {
  var order=_room.turnOrder||[], turn=_room.currentTurn||0, tp=order[turn%order.length];
  if(tp!==ME.name && !ME.isAdmin) return;
  DB.ref('tlm3_room').update({phase:'answering', selectedHint:idx, answers:null, votes:null, answerStart:Date.now()});
}

// ── ANSWERING ──
function renderAnswering() {
  var q=_room.currentQ; if(!q) return '';
  var turn=_room.currentTurn||0, order=_room.turnOrder||[];
  var tp=order[turn%order.length], isMyTurn=tp===ME.name;
  var myAns=_room.answers&&_room.answers[encName(ME.name)];
  var hint=q.hints[_room.selectedHint||0];
  var timeVal=(_room.settings&&_room.settings.time)||60;
  var elapsed=_room.answerStart?Math.floor((Date.now()-_room.answerStart)/1000):0;
  var left=Math.max(0,timeVal-elapsed), pct=(left/timeVal)*100;
  var danger=left<=5;
  var ansCount=Object.values(_room.answers||{}).filter(function(a){ return a&&!isBot(a.name||''); }).length;
  var ansTotal=order.filter(function(p){ return !isBot(p)&&p!==tp; }).length;
  var html=playersBar()+
    '<div class="tbanner">'+av(tp,38)+
      '<div><div class="tbn">'+san(tp)+'</div><div class="tbs">صاحب الدور</div></div>'+
      '<div style="font-family:Lexend,sans-serif;font-size:1.5rem;font-weight:900;color:'+(danger?'#dc2626':'#a855f7')+';min-width:38px;text-align:center" id="tlbl">'+left+'</div>'+
    '</div>'+
    '<div class="tbar"><div class="tfil'+(danger?' warn':'')+'" id="tfil" style="width:'+pct+'%"></div></div>'+
    '<div class="hint-box"><div class="hint-lbl">التلميح</div><div class="hint-txt">'+san(hint)+'</div></div>';
  if(isMyTurn){
    html+='<div class="wbox"><div style="font-size:1.3rem;margin-bottom:8px">⏳</div><div style="font-weight:700;color:var(--t2)">أنت صاحب الدور</div><div style="font-size:.78rem;color:var(--t3);margin-top:5px">'+ansCount+'/'+ansTotal+' أجابوا</div>'+(ME.isAdmin?'<button class="bp" onclick="endAnswering()" style="margin-top:12px;padding:10px;width:100%">⏩ انتهى الوقت</button>':'')+'</div>';
  } else if(myAns){
    html+='<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:14px;padding:14px;text-align:center"><div style="font-size:.9rem;font-weight:700;color:#16a34a">✅ تم تسجيل إجابتك</div><div style="font-size:.74rem;color:var(--t3);margin-top:4px">'+ansCount+'/'+ansTotal+' أجابوا</div></div>';
  } else {
    html+='<div class="abox"><div style="font-size:.78rem;font-weight:700;color:rgba(255,255,255,.55);text-align:center;margin-bottom:12px">ما هو المصطلح؟</div><input class="ainp" id="ansInp" type="text" placeholder="اكتب إجابتك..." autocomplete="off" onkeypress="if(event.key===\'Enter\')doAnswer()"><button class="bp" onclick="doAnswer()" style="margin-top:10px">✓ تأكيد</button></div>';
  }
  html+=exitBtn();
  return html;
}

function startTimer() {
  clearInterval(_timer);
  if(!_room||!_room.answerStart) return;
  var total=(_room.settings&&_room.settings.time)||60;
  _timer=setInterval(function(){
    var elapsed=Math.floor((Date.now()-_room.answerStart)/1000);
    var left=Math.max(0,total-elapsed), pct=(left/total)*100;
    var lbl=$('tlbl'), fil=$('tfil');
    if(!lbl||!fil){ clearInterval(_timer); return; }
    lbl.textContent=left;
    lbl.style.color=left<=5?'#dc2626':'#a855f7';
    fil.style.width=pct+'%';
    fil.className='tfil'+(left<=5?' warn':'');
    if(left<=0){ clearInterval(_timer); if(ME.isAdmin) endAnswering(); }
  }, 500);
}

function doAnswer() {
  var inp=$('ansInp'); if(!inp||!inp.value.trim()) return;
  var raw=inp.value.trim();
  var q=_room.currentQ;
  var correct=raw.toLowerCase().replace(/\s/g,'')===(q.term||'').toLowerCase().replace(/\s/g,'');
  var pk=encName(ME.name);
  DB.ref('tlm3_room/answers/'+pk).set({ans:raw, correct:correct, name:ME.name});
  if(correct){
    // show decoy input, keep timer running
    var gc=$('gameContent');
    if(gc){
      var timeVal=(_room.settings&&_room.settings.time)||60;
      var elapsed=_room.answerStart?Math.floor((Date.now()-_room.answerStart)/1000):0;
      var left=Math.max(0,timeVal-elapsed), pct=(left/timeVal)*100, danger=left<=5;
      gc.innerHTML=
        '<div style="padding-top:0">'+
          '<div class="tbanner" style="margin-top:0">'+
            '<div style="flex:1;font-size:.88rem;font-weight:700;color:#fff">إجابة صحيحة! ✅</div>'+
            '<div style="font-family:Lexend,sans-serif;font-size:1.5rem;font-weight:900;color:'+(danger?'#dc2626':'#a855f7')+'" id="tlbl">'+left+'</div>'+
          '</div>'+
          '<div class="tbar"><div class="tfil'+(danger?' warn':'')+'" id="tfil" style="width:'+pct+'%"></div></div>'+
          '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:14px;padding:12px;text-align:center;margin-bottom:12px">'+
            '<div style="font-size:.88rem;font-weight:700;color:#16a34a">✅ أجبت صح! اكتب إجابة تضليلية 🎭</div>'+
          '</div>'+
          '<div class="abox">'+
            '<div style="font-size:.78rem;font-weight:700;color:rgba(255,255,255,.55);text-align:center;margin-bottom:12px">اكتب إجابة مشابهة لتخدع الآخرين</div>'+
            '<input class="ainp" id="decoyInp" type="text" placeholder="إجابة تضليلية..." autocomplete="off" onkeypress="if(event.key===\'Enter\')doDecoy()">'+
            '<button class="bp" onclick="doDecoy()" style="margin-top:10px">🎭 تأكيد</button>'+
          '</div>'+
        '</div>';
      startTimer(); // re-attach timer to new elements
    }
  } else {
    renderGame();
    checkAllAnswered();
  }
}

function doDecoy() {
  var inp=$('decoyInp'); if(!inp||!inp.value.trim()) return;
  DB.ref('tlm3_room/answers/'+encName(ME.name)+'/decoy').set(inp.value.trim());
  renderGame();
  checkAllAnswered();
}

function checkAllAnswered() {
  if(!ME.isAdmin||!_room) return;
  var order=_room.turnOrder||[], turn=_room.currentTurn||0;
  var tp=order[turn%order.length];
  var humans=order.filter(function(p){ return !isBot(p)&&p!==tp; });
  setTimeout(function(){
    DB.ref('tlm3_room/answers').once('value').then(function(snap){
      var ans=snap.val()||{};
      var done=humans.filter(function(p){
        var a=ans[encName(p)]; if(!a) return false;
        if(a.correct) return !!a.decoy;
        return true;
      });
      if(done.length>=humans.length) endAnswering();
    });
  }, 350);
}

function endAnswering() {
  clearInterval(_timer);
  if(!ME.isAdmin||!_room) return;
  var q=_room.currentQ;
  var order=_room.turnOrder||[], turn=_room.currentTurn||0;
  var tp=order[turn%order.length];
  var existing=_room.answers||{};
  var usedAns=Object.values(existing).map(function(a){ return a.decoy||a.ans||''; }).filter(Boolean);
  var updates={};
  // Bots in game
  order.filter(function(p){ return isBot(p)&&p!==tp; }).forEach(function(bn){
    var pk=encName(bn);
    if(existing[pk]) return;
    var ba=pickBotAns(q,usedAns);
    updates['tlm3_room/answers/'+pk]={ans:ba,correct:false,name:bn,isBot:true};
    usedAns.push(ba);
  });
  // Fill up to 5 answers with ghost bots if needed
  var realCount=Object.values(existing).filter(function(a){ return a&&a.name!==tp; }).length;
  var updateCount=Object.keys(updates).length;
  if(realCount+updateCount<4){
    var ghostBots=BOTS.filter(function(bn){ return !order.includes(bn); });
    var gi=0;
    while(realCount+updateCount<5&&gi<ghostBots.length){
      var gbn=ghostBots[gi++], gpk=encName(gbn);
      var gba=pickBotAns(q,usedAns);
      updates['tlm3_room/answers/'+gpk]={ans:gba,correct:false,name:gbn,isBot:true,isGhost:true};
      usedAns.push(gba); updateCount++;
    }
  }
  if(Object.keys(updates).length){
    DB.ref().update(updates).then(function(){ DB.ref('tlm3_room').update({phase:'voting'}); });
  } else {
    DB.ref('tlm3_room').update({phase:'voting'});
  }
}

// ── VOTING ──
function renderVoting() {
  var q=_room.currentQ; if(!q) return '';
  var turn=_room.currentTurn||0, order=_room.turnOrder||[];
  var tp=order[turn%order.length], isMyTurn=tp===ME.name;
  var pk=encName(ME.name), myVote=_room.votes&&_room.votes[pk]!=null;
  var answers=_room.answers||{};
  var opts=[{text:q.term,real:true,owner:'__real__'}];
  Object.values(answers).forEach(function(d){
    if(!d.name||d.name===tp) return;
    var show=d.decoy||d.ans;
    if(show&&show.toLowerCase().replace(/\s/g,'')!==(q.term||'').toLowerCase().replace(/\s/g,''))
      opts.push({text:show,real:false,owner:d.name});
  });
  var shuffled=shuf(opts.slice());
  var vCount=Object.values(_room.votes||{}).filter(function(v){ return !isBot(v.voterName||''); }).length;
  var vNeeded=order.filter(function(p){ return p!==tp&&!isBot(p); }).length;
  var optsJson=JSON.stringify(shuffled).replace(/</g,'\\u003c').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  var html=playersBar()+
    '<div class="tbanner">'+av(tp,38)+'<div><div class="tbn">'+san(tp)+'</div><div class="tbs">صاحب الدور</div></div></div>'+
    '<div class="hint-box"><div class="hint-lbl">التلميح</div><div class="hint-txt">'+san(q.hints[_room.selectedHint||0])+'</div></div>'+
    '<div style="font-size:.82rem;color:var(--t2);text-align:center;margin-bottom:12px;font-weight:600">'+(isMyTurn?vCount+'/'+vNeeded+' صوّتوا':'اختر الإجابة الصحيحة')+'</div>';
  if(!isMyTurn&&!myVote){
    shuffled.forEach(function(opt,i){
      html+='<div class="vcard" onclick="castVote('+i+','+optsJson+')"><div style="font-size:.9rem;font-weight:700">'+san(opt.text)+'</div></div>';
    });
  } else if(!isMyTurn&&myVote){
    html+='<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:14px;padding:14px;text-align:center"><div style="font-weight:700;color:#16a34a">✅ تم تسجيل صوتك</div><div style="font-size:.74rem;color:var(--t3);margin-top:4px">'+vCount+'/'+vNeeded+' صوّتوا</div></div>';
  } else {
    html+='<div class="wbox"><span class="spin"></span> اللاعبون يصوّتون...</div>';
  }
  if(ME.isAdmin) html+='<button class="bp" onclick="doReveal()" style="margin-top:12px;padding:10px;width:100%">📊 اكشف النتائج</button>';
  html+=exitBtn();
  return html;
}

function castVote(idx, opts) {
  var chosen=opts[idx];
  DB.ref('tlm3_room/votes/'+encName(ME.name)).set({idx:idx,owner:chosen.owner,voterName:ME.name});
}

function doReveal() {
  if(!ME.isAdmin||!_room) return;
  var q=_room.currentQ;
  var turn=_room.currentTurn||0, order=_room.turnOrder||[];
  var tp=order[turn%order.length];
  var answers=_room.answers||{};
  // Build opts same as voting
  var opts=[{text:q.term,real:true,owner:'__real__'}];
  Object.values(answers).forEach(function(d){
    if(!d.name||d.name===tp) return;
    var show=d.decoy||d.ans;
    if(show&&show.toLowerCase().replace(/\s/g,'')!==(q.term||'').toLowerCase().replace(/\s/g,''))
      opts.push({text:show,real:false,owner:d.name});
  });
  var shuffled=shuf(opts.slice());
  // Bot votes
  var botUpdates={};
  order.filter(function(p){ return isBot(p)&&p!==tp; }).forEach(function(bn){
    var bpk=encName(bn);
    if(_room.votes&&_room.votes[bpk]) return;
    var vi=Math.random()<0.4?0:Math.floor(Math.random()*shuffled.length);
    botUpdates['tlm3_room/votes/'+bpk]={idx:vi,owner:shuffled[Math.min(vi,shuffled.length-1)].owner,voterName:bn,isBot:true};
  });
  var compute=function(allVotes){
    var correctVoters=[], deceivedBy={};
    Object.values(allVotes).forEach(function(v){
      var vname=v.voterName||v.owner;
      if(v.owner==='__real__') correctVoters.push(vname);
      else{ if(!deceivedBy[v.owner]) deceivedBy[v.owner]=[]; deceivedBy[v.owner].push(vname); }
    });
    var rPts={}; order.forEach(function(p){ rPts[p]=0; });
    order.filter(function(p){ return p!==tp; }).forEach(function(p){
      if(correctVoters.indexOf(p)>=0) rPts[p]+=2;
      if(deceivedBy[p]) rPts[p]+=deceivedBy[p].length;
    });
    var nc=correctVoters.length;
    rPts[tp]=nc===0?4:nc===1?3:nc<=2?1:0;
    var newSc=Object.assign({},_room.scores||{});
    order.forEach(function(p){ newSc[p]=(newSc[p]||0)+(rPts[p]||0); });
    var resOpts=shuffled.map(function(opt){
      return Object.assign({},opt,{voters:opt.real?correctVoters:(deceivedBy[opt.owner]||[])});
    });
    DB.ref('tlm3_room').update({phase:'round_result',roundPts:rPts,scores:newSc,resOpts:resOpts,nc:nc});
  };
  if(Object.keys(botUpdates).length){
    DB.ref().update(botUpdates).then(function(){
      DB.ref('tlm3_room/votes').once('value').then(function(s){ compute(s.val()||{}); });
    });
  } else compute(_room.votes||{});
}

// ── ROUND RESULT ──
function renderRoundResult() {
  if(!_room.resOpts) return '';
  var q=_room.currentQ;
  var turn=_room.currentTurn||0, order=_room.turnOrder||[];
  var tp=order[turn%order.length];
  var rPts=_room.roundPts||{}, scores=_room.scores||{}, nc=_room.nc||0;
  var html='<div class="tbox" style="font-size:1.4rem">'+san(q.term)+'<div class="tcat">'+san(q.cat)+'</div></div>';
  html+='<div style="text-align:center;font-size:.82rem;color:var(--t2);margin-bottom:14px">عرفها <strong>'+nc+'</strong> شخص — '+san(tp)+' حصل على <strong style="color:var(--purp)">'+(rPts[tp]||0)+'</strong> نقطة</div>';
  (_room.resOpts||[]).forEach(function(opt){
    var cls=opt.real?'ok':opt.voters&&opt.voters.length?'dc':'no';
    var label=opt.real?'✅ الإجابة الصحيحة':('🎭 إجابة '+san(opt.owner));
    var votersHtml='<div style="font-size:.7rem;color:var(--t3);margin-top:4px">لم يختره أحد</div>';
    if(opt.voters&&opt.voters.length){
      votersHtml='<div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:7px">';
      opt.voters.forEach(function(v){ votersHtml+='<div style="display:flex;align-items:center;gap:4px;background:var(--sf);border:1px solid var(--bd);border-radius:10px;padding:3px 8px">'+av(v,18)+'<span style="font-size:.7rem;font-weight:600">'+san(v)+'</span></div>'; });
      votersHtml+='</div>';
    }
    html+='<div class="rcard '+cls+'"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px"><span style="font-size:.9rem;font-weight:700">'+san(opt.text)+'</span><span style="font-size:.66rem;color:var(--t3);margin-right:6px;flex-shrink:0">'+label+'</span></div>'+votersHtml+'</div>';
  });
  if(ME.isAdmin){
    html+='<div style="display:flex;gap:8px;margin-top:14px"><button class="bgn" onclick="showLeader()" style="flex:1;padding:12px">📊 الترتيب</button>';
    var isLast=(turn+1)>=(_room.totalTurns||order.length);
    if(!isLast) html+='<button class="bp" onclick="nextTurn()" style="flex:1;padding:12px">▶️ التالي</button>';
    else html+='<button class="bp" onclick="finishGame()" style="flex:1;padding:12px">🏆 النهاية</button>';
    html+='</div><button class="br" onclick="confirmExit()" style="width:100%;margin-top:8px;padding:9px;font-size:.8rem">🚪 إيقاف</button>';
  } else {
    html+='<div class="wbox"><span class="spin"></span> في انتظار المضيف...</div>';
  }
  return html;
}

function showLeader() {
  var scores=_room.scores||{};
  var order=_room.turnOrder||[];
  var turn=_room.currentTurn||0;
  var sorted=order.slice().sort(function(a,b){ return (scores[b]||0)-(scores[a]||0); });
  var rPts=_room.roundPts||{};
  var medals=['🥇','🥈','🥉'];
  var isLast=(turn+1)>=(_room.totalTurns||order.length);
  var el=$('leaderContent'), ri=$('leaderInfo');
  if(ri) ri.textContent='جولة '+(turn+1)+' / '+(_room.totalTurns||order.length);
  if(el){
    var html='<div class="card">';
    sorted.forEach(function(p,i){
      html+='<div class="scr'+(i===0?' top':'')+'"><span style="min-width:26px;font-size:1rem">'+(medals[i]||'')+'</span>'+av(p,34)+'<span style="flex:1;font-size:.88rem;font-weight:700">'+san(p)+(isBot(p)?'<span style="font-size:.6rem;color:var(--t3)"> 🤖</span>':'')+'</span><span style="font-size:.78rem;font-weight:700;color:'+(((rPts[p]||0)>0)?'var(--grn)':'var(--t3)')+';margin-left:6px">+'+(rPts[p]||0)+'</span><span class="scp">'+(scores[p]||0)+'</span></div>';
    });
    html+='</div>';
    if(ME.isAdmin){
      html+='<div style="display:flex;gap:8px">';
      if(!isLast) html+='<button class="bgn" onclick="nextTurn()" style="flex:1;padding:13px">▶️ الدور التالي</button>';
      else html+='<button class="bp" onclick="finishGame()" style="flex:1;padding:13px">🏆 النهاية</button>';
      html+='</div>';
    } else {
      html+='<div style="text-align:center;font-size:.82rem;color:var(--t3);padding:10px">في انتظار المضيف...</div>';
    }
    el.innerHTML=html;
  }
  showPage('pLeader');
}

function nextTurn() {
  var next=(_room.currentTurn||0)+1;
  var q=pickQ(_room.settings&&_room.settings.cats);
  DB.ref('tlm3_room').update({phase:'pick_hint',currentTurn:next,currentQ:q,selectedHint:null,answers:null,votes:null,resOpts:null,roundPts:null});
  showPage('pGame');
}

function finishGame() {
  if(!ME.isAdmin||!_room) return;
  var scores=_room.scores||{};
  var order=_room.turnOrder||[];
  var sorted=order.filter(function(p){ return !isBot(p); }).sort(function(a,b){ return (scores[b]||0)-(scores[a]||0); });
  sorted.forEach(function(p,i){
    var st=lg('tlm_stats')||{};
    if(!st[p]) st[p]={pts:0,games:0,wins:0};
    st[p].pts=(st[p].pts||0)+(scores[p]||0);
    st[p].games=(st[p].games||0)+1;
    if(i===0) st[p].wins=(st[p].wins||0)+1;
    ls('tlm_stats',st);
  });
  DB.ref('tlm3_room').update({phase:'final',finalScores:scores,winner:sorted[0]||''});
}

// ── FINAL ──
function renderFinal() {
  var scores=_room.finalScores||_room.scores||{};
  var order=(_room.turnOrder||[]).filter(function(p){ return !isBot(p); });
  var sorted=order.slice().sort(function(a,b){ return (scores[b]||0)-(scores[a]||0); });
  var medals=['🥇','🥈','🥉'];
  var winner=_room.winner||sorted[0]||'?';
  var html='<div style="background:linear-gradient(135deg,#3b0764,#7e22ce);border-radius:20px;padding:26px;text-align:center;margin-bottom:18px">'+
    '<div style="font-size:3rem;margin-bottom:8px">🏆</div>'+
    '<div style="font-family:Lexend,sans-serif;font-size:1.4rem;font-weight:900;color:#fff">'+san(winner)+' الفائز!</div>'+
    '<div style="font-size:.82rem;color:rgba(255,255,255,.5);margin-top:4px">'+(scores[winner]||0)+' نقطة</div></div>';
  sorted.forEach(function(p,i){
    html+='<div class="scr'+(i===0?' top':'')+'"><span style="min-width:28px;font-size:1.1rem">'+(medals[i]||'')+'</span>'+av(p,36)+'<span style="flex:1;font-size:.9rem;font-weight:700">'+san(p)+'</span><span class="scp">'+(scores[p]||0)+'</span></div>';
  });
  if(ME.isAdmin) html+='<button class="br" onclick="if(confirm(\'إغلاق الغرفة؟\')){DB.ref(\'tlm3_room\').remove();navHome();}" style="width:100%;margin-top:16px;padding:12px">🗑️ إغلاق الغرفة</button>';
  return html;
}

// ══ BOOT ══
window.addEventListener('load', function(){
  var saved=localStorage.getItem('tlm_name');
  if(saved){
    DB.ref('tlm3_profiles/'+encName(saved)).once('value').then(function(snap){
      if(snap.exists()&&snap.val().expires>Date.now()){
        var p=snap.val();
        ME.name=saved; ME.isAdmin=(saved===ADMIN);
        if(p.photo){ ME.photo=p.photo; PHOTOS[saved]=p.photo; }
        _startSession();
      } else {
        var ni=$('nameInp'); if(ni) ni.value=saved;
        showPage('pLogin'); goStep1();
      }
    });
  } else {
    showPage('pLogin'); goStep1();
  }
});