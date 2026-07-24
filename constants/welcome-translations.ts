/**
 * @file Welcome Popup Translations Dataset
 * @description Structured multilingual message translations for the CM Welcome address popup.
 * Supports Marathi (Default), English, Hindi, and Sanskrit (Architecture only).
 */

export interface CMMessageTranslation {
  title: string;
  subtitle: string;
  event: string;
  salutation: string;
  paragraphs: string[];
  signatureTitle: string;
  signatureSubtitle: string;
  signatureGovt: string;
  closeBtn: string;
  understandBtn: string;
  readAgainBtn: string;
}

export const WELCOME_TRANSLATIONS: Record<string, CMMessageTranslation> = {
  mr: {
    title: 'माननीय मुख्यमंत्र्यांचे संदेश',
    subtitle: 'महाराष्ट्र शासन',
    event: 'नाशिक महाकुंभ २०२६',
    salutation: 'आदरणीय यात्रिक, भाविक आणि भारताचे नागरिक बंधू-भगिनींनो,',
    paragraphs: [
      'नाशिक येथील पवित्र गोदावरी नदीच्या काठावर आयोजित होणाऱ्या पवित्र सिंहस्थ महाकुंभमेळ्यात मी आपले मनःपूर्वक आणि आदरपूर्वक स्वागत करतो. मानवी संस्कृतीच्या इतिहासातील ही एक अत्यंत महत्त्वाची आणि अध्यात्मिक परिषद आहे.',
      'प्रभू रामचंद्रांच्या पावन वास्तव्याने पुनीत झालेले, आणि जिथे अमृताचे थेंब सांडले, अशा नाशिक नगरीला आपल्या संस्कृतीत महत्त्वाचे स्थान आहे. गोदावरी काठचा हा महाकुंभ केवळ सोहळा नसून भारताच्या चैतन्याचे जिवंत रूप आहे.',
      'महाराष्ट्र शासनाने भाविकांच्या सुखकर आणि सुरक्षित प्रवासासाठी सर्व प्रकारची आधुनिक सुरक्षा व्यवस्था, सुसज्ज आरोग्य केंद्रे आणि आपत्कालीन यंत्रणा तैनात केल्या आहेत. आपली सेवा हीच आमची प्राथमिकता आहे.',
      'मी सर्व भाविकांना विनंती करतो की पवित्र घाटांचे पावित्र्य आणि स्वच्छता राखावी. आपली जीवनवाहिनी गोदावरी माता प्रदूषणमुक्त ठेवणे हे आपले सर्वांचे सामूहिक कर्तव्य आहे.',
      'कुंभ प्रशासनाने जारी केलेल्या नियमांचे पालन करून एकमेकांना सहकार्य करावे. हा महाकुंभ आपण सर्वजण मिळून शांतता आणि एकात्मतेचा सोहळा बनवूया.'
    ],
    signatureTitle: 'देवेंद्र फडणवीस',
    signatureSubtitle: 'मुख्य मंत्री',
    signatureGovt: 'महाराष्ट्र शासन',
    closeBtn: 'बंद करा',
    understandBtn: 'मी समजलो',
    readAgainBtn: 'पुन्हा वाचा'
  },
  en: {
    title: "Message from the Hon'ble Chief Minister",
    subtitle: 'Government of Maharashtra',
    event: 'Nashik Mahakumbh 2026',
    salutation: 'Respected Pilgrims, Devotees, and Citizens of India,',
    paragraphs: [
      'It is with immense gratitude and reverence that we welcome you to the sacred city of Nashik for the auspicious Mahakumbh — one of the most profound spiritual gatherings in the history of human civilisation.',
      'Nashik, the city where the sacred Godavari flows, where Lord Rama spent years of his exile, and where drops of the divine Amrit fell upon the earth, holds an unparalleled place in our cultural and spiritual heritage.',
      'The Government of Maharashtra has undertaken extensive preparations to ensure that your pilgrimage is safe, comfortable, and deeply fulfilling. Modern infrastructure, crowd management systems, and medical facilities are fully deployed.',
      'As you embark upon this sacred journey, we request your active cooperation in maintaining the sanctity and cleanliness of the holy ghats. The Godavari, our lifeline, must be preserved.',
      'We encourage every pilgrim to follow the guidelines issued by the Kumbh Administration, respect local customs, and assist fellow devotees. Together, let us make this Mahakumbh a celebration of unity and compassion.'
    ],
    signatureTitle: 'Devendra Fadnavis',
    signatureSubtitle: 'Chief Minister',
    signatureGovt: 'Government of Maharashtra',
    closeBtn: 'Close',
    understandBtn: 'I Understand',
    readAgainBtn: 'Read Again'
  },
  hi: {
    title: 'माननीय मुख्य मंत्री का संदेश',
    subtitle: 'महाराष्ट्र शासन',
    event: 'नाशिक महाकुंभ २०२६',
    salutation: 'आदरणीय तीर्थयात्रियों, श्रद्धालुओं और भारत के प्रिय नागरिकों,',
    paragraphs: [
      'अत्यंत आभार और श्रद्धा के साथ, हम पावन नाशिक नगरी में सिंहस्थ महाकुंभ के शुभ अवसर पर आपका हार्दिक स्वागत करते हैं - जो मानव सभ्यता के इतिहास में सबसे गहन आध्यात्मिक सभाओं में से एक है।',
      'नाशिक, वह शहर जहां पवित्र गोदावरी बहती है, जहां भगवान राम ने अपने वनवास के वर्ष बिताए थे, और जहां दिव्य अमृत की बूंदें गिरी थीं, हमारी सांस्कृतिक विरासत में एक अद्वितीय स्थान रखता है।',
      'महाराष्ट्र सरकार ने यह सुनिश्चित करने के लिए व्यापक तैयारियां की हैं कि आपकी यात्रा सुरक्षित, सुखद और पूर्ण हो। अत्याधुनिक बुनियादी ढांचा, भीड़ प्रबंधन और चिकित्सा सुविधाएं पूरी तरह तैनात हैं।',
      'जब आप इस पावन यात्रा पर निकल रहे हैं, तो हम आपसे अनुरोध करते हैं कि पवित्र घाटों की शुचिता और स्वच्छता बनाए रखने में सहयोग करें। हमारी जीवनदायिनी गोदावरी को हमें हमेशा प्रदूषणमुक्त रखना है।',
      'हम हर तीर्थयात्री से अनुरोध करते हैं कि कुंभ प्रशासन द्वारा जारी नियमों का पालन करें, स्थानीय परंपराओं का सम्मान करें और साथी भक्तों की मदद करें। आइए, इस महाकुंभ को एकता और सद्भाव का पर्व बनाएं।'
    ],
    signatureTitle: 'देवेंद्र फडणवीस',
    signatureSubtitle: 'मुख्य मंत्री',
    signatureGovt: 'महाराष्ट्र शासन',
    closeBtn: 'बंद करें',
    understandBtn: 'मैं समझ गया',
    readAgainBtn: 'पुनः पढ़ें'
  },
  sa: {
    // Sanskrit Architecture and Placeholder only (Section 2)
    title: 'माननीय मुख्यमन्त्रिणः संदेशः',
    subtitle: 'महाराष्ट्र शासनम्',
    event: 'नाशिक महाकुम्भः २०२६',
    salutation: 'प्रिय तीर्थयात्रिणः, भक्ताः भारतस्य नागरिकाश्च,',
    paragraphs: [
      'सिंहस्थ महाकुम्भे भवतां स्वागतं कुर्मः। इयं पावनी गोदावरी नदी मानवकल्याणाय प्रवहतु। (Sanskrit translation placeholder: complete architecture prepared for future shastra-verbatim content)'
    ],
    signatureTitle: 'देवेंद्र फडणवीस',
    signatureSubtitle: 'मुख्यमन्त्री',
    signatureGovt: 'महाराष्ट्र शासनम्',
    closeBtn: 'पिधानम्',
    understandBtn: 'अहं गच्छामि',
    readAgainBtn: 'पुनः पठतु'
  }
};
