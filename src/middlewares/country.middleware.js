import geoip from 'geoip-lite';
import { SUPPORTED_COUNTRIES, DEFAULT_COUNTRY } from '../config/countries.js';

export const detectCountry = (req, res, next) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;

    const geo = geoip.lookup(ip);
    const detectedCountry = (geo && SUPPORTED_COUNTRIES.includes(geo.country)) 
        ? geo.country 
        : DEFAULT_COUNTRY;

    const manualCountry = req.headers['x-country-code'];
    
    req.userCountry = (manualCountry && SUPPORTED_COUNTRIES.includes(manualCountry)) 
        ? manualCountry 
        : detectedCountry;

    next();
};