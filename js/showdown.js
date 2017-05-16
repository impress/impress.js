/*
   A A L        Source code at:
   T C A   <http://www.attacklab.net/>
   T K B
*/

var Showdown={};
Showdown.converter=function(){
var _1;
var _2;
var _3;
var _4=0;
this.makeHtml=function(_5){
_1=new Array();
_2=new Array();
_3=new Array();
_5=_5.replace(/~/g,"~T");
_5=_5.replace(/\$/g,"~D");
_5=_5.replace(/\r\n/g,"\n");
_5=_5.replace(/\r/g,"\n");
_5="\n\n"+_5+"\n\n";
_5=_6(_5);
_5=_5.replace(/^[ \t]+$/mg,"");
_5=_7(_5);
_5=_8(_5);
_5=_9(_5);
_5=_a(_5);
_5=_5.replace(/~D/g,"$$");
_5=_5.replace(/~T/g,"~");
return _5;
};
var _8=function(_b){
var _b=_b.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,function(_c,m1,m2,m3,m4){
m1=m1.toLowerCase();
_1[m1]=_11(m2);
if(m3){
return m3+m4;
}else{
if(m4){
_2[m1]=m4.replace(/"/g,"&quot;");
}
}
return "";
});
return _b;
};
var _7=function(_12){
_12=_12.replace(/\n/g,"\n\n");
var _13="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del";
var _14="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";
_12=_12.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,_15);
_12=_12.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,_15);
_12=_12.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,_15);
_12=_12.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,_15);
_12=_12.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,_15);
_12=_12.replace(/\n\n/g,"\n");
return _12;
};
var _15=function(_16,m1){
var _18=m1;
_18=_18.replace(/\n\n/g,"\n");
_18=_18.replace(/^\n/,"");
_18=_18.replace(/\n+$/g,"");
_18="\n\n~K"+(_3.push(_18)-1)+"K\n\n";
return _18;
};
var _9=function(_19){
_19=_1a(_19);
var key=_1c("<hr />");
_19=_19.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,key);
_19=_19.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,key);
_19=_19.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,key);
_19=_1d(_19);
_19=_1e(_19);
_19=_1f(_19);
_19=_7(_19);
_19=_20(_19);
return _19;
};
var _21=function(_22){
_22=_23(_22);
_22=_24(_22);
_22=_25(_22);
_22=_26(_22);
_22=_27(_22);
_22=_28(_22);
_22=_11(_22);
_22=_29(_22);
_22=_22.replace(/  +\n/g," <br />\n");
return _22;
};
var _24=function(_2a){
var _2b=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;
_2a=_2a.replace(_2b,function(_2c){
var tag=_2c.replace(/(.)<\/?code>(?=.)/g,"$1`");
tag=_2e(tag,"\\`*_");
return tag;
});
return _2a;
};
var _27=function(_2f){
_2f=_2f.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,_30);
_2f=_2f.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,_30);
_2f=_2f.replace(/(\[([^\[\]]+)\])()()()()()/g,_30);
return _2f;
};
var _30=function(_31,m1,m2,m3,m4,m5,m6,m7){
if(m7==undefined){
m7="";
}
var _39=m1;
var _3a=m2;
var _3b=m3.toLowerCase();
var url=m4;
var _3d=m7;
if(url==""){
if(_3b==""){
_3b=_3a.toLowerCase().replace(/ ?\n/g," ");
}
url="#"+_3b;
if(_1[_3b]!=undefined){
url=_1[_3b];
if(_2[_3b]!=undefined){
_3d=_2[_3b];
}
}else{
if(_39.search(/\(\s*\)$/m)>-1){
url="";
}else{
return _39;
}
}
}
url=_2e(url,"*_");
var _3e="<a href=\""+url+"\"";
if(_3d!=""){
_3d=_3d.replace(/"/g,"&quot;");
_3d=_2e(_3d,"*_");
_3e+=" title=\""+_3d+"\"";
}
_3e+=">"+_3a+"</a>";
return _3e;
};
var _26=function(_3f){
_3f=_3f.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,_40);
_3f=_3f.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,_40);
return _3f;
};
var _40=function(_41,m1,m2,m3,m4,m5,m6,m7){
var _49=m1;
var _4a=m2;
var _4b=m3.toLowerCase();
var url=m4;
var _4d=m7;
if(!_4d){
_4d="";
}
if(url==""){
if(_4b==""){
_4b=_4a.toLowerCase().replace(/ ?\n/g," ");
}
url="#"+_4b;
if(_1[_4b]!=undefined){
url=_1[_4b];
if(_2[_4b]!=undefined){
_4d=_2[_4b];
}
}else{
return _49;
}
}
_4a=_4a.replace(/"/g,"&quot;");
url=_2e(url,"*_");
var _4e="<img src=\""+url+"\" alt=\""+_4a+"\"";
_4d=_4d.replace(/"/g,"&quot;");
_4d=_2e(_4d,"*_");
_4e+=" title=\""+_4d+"\"";
_4e+=" />";
return _4e;
};
var _1a=function(_4f){
_4f=_4f.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(_50,m1){
return _1c("<h1>"+_21(m1)+"</h1>");
});
_4f=_4f.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(_52,m1){
return _1c("<h2>"+_21(m1)+"</h2>");
});
_4f=_4f.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(_54,m1,m2){
var _57=m1.length;
return _1c("<h"+_57+">"+_21(m2)+"</h"+_57+">");
});
return _4f;
};
var _58;
var _1d=function(_59){
_59+="~0";
var _5a=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
if(_4){
_59=_59.replace(_5a,function(_5b,m1,m2){
var _5e=m1;
var _5f=(m2.search(/[*+-]/g)>-1)?"ul":"ol";
_5e=_5e.replace(/\n{2,}/g,"\n\n\n");
var _60=_58(_5e);
_60=_60.replace(/\s+$/,"");
_60="<"+_5f+">"+_60+"</"+_5f+">\n";
return _60;
});
}else{
_5a=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;
_59=_59.replace(_5a,function(_61,m1,m2,m3){
var _65=m1;
var _66=m2;
var _67=(m3.search(/[*+-]/g)>-1)?"ul":"ol";
var _66=_66.replace(/\n{2,}/g,"\n\n\n");
var _68=_58(_66);
_68=_65+"<"+_67+">\n"+_68+"</"+_67+">\n";
return _68;
});
}
_59=_59.replace(/~0/,"");
return _59;
};
_58=function(_69){
_4++;
_69=_69.replace(/\n{2,}$/,"\n");
_69+="~0";
_69=_69.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(_6a,m1,m2,m3,m4){
var _6f=m4;
var _70=m1;
var _71=m2;
if(_70||(_6f.search(/\n{2,}/)>-1)){
_6f=_9(_72(_6f));
}else{
_6f=_1d(_72(_6f));
_6f=_6f.replace(/\n$/,"");
_6f=_21(_6f);
}
return "<li>"+_6f+"</li>\n";
});
_69=_69.replace(/~0/g,"");
_4--;
return _69;
};
var _1e=function(_73){
_73+="~0";
_73=_73.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(_74,m1,m2){
var _77=m1;
var _78=m2;
_77=_79(_72(_77));
_77=_6(_77);
_77=_77.replace(/^\n+/g,"");
_77=_77.replace(/\n+$/g,"");
_77="<pre><code>"+_77+"\n</code></pre>";
return _1c(_77)+_78;
});
_73=_73.replace(/~0/,"");
return _73;
};
var _1c=function(_7a){
_7a=_7a.replace(/(^\n+|\n+$)/g,"");
return "\n\n~K"+(_3.push(_7a)-1)+"K\n\n";
};
var _23=function(_7b){
_7b=_7b.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(_7c,m1,m2,m3,m4){
var c=m3;
c=c.replace(/^([ \t]*)/g,"");
c=c.replace(/[ \t]*$/g,"");
c=_79(c);
return m1+"<code>"+c+"</code>";
});
return _7b;
};
var _79=function(_82){
_82=_82.replace(/&/g,"&amp;");
_82=_82.replace(/</g,"&lt;");
_82=_82.replace(/>/g,"&gt;");
_82=_2e(_82,"*_{}[]\\",false);
return _82;
};
var _29=function(_83){
_83=_83.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>");
_83=_83.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>");
return _83;
};
var _1f=function(_84){
_84=_84.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(_85,m1){
var bq=m1;
bq=bq.replace(/^[ \t]*>[ \t]?/gm,"~0");
bq=bq.replace(/~0/g,"");
bq=bq.replace(/^[ \t]+$/gm,"");
bq=_9(bq);
bq=bq.replace(/(^|\n)/g,"$1  ");
bq=bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(_88,m1){
var pre=m1;
pre=pre.replace(/^  /mg,"~0");
pre=pre.replace(/~0/g,"");
return pre;
});
return _1c("<blockquote>\n"+bq+"\n</blockquote>");
});
return _84;
};
var _20=function(_8b){
_8b=_8b.replace(/^\n+/g,"");
_8b=_8b.replace(/\n+$/g,"");
var _8c=_8b.split(/\n{2,}/g);
var _8d=new Array();
var end=_8c.length;
for(var i=0;i<end;i++){
var str=_8c[i];
if(str.search(/~K(\d+)K/g)>=0){
_8d.push(str);
}else{
if(str.search(/\S/)>=0){
str=_21(str);
str=str.replace(/^([ \t]*)/g,"<p>");
str+="</p>";
_8d.push(str);
}
}
}
end=_8d.length;
for(var i=0;i<end;i++){
while(_8d[i].search(/~K(\d+)K/)>=0){
var _91=_3[RegExp.$1];
_91=_91.replace(/\$/g,"$$$$");
_8d[i]=_8d[i].replace(/~K\d+K/,_91);
}
}
return _8d.join("\n\n");
};
var _11=function(_92){
_92=_92.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");
_92=_92.replace(/<(?![a-z\/?\$!])/gi,"&lt;");
return _92;
};
var _25=function(_93){
_93=_93.replace(/\\(\\)/g,_94);
_93=_93.replace(/\\([`*_{}\[\]()>#+-.!])/g,_94);
return _93;
};
var _28=function(_95){
_95=_95.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,"<a href=\"$1\">$1</a>");
_95=_95.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(_96,m1){
return _98(_a(m1));
});
return _95;
};
var _98=function(_99){
function char2hex(ch){
var _9b="0123456789ABCDEF";
var dec=ch.charCodeAt(0);
return (_9b.charAt(dec>>4)+_9b.charAt(dec&15));
}
var _9d=[function(ch){
return "&#"+ch.charCodeAt(0)+";";
},function(ch){
return "&#x"+char2hex(ch)+";";
},function(ch){
return ch;
}];
_99="mailto:"+_99;
_99=_99.replace(/./g,function(ch){
if(ch=="@"){
ch=_9d[Math.floor(Math.random()*2)](ch);
}else{
if(ch!=":"){
var r=Math.random();
ch=(r>0.9?_9d[2](ch):r>0.45?_9d[1](ch):_9d[0](ch));
}
}
return ch;
});
_99="<a href=\""+_99+"\">"+_99+"</a>";
_99=_99.replace(/">.+:/g,"\">");
return _99;
};
var _a=function(_a3){
_a3=_a3.replace(/~E(\d+)E/g,function(_a4,m1){
var _a6=parseInt(m1);
return String.fromCharCode(_a6);
});
return _a3;
};
var _72=function(_a7){
_a7=_a7.replace(/^(\t|[ ]{1,4})/gm,"~0");
_a7=_a7.replace(/~0/g,"");
return _a7;
};
var _6=function(_a8){
_a8=_a8.replace(/\t(?=\t)/g,"    ");
_a8=_a8.replace(/\t/g,"~A~B");
_a8=_a8.replace(/~B(.+?)~A/g,function(_a9,m1,m2){
var _ac=m1;
var _ad=4-_ac.length%4;
for(var i=0;i<_ad;i++){
_ac+=" ";
}
return _ac;
});
_a8=_a8.replace(/~A/g,"    ");
_a8=_a8.replace(/~B/g,"");
return _a8;
};
var _2e=function(_af,_b0,_b1){
var _b2="(["+_b0.replace(/([\[\]\\])/g,"\\$1")+"])";
if(_b1){
_b2="\\\\"+_b2;
}
var _b3=new RegExp(_b2,"g");
_af=_af.replace(_b3,_94);
return _af;
};
var _94=function(_b4,m1){
var _b6=m1.charCodeAt(0);
return "~E"+_b6+"E";
};
};
if(typeof exports!='undefined')exports.Showdown=Showdown;