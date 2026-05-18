const fs = require('fs');

// Define all new keys needed across all languages
const newKeys = {
    en: {
        app: {
            title: 'Oubaitori Collective Blossom Trail',
            subtitle: 'It is Okay to be Here.',
            skipToMain: 'Skip to main content',
            welcomeMsg: 'Join us on the Oubaitori Collective Blossom Trail as we gather anonymous evidence for the design of a new support service for neurodivergent adults across the North East of England and beyond. Not able to join us? We would still love to hear your views. Complete the questions in the survey below. Your views matter to us!'
        },
        nav: { installApp: 'Install App to Home Screen', startSurvey: 'Start the Blossom Trail Survey' },
        weather: { heading: 'Live Trail Conditions', weather: 'Weather', temperature: 'Temperature', wind: 'Wind', rain: 'Rain', pollen: 'Pollen', moon: 'Moon' },
        accessibility: { accessibleToilet: 'Accessible Toilet', radarKey: 'Radar Key Required', readingSpeed: 'Reading Speed' },
        language: { label: '🌐 Language' }
    },
    es: {
        app: { title: 'Sendero en Flor Colectivo Oubaitori', subtitle: 'Está bien estar aquí.', skipToMain: 'Saltar al contenido principal', welcomeMsg: 'Únase a nosotros en el Sendero en Flor del Colectivo Oubaitori mientras recopilamos evidencia anónima para el diseño de un nuevo servicio de apoyo para adultos neurodivergentes. ¿No puede unirse a nosotros? Nos encantaría escuchar sus opiniones. Complete las preguntas en la encuesta a continuación. ¡Sus opiniones nos importan!' },
        nav: { installApp: 'Instalar app en la pantalla de inicio', startSurvey: 'Comenzar la encuesta del Sendero en Flor' },
        weather: { heading: 'Condiciones del sendero en vivo', weather: 'Tiempo', temperature: 'Temperatura', wind: 'Viento', rain: 'Lluvia', pollen: 'Polen', moon: 'Luna' },
        accessibility: { accessibleToilet: 'Aseo accesible', radarKey: 'Clave de radar necesaria', readingSpeed: 'Velocidad de lectura' },
        language: { label: '🌐 Idioma' }
    },
    fr: {
        app: { title: 'Parcours en Fleur du Collectif Oubaitori', subtitle: "C'est d'accord d'être ici.", skipToMain: 'Passer au contenu principal', welcomeMsg: "Rejoignez-nous sur le Parcours en Fleur du Collectif Oubaitori pendant que nous recueillons des preuves anonymes pour la conception d'un nouveau service de soutien aux adultes neurodivergents. Pas disponible pour nous rejoindre ? Nous aimerions quand même connaître votre avis. Complétez les questions dans le sondage ci-dessous. Votre avis nous tient à cœur !" },
        nav: { installApp: "Installer l'appli sur l'écran d'accueil", startSurvey: 'Commencer le sondage du Parcours en Fleur' },
        weather: { heading: 'Conditions du parcours en direct', weather: 'Météo', temperature: 'Température', wind: 'Vent', rain: 'Pluie', pollen: 'Pollen', moon: 'Lune' },
        accessibility: { accessibleToilet: 'Toilettes accessibles', radarKey: 'Clé radar requise', readingSpeed: 'Vitesse de lecture' },
        language: { label: '🌐 Langue' }
    },
    de: {
        app: { title: 'Oubaitori Kollektiv Blütenweg', subtitle: 'Es ist okay, hier zu sein.', skipToMain: 'Zum Hauptinhalt springen', welcomeMsg: 'Begleiten Sie uns auf dem Oubaitori Kollektiv Blütenweg, während wir anonyme Beweise für die Gestaltung eines neuen Unterstützungsdienstes für neurodivergente Erwachsene sammeln. Können Sie uns nicht begleiten? Wir würden dennoch gerne Ihre Meinung hören. Füllen Sie die Fragen in der Umfrage unten aus. Ihre Meinung ist uns wichtig!' },
        nav: { installApp: 'App auf Startbildschirm installieren', startSurvey: 'Blütenweg-Umfrage starten' },
        weather: { heading: 'Aktuelle Wegbedingungen', weather: 'Wetter', temperature: 'Temperatur', wind: 'Wind', rain: 'Regen', pollen: 'Pollen', moon: 'Mond' },
        accessibility: { accessibleToilet: 'Barrierefreie Toilette', radarKey: 'Radar-Schlüssel erforderlich', readingSpeed: 'Lesegeschwindigkeit' },
        language: { label: '🌐 Sprache' }
    },
    pl: {
        app: { title: 'Szlak Kwitnący Kolektywu Oubaitori', subtitle: 'Jest okay być tutaj.', skipToMain: 'Przejdź do głównej treści', welcomeMsg: 'Dołącz do nas na Szlaku Kwitnącym Kolektywu Oubaitori, podczas gdy zbieramy anonimowe dowody na potrzeby projektu nowej usługi wsparcia dla dorosłych neuroróżnorodnych. Nie możesz do nas dołączyć? Chętnie poznamy Twoją opinię. Wypełnij pytania w poniższej ankiecie. Twoje zdanie jest dla nas ważne!' },
        nav: { installApp: 'Zainstaluj aplikację na ekranie głównym', startSurvey: 'Rozpocznij ankietę Szlaku Kwitnącego' },
        weather: { heading: 'Aktualne warunki na szlaku', weather: 'Pogoda', temperature: 'Temperatura', wind: 'Wiatr', rain: 'Deszcz', pollen: 'Pyłki', moon: 'Księżyc' },
        accessibility: { accessibleToilet: 'Dostępna toaleta', radarKey: 'Wymagany klucz radarowy', readingSpeed: 'Prędkość czytania' },
        language: { label: '🌐 Język' }
    },
    cy: {
        app: { title: "Llwybr Blodau Ar Agor y Gymuned Oubaitori", subtitle: "Mae yn iawn bod yma.", skipToMain: "Neidio i'r prif gynnwys", welcomeMsg: "Ymunwch â ni ar Lwybr Blodau Ar Agor y Gymuned Oubaitori wrth i ni gasglu tystiolaeth ddienw ar gyfer dylunio gwasanaeth cymorth newydd ar gyfer oedolion niwroamrywiol. Methu ymuno â ni? Byddem wrth ein bodd yn clywed eich barn. Cwblhewch y cwestiynau yn yr arolwg isod. Mae eich barn yn bwysig i ni!" },
        nav: { installApp: "Gosod yr ap ar sgrin gartref", startSurvey: "Dechrau arolwg y Llwybr Blodau" },
        weather: { heading: "Amodau'r Llwybr Byw", weather: 'Tywydd', temperature: 'Tymheredd', wind: 'Gwynt', rain: 'Glaw', pollen: 'Paill', moon: 'Lleuad' },
        accessibility: { accessibleToilet: 'Toiled hygyrch', radarKey: 'Angen allwedd radar', readingSpeed: 'Cyflymder darllen' },
        language: { label: '🌐 Iaith' }
    },
    ro: {
        app: { title: 'Colectivul Oubaitori Poteca Înfloririi', subtitle: 'Este bine să fii aici.', skipToMain: 'Sari la conținutul principal', welcomeMsg: 'Alăturați-vă nouă pe Poteca Înfloririi a Colectivului Oubaitori pe măsură ce colectăm dovezi anonime pentru proiectarea unui nou serviciu de suport pentru adulții neurodiversi. Nu puteți să vă alăturați? Ne-ar plăcea totuși să vă auzim opiniile. Completați întrebările din sondajul de mai jos. Opinia dvs. contează pentru noi!' },
        nav: { installApp: 'Instalează aplicația pe ecranul principal', startSurvey: 'Începe sondajul Potecii Înfloririi' },
        weather: { heading: 'Condiții live pe potecă', weather: 'Vreme', temperature: 'Temperatură', wind: 'Vânt', rain: 'Ploaie', pollen: 'Polen', moon: 'Lună' },
        accessibility: { accessibleToilet: 'Toaletă accesibilă', radarKey: 'Cheie radar necesară', readingSpeed: 'Viteza de citire' },
        language: { label: '🌐 Limbă' }
    },
    ar: {
        app: { title: 'مجموعة أوباتوري درب الأزهار', subtitle: 'من الجيد أن تكون هنا.', skipToMain: 'الانتقال إلى المحتوى الرئيسي', welcomeMsg: 'انضم إلينا في درب الأزهار لمجموعة أوباتوري بينما نجمع أدلة مجهولة لتصميم خدمة دعم جديدة للبالغين ذوي التنوع العصبي. لا تستطيع الانضمام؟ نود مع ذلك سماع آرائك. أكمل الأسئلة في الاستبيان أدناه. آراؤك مهمة بالنسبة لنا!' },
        nav: { installApp: 'تثبيت التطبيق على الشاشة الرئيسية', startSurvey: 'بدء استبيان درب الأزهار' },
        weather: { heading: 'أحوال الدرب المباشرة', weather: 'الطقس', temperature: 'درجة الحرارة', wind: 'الرياح', rain: 'المطر', pollen: 'حبوب اللقاح', moon: 'القمر' },
        accessibility: { accessibleToilet: 'مرحاض متاح', radarKey: 'مفتاح الرادار مطلوب', readingSpeed: 'سرعة القراءة' },
        language: { label: '🌐 اللغة' }
    },
    ur: {
        app: { title: 'اوباتوری اجتماع کا پھولوں کا راستہ', subtitle: 'یہاں ہونا ٹھیک ہے۔', skipToMain: 'مرکزی مواد پر جائیں', welcomeMsg: 'اوباتوری اجتماع کے پھولوں کے راستے پر ہمارے ساتھ شامل ہوں جب ہم شمال مشرقی انگلینڈ اور اس سے آگے نیوروڈائیورجنٹ بالغوں کے لیے ایک نئی سپورٹ سروس کے ڈیزائن کے لیے گمنام شواہد جمع کر رہے ہیں۔ ہمارے ساتھ شامل نہیں ہو سکتے؟ ہم پھر بھی آپ کے خیالات سننا پسند کریں گے۔ نیچے سروے میں سوالات مکمل کریں۔ آپ کے خیالات ہمارے لیے اہم ہیں!' },
        nav: { installApp: 'ایپ کو ہوم سکرین پر انسٹال کریں', startSurvey: 'پھولوں کے راستے کا سروے شروع کریں' },
        weather: { heading: 'راستے کے براہ راست حالات', weather: 'موسم', temperature: 'درجہ حرارت', wind: 'ہوا', rain: 'بارش', pollen: 'پولن', moon: 'چاند' },
        accessibility: { accessibleToilet: 'قابل رسائی بیت الخلاء', radarKey: 'ریڈار کی چابی درکار ہے', readingSpeed: 'پڑھنے کی رفتار' },
        language: { label: '🌐 زبان' }
    }
};

// Merge new keys into each existing language file
Object.keys(newKeys).forEach(function(lang) {
    const path = 'lang/' + lang + '.json';
    let existing = {};
    try { existing = JSON.parse(fs.readFileSync(path, 'utf8')); } catch(e) { existing = {}; }
    
    const additions = newKeys[lang];
    Object.keys(additions).forEach(function(section) {
        if (!existing[section]) existing[section] = {};
        Object.assign(existing[section], additions[section]);
    });
    
    fs.writeFileSync(path, JSON.stringify(existing, null, 4), 'utf8');
    console.log(lang + ': updated with', Object.keys(additions).join(', '));
});

console.log('\nAll language files updated.');
