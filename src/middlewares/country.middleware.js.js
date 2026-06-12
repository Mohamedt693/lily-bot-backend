import geoip from 'geoip-lite';
import { SUPPORTED_COUNTRIES, DEFAULT_COUNTRY } from '../config/countries.js';

export const detectCountry = (req, res, next) => {
    // 1. محاولة الحصول على IP المستخدم (بما يتناسب مع Proxies مثل Railway)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;

    // 2. تحديد الدولة التلقائي
    const geo = geoip.lookup(ip);
    const detectedCountry = (geo && SUPPORTED_COUNTRIES.includes(geo.country)) 
        ? geo.country 
        : DEFAULT_COUNTRY;

    // 3. أولوية "السيرفر" (التحقق من اختيار المستخدم اليدوي)
    const manualCountry = req.headers['x-country-code'];
    
    // إذا بعت المستخدم دولة، نتحقق أنها في قائمتنا المدعومة، وإلا نرجع للمكتشفة
    req.userCountry = (manualCountry && SUPPORTED_COUNTRIES.includes(manualCountry)) 
        ? manualCountry 
        : detectedCountry;

    next();
};