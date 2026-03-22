import Papa from 'papaparse';

const SHEETS_URL_START = "https://docs.google.com/spreadsheets/d/e/";
const CACHE_EXPIRY_DAYS = 30;
const TEXT_URL_LAST_REQUEST_TIME_KEY = "LAST_REQUEST_TIME_TEXT_URL";
const RESOURCE_DATA_LAST_REQUEST_TIME_KEY = "LAST_REQUEST_TIME_RESOURCE_DATA";
const TEXT_SETTINGS_LAST_REQUEST_TIME_KEY = "LAST_REQUEST_TIME_TEXT_SETTINGS";
const DATA_CACHE_NAME = "data-cache-v1";

async function CacheResponse(localStorageKey: string, url: string, response: Response) {
    const cache = await caches.open(DATA_CACHE_NAME);
    await cache.put(url, response);
    localStorage.setItem(localStorageKey, Date.now() + "");
}


async function GetCachedResponse<T>(localStorageKey: string, url: string, getDataOnlineFunction: () => Promise<T>): Promise<Response | null | undefined> {
    const lastRequestTimeRaw = localStorage.getItem(localStorageKey);
    let lastRequestTime = 0;
    if(lastRequestTimeRaw && Number.isFinite(+lastRequestTimeRaw) && (+lastRequestTimeRaw) > 0) {
        lastRequestTime = +lastRequestTimeRaw;
    }
    if(Date.now() - lastRequestTime < CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
        try{
            console.log(`Loading ${localStorageKey} from cache...`);
            const cache = await caches.open(DATA_CACHE_NAME);
            const response = cache.match(url);
            if(response) {
                console.log(localStorageKey + " loaded from cache.");
                getDataOnlineFunction()
                    .then(() => {
                        console.log(localStorageKey + " downloaded and saved to cache.");
                    });
                return response;
            }
            console.log(`No cached ${localStorageKey} found.`);
        } catch (error) {
            console.error("Failed to load "+ localStorageKey + " from cache with error: ", JSON.stringify(error));
        }
        return null;
    } else {
        console.log(`${localStorageKey} is older than ${CACHE_EXPIRY_DAYS} days. Ignoring cache...`);
    }
}

export async function GetTextUrlDict(sheetId: string = "2PACX-1vScjvrdF1f9q1bM8WMFhohaOqAwudfNoyN4BCORkVM3nEcfEa4muQCqdC2u3XXNd-aqWoXywckEGBzm", skipCache = false) {
    const url = SHEETS_URL_START + sheetId + "/pubhtml/sheet?headers=false&gid=0\n";

    let response: Response | null | undefined = null;
    if(!skipCache) {
        response = await GetCachedResponse(TEXT_URL_LAST_REQUEST_TIME_KEY, url, async () => {
            return GetTextUrlDict(sheetId,true);
        });
    }

    if(!response) {
        response = await fetch(url);
    }
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    await CacheResponse(TEXT_URL_LAST_REQUEST_TIME_KEY, url, response.clone()); //.clone() to remove error saying response is already consumed

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const dict: { [key: string]: string } = {};
    doc.querySelectorAll("a[href]").forEach(a => {
        const text = a.textContent.trim();
        const link = a.getAttribute("href")?.trim();
        if (text && link) {
            const params = new URL(link).searchParams;
            if (text && link) dict[text] = params.get('q') ?? link;
        }
    });
    return dict;
}

export interface Site {
    name: string;
    tags: string[];
    pricing: string;
    link?: string;
}

export async function GetResourceData (sheetId: string = "2PACX-1vScjvrdF1f9q1bM8WMFhohaOqAwudfNoyN4BCORkVM3nEcfEa4muQCqdC2u3XXNd-aqWoXywckEGBzm", skipCache = false) : Promise<Site[]> {
    const url = SHEETS_URL_START + sheetId + "/pub?output=csv";

    let response: Response | null | undefined = null;
    if(!skipCache) {
        response = await GetCachedResponse(RESOURCE_DATA_LAST_REQUEST_TIME_KEY, url, async () => {
            return GetResourceData(sheetId,true);
        });
    }

    if(!response) {
        response = await fetch(url);
    }

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    await CacheResponse(RESOURCE_DATA_LAST_REQUEST_TIME_KEY, url, response.clone()); //.clone() to remove error saying response is already consumed

    const csv = await response.text();
    const data = Papa.parse<never>(csv, {
        header: true
    });
    const sites: Site[] = [];
    //const urlDict = await urlPromise;
    data.data.forEach(d => {
        const site: Site = {
            name: "",
            tags: [],
            pricing: ""
        }
        site.name = d["Site(Links)"];
        site.pricing = d["Price"];
        site.tags = (d["Resource"] as string).split(",");
        site.tags = site.tags.map(x => x.trim());
        site.tags = [d["Category"], ...site.tags];
        //site.link = urlDict[site.name].trim();
        sites.push(site);
    });
    return sites;
}

export interface TextSettings {
    text: string;
    emoji: string;
    color: string;
    svg: string;
}

export async function GetTextSettingsData(sheetId: string = "2PACX-1vRUnyp44bSlnakCeyl0UuaN_PMvUa4SJ7Sj2ImjiyJYpLMSvIoLn7xOPSURSWJm-W-0q0iTSSaxYzVn", skipCache = false): Promise<Map<string, TextSettings>> {
    const url = SHEETS_URL_START + sheetId + "/pub?output=csv";

    let response: Response | null | undefined = null;
    if(!skipCache) {
        response = await GetCachedResponse(TEXT_SETTINGS_LAST_REQUEST_TIME_KEY, url, async () => {
            return GetTextSettingsData(sheetId,true);
        });
    }

    if(!response) {
        response = await fetch(url);
    }
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    await CacheResponse(TEXT_SETTINGS_LAST_REQUEST_TIME_KEY, url, response.clone()); //.clone() to remove error saying response is already consumed

    const csv = await response.text();
    const data = Papa.parse<never>(csv, {
        header: true
    });
    const map = new Map<string, TextSettings>();
    data.data.forEach(d => {
        map.set(d["Text"], {
            text: d["Text"],
            emoji: d["Emoji"],
            svg: d["Svg"],
            color: d["Color"]
        });
    });
    return map;
}
