import Papa from 'papaparse';

const SHEETS_URL_START = "https://docs.google.com/spreadsheets/d/e/"

export async function GetTextUrlDict(sheetId: string = "2PACX-1vScjvrdF1f9q1bM8WMFhohaOqAwudfNoyN4BCORkVM3nEcfEa4muQCqdC2u3XXNd-aqWoXywckEGBzm") {
    const url = SHEETS_URL_START + sheetId + "/pubhtml/sheet?headers=false&gid=0\n";

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
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
    category: string;
    pricing: string;
    link: string;
}

export async function GetResourceData (sheetId: string = "2PACX-1vScjvrdF1f9q1bM8WMFhohaOqAwudfNoyN4BCORkVM3nEcfEa4muQCqdC2u3XXNd-aqWoXywckEGBzm") : Promise<Site[]> {
    const url = SHEETS_URL_START + sheetId + "/pub?output=csv";
    const urlPromise = GetTextUrlDict(sheetId);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const csv = await response.text();
    const data = Papa.parse<never>(csv, {
        header: true
    });
    const sites: Site[] = [];
    const urlDict = await urlPromise;
    data.data.forEach(d => {
        const site: Site = {
            name: "",
            category: "",
            tags: [],
            pricing: "",
            link: ""
        }
        site.name = d["Site(Links)"];
        site.category = d["Category"];
        site.pricing = d["Price"];
        site.tags = (d["Resource"] as string).split(",");
        site.tags = site.tags.map(x => x.trim());
        site.link = urlDict[site.name].trim();
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

export async function GetTextSettingsData(sheetId: string = "2PACX-1vRUnyp44bSlnakCeyl0UuaN_PMvUa4SJ7Sj2ImjiyJYpLMSvIoLn7xOPSURSWJm-W-0q0iTSSaxYzVn"): Promise<Map<string, TextSettings>> {
    const url = SHEETS_URL_START + sheetId + "/pub?output=csv";
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
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
