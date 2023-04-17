(function(){"use strict";const fe={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},ve={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},ge="[^aeiou]",A="[aeiouy]",b=ge+"[^aeiouy]*",E=A+"[aeiou]*",D="^("+b+")?"+E+b,be="^("+b+")?"+E+b+"("+E+")?$",$="^("+b+")?"+E+b+E+b,G="^("+b+")?"+A;function pe(e){let s,n,t,i,o,r;if(e.length<3)return e;const u=e.substring(0,1);if(u=="y"&&(e=u.toUpperCase()+e.substring(1)),t=/^(.+?)(ss|i)es$/,i=/^(.+?)([^s])s$/,t.test(e)?e=e.replace(t,"$1$2"):i.test(e)&&(e=e.replace(i,"$1$2")),t=/^(.+?)eed$/,i=/^(.+?)(ed|ing)$/,t.test(e)){const a=t.exec(e);t=new RegExp(D),t.test(a[1])&&(t=/.$/,e=e.replace(t,""))}else i.test(e)&&(s=i.exec(e)[1],i=new RegExp(G),i.test(s)&&(e=s,i=/(at|bl|iz)$/,o=new RegExp("([^aeiouylsz])\\1$"),r=new RegExp("^"+b+A+"[^aeiouwxy]$"),i.test(e)?e=e+"e":o.test(e)?(t=/.$/,e=e.replace(t,"")):r.test(e)&&(e=e+"e")));if(t=/^(.+?)y$/,t.test(e)){const a=t.exec(e);s=a==null?void 0:a[1],t=new RegExp(G),s&&t.test(s)&&(e=s+"i")}if(t=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,t.test(e)){const a=t.exec(e);s=a==null?void 0:a[1],n=a==null?void 0:a[2],t=new RegExp(D),s&&t.test(s)&&(e=s+fe[n])}if(t=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,t.test(e)){const a=t.exec(e);s=a==null?void 0:a[1],n=a==null?void 0:a[2],t=new RegExp(D),s&&t.test(s)&&(e=s+ve[n])}if(t=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,i=/^(.+?)(s|t)(ion)$/,t.test(e)){const a=t.exec(e);s=a==null?void 0:a[1],t=new RegExp($),s&&t.test(s)&&(e=s)}else if(i.test(e)){const a=i.exec(e);s=(a==null?void 0:a[1])??""+(a==null?void 0:a[2])??"",i=new RegExp($),i.test(s)&&(e=s)}if(t=/^(.+?)e$/,t.test(e)){const a=t.exec(e);s=a==null?void 0:a[1],t=new RegExp($),i=new RegExp(be),o=new RegExp("^"+b+A+"[^aeiouwxy]$"),s&&(t.test(s)||i.test(s)&&!o.test(s))&&(e=s)}return t=/ll$/,i=new RegExp($),t.test(e)&&i.test(e)&&(t=/.$/,e=e.replace(t,"")),u=="y"&&(e=u.toLowerCase()+e.substring(1)),e}const K=192,ke=383,we=[65,65,65,65,65,65,65,67,69,69,69,69,73,73,73,73,69,78,79,79,79,79,79,null,79,85,85,85,85,89,80,115,97,97,97,97,97,97,97,99,101,101,101,101,105,105,105,105,101,110,111,111,111,111,111,null,111,117,117,117,117,121,112,121,65,97,65,97,65,97,67,99,67,99,67,99,67,99,68,100,68,100,69,101,69,101,69,101,69,101,69,101,71,103,71,103,71,103,71,103,72,104,72,104,73,105,73,105,73,105,73,105,73,105,73,105,74,106,75,107,107,76,108,76,108,76,108,76,108,76,108,78,110,78,110,78,110,110,78,110,79,111,79,111,79,111,79,111,82,114,82,114,82,114,83,115,83,115,83,115,83,115,84,116,84,116,84,116,85,117,85,117,85,117,85,117,85,117,85,117,87,119,89,121,89,90,122,90,122,90,122,115];function je(e){return e<K||e>ke?e:we[e-K]||e}function ye(e){const s=[];for(let n=0;n<e.length;n++)s[n]=je(e.charCodeAt(n));return String.fromCharCode(...s)}const Y=["arabic","armenian","bulgarian","danish","dutch","english","finnish","french","german","greek","hungarian","indian","indonesian","irish","italian","lithuanian","nepali","norwegian","portuguese","romanian","russian","serbian","slovenian","spanish","swedish","turkish","ukrainian"];function Oe(e){return`Invalid schema type. Expected string or object, but got ${e}.`}function C(e,s){return`Invalid property name. Expected a wildcard string ("*") or array containing one of the following properties: ${s.join(", ")}, but got: ${e}.`}function Se(e){return`${e} works on edge only. Use edge: true in Lyra constructor to enable it.`}function Ie(){return"Invalid hooks object."}function Ee(e){return`The following hooks aren't supported. Hooks: ${e}`}function _e(e){return`Language "${e}" is not supported.
Supported languages are:
 - ${Y.join(`
 - `)}`}function Le(){return"Custom stop words array must only contain strings."}function Z(){return"Custom stop words must be a function or an array of strings."}function Ae(){return"tokenizer.stemmingFn property must be a function."}function $e(){return"tokenizer.tokenizerFn must be a function."}function xe(){return"Boost value must be a number greater than, or less than 0."}function ze(e){return`You can only use one operation per filter. Found ${e.length}: ${e.join(", ")}`}const J={english:["i","me","my","myself","we","us","our","ours","ourselves","you","your","yours","yourself","yourselves","he","him","his","himself","she","her","hers","herself","it","its","itself","they","them","their","theirs","themselves","what","which","who","whom","this","that","these","those","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","doing","will","would","shall","should","can","could","may","might","must","ought","i'm","you're","he's","she's","it's","we're","they're","i've","you've","we've","they've","i'd","you'd","he'd","she'd","we'd","they'd","i'll","you'll","he'll","she'll","we'll","they'll","isn't","aren't","wasn't","weren't","hasn't","haven't","hadn't","doesn't","don't","didn't","won't","wouldn't","shan't","shouldn't","can't","cannot","couldn't","mustn't","let's","that's","who's","what's","here's","there's","when's","where's","why's","how's","an","the","and","but","if","or","because","as","until","while","of","at","by","for","with","about","against","between","into","through","during","before","after","above","below","to","from","up","down","in","out","on","off","over","under","again","further","then","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very"],italian:["ad","al","allo","ai","agli","all","agl","alla","alle","con","col","coi","da","dal","dallo","dai","dagli","dall","dagl","dalla","dalle","di","del","dello","dei","degli","dell","degl","della","delle","in","nel","nello","nei","negli","nell","negl","nella","nelle","su","sul","sullo","sui","sugli","sull","sugl","sulla","sulle","per","tra","contro","io","tu","lui","lei","noi","voi","loro","mio","mia","miei","mie","tuo","tua","tuoi","tue","suo","sua","suoi","sue","nostro","nostra","nostri","nostre","vostro","vostra","vostri","vostre","mi","ti","ci","vi","lo","la","li","le","gli","ne","il","un","uno","una","ma","ed","se","perché","anche","come","dov","dove","che","chi","cui","non","più","quale","quanto","quanti","quanta","quante","quello","quelli","quella","quelle","questo","questi","questa","queste","si","tutto","tutti","a","c","e","i","l","o","ho","hai","ha","abbiamo","avete","hanno","abbia","abbiate","abbiano","avrò","avrai","avrà","avremo","avrete","avranno","avrei","avresti","avrebbe","avremmo","avreste","avrebbero","avevo","avevi","aveva","avevamo","avevate","avevano","ebbi","avesti","ebbe","avemmo","aveste","ebbero","avessi","avesse","avessimo","avessero","avendo","avuto","avuta","avuti","avute","sono","sei","è","siamo","siete","sia","siate","siano","sarò","sarai","sarà","saremo","sarete","saranno","sarei","saresti","sarebbe","saremmo","sareste","sarebbero","ero","eri","era","eravamo","eravate","erano","fui","fosti","fu","fummo","foste","furono","fossi","fosse","fossimo","fossero","essendo","faccio","fai","facciamo","fanno","faccia","facciate","facciano","farò","farai","farà","faremo","farete","faranno","farei","faresti","farebbe","faremmo","fareste","farebbero","facevo","facevi","faceva","facevamo","facevate","facevano","feci","facesti","fece","facemmo","faceste","fecero","facessi","facesse","facessimo","facessero","facendo","sto","stai","sta","stiamo","stanno","stia","stiate","stiano","starò","starai","starà","staremo","starete","staranno","starei","staresti","starebbe","staremmo","stareste","starebbero","stavo","stavi","stava","stavamo","stavate","stavano","stetti","stesti","stette","stemmo","steste","stettero","stessi","stesse","stessimo","stessero","stando"],french:["au","aux","avec","ce","ces","dans","de","des","du","elle","en","et","eux","il","je","la","le","leur","lui","ma","mais","me","même","mes","moi","mon","ne","nos","notre","nous","on","ou","par","pas","pour","qu","que","qui","sa","se","ses","son","sur","ta","te","tes","toi","ton","tu","un","une","vos","votre","vous","c","d","j","l","à","m","n","s","t","y","","été","étée","étées","étés","étant","suis","es","est","sommes","êtes","sont","serai","seras","sera","serons","serez","seront","serais","serait","serions","seriez","seraient","étais","était","étions","étiez","étaient","fus","fut","fûmes","fûtes","furent","sois","soit","soyons","soyez","soient","fusse","fusses","fût","fussions","fussiez","fussent","ayant","eu","eue","eues","eus","ai","as","avons","avez","ont","aurai","auras","aura","aurons","aurez","auront","aurais","aurait","aurions","auriez","auraient","avais","avait","avions","aviez","avaient","eut","eûmes","eûtes","eurent","aie","aies","ait","ayons","ayez","aient","eusse","eusses","eût","eussions","eussiez","eussent","ceci","cela","celà","cet","cette","ici","ils","les","leurs","quel","quels","quelle","quelles","sans","soi"],spanish:["de","la","que","el","en","y","a","los","del","se","las","por","un","para","con","no","una","su","al","lo","como","más","pero","sus","le","ya","o","este","sí","porque","esta","entre","cuando","muy","sin","sobre","también","me","hasta","hay","donde","quien","desde","todo","nos","durante","todos","uno","les","ni","contra","otros","ese","eso","ante","ellos","e","esto","mí","antes","algunos","qué","unos","yo","otro","otras","otra","él","tanto","esa","estos","mucho","quienes","nada","muchos","cual","poco","ella","estar","estas","algunas","algo","nosotros","mi","mis","tú","te","ti","tu","tus","ellas","nosotras","vosotros","vosotras","os","mío","mía","míos","mías","tuyo","tuya","tuyos","tuyas","suyo","suya","suyos","suyas","nuestro","nuestra","nuestros","nuestras","vuestro","vuestra","vuestros","vuestras","esos","esas","estoy","estás","está","estamos","estáis","están","esté","estés","estemos","estéis","estén","estaré","estarás","estará","estaremos","estaréis","estarán","estaría","estarías","estaríamos","estaríais","estarían","estaba","estabas","estábamos","estabais","estaban","estuve","estuviste","estuvo","estuvimos","estuvisteis","estuvieron","estuviera","estuvieras","estuviéramos","estuvierais","estuvieran","estuviese","estuvieses","estuviésemos","estuvieseis","estuviesen","estando","estado","estada","estados","estadas","estad","he","has","ha","hemos","habéis","han","haya","hayas","hayamos","hayáis","hayan","habré","habrás","habrá","habremos","habréis","habrán","habría","habrías","habríamos","habríais","habrían","había","habías","habíamos","habíais","habían","hube","hubiste","hubo","hubimos","hubisteis","hubieron","hubiera","hubieras","hubiéramos","hubierais","hubieran","hubiese","hubieses","hubiésemos","hubieseis","hubiesen","habiendo","habido","habida","habidos","habidas","soy","eres","es","somos","sois","son","sea","seas","seamos","seáis","sean","seré","serás","será","seremos","seréis","serán","sería","serías","seríamos","seríais","serían","era","eras","éramos","erais","eran","fui","fuiste","fue","fuimos","fuisteis","fueron","fuera","fueras","fuéramos","fuerais","fueran","fuese","fueses","fuésemos","fueseis","fuesen","siendo","sido","tengo","tienes","tiene","tenemos","tenéis","tienen","tenga","tengas","tengamos","tengáis","tengan","tendré","tendrás","tendrá","tendremos","tendréis","tendrán","tendría","tendrías","tendríamos","tendríais","tendrían","tenía","tenías","teníamos","teníais","tenían","tuve","tuviste","tuvo","tuvimos","tuvisteis","tuvieron","tuviera","tuvieras","tuviéramos","tuvierais","tuvieran","tuviese","tuvieses","tuviésemos","tuvieseis","tuviesen","teniendo","tenido","tenida","tenidos","tenidas","tened"],portuguese:["de","a","o","que","e","do","da","em","um","para","com","não","uma","os","no","se","na","por","mais","as","dos","como","mas","ao","ele","das","à","seu","sua","ou","quando","muito","nos","já","eu","também","só","pelo","pela","até","isso","ela","entre","depois","sem","mesmo","aos","seus","quem","nas","me","esse","eles","você","essa","num","nem","suas","meu","às","minha","numa","pelos","elas","qual","nós","lhe","deles","essas","esses","pelas","este","dele","tu","te","vocês","vos","lhes","meus","minhas","teu","tua","teus","tuas","nosso","nossa","nossos","nossas","dela","delas","esta","estes","estas","aquele","aquela","aqueles","aquelas","isto","aquilo","estou","está","estamos","estão","estive","esteve","estivemos","estiveram","estava","estávamos","estavam","estivera","estivéramos","esteja","estejamos","estejam","estivesse","estivéssemos","estivessem","estiver","estivermos","estiverem","hei","há","havemos","hão","houve","houvemos","houveram","houvera","houvéramos","haja","hajamos","hajam","houvesse","houvéssemos","houvessem","houver","houvermos","houverem","houverei","houverá","houveremos","houverão","houveria","houveríamos","houveriam","sou","somos","são","era","éramos","eram","fui","foi","fomos","foram","fora","fôramos","seja","sejamos","sejam","fosse","fôssemos","fossem","for","formos","forem","serei","será","seremos","serão","seria","seríamos","seriam","tenho","tem","temos","tém","tinha","tínhamos","tinham","tive","teve","tivemos","tiveram","tivera","tivéramos","tenha","tenhamos","tenham","tivesse","tivéssemos","tivessem","tiver","tivermos","tiverem","terei","terá","teremos","terão","teria","teríamos","teriam"],dutch:["de","en","van","ik","te","dat","die","in","een","hij","het","niet","zijn","is","was","op","aan","met","als","voor","had","er","maar","om","hem","dan","zou","of","wat","mijn","men","dit","zo","door","over","ze","zich","bij","ook","tot","je","mij","uit","der","daar","haar","naar","heb","hoe","heeft","hebben","deze","u","want","nog","zal","me","zij","nu","ge","geen","omdat","iets","worden","toch","al","waren","veel","meer","doen","toen","moet","ben","zonder","kan","hun","dus","alles","onder","ja","eens","hier","wie","werd","altijd","doch","wordt","wezen","kunnen","ons","zelf","tegen","na","reeds","wil","kon","niets","uw","iemand","geweest","andere"],swedish:["och","det","att","i","en","jag","hon","som","han","på","den","med","var","sig","för","så","till","är","men","ett","om","hade","de","av","icke","mig","du","henne","då","sin","nu","har","inte","hans","honom","skulle","hennes","där","min","man","ej","vid","kunde","något","från","ut","när","efter","upp","vi","dem","vara","vad","över","än","dig","kan","sina","här","ha","mot","alla","under","någon","eller","allt","mycket","sedan","ju","denna","själv","detta","åt","utan","varit","hur","ingen","mitt","ni","bli","blev","oss","din","dessa","några","deras","blir","mina","samma","vilken","er","sådan","vår","blivit","dess","inom","mellan","sådant","varför","varje","vilka","ditt","vem","vilket","sitta","sådana","vart","dina","vars","vårt","våra","ert","era","vilkas"],russian:["и","в","во","не","что","он","на","я","с","со","как","а","то","все","она","так","его","но","да","ты","к","у","же","вы","за","бы","по","только","ее","мне","было","вот","от","меня","еще","нет","о","из","ему","теперь","когда","даже","ну","вдруг","ли","если","уже","или","ни","быть","был","него","до","вас","нибудь","опять","уж","вам","сказал","ведь","там","потом","себя","ничего","ей","может","они","тут","где","есть","надо","ней","для","мы","тебя","их","чем","была","сам","чтоб","без","будто","человек","чего","раз","тоже","себе","под","жизнь","будет","ж","тогда","кто","этот","говорил","того","потому","этого","какой","совсем","ним","здесь","этом","один","почти","мой","тем","чтобы","нее","кажется","сейчас","были","куда","зачем","сказать","всех","никогда","сегодня","можно","при","наконец","два","об","другой","хоть","после","над","больше","тот","через","эти","нас","про","всего","них","какая","много","разве","сказала","три","эту","моя","впрочем","хорошо","свою","этой","перед","иногда","лучше","чуть","том","нельзя","такой","им","более","всегда","конечно","всю","между"],norwegian:["og","i","jeg","det","at","en","et","den","til","er","som","på","de","med","han","av","ikke","ikkje","der","så","var","meg","seg","men","ett","har","om","vi","min","mitt","ha","hadde","hun","nå","over","da","ved","fra","du","ut","sin","dem","oss","opp","man","kan","hans","hvor","eller","hva","skal","selv","sjøl","her","alle","vil","bli","ble","blei","blitt","kunne","inn","når","være","kom","noen","noe","ville","dere","som","deres","kun","ja","etter","ned","skulle","denne","for","deg","si","sine","sitt","mot","å","meget","hvorfor","dette","disse","uten","hvordan","ingen","din","ditt","blir","samme","hvilken","hvilke","sånn","inni","mellom","vår","hver","hvem","vors","hvis","både","bare","enn","fordi","før","mange","også","slik","vært","være","båe","begge","siden","dykk","dykkar","dei","deira","deires","deim","di","då","eg","ein","eit","eitt","elles","honom","hjå","ho","hoe","henne","hennar","hennes","hoss","hossen","ikkje","ingi","inkje","korleis","korso","kva","kvar","kvarhelst","kven","kvi","kvifor","me","medan","mi","mine","mykje","no","nokon","noka","nokor","noko","nokre","si","sia","sidan","so","somt","somme","um","upp","vere","vore","verte","vort","varte","vart"],german:["aber","alle","allem","allen","aller","alles","als","also","am","an","ander","andere","anderem","anderen","anderer","anderes","anderm","andern","anderr","anders","auch","auf","aus","bei","bin","bis","bist","da","damit","dann","der","den","des","dem","die","das","daß","derselbe","derselben","denselben","desselben","demselben","dieselbe","dieselben","dasselbe","dazu","dein","deine","deinem","deinen","deiner","deines","denn","derer","dessen","dich","dir","du","dies","diese","diesem","diesen","dieser","dieses","doch","dort","durch","ein","eine","einem","einen","einer","eines","einig","einige","einigem","einigen","einiger","einiges","einmal","er","ihn","ihm","es","etwas","euer","eure","eurem","euren","eurer","eures","für","gegen","gewesen","hab","habe","haben","hat","hatte","hatten","hier","hin","hinter","ich","mich","mir","ihr","ihre","ihrem","ihren","ihrer","ihres","euch","im","in","indem","ins","ist","jede","jedem","jeden","jeder","jedes","jene","jenem","jenen","jener","jenes","jetzt","kann","kein","keine","keinem","keinen","keiner","keines","können","könnte","machen","man","manche","manchem","manchen","mancher","manches","mein","meine","meinem","meinen","meiner","meines","mit","muss","musste","nach","nicht","nichts","noch","nun","nur","ob","oder","ohne","sehr","sein","seine","seinem","seinen","seiner","seines","selbst","sich","sie","ihnen","sind","so","solche","solchem","solchen","solcher","solches","soll","sollte","sondern","sonst","über","um","und","uns","unse","unsem","unsen","unser","unses","unter","viel","vom","von","vor","während","war","waren","warst","was","weg","weil","weiter","welche","welchem","welchen","welcher","welches","wenn","werde","werden","wie","wieder","will","wir","wird","wirst","wo","wollen","wollte","würde","würden","zu","zum","zur","zwar","zwischen"],danish:["og","i","jeg","det","at","en","den","til","er","som","på","de","med","han","af","for","ikke","der","var","mig","sig","men","et","har","om","vi","min","havde","ham","hun","nu","over","da","fra","du","ud","sin","dem","os","op","man","hans","hvor","eller","hvad","skal","selv","her","alle","vil","blev","kunne","ind","når","være","dog","noget","ville","jo","deres","efter","ned","skulle","denne","end","dette","mit","også","under","have","dig","anden","hende","mine","alt","meget","sit","sine","vor","mod","disse","hvis","din","nogle","hos","blive","mange","ad","bliver","hendes","været","thi","jer","sådan"],finnish:["olla","olen","olet","on","olemme","olette","ovat","ole","oli","olisi","olisit","olisin","olisimme","olisitte","olisivat","olit","olin","olimme","olitte","olivat","ollut","olleet","en","et","ei","emme","ette","eivät","minä","minun","minut","minua","minussa","minusta","minuun","minulla","minulta","minulle","sinä","sinun","sinut","sinua","sinussa","sinusta","sinuun","sinulla","sinulta","sinulle","hän","hänen","hänet","häntä","hänessä","hänestä","häneen","hänellä","häneltä","hänelle","me","meidän","meidät","meitä","meissä","meistä","meihin","meillä","meiltä","meille","te","teidän","teidät","teitä","teissä","teistä","teihin","teillä","teiltä","teille","he","heidän","heidät","heitä","heissä","heistä","heihin","heillä","heiltä","heille","tämä","tämän","tätä","tässä","tästä","tähän","tällä","tältä","tälle","tänä","täksi","tuo","tuon","tuota","tuossa","tuosta","tuohon","tuolla","tuolta","tuolle","tuona","tuoksi","se","sen","sitä","siinä","siitä","siihen","sillä","siltä","sille","sinä","siksi","nämä","näiden","näitä","näissä","näistä","näihin","näillä","näiltä","näille","näinä","näiksi","nuo","noiden","noita","noissa","noista","noihin","noilla","noilta","noille","noina","noiksi","ne","niiden","niitä","niissä","niistä","niihin","niillä","niiltä","niille","niinä","niiksi","kuka","kenen","kenet","ketä","kenessä","kenestä","keneen","kenellä","keneltä","kenelle","kenenä","keneksi","ketkä","keiden","ketkä","keitä","keissä","keistä","keihin","keillä","keiltä","keille","keinä","keiksi","mikä","minkä","minkä","mitä","missä","mistä","mihin","millä","miltä","mille","minä","miksi","mitkä","joka","jonka","jota","jossa","josta","johon","jolla","jolta","jolle","jona","joksi","jotka","joiden","joita","joissa","joista","joihin","joilla","joilta","joille","joina","joiksi","että","ja","jos","koska","kuin","mutta","niin","sekä","sillä","tai","vaan","vai","vaikka","kanssa","mukaan","noin","poikki","yli","kun","niin","nyt","itse"]},Te=Object.keys(J),De={dutch:/[^A-Za-zàèéìòóù0-9_'-]+/gim,english:/[^A-Za-zàèéìòóù0-9_'-]+/gim,french:/[^a-z0-9äâàéèëêïîöôùüûœç-]+/gim,italian:/[^A-Za-zàèéìòóù0-9_'-]+/gim,norwegian:/[^a-z0-9_æøåÆØÅäÄöÖüÜ]+/gim,portuguese:/[^a-z0-9à-úÀ-Ú]/gim,russian:/[^a-z0-9а-яА-ЯёЁ]+/gim,spanish:/[^a-z0-9A-Zá-úÁ-ÚñÑüÜ]+/gim,swedish:/[^a-z0-9_åÅäÄöÖüÜ-]+/gim,german:/[^a-z0-9A-ZäöüÄÖÜß]+/gim,finnish:/[^a-z0-9äöÄÖ]+/gim,danish:/[^a-z0-9æøåÆØÅ]+/gim,hungarian:/[^a-z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]+/gim,romanian:/[^a-z0-9ăâîșțĂÂÎȘȚ]+/gim,serbian:/[^a-z0-9čćžšđČĆŽŠĐ]+/gim,turkish:/[^a-z0-9çÇğĞıİöÖşŞüÜ]+/gim,lithuanian:/[^a-z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ]+/gim,arabic:/[^a-z0-9أ-ي]+/gim,nepali:/[^a-z0-9अ-ह]+/gim,irish:/[^a-z0-9áéíóúÁÉÍÓÚ]+/gim,indian:/[^a-z0-9अ-ह]+/gim,armenian:/[^a-z0-9ա-ֆ]+/gim,greek:/[^a-z0-9α-ωά-ώ]+/gim,indonesian:/[^a-z0-9]+/gim,ukrainian:/[^a-z0-9а-яА-ЯіїєІЇЄ]+/gim,slovenian:/[^a-z0-9čžšČŽŠ]+/gim,bulgarian:/[^a-z0-9а-яА-Я]+/gim},x=new Map;function Re(e,s,n){const t=`${s}:${e}`;if(x.has(t))return x.get(t);if(n!=null&&n.enableStopWords&&n.customStopWords.includes(e)){const i="";return x.set(t,i),i}return n!=null&&n.enableStemming&&typeof(n==null?void 0:n.stemmingFn)=="function"&&(e=n==null?void 0:n.stemmingFn(e)),e=ye(e),x.set(t,e),e}function qe(e){for(;e[e.length-1]==="";)e.pop();for(;e[0]==="";)e.shift();return e}function Ne(e){if(!Y.includes(e))throw new Error(_e(e))}function Fe(e,s="english",n=!1,t=R(s)){if(typeof e!="string")return[e];const i=De[s],o=e.toLowerCase().split(i).map(u=>Re(u,s,t)).filter(Boolean),r=qe(o);return n?r:Array.from(new Set(r))}function R(e,s={}){let n=[],t=[],i,o=Fe;if(s!=null&&s.tokenizerFn){if(typeof s.tokenizerFn!="function")throw Error($e());o=s.tokenizerFn}else{if(s!=null&&s.stemmingFn){if(typeof s.stemmingFn!="function")throw Error(Ae());i=s.stemmingFn}else i=pe;if(Te.includes(e)&&(n=J[e]??[]),s!=null&&s.customStopWords)switch(typeof s.customStopWords){case"function":t=s.customStopWords(n);break;case"object":if(!Array.isArray(s.customStopWords))throw Error(Z());if(t=s.customStopWords,t.some(r=>typeof r!="string"))throw Error(Le());break;default:throw Error(Z())}}return{enableStopWords:(s==null?void 0:s.enableStopWords)??!0,enableStemming:(s==null?void 0:s.enableStemming)??!0,stemmingFn:i,customStopWords:t??n,tokenizerFn:o,assertSupportedLanguage:s.assertSupportedLanguage??Ne}}const Pe=Date.now().toString().slice(5);let Me=0;const Q=BigInt(1e3),X=BigInt(1e6),ee=BigInt(1e9);function We(e){return typeof e=="number"&&(e=BigInt(e)),e<Q?`${e}ns`:e<X?`${e/Q}μs`:e<ee?`${e/X}ms`:`${e/ee}s`}function se(){return typeof process<"u"&&process.hrtime!==void 0?process.hrtime.bigint():BigInt(typeof performance<"u"?Math.floor(performance.now()*1e6):0)}function Be(){return`${Pe}-${Me++}`}function te(e,s){return Object.hasOwn===void 0?Object.prototype.hasOwnProperty.call(e,s)?e[s]:void 0:Object.hasOwn(e,s)?e[s]:void 0}function Ue(e,s){return s[1]-e[1]}function Ve(e){if(e.length===0)return[];for(let n=1;n<e.length;n++)if(e[n].length<e[0].length){const t=e[0];e[0]=e[n],e[n]=t}const s=new Map;for(const n of e[0])s.set(n,1);for(let n=1;n<e.length;n++){let t=0;for(const i of e[n]){const o=s.get(i);o===n&&(s.set(i,o+1),t++)}if(t===0)return[]}return e[0].filter(n=>{const t=s.get(n);return t!==void 0&&s.set(n,0),t===e.length})}function ne(e,s){return s.split(".").reduce((n,t)=>n&&typeof n=="object"?n[t]:void 0,e)}function He(e=!1,s="",n=""){const t={id:Be(),key:n,subWord:s,parent:null,children:{},docs:[],end:e,word:""};return Object.defineProperty(t,"toJSON",{value:Ge}),t}function Ge(){const{word:e,subWord:s,children:n,docs:t,end:i}=this;return{word:e,subWord:s,children:n,docs:t,end:i}}function Ke(e,s){return{key:e,value:s,left:null,right:null,height:0}}function Ye(e,s){return Ke(e,s)}function q(e,s){return e?e.key===s?e.value:s<e.key?e.left?q(e.left,s):null:e.right?q(e.right,s):null:null}function Ce(e,s,n){if(!e)return[];const t=[];function i(o){o&&(o.key>s&&i(o.left),o.key>=s&&o.key<=n&&t.push(...o.value),o.key<n&&i(o.right))}return i(e),t}function ie(e,s,n=!1){if(!e)return[];const t=[];function i(o){o&&(n&&o.key>=s&&t.push(...o.value),!n&&o.key>s&&t.push(...o.value),i(o.left),i(o.right))}return i(e),t}function oe(e,s,n=!1){if(!e)return[];const t=[];function i(o){o&&(n&&o.key<=s&&t.push(...o.value),!n&&o.key<s&&t.push(...o.value),i(o.left),i(o.right))}return i(e),t}const Ze=["afterInsert"];function Je(e){if(e){if(typeof e!="object")throw new Error(Ie());const s=Object.keys(e).filter(n=>!Ze.includes(n));if(s.length)throw new Error(Ee(s))}}function Qe(e){if(e.length===0)return[];for(let i=1;i<e.length;i++)if(e[i].length<e[0].length){const o=e[0];e[0]=e[i],e[i]=o}const s=new Map;for(const i of e[0])s.set(i[0],[1,i[1]]);const n=e.length;for(let i=1;i<n;i++){let o=0;for(const r of e[i]){const u=r[0]??"",[a,l]=s.get(u)??[0,0];a===i&&(s.set(u,[a+1,l+r[1]]),o++)}if(o===0)return[]}const t=[];for(const[i,[o,r]]of s)o===n&&t.push([i,r]);return t}function Xe(e,s){if(s===0)throw new Error(xe());const n={},t=e.length;for(let i=0;i<t;i++){const o=e[i],r=o.length;for(let u=0;u<r;u++){const[a,l]=o[u],d=l*s;a in n?n[a]*=1.5+d:n[a]=d}}return Object.entries(n).sort((i,o)=>o[1]-i[1])}function es(e,s,n,t,i,o){const{k:r,b:u,d:a}=o;return Math.log(1+(n-s+.5)/(s+.5))*(a+e*(r+1))/(e+r*(1-u+u*t/i))}async function ss(e){var s,n,t,i,o;const r=(e==null||(s=e.defaultLanguage)===null||s===void 0?void 0:s.toLowerCase())??"english",u=R(r,((n=e.components)===null||n===void 0?void 0:n.tokenizer)??{});u.assertSupportedLanguage(r),Je(e.hooks);const a={defaultLanguage:r,schema:e.schema,docs:{},docsCount:0,index:{},hooks:e.hooks||{},edge:e.edge??!1,frequencies:{},tokenOccurrencies:{},avgFieldLength:{},fieldLengths:{},components:{elapsed:((t=e.components)===null||t===void 0?void 0:t.elapsed)??{},tokenizer:u,algorithms:{intersectTokenScores:((i=e.components)===null||i===void 0||(o=i.algorithms)===null||o===void 0?void 0:o.intersectTokenScores)??Qe}}};return ae(a,e.schema),a}function ae(e,s,n=""){for(const t of Object.keys(s)){const i=typeof t,o=typeof s[t]=="object";if(i!=="string")throw new Error(Oe(i));const r=`${n}${t}`;if(o)ae(e,s[t],`${r}.`);else{if(s[t]==="string"){e.index[r]=He(),e.avgFieldLength[r]=0;continue}if(s[t]==="number"){e.index[r]=Ye(0,[]);continue}if(s[t]==="boolean"){e.index[r]={true:[],false:[]};continue}}}}function ts(e,s,n){const t=ns(e,s,n);return{distance:t,isBounded:t>=0}}function ns(e,s,n){if(e===s)return 0;const t=e;e.length>s.length&&(e=s,s=t);let i=e.length,o=s.length;for(;i>0&&e.charCodeAt(~-i)===s.charCodeAt(~-o);)i--,o--;if(!i)return o>n?-1:o;let r=0;for(;r<i&&e.charCodeAt(r)===s.charCodeAt(r);)r++;if(i-=r,o-=r,i===0)return o>n?-1:o;const u=o-i;if(n>o)n=o;else if(u>n)return-1;let a=0;const l=[],d=[];for(;a<n;)d[a]=s.charCodeAt(r+a),l[a]=++a;for(;a<o;)d[a]=s.charCodeAt(r+a),l[a++]=n+1;const c=n-u,h=n<o;let m=0,w=n,v=0,j=0,I=0,O=0,p=0;for(a=0;a<i;a++){for(j=a,v=a+1,O=e.charCodeAt(r+a),m+=a>c?1:0,w+=w<o?1:0,p=m;p<w;p++)I=v,v=j,j=l[p],O!==d[p]&&(j<v&&(v=j),I<v&&(v=I),v++),l[p]=v;if(h&&l[a+u]>n)return-1}return v<=n?v:-1}function is(e,{term:s,exact:n,tolerance:t}){for(let o=0;o<s.length;o++){const r=s[o];if(r in e.children){const u=e.children[r],a=u.subWord,l=s.substring(o),c=os(a,l).length;if(c!==a.length&&c!==l.length){if(t)break;return{}}o+=u.subWord.length-1,e=u}else return{}}const i={};return re(e,i,s,n,t),i}function re(e,s,n,t,i){if(e.end){const{word:o,docs:r}=e;if(t&&o!==n)return{};if(te(s,o)||(i?Math.abs(n.length-o.length)<=i&&ts(n,o,i).isBounded&&(s[o]=[]):s[o]=[]),te(s,o)&&r.length){const u=new Set(s[o]),a=r.length;for(let l=0;l<a;l++)u.add(r[l]);s[o]=Array.from(u)}}for(const o of Object.keys(e.children))re(e.children[o],s,n,t,i);return s}function os(e,s){let n="";const t=Math.min(e.length,s.length);for(let i=0;i<t;i++){if(e[i]!==s[i])return n;n+=e[i]}return n}function as(e,s){const n=Object.keys(e.index);if(!s)return n;if(typeof s=="string"){if(s!=="*")throw new Error(C(s,n));return n}for(const t of s)if(!n.includes(t))throw new Error(C(t,n));return s}async function rs(e,{index:s,docs:n,schema:t,frequencies:i,tokenOccurrencies:o,defaultLanguage:r,fieldLengths:u,avgFieldLength:a}){if(!e.edge)throw new Error(Se("load"));e.index=s,e.docs=n,e.docsCount=Object.keys(n).length,e.schema=t,e.frequencies=i,e.tokenOccurrencies=o,e.defaultLanguage=r,e.fieldLengths=u,e.avgFieldLength=a}function ls(e,s,n,t){const i={},r=n.map(([l])=>l).map(l=>s[l]),u=Object.keys(t);for(const l of u){const d=le(e,l);let c={};if(d==="number"){const{ranges:h}=t[l],m=[];for(const w of h)m.push([`${w.from}-${w.to}`,0]);c=Object.fromEntries(m)}i[l]={count:0,values:c}}const a=r.length;for(let l=0;l<a;l++){const d=r[l];for(const c of u){const h=c.includes(".")?ne(d,c):d[c];if(typeof h=="string")i[c].values[h]===void 0?i[c].values[h]=1:i[c].values[h]++;else if(typeof h=="boolean")i[c].values[h.toString()]===void 0?i[c].values[h.toString()]=1:i[c].values[h.toString()]++;else if(typeof h=="number")for(const m of t[c].ranges)h>=m.from&&h<=m.to&&(i[c].values[`${m.from}-${m.to}`]===void 0?i[c].values[`${m.from}-${m.to}`]=1:i[c].values[`${m.from}-${m.to}`]++)}}for(const l of u){const d=le(e,l);i[l].count=Object.keys(i[l].values).length,d==="string"&&(i[l].values=Object.fromEntries(Object.entries(i[l].values).sort((c,h)=>us(t[l].sort,c,h)).slice(t[l].offset??0,t[l].limit??10)))}return i}const N=new Map;function le(e,s){if(N.has(s))return N.get(s);const n=ne(e,s);return N.set(s,n),n}function us(e="desc",s,n){return e.toLowerCase()==="asc"?s[1]-n[1]:n[1]-s[1]}function cs(e,s){const n=Object.keys(e),t=n.reduce((o,r)=>({[r]:[],...o}),{});for(const o of n){const r=e[o],u=Object.keys(r);if(u.length>1)throw new Error(ze(u));if(typeof r=="boolean"){const h=s.index[o][r.toString()];t[o].push(...h)}const a=u[0],l=r[a],d=s.index[o];switch(a){case"gt":{const c=ie(d,l,!1);t[o].push(...c);break}case"gte":{const c=ie(d,l,!0);t[o].push(...c);break}case"lt":{const c=oe(d,l,!1);t[o].push(...c);break}case"lte":{const c=oe(d,l,!0);t[o].push(...c);break}case"eq":{const c=q(d,l)??[];t[o].push(...c);break}case"between":{const c=Ce(d,l[0],l[1]);t[o].push(...c)}}}return Ve(Object.values(t))}function ds(e,s){const n=new Map,t=[];for(const i of e)n.set(i,!0);for(const[i,o]of s)n.has(i)&&(t.push([i,o]),n.delete(i));return t}async function hs(e,s,n){var t,i;n||(n=e.defaultLanguage),!((t=e.components)===null||t===void 0)&&t.tokenizer||(e.components={...e.components??{},tokenizer:R(n)}),s.relevance=fs(s.relevance);const o=s.facets&&Object.keys(s.facets).length>0,{limit:r=10,offset:u=0,exact:a=!1,term:l,properties:d}=s,c=e.components.tokenizer.tokenizerFn(l,n,!1,e.components.tokenizer),h=as(e,d),m=Array.from({length:r}),w=e.docsCount,v=se(),j=Object.keys(s.where??{}).length>0;let I=[];j&&(I=cs(s.where,e));const O={},p={},F={};for(const g of h){const f={};for(const y of c)f[y]=[];p[g]=f,F[g]=[]}const gs=h.length;for(let g=0;g<gs;g++){var P;const f=h[g],y=e.avgFieldLength[f],B=e.fieldLengths[f];if(!(f in e.tokenOccurrencies))continue;const z=e.tokenOccurrencies[f],U=e.frequencies[f],ps=c.length;for(let S=0;S<ps;S++){const k=c[S],L=ms(e,{...s,index:f,term:k,exact:a}),T=typeof z[k]=="number"?z[k]??0:0,me=[],ys=L.length;for(let V=0;V<ys;V++){var M;const H=L[V],Os=(U==null||(M=U[H])===null||M===void 0?void 0:M[k])??0,Ss=es(Os,T,w,B[H],y,s.relevance);me.push([H,Ss])}p[f][k].push(...me)}const ks=p[f],ws=Object.values(ks);F[f]=Xe(ws,(s==null||(P=s.boost)===null||P===void 0?void 0:P[f])??1);const he=F[f],js=he.length;for(let S=0;S<js;S++){const[k,L]=he[S],T=O[k];T?O[k]=T+L+.5:O[k]=L}}let _=Object.entries(O).sort(Ue);j&&(_=ds(I,_));const ce=new Set,bs=o?ls(e.schema,e.docs,_,s.facets):{};for(let g=u;g<r+u;g++){const f=_[g];if(typeof f>"u")break;const[y,B]=f;if(!ce.has(y)){const z=e.docs[y];m[g]={id:y,score:B,document:z},ce.add(y)}}let W=se()-v;((i=e.components.elapsed)===null||i===void 0?void 0:i.format)==="human"&&(W=We(W));const de={elapsed:W,hits:m.filter(Boolean),count:_.length};return o&&(de.facets=bs),de}function ms(e,s){const n=e.index[s.index],t=is(n,{term:s.term,exact:s.exact,tolerance:s.tolerance}),i=new Set;for(const o in t)for(const r of t[o])i.add(r);return Array.from(i)}const ue={k:1.2,b:.75,d:.5};function fs(e=ue){return Object.assign({},ue,e)}const vs=async e=>{const s=await ss({edge:!0,schema:{__placeholder:"string"}});return await rs(s,e),s};(async()=>{const e=await fetch("../searchIndexes.json").then(n=>n.json()).then(n=>n),s=await vs(e);self.onmessage=async n=>{const t=n.data,i=await hs(s,t);postMessage(i)}})()})();
