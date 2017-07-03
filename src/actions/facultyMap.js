export const fullId = ['01','02','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','51','52','55','58','99'];
const FullNameToCode = {
    "THE SIRINDHORN THAI LAUNGUAGE INSTITUTE" : "01",
    "OFFICE OF ACADEMIC AFFAIRS" : "02",
    "GRADUATE SCHOOL" : "20",
    "FACULTY OF ENGINEERING" : "21",
    "FACULTY OF ARTS" : "22",
    "FACULTY OF SCIENCE" : "23",
    "FACULTY OF POLITICAL SCIENCE" : "24",
    "FACULTY OF ARCHITECTURE" : "25",
    "FACULTY OF COMMERCE AND ACCOUNTANTCY" : "26",
    "FACULTY OF EDUCATION" : "27",
    "FACULTY OF COMMUNICATION ARTS" : "28",
    "FACULTY OF ECONOMICS" : "29",
    "FACULTY OF MEDICINE" : "30",
    "FACULTY OF VETERINARY SCIENCE" : "31",
    "FACULTY OF DENTISTRY" : "32",
    "FACULTY OF PHARMACEUTICAL SCIENCE" : "33",
    "FACULTY OF LAW" : "34",
    "FACULTY OF FINE AND APPLIED ARTS" : "35",
    "FACULTY OF NURSING" : "36",
    "FACULTY OF ALLIED HEALTH SCIENCES" : "37",
    "FACULTY OF PSYCHOLOGY" : "38",
    "FACULTY OF SPORTS SCIENCE" : "39",
    "SCHOOL OF AGRICULTURAL RESOURCES" : "40",
    "COLLEGE OF POPULATION STUDIES" : "51",
    "COLLEGE OF PUBLIC HEALTH SCIENCES" : "52",
    "LANGUAGE INSTITUTE" : "55",
    "SASIN GRADUATE INSTITUTE OF BUSINESS ADMINISTRATION" : "58",
    "OTHER UNIVERSITY" : "99"
}

const ThaiNameToCode = {
    "สถาบันภาษาไทยสิรินธร": "01",
    "ศูนย์การศึกษาทั่วไป": "02",
    "บัณฑิตวิทยาลัย": "20",
    "คณะวิศวกรรมศาสตร์": "21",
    "คณะอักษรศาสตร์": "22",
    "คณะวิทยาศาสตร์": "23",
    "คณะรัฐศาสตร์": "24",
    "คณะสถาปัตยกรรมศาสตร์": "25",
    "คณะพาณิชยศาสตร์และการบัญชี": "26",
    "คณะครุศาสตร์": "27",
    "คณะนิเทศศาสตร์": "28",
    "คณะเศรษฐศาสตร์": "29",
    "คณะแพทยศาสตร์": "30",
    "คณะสัตวแพทยศาสตร์": "31",
    "คณะทันตแพทยศาสตร์": "32",
    "คณะเภสัชศาสตร์": "33",
    "คณะนิติศาสตร์": "34",
    "คณะศิลปกรรมศาสตร์": "35",
    "คณะพยาบาลศาสตร์": "36",
    "คณะสหเวชศาสตร์": "37",
    "คณะจิตวิทยา": "38",
    "คณะวิทยาศาสตร์การกีฬา": "39",
    "สำนักวิชาทรัพยากรการเกษตร": "40",
    "วิทยาลัยประชากรศาสตร์": "51",
    "วิทยาลัยวิทยาศาสตร์สาธารณสุข": "52",
    "สถาบันภาษา": "55",
    "สถาบันบัณฑิตบริหารธุรกิจ ศศินทร์ฯ": "58",
    "มหาวิทยาลัยอื่น": "99"
}

const ThaiNameShortToAlternateName = {
    "วิศวะ": "วิศวกรรม",
    "วิดวะ": "วิศวกรรม",
    "วิดยา": "วิทยาศาสตร์",
    "สถาปัตย์": "สถาปัตยกรรม",
    "บช": "บัญชี",
    "นิเทด": "นิเทศ",
    "แพทย์": "แพทยศาสตร์",
}

const codeToInfo = {
    "01": {
        "FullName": "The Sirindhorn Thai Launguage Institute",
        "ThaiName": "สถาบันภาษาไทยสิรินธร",
        "Color": "FF6FDB",
        "ClassNameKeyWord": "chula"
    },
    "02": {
        "FullName": "Office Of Academic Affairs",
        "ThaiName": "ศูนย์การศึกษาทั่วไป",
        "Color": "FF6FDB",
        "ClassNameKeyWord": "chula"
    },
    "20": {
        "FullName": "Graduate School",
        "ThaiName": "บัณฑิตวิทยาลัย",
        "Color": "FF6FDB",
        "ClassNameKeyWord": "chula"
    },
    "21": {
        "FullName": "Faculty Of Engineering",
        "ThaiName": "คณะวิศวกรรมศาสตร์",
        "Color": "B80000",
        "ClassNameKeyWord": "engineer"
    },
    "22": {
        "FullName": "Faculty Of Arts",
        "ThaiName": "คณะอักษรศาสตร์",
        "Color": "B3B3B3",
        "ClassNameKeyWord": "arts"
    },
    "23": {
        "FullName": "Faculty Of Science",
        "ThaiName": "คณะวิทยาศาสตร์",
        "Color": "FFFF00",
        "ClassNameKeyWord": "science"
    },
    "24": {
        "FullName": "Faculty Of Political Science",
        "ThaiName": "คณะรัฐศาสตร์",
        "Color": "000000",
        "ClassNameKeyWord": "pol_sci"
    },
    "25": {
        "FullName": "Faculty Of Architecture",
        "ThaiName": "คณะสถาปัตยกรรมศาสตร์",
        "Color": "DF8800",
        "ClassNameKeyWord": "arch"
    },
    "26": {
        "FullName": "Faculty Of Commerce And Accountantcy",
        "ThaiName": "คณะพาณิชยศาสตร์และการบัญชี",
        "Color": "00C0FF",
        "ClassNameKeyWord": "account"
    },
    "27": {
        "FullName": "Faculty Of Education",
        "ThaiName": "คณะครุศาสตร์",
        "Color": "FF4E09",
        "ClassNameKeyWord": "edu"
    },
    "28": {
        "FullName": "Faculty Of Communication Arts",
        "ThaiName": "คณะนิเทศศาสตร์",
        "Color": "12269F",
        "ClassNameKeyWord": "com_art"
    },
    "29": {
        "FullName": "Faculty Of Economics",
        "ThaiName": "คณะเศรษฐศาสตร์",
        "Color": "FFD800",
        "ClassNameKeyWord": "econ"
    },
    "30": {
        "FullName": "Faculty Of Medicine",
        "ThaiName": "คณะแพทยศาสตร์",
        "Color": "1E7E00",
        "ClassNameKeyWord": "med"
    },
    "31": {
        "FullName": "Faculty Of Veterinary Science",
        "ThaiName": "คณะสัตวแพทยศาสตร์",
        "Color": "98C8E6",
        "ClassNameKeyWord": "vet_sci"
    },
    "32": {
        "FullName": "Faculty Of Dentistry",
        "ThaiName": "คณะทันตแพทยศาสตร์",
        "Color": "7600D1",
        "ClassNameKeyWord": "dent"
    },
    "33": {
        "FullName": "Faculty Of Pharmaceutical Science",
        "ThaiName": "คณะเภสัชศาสตร์",
        "Color": "A3DF00",
        "ClassNameKeyWord": "pharma"
    },
    "34": {
        "FullName": "Faculty Of Law",
        "ThaiName": "คณะนิติศาสตร์",
        "Color": "FFFFFF",
        "ClassNameKeyWord": "law"
    },
    "35": {
        "FullName": "Faculty Of Fine And Applied Arts",
        "ThaiName": "คณะศิลปกรรมศาสตร์",
        "Color": "E20025",
        "ClassNameKeyWord": "fine_art"
    },
    "36": {
        "FullName": "Faculty Of Nursing",
        "ThaiName": "คณะพยาบาลศาสตร์",
        "Color": "F90432",
        "ClassNameKeyWord": "nurse"
    },
    "37": {
        "FullName": "Faculty Of Allied Health Sciences",
        "ThaiName": "คณะสหเวชศาสตร์",
        "Color": "D478FF",
        "ClassNameKeyWord": "health_sci"
    },
    "38": {
        "FullName": "Faculty Of Psychology",
        "ThaiName": "คณะจิตวิทยา",
        "Color": "40129F",
        "ClassNameKeyWord": "psycho"
    },
    "39": {
        "FullName": "Faculty Of Sports Science",
        "ThaiName": "คณะวิทยาศาสตร์การกีฬา",
        "Color": "FF7E20",
        "ClassNameKeyWord": "sport_sci"
    },
    "40": {
        "FullName": "School Of Agricultural Resources",
        "ThaiName": "สำนักวิชาทรัพยากรการเกษตร",
        "Color": "FF6FDB",
        "ClassNameKeyWord": "chula"
    },
    "51": {
        "FullName": "College Of Population Studies",
        "ThaiName": "วิทยาลัยประชากรศาสตร์",
        "Color": "FF6FDB",
        "ClassNameKeyWord": "chula"
    },
    "52": {
        "FullName": "College Of Public Health Sciences",
        "ThaiName": "วิทยาลัยวิทยาศาสตร์สาธารณสุข",
        "Color": "FF6FDB",
        "ClassNameKeyWord": "chula"
    },
    "55": {
        "FullName": "Language Institute",
        "ThaiName": "สถาบันภาษา",
        "Color": "FF6FDB",
        "ClassNameKeyWord": "chula"
    },
    "58": {
        "FullName": "Sasin Graduate Institute Of Business Administration",
        "ThaiName": "สถาบันบัณฑิตบริหารธุรกิจ ศศินทร์ฯ",
        "Color": "FF6FDB",
        "ClassNameKeyWord": "chula"
    },
    "99": {
        "FullName": "Other University",
        "ThaiName": "มหาวิทยาลัยอื่น",
        "Color": "FF6FDB",
        "ClassNameKeyWord": "chula"
    }
}

export function getCodeList() {
    return Object.keys(codeToInfo);
}

export function findIdByNameEN(substring) {
    let returnMap = {};
    Object.keys(FullNameToCode).filter((key) => {
        return key.includes(substring);
    }).forEach((filteredKey) => {
        returnMap[filteredKey] = FullNameToCode[filteredKey];
    });
    return returnMap;
}

export function findIdByNameTH(substring) {
    let returnMap = {};
    Object.keys(ThaiNameToCode).filter((key) => {
        return key.includes(substring);
    }).forEach((filteredKey) => {
        returnMap[filteredKey] = ThaiNameToCode[filteredKey];
    });
    return returnMap;
}

export function findInfoById(id) {
    return codeToInfo[id];
}

/**
 * @param  {string}
 * @return {object}
 */

export function findInfoByName(substring) {
    if(/^[a-zA-Z\s()]+$/.test(substring)) {
        let possibleId = findIdByNameEN(substring.toUpperCase());
        if(Object.keys(possibleId).length !== 0) {
            let possibleResult = {};
            Object.keys(possibleId).forEach((key) => {
                possibleResult[key] = findInfoById(possibleId[key]);
            })
            return possibleResult;
        }
    } else if(/^[ก-๙\s()]+$/.test(substring)) {
        let possibleId = findIdByNameTH(substring);
        if(Object.keys(possibleId).length === 0 && ThaiNameShortToAlternateName[substring]) {
            possibleId = findIdByNameTH(ThaiNameShortToAlternateName[substring]);
            if(Object.keys(possibleId).length !== 0) {
                let possibleResult = {};
                Object.keys(possibleId).forEach((key) => {
                    possibleResult[key] = findInfoById(possibleId[key]);
                })
                return possibleResult;
            }
        }
        else {
            let possibleResult = {};
            Object.keys(possibleId).forEach((key) => {
                possibleResult[key] = findInfoById(possibleId[key]);
            })
            return possibleResult;
        }
    }
    return null;
}
